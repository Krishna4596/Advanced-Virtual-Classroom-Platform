/**
 * ============================================================
 * 📊 TITAN NEURAL ANALYTICS ENGINE (v4.2 - Final Sync)
 * Upgrade: Parallel Data Mining & Risk Prediction Logic.
 * ============================================================
 */

const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Session = require("../models/Session");
const Assignment = require("../models/Assignment");

// 🛡️ SECURITY_NODES: Named import fix for TITAN v4.2 architecture
const { protect } = require("../middleware/authMiddleware");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * ================= 📈 1. CLASS-WIDE TELEMETRY =================
 * Logic: Multi-node data aggregation for classroom health scores.
 */
router.get("/:classId", protect, async (req, res) => {
  try {
    const { classId } = req.params;

    // 🚀 PARALLEL_SYNC: High-speed fetching from multiple collections
    const [attendance, sessions] = await Promise.all([
      Attendance.find({ classId }),
      Session.find({ classId })
    ]);

    const totalRecords = attendance.length;
    const durations = attendance.map(a => a.duration || 0);
    
    const totalDuration = durations.reduce((a, b) => a + b, 0);
    const averageDuration = totalRecords ? (totalDuration / totalRecords).toFixed(2) : 0;
    
    const presentCount = attendance.filter(a => a.status.toLowerCase() === "present").length;
    const attendanceRatio = totalRecords ? ((presentCount / totalRecords) * 100).toFixed(1) : 0;

    return successResponse(res, "Classroom Telemetry Processed", {
      totalAttendanceRecords: totalRecords,
      totalSessions: sessions.length,
      averageDuration: `${averageDuration} mins`,
      maxDuration: `${durations.length ? Math.max(...durations) : 0} mins`,
      classAttendanceRatio: `${attendanceRatio}%`,
      engagementScore: calculateEngagementScore(averageDuration, attendanceRatio)
    });
  } catch (err) {
    return errorResponse(res, "Analytics processing failure: " + err.message);
  }
});

/**
 * ================= 🤖 2. INDIVIDUAL STUDENT PREDICTION =================
 * Logic: AI-Lite heuristics for academic risk assessment.
 */
router.get("/predict/:classId/:studentId", protect, async (req, res) => {
  try {
    const { classId, studentId } = req.params;

    // 🛰️ DATA_MINING: Fetching linked identity records
    const [attendance, assignments] = await Promise.all([
      Attendance.find({ classId, student: studentId }),
      Assignment.find({ classId, "submissions.student": studentId })
    ]);

    // A. Attendance Telemetry
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status.toLowerCase() === "present").length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 100;

    // B. Academic Grading (Logic Fixed: using gradedTasks)
    let totalMarks = 0;
    let gradedTasks = 0;
    assignments.forEach(asm => {
      const sub = asm.submissions.find(s => s.student.toString() === studentId.toString());
      if (sub && sub.marks) {
        totalMarks += sub.marks;
        gradedTasks++;
      }
    });
    const avgMarks = gradedTasks > 0 ? (totalMarks / gradedTasks) : 100;

    // C. 🧠 PREDICTION_NODE (Heuristics)
    let riskLevel = "Stable";
    let colorCode = "#2ecc71"; // Green
    let recommendation = "Momentum is optimal. Continue current participation.";

    if (attendanceRate < 75 || avgMarks < 50) {
      riskLevel = "At Risk";
      colorCode = "#f1c40f"; // Yellow
      recommendation = "Low engagement detected. Academic intervention advised.";
    }

    if (attendanceRate < 60 && avgMarks < 40) {
      riskLevel = "Critical";
      colorCode = "#e74c3c"; // Red
      recommendation = "High alert: Failing attendance and grades. Immediate attention required.";
    }

    return successResponse(res, "Predictive Academic Insights Generated", {
      studentId,
      metrics: {
        attendanceRate: `${attendanceRate.toFixed(1)}%`,
        academicAvg: `${avgMarks.toFixed(1)}%`
      },
      prediction: {
        riskLevel,
        colorCode,
        recommendation
      }
    });

  } catch (err) {
    return errorResponse(res, "Prediction Engine Failure: " + err.message);
  }
});

// 🤖 HEURISTIC HELPER
function calculateEngagementScore(avgDur, attRatio) {
  const score = (parseFloat(avgDur) * 0.4) + (parseFloat(attRatio) * 0.6);
  return Math.min((score / 10).toFixed(1), 10); 
}

module.exports = router;