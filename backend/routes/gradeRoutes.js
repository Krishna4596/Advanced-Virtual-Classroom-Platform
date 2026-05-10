/**
 * ============================================================
 * 🛣️ TITAN NETWORK: Grade Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { addGrade, getStudentGrades } = require('../controllers/gradeController');

// Ye middleware assume kar raha hu tere paas auth ke liye pehle se hai
const { protect } = require('../middleware/authMiddleware'); 

// Teacher uploads grade
router.post('/upload', protect, addGrade);

// Fetch grades for a specific student
router.get('/:studentId', protect, getStudentGrades);

module.exports = router;