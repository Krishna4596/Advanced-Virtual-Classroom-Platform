// backend/utils/securityLogger.js
const SecurityLog = require("../models/SecurityLog");
const logger = require("./logger");

/**
 * 🛡️ NEURAL SECURITY AUDIT INTERFACE (TITAN v4.2)
 * Ref: Report Section 3.3.4 (Cybersecurity & Forensic Telemetry)
 * Purpose: Logging high-risk security events to prevent and trace unauthorized node activity.
 */

const logSecurityEvent = async (req, userId, action, severity = "LOW") => {
  try {
    // 🛡️ IP RESOLUTION: Handling proxies for forensic accuracy
    const ipAddress = 
      req.headers["x-forwarded-for"]?.split(",")[0] || 
      req.socket.remoteAddress || 
      req.ip || 
      "0.0.0.0";

    // 🚀 CRITICAL LOG CREATION
    await SecurityLog.create({
      user: userId,
      action: action.toUpperCase(), // Standardizing: 'MFA_FAILURE', 'PASSWORD_CHANGE'
      severity, // NEW: Helps in filtering critical threats quickly
      ip: ipAddress,
      userAgent: req.headers["user-agent"] || "Unknown Agent",
      timestamp: new Date()
    });

    // 🚩 ALERT SYSTEM: Log to winston if severity is HIGH
    if (severity === "HIGH" || severity === "CRITICAL") {
      logger.warn(`🚨 SECURITY ALERT: [${action}] detected from IP ${ipAddress} for User ${userId}`);
    }

  } catch (error) {
    // 🛡️ FAIL-SAFE: Ensuring security logging failure doesn't bypass the event itself
    logger.error("❌ Critical Security Handshake Failure: " + error.message, {
      context: "SecurityLogger",
      action
    });
  }
};

module.exports = logSecurityEvent;