/**
 * ============================================================
 * 🔔 TITAN NOTIFICATION CONTROLLER (v4.2 - Neural Sync)
 * Ref: Report Section 3.5 (Feedback Loop) & 3.3.1 (Role Views)
 * ============================================================
 */
const Notification = require("../models/Notification");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// ================= 📥 1. GET MY NOTIFICATIONS =================
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🛰️ Fetching latest 20 notifications for the user node
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    // 📊 Counting unread signals for the badge icon
    const unreadCount = await Notification.countDocuments({ 
      recipient: userId, 
      isRead: false 
    });

    return successResponse(res, "Neural Alerts Synchronized", {
      notifications,
      unreadCount
    });
  } catch (err) {
    return errorResponse(res, "Alert Sync Failure: " + err.message);
  }
};

// ================= 🔑 2. MARK AS READ =================
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user.id },
      { isRead: true },
      { returnDocument: 'after' }
    );

    if (!notification) return errorResponse(res, "Signal Node not found", 404);

    return successResponse(res, "Alert Neutralized (Marked as Read)");
  } catch (err) {
    return errorResponse(res, "Signal Processing Failure");
  }
};

// ================= 🚀 3. PUSH SYSTEM ALERT (Internal Helper) =================
/**
 * Ye function hamara 'Ringing Bell' engine hai. 
 * Isse hum doosre controllers (like Analytics) se call karenge.
 */
exports.createInternalNotification = async (app, data) => {
  try {
    const { recipient, title, message, type, priority, link } = data;

    const newNotification = await Notification.create({
      recipient,
      title,
      message,
      type,
      priority,
      link
    });

    // ⚡ REAL-TIME DISPATCH: Socket.io se bina refresh 'Ring' karwana
    const io = app.get("io");
    if (io) {
      io.to(recipient.toString()).emit("new_notification", {
        title,
        message,
        type,
        priority,
        createdAt: newNotification.createdAt
      });
    }

    return newNotification;
  } catch (err) {
    console.error("Critical Notification Dispatch Failure:", err);
  }
};