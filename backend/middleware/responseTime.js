// backend/middleware/responseTime.js
const logger = require("../utils/logger");

/**
 * ⏱️ NEURAL LATENCY MONITOR (TITAN v4.2)
 * Ref: Report Section 1.3 (Performance Optimization & Redis)
 * Purpose: Measuring API response latency to identify bottleneck nodes.
 */

const responseTime = (req, res, next) => {
  // 🛰️ START_TIME: High-resolution real-time nanoseconds
  const start = process.hrtime();
 
  res.on("finish", () => {
    // 🛰️ END_TIME: Diff between start and finish
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1e3 + diff[1] / 1e6); // Simplified MS calculation

    const logPayload = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      latency: `${durationInMs.toFixed(2)} ms`,
    };

    // 🚩 PERFORMANCE THRESHOLD: Alert if response takes more than 500ms
    if (durationInMs > 500) {
      logger.warn(`⚠️ [SLOW_NODE_DETECTION]: ${req.method} ${req.originalUrl} took ${durationInMs.toFixed(2)}ms`);
    } else {
      // Standard logging for health monitoring
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[TITAN-METRIC]: ${req.method} ${req.originalUrl} -> ${durationInMs.toFixed(2)}ms`);
      }
      logger.info(logPayload);
    }
  });

  next();
};

module.exports = responseTime;