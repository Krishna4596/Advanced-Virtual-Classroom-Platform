/**
 * ============================================================
 * ⚙️ TITAN CORE: Grade Controller
 * Purpose: Handle Push (Teacher) and Pull (Parent/Student) requests.
 * ============================================================
 */

const Grade = require('../models/Grade');

// 1. TEACHER PUSH: Upload new grades
exports.addGrade = async (req, res) => {
  try {
    // Only teachers should be able to upload grades
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ success: false, message: "Unauthorized Node Access." });
    }

    const { studentId, subject, examType, score, totalMarks, grade, remarks } = req.body;

    const newGrade = new Grade({
      student: studentId,
      teacher: req.user._id || req.user.id,
      subject,
      examType,
      score,
      totalMarks,
      grade,
      remarks
    });

    await newGrade.save();

    res.status(201).json({ 
      success: true, 
      message: "Telemetry Sync Complete. Grades Uploaded.",
      data: newGrade 
    });

  } catch (error) {
    console.error("Grade Upload Error:", error);
    res.status(500).json({ success: false, message: "Server Protocol Failure." });
  }
};

// 2. PARENT/STUDENT PULL: Fetch grades for a specific student
exports.getStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Fetch grades and populate teacher's name so parent knows who gave the marks
    const grades = await Grade.find({ student: studentId })
                              .populate('teacher', 'name')
                              .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: grades.length,
      data: grades 
    });

  } catch (error) {
    console.error("Grade Fetch Error:", error);
    res.status(500).json({ success: false, message: "Server Protocol Failure." });
  }
};