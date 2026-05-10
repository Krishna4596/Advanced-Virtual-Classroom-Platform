// backend/config/db.js
const mongoose = require("mongoose");
const logger = require("../utils/logger");

/**
 * 🗄️ TITAN DATABASE ENGINE (v4.2)
 * Ref: Report Section 1.3 (Database Infrastructure) & 3.2 (NoSQL Schema)
 * Purpose: Maintaining a persistent, high-concurrency link to MongoDB Atlas.
 */

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("CRITICAL: MONGO_URI node not defined in environment.");
    }

    // 🛡️ SCHEMA_INTEGRITY: Enforcing strict query patterns
    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,              // 🚀 Multi-user concurrency handling
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,       // Prevents idle connections from hanging
      autoIndex: true,              // Ensuring indexes are built for search performance
    });

    logger.info(`✅ [DB_NODE]: MongoDB Atlas Connected -> ${conn.connection.host}`);
    
    if (process.env.NODE_ENV !== "production") {
      console.log(`🛢️  TITAN_DB: Connection Stable on ${conn.connection.host}`);
    }

  } catch (error) {
    logger.error("❌ [DB_NODE_CRITICAL]: " + error.message);
    process.exit(1); // Stopping engine on failure
  }
};

// 🛰️ CONNECTION_TELEMETRY: Monitoring live link status
mongoose.connection.on("disconnected", () => {
  logger.warn("⚠️ [DB_NODE]: MongoDB link lost. Attempting reconnection...");
});

mongoose.connection.on("error", (err) => {
  logger.error("❌ [DB_NODE_RUNTIME]: " + err.message);
});

module.exports = connectDB;