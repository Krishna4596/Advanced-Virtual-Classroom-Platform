/**
 * ============================================================
 * 🛡️ NEURAL ERROR HANDLER (TITAN v5.0 - Anti-Crash Build)
 * Ref: Report Section 3.5 (System Stability & Error Handshaking)
 * Fix: Standardized Response Dispatch & Recursive Loop Protection.
 * ============================================================
 */

const logger = require("../utils/logger");

const errorMiddleware = (err, req, res, next) => {
  // 1. ⚙️ STATUS CODE CALIBRATION
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal System Synchronisation Failure";

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  // Handle Mongoose Duplicate Key Error (Error Code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Identity Node Conflict: Email or Resource already exists.";
  }

  // Handle JWT Security Breaches
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Security Breach: Invalid session signature detected.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session Expired: Please re-authenticate your node.";
  }

  // 2. 📝 FORENSIC LOGGING
  logger.error(`[${req.method}] ${req.url} - Status: ${statusCode} - Error: ${err.message}`, {
    stack: err.stack,
    ip: req.ip
  });

  // 3. 🚀 CRASH-PROOF DISPATCH
  /**
   * 🔥 IMPORTANT: Hum yahan direct res.status use kar rahe hain bina 
   * kisi external utility par depend kiye, taaki agar utility mein 
   * error ho toh bhi server crash na ho (next is not a function error fix).
   */
  return res.status(statusCode).json({
    success: false,
    message: message,
    debug: process.env.NODE_ENV === "development" ? {
      error: err.message,
      stack: err.stack,
      path: req.url
    } : null
  });
};

module.exports = errorMiddleware;