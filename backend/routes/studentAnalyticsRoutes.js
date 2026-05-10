// backend/routes/studentAnalyticsRoutes.js
const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const auth = require("../middleware/authMiddleware");

/**
 * 🛰️ STUDENT PERFORMANCE ANALYTICS (TITAN v4.2)
 * Ref: Report Section 3.6 (User-Centric Performance Metrics)
 * Purpose: Providing student nodes with individualized academic telemetry.
 */

router.get("/personal/:classId", auth, async (req, res) => {
  try {
    const { classId } = req.params;
    // 🛡️ SECURITY: Using standardized identity node from Titan Auth
    const studentId = req.user.id; 

    // 🚀 TELEMETRY RETRIEVAL: Fetching all attendance records for this student-class link
    const records = await Attendance.find({ classId, student: studentId })
      .sort({ createdAt: -1 });

    const total = records.length;
    const presentCount = records.filter(r => r.status === "Present" || r.status === "Late").length;
    
    // 📊 CALCULATION ENGINE
    const attendancePercentage = total > 0 ? ((presentCount / total) * 100).toFixed(2) : 0;

    // 🤖 PREDICTIVE INSIGHT: Quick status check
    let healthStatus = "EXCELLENT";
    if (attendancePercentage < 75) healthStatus = "CRITICAL";
    else if (attendancePercentage < 85) healthStatus = "STABLE";

    res.json({
      success: true,
      data: {
        attendancePercentage: `${attendancePercentage}%`,
        presentCount,
        totalClasses: total,
        healthStatus, // For UI color coding (Red/Yellow/Green)
        history: records
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Personal telemetry synchronization failed",
      error: err.message 
    });
  }
});

module.exports = router;