// backend/middleware/queryLogger.js
const mongoose = require("mongoose");
const logger = require("../utils/logger");

/**
 * 🛢️ NEURAL DATABASE TELEMETRY (TITAN v4.2)
 * Ref: Report Section 3.2 (Database Architecture & Performance)
 * Purpose: Monitoring live MongoDB queries for performance profiling and debugging.
 */

// 🛡️ DEBUG SWITCH: Enabled in development to prevent production log flooding
if (process.env.NODE_ENV === "development") {
  mongoose.set("debug", (collectionName, method, query, doc) => {
    const logMsg = `🛢 DB Query -> ${collectionName}.${method} | Query: ${JSON.stringify(query)}`;
    
    // Using our Titan Logger for consistency
    logger.info(logMsg);

    if (process.env.VERBOSE_DB_LOGS === "true") {
      console.log(`[DB-DOC]:`, doc ? JSON.stringify(doc) : "N/A");
    }
  });
}

// Note: It's a configuration-only middleware, returns an empty object or a status function.
module.exports = { dbStatus: "Monitoring Enabled" };