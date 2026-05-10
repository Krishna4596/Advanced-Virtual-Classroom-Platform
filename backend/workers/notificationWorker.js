// backend/workers/notificationWorker.js
require("dotenv").config();
const notificationQueue = require("../jobs/notificationQueue");
const sendMail = require("../utils/sendMail");
const Notification = require("../models/Notification");
const logger = require("../utils/logger");

/**
 * ⚙️ TITAN NEURAL WORKER (v4.2)
 * Ref: Report Section 1.3 (Bull/Redis Queue) & 4.2 (Async Processing)
 * Purpose: Handling resource-intensive background tasks to keep the main API responsive.
 */

// ================= 🟢 WORKER STATUS =================
notificationQueue.on("ready", () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log("🟢 [TITAN-WORKER]: Redis Connection established. Listening for payloads...");
  }
});

// ================= ⚙️ JOB PROCESSOR =================
/**
 * PROCESSOR CONFIG: Handling jobs concurrently
 * Humne yahan '5' rakha hai, yani worker ek saath 5 emails process kar sakta hai.
 */
notificationQueue.process(5, async (job) => {
  const { userId, email, title, message, type } = job.data;

  try {
    // 🛡️ PROGRESS TRACKING: Useful for long-running tasks
    job.progress(10); 

    // 1. 📧 DISPATCH_MAIL: Handled by our calibrated sendMail utility
    if (email) {
      await sendMail(email, title, message, type || "SYSTEM ALERT");
      job.progress(60);
    }

    // 2. 💾 PERSIST_DATA: Mapping the notification to the User node
    if (userId) {
      await Notification.create({
        recipient: userId,
        title,
        message,
        type: type || "GENERAL"
      });
      job.progress(100);
    }

    return { 
      status: "COMPLETED", 
      recipient: email || userId,
      timestamp: new Date().toISOString() 
    };
  } catch (error) {
    logger.error(`❌ Worker Node Failure [Job: ${job.id}]: ${error.message}`);
    
    // 🛡️ RETRY LOGIC: Bull will trigger retries based on backoff config
    throw new Error(`Execution Failed: ${error.message}`); 
  }
});

// ================= 📈 EVENT MONITORING =================
notificationQueue.on("completed", (job, result) => {
  logger.info(`✅ Job ${job.id} finalized successfully.`);
});

notificationQueue.on("failed", (job, err) => {
  logger.error(`❌ Job ${job.id} failed permanently: ${err.message}`);
});

// ================= 🛑 GRACEFUL SHUTDOWN =================
process.on("SIGTERM", async () => {
  console.log("🔴 [TITAN-WORKER]: SIGTERM received. Finalizing active jobs...");
  await notificationQueue.close();
  process.exit(0);
});

module.exports = notificationQueue;