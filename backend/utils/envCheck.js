// backend/utils/envCheck.js

/**
 * 🛡️ TITAN ENVIRONMENT GUARDIAN (v4.2)
 * Ref: Report Section 3.5 (Deployment & Infrastructure)
 * Purpose: Pre-flight validation of critical environment variables to prevent runtime crashes.
 */

const requiredVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "REDIS_URL",      // Active: As we are using Redis for caching
  "FRONTEND_URL",
  "PORT",
  "NODE_ENV",
  "CLOUDINARY_CLOUD_NAME", // Required for Assignment uploads
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "EMAIL_USER",     // Required for OTP & Notifications
  "EMAIL_PASS"
];

const checkEnv = () => {
  const missing = requiredVars.filter(
    (key) => !process.env[key]
  );

  if (missing.length) {
    console.error("\n" + "=".repeat(40));
    console.error("❌ CRITICAL FAILURE: MISSING CONFIGURATION");
    console.error("=".repeat(40));
    missing.forEach((key) => console.error(`   👉 MISSING: ${key}`));
    console.error("=".repeat(40));
    console.error("Server shutting down to prevent unstable execution...\n");
    
    // 🛡️ SIGTERM: Exit with failure code
    process.exit(1);
  }

  // 🚀 LOGGING: Success handshake in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    console.log("✅ [TITAN-CONFIG]: All environment variables validated.");
  }
};

module.exports = checkEnv;