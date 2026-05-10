// backend/routes/aiInsightRoutes.js
const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const auth = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

/**
 * 🧠 AI ANALYTICS ENGINE (TITAN v4.2)
 * Ref: Report Section 3.6 (Predictive Academic Insights)
 * Purpose: Automated behavioral analysis and risk assessment of student nodes.
 */

router.get("/:classId", auth, isTeacher, async (req, res) => {
  try {
    const { classId } = req.params;

    // 🎯 TARGETED DISCOVERY: Fetch only students enrolled in this specific classroom
    const targetClass = await Class.findById(classId).populate("students", "name _id");
    if (!targetClass) {
      return res.status(404).json({ success: false, message: "Classroom node not found" });
    }

    const students = targetClass.students;
    const insights = [];

    // Parallel processing for high-speed telemetry analysis
    const analysisPromises = students.map(async (student) => {
      const records = await Attendance.find({ classId, student: student._id });
      
      if (records.length > 0) {
        const total = records.length;
        const present = records.filter(r => r.status === "Present" || r.status === "Late").length;
        const attendancePercentage = (present / total) * 100;
        const avgDuration = records.reduce((sum, r) => sum + (r.duration || 0), 0) / total;

        // 🤖 NEURAL LOGIC GATES: Status Classification
        let alert = "Performing Well";
        let level = "SUCCESS"; // For UI color coding

        if (attendancePercentage < 75) {
          alert = "At Risk: Low Attendance";
          level = "CRITICAL";
        } else if (avgDuration < 30) {
          alert = "Attention: Low Engagement";
          level = "WARNING";
        }

        return {
          studentId: student._id,
          studentName: student.name,
          attendance: `${attendancePercentage.toFixed(1)}%`,
          avgSession: `${avgDuration.toFixed(1)} mins`,
          status: alert,
          riskLevel: level
        };
      }
      return null;
    });

    const results = await Promise.all(analysisPromises);
    // Remove nulls (students with no attendance records yet)
    const filteredInsights = results.filter(r => r !== null);

    res.json({ 
      success: true, 
      classId,
      totalAnalyzed: filteredInsights.length,
      insights: filteredInsights 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "AI Telemetry processing error", 
      error: err.message 
    });
  }
});

module.exports = router;