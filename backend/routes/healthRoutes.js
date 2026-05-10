// backend/routes/healthRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * 🏥 NEURAL HEALTH MONITOR (TITAN v4.2)
 * Ref: Report Section 3.5 (System Stability & Telemetry)
 * Purpose: Real-time monitoring of service uptime and database handshake status.
 */

router.get("/status", async (req, res) => {
  try {
    // 🔗 DATABASE HANDSHAKE CHECK
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatus = mongoose.connection.readyState === 1 ? "OPERATIONAL" : "DEGRADED";
    
    // 🔋 SYSTEM RESOURCE TELEMETRY
    const memoryUsage = process.memoryUsage();

    res.json({
      success: true,
      service: "Titan Virtual Classroom API",
      status: "ACTIVE",
      database: dbStatus,
      // ⏱️ TEMPORAL DATA
      uptime: `${Math.floor(process.uptime())} seconds`,
      timestamp: new Date().toISOString(),
      // 🧠 NODE PERFORMANCE METRICS
      metrics: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`, // Resident Set Size
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
      },
      environment: process.env.NODE_ENV || "development"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      service: "Virtual Classroom API",
      status: "CRITICAL_FAILURE",
      message: error.message 
    });
  }
});

module.exports = router;