// backend/middleware/securityMiddleware.js
const helmet = require("helmet");
const cors = require("cors");

/**
 * 🛡️ TITAN SECURITY SHIELD (v4.2)
 * Ref: Report Section 3.3.4 (Cybersecurity & Forensic Telemetry)
 * Purpose: Hardening HTTP headers and enforcing Cross-Origin Resource Sharing protocols.
 */

const securityMiddleware = (app) => {
  // 🛰️ HELMET: Standard security headers
  app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false, // Development flexibility
    crossOriginEmbedderPolicy: false,
  }));

  // 🛰️ CORS: Defining the trust boundary
  const corsOptions = {
    origin: (origin, callback) => {
      // Allowing requests with no origin (like mobile apps or curl) 
      // but strictly validating against CLIENT_URL in production
      const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"];
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS Policy Violation: Origin not allowed by Titan Security."));
      }
    },
    credentials: true, // Required for HttpOnly Cookies / Session Handshake
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
};

module.exports = securityMiddleware;