import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Create a new chat session
export const createChatSession = mutation({
  args: {
    language: v.union(v.literal("en"), v.literal("hi"), v.literal("te"), v.literal("ta"), v.literal("bn")),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const chatSessionId = await ctx.db.insert("chatSessions", {
      userId: user._id,
      sessionId,
      title: args.title || "New Health Consultation",
      language: args.language,
      isActive: true,
    });

    return chatSessionId;
  },
});

// Add a message to a chat session
export const addChatMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
    isUser: v.boolean(),
    messageType: v.union(v.literal("text"), v.literal("voice"), v.literal("system")),
    severity: v.optional(v.union(v.literal("low"), v.literal("moderate"), v.literal("high"), v.literal("emergency"))),
    symptoms: v.optional(v.array(v.string())),
    recommendations: v.optional(v.array(v.string())),
    possibleConditions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const messageId = await ctx.db.insert("chatMessages", {
      sessionId: args.sessionId,
      userId: user._id,
      content: args.content,
      isUser: args.isUser,
      timestamp: Date.now(),
      messageType: args.messageType,
      severity: args.severity,
      symptoms: args.symptoms,
      recommendations: args.recommendations,
      possibleConditions: args.possibleConditions,
    });

    return messageId;
  },
});

// Get chat sessions for a user
export const getUserChatSessions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return sessions;
  },
});

// Get messages for a specific chat session
export const getChatMessages = query({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();

    return messages;
  },
});

// Generate a medical report from a chat session
export const generateMedicalReport = mutation({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    // Get all messages from the session
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Extract symptoms, recommendations, and conditions from AI messages
    const symptoms: string[] = [];
    const recommendations: string[] = [];
    const possibleConditions: string[] = [];
    let maxSeverity: "low" | "moderate" | "high" | "emergency" = "low";

    messages.forEach((message) => {
      if (!message.isUser && message.symptoms) {
        symptoms.push(...message.symptoms);
      }
      if (!message.isUser && message.recommendations) {
        recommendations.push(...message.recommendations);
      }
      if (!message.isUser && message.possibleConditions) {
        possibleConditions.push(...message.possibleConditions);
      }
      if (message.severity) {
        const severityLevels = { low: 1, moderate: 2, high: 3, emergency: 4 };
        if (severityLevels[message.severity] > severityLevels[maxSeverity]) {
          maxSeverity = message.severity;
        }
      }
    });

    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const reportDocId = await ctx.db.insert("medicalReports", {
      userId: user._id,
      sessionId: args.sessionId,
      reportId,
      symptoms: [...new Set(symptoms)], // Remove duplicates
      severity: maxSeverity,
      recommendations: [...new Set(recommendations)],
      possibleConditions: [...new Set(possibleConditions)],
      isReviewed: false,
      generatedAt: Date.now(),
    });

    return reportDocId;
  },
});

// Get user's medical reports
export const getUserMedicalReports = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const reports = await ctx.db
      .query("medicalReports")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return reports;
  },
});
