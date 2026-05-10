/**
 * ============================================================
 * 🛡️ TITAN Advanced VIRTUAL CLASSROOM ENGINE (v5.6 - Master Node)
 * ============================================================
 * Final Assembly: Integrating Sockets, Security, and Grading.
 * Upgraded: Added 404 API Fallback Shield for better debugging.
 * Status: OPERATIONAL [ALL SYSTEMS GO]
 * ============================================================
 */

require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const { Server } = require("socket.io");
const path = require("path");
const cron = require("node-cron");

const connectDB = require("./config/db");
const logger = require("./utils/logger");
const errorMiddleware = require("./middleware/errorMiddleware");

// 🛤️ ROUTE_IMPORTS
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const parentRoutes = require("./routes/parentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const pollRoutes = require("./routes/pollRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const broadcastRoutes = require("./routes/broadcastRoutes");
const messageRoutes = require("./routes/messageRoutes");
const gradeRoutes = require("./routes/gradeRoutes"); 

const { automatedCronBroadcast } = require("./controllers/parentController");
const startRedisMonitoring = require("./monitoring/redisMonitor");
const { socketHandler } = require("./socket/socketHandler"); 

const app = express();
const server = http.createServer(app);

// 🔌 INFRASTRUCTURE: Database & Monitoring
connectDB();
if (process.env.NODE_ENV === "production") {
    startRedisMonitoring();
}

/**
 * 🛡️ SECURITY_SHIELD_STACK
 */
app.use(helmet({ 
  contentSecurityPolicy: false, 
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression()); 

// 🛰️ CORS_PROTOCOL: Neural Link
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));

app.use(express.json({ limit: "50mb" })); 
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// 📁 STATIC_RESOURCES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * ⚡ REAL-TIME_ENGINE (Socket.io)
 */
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  },
  maxHttpBufferSize: 1e7,
  transports: ['websocket', 'polling']
});

socketHandler(io); 
app.set("io", io); 

/**
 * 🔑 CSRF_PROTOCOL: Guarding Neural Integrity
 */
const csrfProtection = csurf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax"
  } 
});

/**
 * 🛤️ API_NODE_MAPPING
 */

// 🔓 1. Public Handshake (Bypasses CSRF)
app.get("/health", (req, res) => res.status(200).send("TITAN_ENGINE_STABLE"));
app.use("/api/auth", authRoutes); 

// 🔑 2. CSRF Token Generation
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 🔒 3. Protected Nodes (Optional CSRF in Development)
const nodeSecurityGate = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") return next();
  return csrfProtection(req, res, next);
};

app.use("/api/classes", nodeSecurityGate, classRoutes);
app.use("/api/parent", nodeSecurityGate, parentRoutes);
app.use("/api/analytics", nodeSecurityGate, analyticsRoutes);
app.use("/api/assignments", nodeSecurityGate, assignmentRoutes);
app.use("/api/submissions", nodeSecurityGate, submissionRoutes);
app.use("/api/polls", nodeSecurityGate, pollRoutes);
app.use("/api/broadcast", nodeSecurityGate, broadcastRoutes); 
app.use("/api/messages", nodeSecurityGate, messageRoutes); 
app.use("/api/attendance", nodeSecurityGate, attendanceRoutes);
app.use("/api/grades", nodeSecurityGate, gradeRoutes); 

/**
 * 🤖 TITAN_CRON_AGENT
 */
cron.schedule("0 0 * * 0", () => {
  try {
    automatedCronBroadcast();
    logger.info("🤖 [CRON-AGENT]: Weekly Performance Sync Executed.");
  } catch (err) {
    logger.error("❌ [CRON-AGENT] Failure: " + err.message);
  }
});

// 🔥 FIXED: 404 API FALLBACK SHIELD
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ 
      success: false, 
      message: `❌ API Node Not Found: ${req.originalUrl}. Please check your frontend API path.` 
    });
  }
  next();
});

// 🛠️ ERROR_HANDLER
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        return res.status(403).json({ success: false, message: "Security Handshake Failed: Invalid CSRF Token" });
    }
    errorMiddleware(err, req, res, next);
});

/**
 * 🚀 ENGINE_IGNITION
 */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  ================================================
  🛡️  ADVANCED VIRTUAL CLASSROOM PLATFORM (v5.6)
  ================================================
  🚀 STATUS   : OPERATIONAL [ALL NODES SYNCED]
  📡 PORT     : ${PORT}
  📶 SOCKET   : LINK_STABLE [READY FOR CHAT]
  📊 GRADES   : TELEMETRY_ONLINE [SYNCED]
  🤖 AGENT    : CRON_SCHEDULED [WEEKLY_SYNC]
  🔒 SECURITY : HELMET + CSRF + JWT_GATEWAY
  ================================================
  `);
});

// 🛑 GRACEFUL_SHUTDOWN
process.on("unhandledRejection", (err) => {
    console.error("❌ UNHANDLED_REJECTION: ", err.message);
    if (process.env.NODE_ENV === "production") {
        server.close(() => process.exit(1));
    }
});