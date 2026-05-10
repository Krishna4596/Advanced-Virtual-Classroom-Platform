// backend/config/redis.js
const Redis = require("ioredis");
const logger = require("../utils/logger");

/**
 * ⚡ TITAN REDIS ENGINE (v4.2)
 * Ref: Report Section 1.3 (Performance Optimization) & 4.2 (Analytics Monitoring)
 * Purpose: Handling real-time caching, session telemetry, and job queuing.
 */

let redisClient = null;

if (process.env.REDIS_URL) {
  // 🛰️ NODE_CONFIGURATION: Establishing the neural link to Redis cloud
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    // 🛡️ SECURITY_HANDSHAKE: Enabling TLS for production 'rediss' protocols
    tls: process.env.REDIS_URL.includes("rediss://") 
      ? { rejectUnauthorized: false } 
      : undefined,
    
    // 🔄 RESILIENCE_STRATEGY: Auto-retry logic for connection stability
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    reconnectOnError(err) {
      const targetError = "READONLY";
      if (err.message.includes(targetError)) {
        return true; // Reconnect on specific node failures
      }
      return false;
    }
  });

  // ================= 📈 LINK TELEMETRY =================

  redisClient.on("connect", () => {
    logger.info("✅ [REDIS_NODE]: Neural link established successfully.");
    if (process.env.NODE_ENV !== "production") {
      console.log("⚡ TITAN_REDIS: Cache Engine Operational.");
    }
  });

  redisClient.on("error", (err) => {
    logger.error("❌ [REDIS_NODE_CRITICAL]: " + err.message);
  });

  redisClient.on("reconnecting", () => {
    logger.warn("⚠️ [REDIS_NODE]: Re-establishing connection...");
  });

} else {
  logger.warn("⚠️ [REDIS_NODE_MISSING]: REDIS_URL not detected. Performance caching disabled.");
}

module.exports = redisClient;