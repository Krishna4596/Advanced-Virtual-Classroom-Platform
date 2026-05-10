/**
 * ============================================================
 * 📊 TITAN DASHBOARD ANALYTICS (v4.2 - Production Ready)
 * Ref: Report Section 1.2 (Access Matrix) & 4.2 (Performance)
 * ============================================================
 */
const Class = require("../models/Class");
const redisClient = require("../config/redis"); 
const { successResponse, errorResponse } = require("../utils/apiResponse");

exports.getDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const cacheKey = `dashboard:${userId}`;

    // ⚡ NEURAL_CACHE_RETRIEVAL: Checking Redis for existing telemetry
    if (redisClient?.status === "ready") {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        if (process.env.NODE_ENV !== "production") console.log("🛰️  Cache Hit: Serving Dashboard Telemetry");
        return res.json(JSON.parse(cached));
      }
    }

    // 🏗️ DATA_AGGREGATION: Calculating Teacher Stats
    // Optimized: Using $size instead of $unwind to prevent memory overflow
    const teacherStats = await Class.aggregate([
      { $match: { teacher: userId } },
      {
        $group: {
          _id: "$teacher",
          totalClasses: { $sum: 1 },
          totalStudents: { $sum: { $size: { $ifNull: ["$students", []] } } }
        }
      }
    ]);

    const dashboardData = {
      success: true,
      totalClasses: teacherStats[0]?.totalClasses || 0,
      totalStudents: teacherStats[0]?.totalStudents || 0,
      timestamp: new Date().toISOString()
    };

    // ⚡ CACHE_COMMIT: Storing results for 60 seconds to reduce DB load
    if (redisClient?.status === "ready") {
      await redisClient.set(cacheKey, JSON.stringify(dashboardData), "EX", 60);
    }

    return res.json(dashboardData);
  } catch (error) {
    // 🛡️ Error handled via global middleware
    next(error);
  }
};