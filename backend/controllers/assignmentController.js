/**
 * ============================================================
 * 📝 TITAN ASSIGNMENT CONTROLLER (v4.2 - Production Stabilized)
 * Optimized for: Infinite Resubmissions, Persistent Grading, & Atomic Updates.
 * ============================================================
 */
const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// ================= 📝 1. CREATE ASSIGNMENT (Teacher Node) =================
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, classId, deadline } = req.body;
    const teacherId = req.user.id;

    if (!title || !classId || !deadline) {
      return errorResponse(res, "Protocol Incomplete: Data nodes missing", 400);
    }

    const validDeadline = new Date(deadline);
    if (isNaN(validDeadline.getTime())) {
      return errorResponse(res, "Neural Sync Error: Invalid Date Format", 400);
    }

    const attachmentPath = req.file ? `/uploads/assignments/${req.file.filename}` : null;

    const assignment = await Assignment.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      classId,
      teacher: teacherId,
      deadline: validDeadline,
      dueDate: validDeadline, 
      attachment: attachmentPath,
    });

    return successResponse(res, "Academic Task Linked Successfully", assignment, 201);
  } catch (err) {
    console.error("❌ CREATE_ASSIGNMENT_FAIL:", err.message);
    return errorResponse(res, "Neural Sync Failure: " + err.message);
  }
};

// ================= 📤 2. SUBMIT / RESUBMIT ASSIGNMENT (Student Node) =================
exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const studentId = req.user.id;

    if (!req.file) return errorResponse(res, "Payload Missing: No file detected", 400);

    // 🛡️ ATOMIC SYNC: Using findOne to prevent version conflicts
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return errorResponse(res, "Task Node not found", 404);

    // 🔥 FIND INDEX: Deep check for existing student node
    const subIndex = assignment.submissions.findIndex(
      (s) => s.student && s.student.toString() === studentId.toString()
    );

    const submissionPath = `/uploads/submissions/${req.file.filename}`;
    const isLate = new Date() > new Date(assignment.dueDate || assignment.deadline);

    if (subIndex !== -1) {
      // 🔄 OVERWRITE PROTOCOL (Resubmission)
      // Status management: Only change to 'resubmitted' if not already graded
      let currentStatus = assignment.submissions[subIndex].status;
      let nextStatus = currentStatus === "graded" ? "graded" : "resubmitted";

      // Update node values
      assignment.submissions[subIndex].fileUrl = submissionPath;
      assignment.submissions[subIndex].submittedAt = new Date();
      assignment.submissions[subIndex].status = nextStatus;
      assignment.submissions[subIndex].isLate = isLate;

      // 🛡️ CRITICAL: Tell Mongoose array has changed to trigger update
      assignment.markModified('submissions');
    } else {
      // ✨ NEW UPLINK: Pehli baar submission
      assignment.submissions.push({
        student: studentId,
        fileUrl: submissionPath,
        status: isLate ? "late" : "submitted",
        submittedAt: new Date(),
        isLate: isLate
      });
    }

    // 🔥 Save with Neural Handshake
    await assignment.save();
    return successResponse(res, isLate ? "Verified (LATE_SIGNAL_DETECTED)" : "Verified: Submission Successful");
  } catch (err) {
    console.error("❌ SUBMISSION_FAIL_LOG:", err);
    if (err.name === 'ValidationError') {
       return errorResponse(res, "Schema Validation Failed: Check Status Enum Values", 400);
    }
    return errorResponse(res, "Uplink Failed: " + err.message, 500);
  }
};

// ================= 📊 3. GLOBAL MONITOR (Dashboard Sync) =================
exports.getMyAssignments = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let assignments = [];

    if (role === "teacher") {
      assignments = await Assignment.find({ teacher: userId })
        .populate("classId", "name subject")
        .sort({ createdAt: -1 });
    } else {
      const studentClasses = await Class.find({ students: userId }).select("_id");
      const classIds = studentClasses.map((c) => c._id);
      
      assignments = await Assignment.find({ classId: { $in: classIds } })
        .populate("teacher", "name email")
        .populate("classId", "name subject")
        .sort({ createdAt: -1 });
    }
    
    return successResponse(res, "Global Dashboard Nodes Retrieved", assignments);
  } catch (err) {
    return errorResponse(res, "Global Sync Failure");
  }
};

// ================= 📋 4. FETCH SUBMISSIONS (Teacher Audit) =================
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const assignment = await Assignment.findById(assignmentId)
      .populate({
        path: "submissions.student",
        select: "name email"
      });

    if (!assignment) return errorResponse(res, "Task Node not found", 404);

    const validSubmissions = assignment.submissions.filter(sub => sub.student !== null);

    return successResponse(res, "Audit Nodes Retrieved Successfully", validSubmissions);
  } catch (err) {
    return errorResponse(res, "Audit Fetch Failure");
  }
};

// ================= 🎯 5. GRADING ENGINE =================
exports.giveMarks = async (req, res) => {
  try {
    const { assignmentId, studentId, marks, feedback } = req.body;
    
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return errorResponse(res, "Task Node not found", 404);

    const submission = assignment.submissions.find((s) => s.student.toString() === studentId.toString());
    if (!submission) return errorResponse(res, "Submission Data not found", 404);

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = "graded"; 

    // 🛡️ CRITICAL: Mark array as modified
    assignment.markModified('submissions');
    
    await assignment.save();
    return successResponse(res, "Neural Grading Updated Successfully");
  } catch (err) {
    console.error("❌ GRADING_FAIL:", err.message);
    return errorResponse(res, "Grading Module Failure");
  }
};

// ================= 🏫 6. FETCH CLASS SPECIFIC ASSIGNMENTS =================
exports.getAssignments = async (req, res) => {
  try {
    const { classId } = req.params;

    const assignments = await Assignment.find({ classId })
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    return successResponse(res, "Local Class Assignments Retrieved Successfully", assignments);
  } catch (err) {
    return errorResponse(res, "Classroom Node Sync Failure");
  }
};

// ================= 🗑️ 7. DELETE ASSIGNMENT PROTOCOL (Teacher Only) =================
exports.deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user.id;

    // Assignment ko find karo backend memory mein
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return errorResponse(res, "Target Node not found for termination.", 404);
    }

    // Security Check: Kya jis teacher ne assignment banaya tha, wahi delete kar raha hai?
    if (assignment.teacher.toString() !== userId.toString()) {
      return errorResponse(res, "Access Denied: You cannot terminate another Operator's task.", 403);
    }

    // Terminate it from the database!
    await Assignment.findByIdAndDelete(assignmentId);

    return successResponse(res, "Academic Task Terminated Successfully.");
  } catch (err) {
    console.error("❌ DELETE_ASSIGNMENT_FAIL:", err.message);
    return errorResponse(res, "Terminal Execution Failed: " + err.message);
  }
};