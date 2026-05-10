const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  autoMarkAttendance,
  markBulkAttendance, 
  getAttendance,
  getStudentPresenceIndex,
  getAttendanceTrend,
  getClassAttendanceAnalytics
} = require("../controllers/attendanceController");

// --- 📡 STUDENT TELEMETRY ---
router.post("/auto/:classId", protect, authorize("student"), autoMarkAttendance);
router.get("/my-presence", protect, authorize("student"), getStudentPresenceIndex);

// --- 🛡️ TEACHER ACTIONS ---
router.post("/mark-bulk", protect, authorize("teacher"), markBulkAttendance);
router.get("/trend", protect, authorize("teacher"), getAttendanceTrend);

// --- 🔍 SHARED METRICS ---
router.get("/class/:classId", protect, getAttendance);
router.get("/analytics/:classId", protect, getClassAttendanceAnalytics);

// 🔥 THE FIX: Ye route Parent ke liye add karna zaroori tha! (404 Error fixed)
router.get("/:studentId", protect, getAttendance); 

module.exports = router;