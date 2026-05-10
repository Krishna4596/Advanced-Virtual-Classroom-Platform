/**
 * ============================================================
 * 🛰️ TITAN NEURAL SOCKET HANDLER (v6.1 - Live Radar Enabled)
 * Upgrade: Added Global 'class_live_status' emitter.
 * Fix: Live Badge now auto-triggers when Teacher joins/leaves.
 * ============================================================
 */
const Message = require("../models/Message");

let ioInstance; // Global instance

const socketHandler = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log(`📡 Neural Node Linked: ${socket.id}`);

    // --- 0. IDENTITY HANDSHAKE (RECOVERY PROTOCOL) ---
    socket.on("identify_node", (userId) => {
      if (userId) {
        const room = userId.toString();
        socket.join(room); 
        console.log(`🔑 Node Identity Verified: ${room}`);
      }
    });

    socket.on("join_parent_node", (parentId) => {
      if (parentId) {
        socket.join(parentId.toString());
        console.log(`👨‍👩‍👧 Guardian Node Linked: ${parentId}`);
      }
    });

    socket.on("trigger_ptm_alert", (data) => {
      if (data && data.parentId) {
        io.to(data.parentId.toString()).emit("ptm_invitation", {
          teacherName: data.teacherName || "Instructor",
          classId: data.classId,
          topic: data.topic || "Emergency Performance Sync"
        });
        console.log(`🚨 Emergency Handshake Dispatched to Guardian: ${data.parentId}`);
      }
    });

    socket.on("terminate_ptm_alert", (parentId) => {
      if (parentId) {
        io.to(parentId.toString()).emit("ptm_terminated");
      }
    });

    // --- 1. CLASSROOM & CHAT PROTOCOL ---
    socket.on("join_class", async (classId) => {
      try {
        if (!classId || String(classId) === "null" || String(classId) === "undefined") return;
        socket.join(classId);
        console.log(`🏫 Joined Classroom Node: ${classId}`);
        
        const messages = await Message.find({ classId })
          .populate("user", "name") 
          .sort({ createdAt: -1 })
          .limit(50)
          .lean(); 
        socket.emit("load_messages", messages.reverse());
      } catch (err) {
        console.error("❌ Socket Protocol Error [join_class]:", err.message);
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, text, classId, senderName } = data;
        if (!senderId || !text || !classId) return;

        const msg = await Message.create({ 
          classId, 
          user: senderId, 
          message: text.trim() 
        });
        
        const responseData = {
          classId,
          sender: senderName || "Authorized User",
          senderId: senderId,
          text: text.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          _id: msg._id,
          createdAt: msg.createdAt
        };

        io.to(classId).emit("receive_message", responseData);
      } catch (err) {
        console.error("❌ Signal Processing Failed [send_message]:", err.message);
      }
    });

    // ============================================================
    // 🔥 2. VIDEO ROOM SYNC (LIVE RADAR, WHITEBOARD, KICKS & POLLS)
    // ============================================================
    socket.on("join_video_room", (data) => {
      if (data && data.roomId) {
        socket.join(data.roomId);
        console.log(`📹 Connected to Video Room Node: ${data.roomId}`);
        socket.to(data.roomId).emit("new_participant", data.user);

        // 🔥 FIX: Global Live Status Radar!
        // Agar teacher ne join kiya hai, toh sabhi students ke dashboard par "LIVE NOW" bhej do
        if (data.user?.role === "teacher") {
           io.emit("class_live_status", { classId: data.roomId, isLive: true });
           console.log(`🔴 CLASS WENT LIVE: ${data.roomId}`);
           
           // Socket object par roomId save kar lo taaki disconnect hone par pata rahe konsi class off hui
           socket.teacherRoomId = data.roomId;
        }
      }
    });

    // Legacy Kick (Kept for safety)
    socket.on("kick_participant", (data) => {
      if (data && data.roomId && data.studentId) {
        io.to(data.roomId).emit("you_are_kicked", { targetId: data.studentId });
      }
    });

    // New Enterprise Kick System Listener
    socket.on("kick_user", (data) => {
      if (data && data.roomId && data.userId) {
        io.to(data.roomId).emit("user_kicked", { userId: data.userId });
        console.log(`👢 User ${data.userId} kicked from room ${data.roomId}`);
      }
    });

    // --- 3. LIVE WHITEBOARD SYNC ---
    socket.on("draw", (data) => {
      const targetRoom = data?.classId || data?.roomId;
      if (targetRoom) {
        socket.to(targetRoom).emit("drawing", data);
      }
    });

    socket.on("clear_board", (roomIdOrClassId) => {
      if (roomIdOrClassId) {
        socket.to(roomIdOrClassId).emit("board_cleared");
      }
    });

    // --- 4. BROADCAST SYNC ---
    socket.on("dispatch_broadcast", (data) => {
       if(data && data.classId) {
         io.to(data.classId).emit("new_announcement_broadcast", data);
       }
    });

    // --- 5. HAND RAISE SIGNAL ---
    // Legacy Hand Raise
    socket.on("raise_hand", (data) => {
      const targetRoom = data?.classId || data?.roomId; 
      if (targetRoom) {
        io.to(targetRoom).emit("hand_raised_ui", { 
          userName: data.userName,
          userId: data.userId 
        });
      }
    });

    // Global Toggle Hand Raise Listener
    socket.on("toggle_hand_raise", (data) => {
      const targetRoom = data?.roomId || data?.classId;
      if (targetRoom && data.userId) {
        io.to(targetRoom).emit("hand_raise_updated", data);
      }
    });

    // ============================================================
    // 🔥 6. NEURAL POLLS & VOTING 
    // ============================================================
    socket.on("launch_poll", (data) => {
      if (data && data.classId) {
        io.to(data.classId).emit("new_poll_active", data);
      }
      if (data && data.roomId && data.roomId !== data.classId) {
        io.to(data.roomId).emit("new_poll_active", data);
      }
    });

    socket.on("submit_vote", (data) => {
      if (data && data.classId) {
        io.to(data.classId).emit("poll_vote_registered", data);
      }
      if (data && data.roomId && data.roomId !== data.classId) {
        io.to(data.roomId).emit("poll_vote_registered", data);
      }
    });

    socket.on("end_poll", (data) => {
      if (data && data.classId) {
        io.to(data.classId).emit("poll_terminated", { pollId: data.pollId });
      }
    });

    // --- 7. DISCONNECT & OFFLINE PROTOCOL ---
    socket.on("disconnect", (reason) => {
      console.log(`🔻 Node Offline: ${socket.id} (Reason: ${reason})`);
      
      // 🔥 FIX: Agar teacher ka connection toota (call cut kiya), toh class ko wapas OFFLINE dikhao
      if (socket.teacherRoomId) {
         io.emit("class_live_status", { classId: socket.teacherRoomId, isLive: false });
         console.log(`⚫ CLASS OFFLINE: ${socket.teacherRoomId}`);
      }
    });
  });
};

const getSocket = () => {
  if (!ioInstance) {
    console.warn("⚠️ [TITAN]: Socket.io instance requested before initialization.");
    return null;
  }
  return ioInstance;
};

module.exports = { socketHandler, getSocket };