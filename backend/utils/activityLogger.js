// backend/utils/activityLogger.js
const ActivityLog = require("../models/ActivityLog");
const logger = require("./logger");

/**
 * 🛰️ NEURAL ACTIVITY LOG INTERFACE (TITAN v4.2)
 * Ref: Report Section 3.3.4 (System Audit & Forensic Logging)
 * Purpose: Capturing user interactions for accountability and security auditing.
 */

const logActivity = async (req, userId, action, details = "") => {
  try {
    // 🛡️ IP RESOLUTION: Handling proxies to get the real client identity
    const ipAddress = 
      req.headers["x-forwarded-for"]?.split(",")[0] || 
      req.socket.remoteAddress || 
      req.ip || 
      "0.0.0.0";

    // 🚀 ATOMIC LOG CREATION
    await ActivityLog.create({
      user: userId, // Mapping to the User node
      action: action.toUpperCase(), // Standardizing actions (e.g., 'LOGIN', 'SUBMIT')
      details: typeof details === 'object' ? JSON.stringify(details) : details,
      ipAddress,
      userAgent: req.headers["user-agent"] || "Unknown Agent",
      timestamp: new Date()
    });

    // Optional: Log to console for dev monitoring
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[LOG]: ${action} by User ${userId} from IP ${ipAddress}`);
    }
    
  } catch (error) {
    // 🛡️ FAIL-SAFE: Ensuring logging failure doesn't break the main thread
    logger.error("❌ Critical: Activity logging handshake failed: " + error.message);
  }
};

module.exports = logActivity;