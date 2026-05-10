// backend/middleware/redisRateLimiter.js
const { RateLimiterRedis } = require("rate-limiter-flexible");
const redisClient = require("../config/redis");
const logSecurityEvent = require("../utils/securityLogger");
const logger = require("../utils/logger");

/**
 * 🛡️ TITAN BRUTE-FORCE DEFLECTOR (v4.2)
 * Ref: Report Section 3.3.4 (Access Control & Threat Mitigation)
 * Purpose: Throttling malicious login attempts using Redis-backed distributed counters.
 */

const loginLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "login_fail",
  points: 5,               // Max 5 attempts
  duration: 60 * 15,       // Within 15 minutes
  blockDuration: 60 * 15,  // Lockout for 15 minutes
});

const rateLimiterMiddleware = async (req, res, next) => {
  // 🛰️ FAIL-SAFE: If Redis is unreachable, bypass limiter to avoid service disruption
  if (!redisClient || redisClient.status !== "ready") return next();

  try {
    await loginLimiter.consume(req.ip);
    next();
  } catch (err) {
    // 🚩 SECURITY AUDIT: Log this as a high-risk event
    await logSecurityEvent(req, "ANONYMOUS", "BRUTE_FORCE_LOCKOUT", "HIGH");
    
    logger.warn(`🚨 Rate limit exceeded for IP: ${req.ip}. Node locked for 15m.`);

    res.status(429).json({ 
      success: false, 
      message: "Security Protocol Active: Too many failed attempts. Access locked for 15 minutes.",
      retryAfter: "15m"
    });
  }
};

module.exports = rateLimiterMiddleware;