import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  DOCTOR: "doctor",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.DOCTOR),
);
export type Role = Infer<typeof roleValidator>;

// Severity levels for symptoms and recommendations
export const SEVERITY_LEVELS = {
  LOW: "low",
  MODERATE: "moderate", 
  HIGH: "high",
  EMERGENCY: "emergency",
} as const;

export const severityValidator = v.union(
  v.literal(SEVERITY_LEVELS.LOW),
  v.literal(SEVERITY_LEVELS.MODERATE),
  v.literal(SEVERITY_LEVELS.HIGH),
  v.literal(SEVERITY_LEVELS.EMERGENCY),
);

// Languages supported
export const LANGUAGES = {
  ENGLISH: "en",
  HINDI: "hi",
  TELUGU: "te",
  TAMIL: "ta",
  BENGALI: "bn",
} as const;

export const languageValidator = v.union(
  v.literal(LANGUAGES.ENGLISH),
  v.literal(LANGUAGES.HINDI),
  v.literal(LANGUAGES.TELUGU),
  v.literal(LANGUAGES.TAMIL),
  v.literal(LANGUAGES.BENGALI),
);

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Health chatbot specific fields
      preferredLanguage: v.optional(languageValidator),
      location: v.optional(v.object({
        latitude: v.number(),
        longitude: v.number(),
        city: v.optional(v.string()),
        country: v.optional(v.string()),
      })),
      
      // Gamification fields
      totalPoints: v.optional(v.number()),
      currentStreak: v.optional(v.number()),
      longestStreak: v.optional(v.number()),
      badges: v.optional(v.array(v.string())),
      level: v.optional(v.number()),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Chat conversations and reports
    chatSessions: defineTable({
      userId: v.id("users"),
      sessionId: v.string(),
      title: v.optional(v.string()),
      language: languageValidator,
      isActive: v.boolean(),
      summary: v.optional(v.string()),
    }).index("by_user", ["userId"])
      .index("by_session", ["sessionId"]),

    // Individual chat messages
    chatMessages: defineTable({
      sessionId: v.id("chatSessions"),
      userId: v.id("users"),
      content: v.string(),
      isUser: v.boolean(), // true if from user, false if from AI
      timestamp: v.number(),
      messageType: v.union(v.literal("text"), v.literal("voice"), v.literal("system")),
      severity: v.optional(severityValidator),
      symptoms: v.optional(v.array(v.string())),
      recommendations: v.optional(v.array(v.string())),
      possibleConditions: v.optional(v.array(v.string())),
    }).index("by_session", ["sessionId"])
      .index("by_user", ["userId"]),

    // Medical reports generated from chat sessions
    medicalReports: defineTable({
      userId: v.id("users"),
      sessionId: v.id("chatSessions"),
      reportId: v.string(),
      symptoms: v.array(v.string()),
      severity: severityValidator,
      recommendations: v.array(v.string()),
      possibleConditions: v.array(v.string()),
      doctorNotes: v.optional(v.string()),
      doctorId: v.optional(v.id("users")),
      isReviewed: v.boolean(),
      generatedAt: v.number(),
    }).index("by_user", ["userId"])
      .index("by_doctor", ["doctorId"])
      .index("by_report_id", ["reportId"]),

    // Disease and outbreak information
    diseases: defineTable({
      name: v.string(),
      description: v.string(),
      symptoms: v.array(v.string()),
      severity: severityValidator,
      preventionTips: v.array(v.string()),
      treatmentInfo: v.string(),
      isActive: v.boolean(),
    }).index("by_name", ["name"]),

    // Outbreak alerts by location
    outbreaks: defineTable({
      diseaseId: v.id("diseases"),
      location: v.object({
        latitude: v.number(),
        longitude: v.number(),
        city: v.string(),
        country: v.string(),
        radius: v.number(), // in kilometers
      }),
      severity: severityValidator,
      casesReported: v.number(),
      description: v.string(),
      alertLevel: v.union(v.literal("watch"), v.literal("warning"), v.literal("critical")),
      isActive: v.boolean(),
      startDate: v.number(),
      endDate: v.optional(v.number()),
    }).index("by_disease", ["diseaseId"])
      .index("by_location", ["location.city", "location.country"]),

    // Healthcare resources (hospitals, clinics, pharmacies)
    healthcareResources: defineTable({
      name: v.string(),
      type: v.union(v.literal("hospital"), v.literal("clinic"), v.literal("pharmacy"), v.literal("testing_center")),
      address: v.string(),
      location: v.object({
        latitude: v.number(),
        longitude: v.number(),
        city: v.string(),
        country: v.string(),
      }),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      services: v.array(v.string()),
      rating: v.optional(v.number()),
      isActive: v.boolean(),
    }).index("by_type", ["type"])
      .index("by_location", ["location.city", "location.country"]),

    // Gamification - Quiz questions
    quizQuestions: defineTable({
      question: v.string(),
      options: v.array(v.string()),
      correctAnswer: v.number(), // index of correct option
      category: v.string(),
      difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
      points: v.number(),
      explanation: v.string(),
      isActive: v.boolean(),
    }).index("by_category", ["category"])
      .index("by_difficulty", ["difficulty"]),

    // User quiz attempts and scores
    quizAttempts: defineTable({
      userId: v.id("users"),
      questionId: v.id("quizQuestions"),
      selectedAnswer: v.number(),
      isCorrect: v.boolean(),
      pointsEarned: v.number(),
      attemptedAt: v.number(),
    }).index("by_user", ["userId"])
      .index("by_question", ["questionId"]),

    // User achievements and badges
    userAchievements: defineTable({
      userId: v.id("users"),
      badgeType: v.string(),
      badgeName: v.string(),
      description: v.string(),
      pointsEarned: v.number(),
      earnedAt: v.number(),
    }).index("by_user", ["userId"])
      .index("by_badge", ["badgeType"]),

    // Community forum posts (optional feature)
    forumPosts: defineTable({
      userId: v.id("users"),
      title: v.string(),
      content: v.string(),
      category: v.string(),
      tags: v.array(v.string()),
      isModerated: v.boolean(),
      moderatorId: v.optional(v.id("users")),
      likes: v.number(),
      views: v.number(),
    }).index("by_user", ["userId"])
      .index("by_category", ["category"])
      .index("by_moderated", ["isModerated"]),

    // Forum replies
    forumReplies: defineTable({
      postId: v.id("forumPosts"),
      userId: v.id("users"),
      content: v.string(),
      isModerated: v.boolean(),
      moderatorId: v.optional(v.id("users")),
      likes: v.number(),
    }).index("by_post", ["postId"])
      .index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;