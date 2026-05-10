// backend/jobs/notificationQueue.js
const Queue = require("bull");
const logger = require("../utils/logger");

/**
 * 🛰️ TITAN NOTIFICATION QUEUE (v4.2)
 * Ref: Report Section 1.3 (Redis Infrastructure) & 5.1 (Scalability)
 * Purpose: Managing high-volume notification payloads for background processing.
 */

if (!process.env.REDIS_URL) {
  throw new Error("CRITICAL: REDIS_URL node not defined in environment configuration.");
}

// Fixed: Bull configuration for secure and resilient job processing
const notificationQueue = new Queue("notifications", process.env.REDIS_URL, {
  redis: {
    // 🛡️ SSL/TLS Handshake for production environments
    tls: process.env.REDIS_URL.startsWith("rediss://") 
      ? { rejectUnauthorized: false } 
      : undefined,
  },
  defaultJobOptions: {
    attempts: 3,             // 🔁 Max retries on node failure
    backoff: {
      type: "exponential",
      delay: 5000,           // ⏳ 5s initial delay, increasing per attempt
    },
    removeOnComplete: true,  // 🧹 Auto-purge memory to keep Redis lean
    removeOnFail: false,     // 🚩 Keep failed jobs for manual forensic audit
  },
});

// ================= 📈 QUEUE TELEMETRY =================

notificationQueue.on("error", (err) => {
  logger.error("❌ Redis Queue Node Error: " + err.message);
});

notificationQueue.on("waiting", (jobId) => {
  // Useful for tracking queue pressure in development
  if (process.env.NODE_ENV !== "production") {
    console.log(`⏳ Job ${jobId} is in standby...`);
  }
});

notificationQueue.on("stalled", (job) => {
  logger.warn(`⚠️ Job ${job.id} has stalled. Processor might be under heavy load.`);
});

module.exports = notificationQueue;