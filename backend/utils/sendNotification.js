// backend/utils/sendNotification.js
const Notification = require("../models/Notification");
const logger = require("./logger");

/**
 * 🛰️ NEURAL NOTIFICATION DISPATCHER (TITAN v4.2)
 * Ref: Report Section 3.4 (Real-time Communication Layer)
 * Purpose: Orchestrating persistent and ephemeral alerts across user nodes.
 */

const sendNotification = async (req, userId, title, message, type = "INFO") => {
  try {
    // 🛡️ SOCKET HANDSHAKE: Retrieving the IO instance from the app context
    const io = req.app.get("io"); 

    // 1. 💾 PERSISTENCE: Archiving the notification in MongoDB
    const notification = await Notification.create({
      recipient: userId,
      title,
      message,
      type, // Standardizing types: 'ASSIGNMENT', 'POLL', 'SYSTEM'
      isRead: false
    });

    // 2. ⚡ REAL-TIME EMISSION: Pushing to the user's private socket room
    if (io) {
      // Ensuring the room ID is a clean string
      const targetRoom = userId.toString();
      io.to(targetRoom).emit("new_notification", {
        success: true,
        data: notification
      });
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`🚀 [TITAN-SOCKET]: Notification pushed to Room ${targetRoom}`);
      }
    }

    return notification;
  } catch (error) {
    // 🛡️ FAIL-SAFE: Logging the failure without crashing the main thread
    logger.error("❌ Notification Synchronization Failure: " + error.message, {
      userId,
      title
    });
    return null;
  }
};

module.exports = sendNotification;