/**
 * ============================================================
 * 🏫 TITAN CLASSROOM PROTOCOLS (v4.3 - Core Routing)
 * Upgrade: Unified Auth Handshake & Context-Aware Routing.
 * Fixed: Removed attendance/analytics routes to dedicated modules.
 * ============================================================
 */

const express = require("express");
const router = express.Router();

// 🛡️ SECURITY_NODES: Using the new unified protect/authorize pattern
const { protect, authorize } = require("../middleware/authMiddleware");

// 🧠 CONTROLLER_NODES
const {
  createClass,
  joinClass,
  getClasses,
  getMyClasses,
  getClassById,
  postAnnouncement,
  kickStudent,
  initiatePTM,
  getGlobalAnalytics,
  deleteClass
} = require("../controllers/classController");

// --- 🟢 1. CLASSROOM LIFECYCLE MANAGEMENT ---

// TEACHER_ONLY: Establish a new classroom node
router.post("/create", protect, authorize("teacher"), createClass);

// STUDENT_ONLY: Link identity to a classroom node
router.post("/join", protect, authorize("student"), joinClass);

// SHARED: Retrieve available class nodes
router.get("/all", protect, getClasses); 

// SHARED: User-specific classroom cluster
router.get("/my-classes", protect, getMyClasses);


// --- 📊 2. SYSTEM-WIDE TELEMETRY ---

// TEACHER_ONLY: Global analytics across all nodes (Stat Cards)
router.get("/all-analytics", protect, authorize("teacher"), getGlobalAnalytics);


// --- 🔍 3. NODE INTELLIGENCE & COMMUNICATION ---

// SHARED: Specific node telemetry retrieval
router.get("/:id", protect, getClassById); 

// NEURAL_STREAM: Broadcasting updates to the node
router.post("/:id/announcements", protect, postAnnouncement); 


// --- 🛡️ 4. ROSTER SECURITY & COMPLIANCE ---

// TEACHER_ONLY: Evict student node from classroom
router.post("/:id/kick", protect, authorize("teacher"), kickStudent); 


// --- 🎥 5. PARENT-TEACHER SYNC (PTM) ---

// TEACHER_ONLY: Initiate real-time PTM node
router.post("/:id/initiate-ptm", protect, authorize("teacher"), initiatePTM);

// TEACHER_ONLY: Terminate a classroom node permanently
router.delete("/:id", protect, authorize("teacher"), deleteClass);

module.exports = router;