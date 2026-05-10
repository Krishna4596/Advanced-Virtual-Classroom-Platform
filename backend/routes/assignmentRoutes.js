/**
 * ============================================================
 * 🛰️ NEURAL ASSIGNMENT PROTOCOLS (v4.2 - Production Final)
 * Upgrade: Unified Auth Handshake & Multi-part Upload Sync.
 * ============================================================
 */

const express = require("express");
const router = express.Router();

// 🛡️ SECURITY_NODES: Using the fixed named exports for TITAN v4.2
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// 🧠 CONTROLLER_NODES
const {
  createAssignment,
  getAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  giveMarks,
  getMyAssignments,
  deleteAssignment
} = require("../controllers/assignmentController");

/**
 * 🛰️ NEURAL ASSIGNMENT PROTOCOLS
 * Ref: Report Section 3.4 (Academic Module)
 */

// --- 👨‍🏫 TEACHER OPERATIONS (High-Privilege) ---

// 🎯 DISCOVERY: Fetch all student submissions for a specific task
router.get("/:assignmentId/submissions", protect, authorize("teacher"), getAssignmentSubmissions);

// 📝 CREATION: Deployment of new tasks with cloud-attachment support
// Logic: protect sets identity, upload handles file, authorize guards role.
router.post("/create", protect, authorize("teacher"), upload.single("file"), createAssignment);

// ⭐ GRADING: Updating student nodes with performance metrics
router.post("/give-marks", protect, authorize("teacher"), giveMarks);


// --- 🧑‍🎓 STUDENT & SHARED OPERATIONS (Agent-Level) ---

// 📊 AGGREGATION: Global view of all tasks across enrolled classrooms
router.get("/my-assignments", protect, getMyAssignments);

// 🏫 LOCALIZATION: Fetching tasks specific to a single classroom node
router.get("/class/:classId", protect, getAssignments);

// 📤 SUBMISSION: Uploading student work nodes (Supports PDF/Docs)
router.post("/submit", protect, authorize("student"), upload.single("file"), submitAssignment);

// 🗑️ TERMINATION: Delete a specific academic task
router.delete("/:assignmentId", protect, authorize("teacher"), deleteAssignment);
 
module.exports = router;