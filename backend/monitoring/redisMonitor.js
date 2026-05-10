/**
 * ============================================================
 * 📊 TITAN REDIS MONITORING ENGINE (v4.2 - Production Ready)
 * Ref: Report Section 4.2 (Performance Monitoring)
 * ============================================================
 */
const redisClient = require("../config/redis");
const logger = require("../utils/logger");

const startRedisMonitoring = () => {
  // 🛡️ INITIAL_CHECK: Ensuring the neural link is active
  if (!redisClient) {
    return logger.error("❌ [MONITOR_CRITICAL]: Redis client not initialized in configuration.");
  }

  // 🚩 SAFETY_THRESHOLD: 100MB Limit for the virtual classroom node
  const MEMORY_LIMIT_MB = 100;

  setInterval(async () => {
    try {
      // 🛰️ CONNECTION_HANDSHAKE: Checking status before querying telemetry
      if (redisClient.status !== "ready") {
        return logger.warn("📊 [MONITOR]: Redis node offline. Retrying link...");
      }

      // 📥 METRIC_COLLECTION: Fetching memory telemetry from the engine
      const info = await redisClient.info("memory");
      
      // Using Regex for precise telemetry extraction
      const matchHuman = info.match(/used_memory_human:(.*)/);
      const matchRaw = info.match(/used_memory:(.*)/);

      const usedHuman = matchHuman ? matchHuman[1].trim() : "N/A";
      const usedRawBytes = matchRaw ? parseInt(matchRaw[1]) : 0;
      const usedMB = (usedRawBytes / (1024 * 1024)).toFixed(2);

      // 🚩 THRESHOLD_ALARM: Triggering alerts for high memory consumption
      if (parseFloat(usedMB) > MEMORY_LIMIT_MB) {
        logger.warn(`🚨 [REDIS_MEMORY_ALERT]: Usage reached ${usedHuman}. Exceeding ${MEMORY_LIMIT_MB}MB safety limit.`);
        
        /**
         * 🔄 AUTO_RECOVERY (Optional): 
         * If memory is critical, we could flush volatile keys here.
         * await redisClient.flushdb(); 
         */
      }

      // Standard logging for the TITAN Performance Audit Trail
      logger.info(`📊 [REDIS_METRIC]: Memory Usage -> ${usedHuman} (${usedMB} MB) | Status: STABLE`);

    } catch (err) {
      logger.error("📊 [MONITOR_FAILURE]: Telemetry sync failed - " + err.message);
    }
  }, 60000); // ⏱️ Frequency: Sync every 60 seconds
};

module.exports = startRedisMonitoring;