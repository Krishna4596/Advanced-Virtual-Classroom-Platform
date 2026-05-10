//frontend/src/socket/socket.js 

/**
 * ============================================================
 * 📡 TITAN NEURAL LINK ENGINE (v4.2 - Production)
 * Ref: Report Section 3.5 (Communication & Real-time Sync)
 * Status: STABILIZED - Dynamic Auth & Fallback logic verified.
 * ============================================================
 */
import { io } from "socket.io-client";

// 🛰️ NODE_ENDPOINT: Mapping to primary communication cluster
const SOCKET_URL = import.meta.env.VITE_BACKEND_SOCKET || import.meta.env.VITE_BACKEND_API || "http://localhost:5000";

let socket = null;

export const initSocket = () => {
  // 🛡️ RE-INITIALIZATION PREVENTER
  if (socket && socket.connected) return socket;

  // 🔐 IDENTITY_HANDSHAKE: Always fetch the latest token from storage
  const token = localStorage.getItem("token");

  socket = io(SOCKET_URL, {
    auth: { token }, // 👈 Initial token injection
    withCredentials: true,
    transports: ["websocket"], 
    upgrade: true,
    reconnection: true,
    reconnectionAttempts: 20, 
    reconnectionDelay: 1500,
    timeout: 45000, 
    autoConnect: false, // Explicit control via connectSocket()
  });

  // ================= 📡 NEURAL EVENT PROTOCOLS =================

  socket.on("connect", () => {
    console.log(`%c✅ AVCP_NEURAL_LINK: Online [Node_ID: ${socket.id}]`, "color: #10b981; font-weight: bold;");
  });

  socket.on("disconnect", (reason) => {
    console.warn(`⚠️ AVCP_LINK_LOST: ${reason}`);
    // Forced reconnection if server severed the link unexpectedly
    if (reason === "io server disconnect") {
      socket.connect(); 
    }
  });

  socket.on("connect_error", (err) => {
    console.error("❌ NEURAL_HANDSHAKE_FAILED:", err.message);
    
    // 🔄 RE-AUTH LOGIC: Agar token expire ho gaya toh connection reconnect karega
    if (err.message === "xhr poll error" || err.message === "Authentication error") {
       console.log("%c🔄 RE-IDENTIFYING: Refreshing Authentication Node...", "color: #f59e0b;");
       const newToken = localStorage.getItem("token");
       if (newToken) {
         socket.auth.token = newToken; // Inject fresh token
         socket.connect();
       }
    }

    // 🔄 HYBRID FALLBACK: Reverting to Long-Polling if WebSocket is restricted
    if (socket.io.opts.transports.includes("websocket") && socket.io.opts.transports.length === 1) {
       console.log("%c🔄 REVERTING_PROTOCOL: Initializing HTTP Polling Buffer...", "color: #3b82f6; italic");
       socket.io.opts.transports = ["polling", "websocket"];
       socket.connect();
    }
  });

  return socket;
};

// 🛰️ SIGNAL_INITIATOR: Establishing link with the cluster
export const connectSocket = () => {
  if (!socket) initSocket();
  
  // 💉 DYNAMIC TOKEN INJECTION (Crucial for login-flow)
  const token = localStorage.getItem("token");
  if (socket) {
    socket.auth = { token }; 
    if (!socket.connected) {
      socket.connect();
    }
  }
};

// 🛑 PROTOCOL_TERMINATOR: Safe severance of all neural links
export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null; // Memory cleanup
    console.log("%c🛑 AVCP_NEURAL_LINK: Offline (Node Deregistered)", "color: #ef4444; font-weight: bold;");
  }
};

// 🛰️ NODE_ACCESSOR: Accessing the active communication node
export const getSocket = () => {
  if (!socket) return initSocket();
  return socket;
};