/**
 * ============================================================
 * 📊 TITAN PARENT CONTROLLER (v5.2 - Async-Safe Build)
 * Ref: Report Section 3.3.1 (f) (Parent Portal) & 4.2 (Analytics)
 * Upgrade: express-async-handler, Null-Safety, & Clean Logic.
 * ============================================================
 */
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Assignment = require("../models/Assignment");
const { successResponse, errorResponse } = require("../utils/apiResponse");

/**
 * 🛰️ NEURAL ANALYTICS ENGINE: Global performance calculation
 */
const calculateWeeklyMetrics = async () => {
  const parents = await User.find({ role: "parent" }).populate("children");
  
  return Promise.all(parents.map(async (parent) => {
    const childReports = await Promise.all(parent.children.map(async (child) => {
      
      // 📅 ATTENDANCE_TELEMETRY: Null-safe filter
      const attendance = await Attendance.find({ student: child._id });
      const presentCount = attendance.filter(a => 
        a.status?.toLowerCase() === "present"
      ).length;
      
      const attendancePercentage = attendance.length > 0 
        ? ((presentCount / attendance.length) * 100).toFixed(1) : "0";

      // 📝 PERFORMANCE_LOGIC: Grade aggregation
      const assignments = await Assignment.find({ "submissions.student": child._id });
      let totalGrades = 0, gradedTasks = 0;

      assignments.forEach(asm => {
        const sub = asm.submissions.find(s => s.student.toString() === child._id.toString());
        if (sub && sub.marks !== undefined) { 
          totalGrades += sub.marks; 
          gradedTasks++; 
        }
      });

      return {
        childId: child._id,
        childName: child.name,
        childEmail: child.email,
        stats: {
          attendanceRatio: `${presentCount}/${attendance.length}`,
          attendancePercentage: `${attendancePercentage}%`,
          avgPerformance: gradedTasks > 0 
            ? `${(totalGrades / gradedTasks).toFixed(1)}/100` : "Eval Pending"
        }
      };
    }));

    return { 
      parentId: parent._id, 
      parentName: parent.name, 
      reports: childReports 
    };
  }));
};

// ================= 🔗 1. LINK CHILD (Handshake Protocol) =================
exports.linkChild = asyncHandler(async (req, res) => {
  const { studentEmail } = req.body;
  if (!studentEmail) return errorResponse(res, "Target student email parameter missing.", 400);

  const parentId = req.user.id;
  const normalizedStudentEmail = studentEmail?.toLowerCase()?.trim();

  const student = await User.findOne({ email: normalizedStudentEmail, role: "student" });
  if (!student) return errorResponse(res, "Student Node not found in the identity grid.", 404);

  const parent = await User.findById(parentId);
  if (parent.children.includes(student._id)) {
    return errorResponse(res, "Conflict: Neural Link already active for this child.", 400);
  }

  parent.children.push(student._id);
  await parent.save();

  return successResponse(res, "Neural Link Established Successfully! 🔗");
});

// ================= 📊 2. PARENT DASHBOARD FEED =================
exports.getChildProgress = asyncHandler(async (req, res) => {
  const parentId = req.user.id;
  const parent = await User.findById(parentId).populate("children", "name email");
  
  if (!parent) return errorResponse(res, "Guardian Node not detected.", 404);

  // Agar parent ne koi child link nahi kiya, toh khali array bhejo taaki frontend par "No Nodes Detected" dikhe
  if (!parent.children || parent.children.length === 0) {
    return successResponse(res, "Guardian Feed Ready (No Nodes)", { guardian: parent.name, children: [] });
  }

  const childrenData = await Promise.all(parent.children.map(async (child) => {
    const attendanceLogs = await Attendance.find({ student: child._id }).sort({ date: -1 });
    const presentCount = attendanceLogs.filter(a => a.status?.toLowerCase() === "present").length;
    
    const attendancePercentage = attendanceLogs.length > 0 
      ? ((presentCount / attendanceLogs.length) * 100).toFixed(1) : "0";

    const assignments = await Assignment.find({ "submissions.student": child._id });
    let totalGrades = 0, gradedTasks = 0;
    
    assignments.forEach(asm => {
      const sub = asm.submissions.find(s => s.student.toString() === child._id.toString());
      if (sub && sub.marks !== undefined) { 
        totalGrades += sub.marks; 
        gradedTasks++; 
      }
    });

    return {
      childId: child._id,
      childName: child.name,
      analytics: {
        attendancePercentage: `${attendancePercentage}`,
        avgPerformance: gradedTasks > 0 ? `${(totalGrades / gradedTasks).toFixed(1)}/100` : "N/A",
        status: attendanceLogs.length > 0 ? "Linked & Active" : "No Recent Signal"
      },
      recentLogs: attendanceLogs.slice(0, 3) 
    };
  }));

  return successResponse(res, "Guardian Analytics Feed Retrieved", { 
    guardian: parent.name, 
    children: childrenData 
  });
});

// ================= 📢 3. TEACHER BROADCAST =================
exports.broadcastWeeklyReport = asyncHandler(async (req, res) => {
  // Yeh API ab sirf middleware se "teacher" role wale hi access kar payenge (Routes mein lock laga hai)
  
  const fullDossier = await calculateWeeklyMetrics();
  const io = req.app.get("io"); 

  if (io) {
    fullDossier.forEach(data => {
      io.to(data.parentId.toString()).emit("ptm_invitation", {
        teacherName: req.user.name,
        reports: data.reports,
        timestamp: new Date().toISOString()
      });
    });
  }

  return successResponse(res, "Neural Broadcast Complete: Dossiers synced to Guardian Nodes! 📡");
});

// Automated Worker Logic (for Cron Jobs)
exports.automatedCronBroadcast = async () => {
  try {
    const dossier = await calculateWeeklyMetrics();
    console.log(`✅ [TITAN_CRON]: Sunday Sync Complete for ${dossier.length} Guardian Nodes.`);
  } catch (err) {
    console.error("❌ Auto-Sync Failure:", err.message);
  }
};