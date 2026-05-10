/**
 * ============================================================
 * 📥 STUDENT SUBMISSIONS CONTROLLER (v4.2 - Production Ready)
 * Ref: Report Section 3.3.1 (d) (Assignment-Feedback Flow)
 * ============================================================
 */
const Assignment = require("../models/Assignment");
const { successResponse, errorResponse } = require("../utils/apiResponse");

exports.getMySubmissions = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const userRole = req.user?.role;

    // 🛡️ ROLE_GUARD: Access restricted to student identity nodes
    if (userRole !== "student") {
      return errorResponse(res, "Access Denied: Student credentials required", 403);
    }

    // 🛰️ DISCOVERY: Fetching assignments with student's specific submission node
    // Optimized: Populating class details to provide subject context
    const assignments = await Assignment.find({
      "submissions.student": userId,
    })
    .select("title submissions classId")
    .populate("classId", "name subject");

    // 🧬 DATA_FLATTENING: Transforming nested schema into flat telemetry
    const submissions = assignments.flatMap(assignment => 
      assignment.submissions
        .filter(sub => sub.student.toString() === userId.toString())
        .map(sub => ({
          submissionId: sub._id,
          assignmentId: assignment._id,
          title: assignment.title,
          subject: assignment.classId?.subject || "General",
          className: assignment.classId?.name || "N/A",
          fileUrl: sub.fileUrl,
          marks: sub.marks || "Pending",
          feedback: sub.feedback || "No feedback yet",
          status: sub.status, // Tracking: 'submitted' or 'graded'
          submittedAt: sub.submittedAt || sub.createdAt,
        }))
    );

    return successResponse(res, "Student submission nodes retrieved successfully", submissions);
  } catch (err) {
    return errorResponse(res, "Neural Link Failure: Unable to fetch submissions - " + err.message);
  }
};