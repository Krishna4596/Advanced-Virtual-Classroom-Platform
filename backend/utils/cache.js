// backend/utils/cache.js
const redisClient = require("../config/redis");
const logger = require("./logger");

/**
 * ⚡ NEURAL CACHE INTERFACE (TITAN v4.2)
 * Ref: Report Section 1.3 (Redis Caching & Performance Optimization)
 * Purpose: Accelerating dashboard telemetry and reducing MongoDB overhead.
 */

// ✅ GET_CACHE: Fast retrieval of serialized data nodes
const getCache = async (key) => {
  try {
    if (!redisClient || redisClient.status !== "ready") return null;
    
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    logger.warn(`Cache Read Failure for key [${key}]: ${err.message}`);
    return null;
  }
};

// 💾 SET_CACHE: Storing data with a Volatile TTL (Time-To-Live)
const setCache = async (key, value, ttl = 300) => { // Default increased to 5 mins
  try {
    if (!redisClient || redisClient.status !== "ready") return;
    
    // Using SETEX for atomic 'Set and Expire' operation
    await redisClient.setex(key, ttl, JSON.stringify(value));
  } catch (err) {
    logger.error(`Cache Write Failure for key [${key}]: ${err.message}`);
  }
};

// 🗑️ DELETE_CACHE: Explicit removal of specific data nodes
const deleteCache = async (key) => {
  try {
    if (redisClient && redisClient.status === "ready") {
      await redisClient.del(key);
    }
  } catch (err) {
    logger.error(`Cache Deletion Failure: ${err.message}`);
  }
};

// 🧹 CLEAR_PATTERN: Advanced - Clear all cache starting with a prefix (e.g., "class_101_*")
const clearCacheByPattern = async (pattern) => {
  try {
    if (!redisClient || redisClient.status !== "ready") return;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    logger.error(`Pattern Cache Clear Failure: ${err.message}`);
  }
};

module.exports = { 
  getCache, 
  setCache, 
  deleteCache, 
  clearCacheByPattern 
};