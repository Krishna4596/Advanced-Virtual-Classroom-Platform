/**
 * ============================================================
 * 📊 TITAN NEURAL POLL ROUTES (v4.2 - Production Final)
 * Upgrade: Secure Destructuring & Real-Time Engagement Sync.
 * ============================================================
 */
const express = require("express");
const router = express.Router();

// 🛡️ SECURITY_NODES: Named import fix for TITAN v4.2
const { protect, authorize } = require("../middleware/authMiddleware");

// 🧠 CONTROLLER_NODES
const { 
  createPoll, 
  getActivePoll, 
  castVote 
} = require("../controllers/pollController");

/**
 * 📝 POST /api/polls/create
 * Role: Teacher Only
 * Purpose: Deploys a new interactive poll signal.
 */
router.post("/create", protect, authorize("teacher"), createPoll);

/**
 * 🛰️ GET /api/polls/:classId
 * Role: Authenticated Users (Shared)
 * Purpose: Handshake to sync the latest active poll state.
 */
router.get("/:classId", protect, getActivePoll);

/**
 * ✅ POST /api/polls/vote
 * Role: Authenticated Users (Student/Teacher)
 * Purpose: Transmits student vote telemetry to the hub.
 */
router.post("/vote", protect, castVote);

module.exports = router;