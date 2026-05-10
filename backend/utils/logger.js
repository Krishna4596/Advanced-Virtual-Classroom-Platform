// backend/utils/logger.js
const winston = require("winston");
const fs = require("fs");
const path = require("path");

/**
 * 🛰️ NEURAL LOGGING INTERFACE (TITAN v4.2)
 * Ref: Report Section 3.5 (System Monitoring & Observability)
 * Purpose: Centralized event capturing for system health and debugging.
 */

const logDir = "logs";

// 🛡️ DIRECTORY SHIELD: Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 🎨 CUSTOM COLORS: For enhanced terminal visibility
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json() // 🤖 Optimized for Machine Reading (Splunk/ELK)
  ),
  transports: [
    // ❌ ERROR LOGS: Capturing only critical failures
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB limit per file
      maxFiles: 5,
    }),
    // 📂 COMBINED LOGS: Capturing all system telemetry
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 10485760, // 10MB limit
      maxFiles: 5,
    }),
  ],
});

// 🖥️ DEVELOPMENT OVERRIDE: Pretty printing for local terminal
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `[${info.timestamp}] ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
        )
      ),
    })
  );
}

module.exports = logger;