/**
 * ============================================================
 * 📤 NEURAL SUBMISSION ARCHIVE (v4.2 - Production Final)
 * Upgrade: Secure Destructuring & Role-Based Telemetry.
 * ============================================================
 */

const express = require("express");
const router = express.Router();

// 🛡️ SECURITY_NODES: Fixed Named Imports for TITAN v4.2
// Humne 'auth' aur 'isStudent' ko hata kar unified protect/authorize pattern lagaya hai
const { protect, authorize } = require("../middleware/authMiddleware");

// 🧠 CONTROLLER_NODES
const { getMySubmissions } = require("../controllers/submissionController");

/**
 * 🛰️ NEURAL SUBMISSION ARCHIVE
 * Ref: Report Section 3.4 (Academic Task Lifecycle)
 * Purpose: Providing student nodes with a historical audit of their submitted work.
 */

// 🛰️ GET_MY_SUBMISSIONS: Retrieves all assignment nodes submitted by the current student
// Logic: protect sets req.user, authorize("student") enforces the role gate.
router.get("/my-submissions", protect, authorize("student"), getMySubmissions);

module.exports = router;