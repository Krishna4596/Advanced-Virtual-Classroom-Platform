// backend/routes/adminSecurityRoutes.js
const express = require("express");
const router = express.Router();
const SecurityLog = require("../models/SecurityLog");
const auth = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

/**
 * 🛰️ NEURAL SECURITY MONITOR (v4.2)
 * Ref: Report Section 3.3.4 (Forensic Audit Trail)
 * Purpose: Advanced surveillance of high-risk authentication and system events.
 */

// 🔍 FETCH_SECURITY_TELEMETRY: Comprehensive audit of forensic logs
router.get("/logs", auth, isAdmin, async (req, res) => {
  try {
    const { level, status } = req.query;
    let query = {};

    // 🛡️ Dynamic Filtering: Only fetch logs based on severity (INFO, CRITICAL, etc.)
    if (level) query.level = level;
    if (status) query.status = status;

    const logs = await SecurityLog.find(query)
      .populate("user", "name email role") // Expanded to 'name' for better audit clarity
      .sort({ createdAt: -1 })
      .limit(200); // Increased limit for deeper forensic analysis

    res.json({ 
      success: true, 
      count: logs.length,
      data: logs 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Security telemetry synchronization failed", 
      error: err.message 
    });
  }
});

module.exports = router;