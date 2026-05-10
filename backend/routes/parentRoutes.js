/**
 * ============================================================
 * 👨‍👩‍👧‍👦 TITAN PARENT GATEWAY (v5.2 - Security Hardened)
 * Upgrade: Unified Middlewares & Role-Based Telemetry Access.
 * ============================================================
 */

const express = require("express");
const router = express.Router();

// 🛡️ SECURITY_NODES
const { protect, authorize } = require("../middleware/authMiddleware");

// 🛰️ CONTROLLER_NODES
const { 
  getChildProgress, 
  linkChild, 
  broadcastWeeklyReport 
} = require("../controllers/parentController");

// --- 🟢 1. GUARDIAN ANALYTICS ---
// FETCH_DASHBOARD: Retrieves real-time attendance & grading telemetry
router.get("/dashboard", protect, authorize("parent"), getChildProgress);

// --- 🔗 2. RELATIONSHIP MANAGEMENT ---
// LINK_STUDENT_NODE: Establishes a secure neural link
router.post("/link-child", protect, authorize("parent"), linkChild);

// --- 📢 3. TEACHER-TO-PARENT BROADCAST ---
// PUSH_WEEKLY_REPORT: Teacher initiates a mass sync
router.post("/broadcast-report", protect, authorize("teacher"), broadcastWeeklyReport);

module.exports = router;