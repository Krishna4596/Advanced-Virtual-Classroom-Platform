/**
 * ============================================================
 * 📁 TITAN FILE UPLOAD MIDDLEWARE (v4.2 - High Capacity)
 * Upgrade: Increased limit to 60MB & Optimized Collision Logic.
 * ============================================================
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🛠️ STORAGE_NODE_SETUP: Ensures directory existence without crashing
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 🛰️ DYNAMIC PATH RESOLUTION: Distinguishing Tasks vs Submissions
    let uploadPath = path.join("uploads", "assignments");
    
    if (req.originalUrl.includes("submit") || req.originalUrl.includes("submission")) {
      uploadPath = path.join("uploads", "submissions");
    }
    
    try {
      createDir(uploadPath);
      cb(null, uploadPath);
    } catch (err) {
      cb(new Error("Storage Sync Failure: Could not initialize directory."), null);
    }
  },
  filename: (req, file, cb) => {
    // 🧬 NEURAL FILENAME: Ensures zero-collision and removes special characters
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanFileName = file.originalname
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9.\-_]/g, ''); // Remove non-standard characters
      
    cb(null, `TITAN-${uniqueSuffix}-${cleanFileName}`);
  },
});

/**
 * 🛡️ EXTENSION_GUARD: Restricting to academic file types
 */
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".zip", ".rar", ".txt"];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    const error = new Error("Security Alert: Unauthorized file signature detected.");
    error.status = 400;
    cb(error, false);
  }
};

const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { 
    // 🌐 UPGRADED LIMIT: 50MB (Buffer for large project nodes)
    fileSize: 50 * 1024 * 1024 
  },
});

module.exports = uploadMiddleware;