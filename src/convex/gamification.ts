import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get quiz questions by category
export const getQuizQuestions = query({
  args: {
    category: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("quizQuestions").filter((q) => q.eq(q.field("isActive"), true));

    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }

    if (args.difficulty) {
      query = query.filter((q) => q.eq(q.field("difficulty"), args.difficulty));
    }

    const questions = await query.collect();
    
    // Shuffle and limit results
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return args.limit ? shuffled.slice(0, args.limit) : shuffled;
  },
});

// Submit quiz answer
export const submitQuizAnswer = mutation({
  args: {
    questionId: v.id("quizQuestions"),
    selectedAnswer: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User must be authenticated");
    }

    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    const isCorrect = args.selectedAnswer === question.correctAnswer;
    const pointsEarned = isCorrect ? question.points : 0;

    // Record the attempt
    await ctx.db.insert("quizAttempts", {
      userId: user._id,
      questionId: args.questionId,
      selectedAnswer: args.selectedAnswer,
      isCorrect,
      pointsEarned,
      attemptedAt: Date.now(),
    });

    // Update user points
    const currentPoints = user.totalPoints || 0;
    await ctx.db.patch(user._id, {
      totalPoints: currentPoints + pointsEarned,
    });

    // Check for new achievements
    await checkAndAwardBadges(ctx, user._id, currentPoints + pointsEarned);

    return {
      isCorrect,
      pointsEarned,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  },
});

// Helper function to check and award badges
async function checkAndAwardBadges(ctx: any, userId: any, totalPoints: number) {
  const existingAchievements = await ctx.db
    .query("userAchievements")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .collect();

  const existingBadgeTypes = new Set(existingAchievements.map((a: any) => a.badgeType));

  // Define badge criteria
  const badges = [
    { type: "first_quiz", name: "Quiz Starter", description: "Completed your first quiz", pointsRequired: 10 },
    { type: "knowledge_seeker", name: "Knowledge Seeker", description: "Earned 100 points", pointsRequired: 100 },
    { type: "health_expert", name: "Health Expert", description: "Earned 500 points", pointsRequired: 500 },
    { type: "wellness_champion", name: "Wellness Champion", description: "Earned 1000 points", pointsRequired: 1000 },
  ];

  for (const badge of badges) {
    if (totalPoints >= badge.pointsRequired && !existingBadgeTypes.has(badge.type)) {
      await ctx.db.insert("userAchievements", {
        userId,
        badgeType: badge.type,
        badgeName: badge.name,
        description: badge.description,
        pointsEarned: badge.pointsRequired,
        earnedAt: Date.now(),
      });

      // Update user badges array
      const user = await ctx.db.get(userId);
      const currentBadges = user?.badges || [];
      await ctx.db.patch(userId, {
        badges: [...currentBadges, badge.type],
      });
    }
  }
}

// Get user achievements
export const getUserAchievements = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) {
      return [];
    }

    const achievements = await ctx.db
      .query("userAchievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return achievements;
  },
});

// Get leaderboard
export const getLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    
    const leaderboard = users
      .filter(user => user.totalPoints && user.totalPoints > 0)
      .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
      .slice(0, args.limit || 10)
      .map(user => ({
        name: user.name || "Anonymous",
        totalPoints: user.totalPoints || 0,
        badges: user.badges || [],
        level: user.level || 1,
      }));

    return leaderboard;
  },
});
