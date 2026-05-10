/**
 * ============================================================
 * 🏫 TITAN CLASSROOM CONTROLLER (v5.4 - PTM Synced Build)
 * Audited: Socket Integration, Roster Security, & Crash-Proofing.
 * Fixed: Added Guardian Mapping in getClassById for PTM Alerts.
 * ============================================================
 */
const asyncHandler = require("express-async-handler"); 
const Class = require("../models/Class");
const User = require("../models/User"); 
const redisClient = require("../config/redis");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { getSocket } = require("../socket/socketHandler"); 

// ------------------------------------------------------------
// 🏗️ 1. CLASSROOM MANAGEMENT
// ------------------------------------------------------------

exports.createClass = asyncHandler(async (req, res) => {
  const { name, subject, description } = req.body;
  const teacherId = req.user?.id || req.user?._id;

  if (!teacherId) return errorResponse(res, "Unauthorized: Identity token missing.", 401);

  const newClass = await Class.create({
    name: name.trim(),
    subject: subject.trim(),
    description: description ? description.trim() : "",
    teacher: teacherId,
  });

  // Cache Invalidation
  if (typeof redisClient !== "undefined" && redisClient?.status === "ready") {
    await redisClient.del("all_classes");
    await redisClient.del(`my_classes_${teacherId}`);
  }

  return successResponse(res, "Classroom established successfully.", newClass, 201);
});

exports.joinClass = asyncHandler(async (req, res) => {
  const { classCode } = req.body;
  const studentId = req.user?.id || req.user?._id;

  if (!classCode) return errorResponse(res, "Class code is required.", 400);
  if (!studentId) return errorResponse(res, "Unauthorized: Identity token missing.", 401);

  const targetCode = classCode.trim().toUpperCase();
  const classData = await Class.findOne({ classCode: targetCode });

  if (!classData) return errorResponse(res, "Classroom not found.", 404);

  if (classData.students.includes(studentId)) {
    return errorResponse(res, "You are already linked to this classroom.", 400);
  }

  const updatedClass = await Class.findOneAndUpdate(
    { classCode: targetCode },
    { $addToSet: { students: studentId } },
    { returnDocument: 'after' }
  );

  if (typeof redisClient !== "undefined" && redisClient?.status === "ready") {
    await redisClient.del(`my_classes_${studentId}`);
  }

  return successResponse(res, "Successfully joined the classroom.", updatedClass, 200);
});

// ------------------------------------------------------------
// 📢 2. BROADCAST PROTOCOLS
// ------------------------------------------------------------

exports.postAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === "") return errorResponse(res, "Signal content missing.", 400);

  const newAnnouncement = {
    user: req.user?._id || req.user?.id,
    text: text.trim(),
    createdAt: new Date()
  };

  const updatedClass = await Class.findByIdAndUpdate(
    id,
    { $push: { announcements: newAnnouncement } },
    { returnDocument: 'after' }
  ).populate("announcements.user", "name role");
 
  if (!updatedClass) return errorResponse(res, "Node Not Found.", 404);

  const savedAnn = updatedClass.announcements[updatedClass.announcements.length - 1];

  // Real-time Broadcast
  const io = getSocket();
  if (io) io.to(id).emit("new_announcement_broadcast", savedAnn);

  return successResponse(res, "Broadcast Signal Transmitted", savedAnn, 201);
});

// ------------------------------------------------------------
// 🛡️ 3. SECURITY & ROSTER
// ------------------------------------------------------------

exports.kickStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { studentId } = req.body;
  
  const classroom = await Class.findById(id);
  if (!classroom) return errorResponse(res, "Node not found", 404);

  classroom.students = classroom.students.filter(s => s.toString() !== studentId);
  await classroom.save();

  const io = getSocket();
  if (io) io.to(id).emit("you_are_kicked", { targetId: studentId });

  return successResponse(res, "Unauthorized Node Terminated");
});

// ------------------------------------------------------------
// 🔍 4. DISCOVERY & METADATA
// ------------------------------------------------------------

exports.getClassById = asyncHandler(async (req, res) => {
  const classroom = await Class.findById(req.params.id)
    .populate("teacher", "name email")
    .populate("students", "name email")
    .populate({ path: "announcements.user", select: "name" });

  if (!classroom) return errorResponse(res, "Classroom node offline", 404);

  // 🔥 THE MAGIC FIX: NEURAL SCAN FOR GUARDIANS
  const mappedStudents = await Promise.all(classroom.students.map(async (student) => {
    // Har student ke liye check karo ki kya koi parent linked hai
    const guardian = await User.findOne({ role: "parent", children: student._id });
    
    return {
      ...student.toObject(),
      parentId: guardian ? guardian._id : null, 
      isLinked: !!guardian // Frontend Roster ab ise detect karega
    };
  }));

  const enrichedClassData = {
    ...classroom.toObject(),
    students: mappedStudents
  };

  return successResponse(res, "Node Metadata Synchronized", enrichedClassData);
});

exports.getClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find().populate("teacher", "name email").sort("-createdAt");
  return successResponse(res, "Global Node Discovery Successful", classes);
});

exports.getMyClasses = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const role = req.user.role;

  let classes = (role === "teacher")
    ? await Class.find({ teacher: userId }).populate("students", "name email").sort("-createdAt")
    : await Class.find({ students: userId }).populate("teacher", "name email").sort("-createdAt");

  return successResponse(res, "Personalized Node Stream Retrieved", classes);
});

exports.initiatePTM = asyncHandler(async (req, res) => {
  const roomId = `PTM-${req.params.id}-${Date.now()}`;
  return successResponse(res, "Video Handshake Initialized", { roomId });
});

// ================= 📊 5. GLOBAL ANALYTICS =================
exports.getGlobalAnalytics = asyncHandler(async (req, res) => {
  const teacherId = req.user?.id || req.user?._id;
  const teacherClasses = await Class.find({ teacher: teacherId });

  if (!teacherClasses.length) {
    return successResponse(res, "Analytics Gathered (Empty)", { totalStudents: 0, totalClasses: 0 });
  }

  const studentSet = new Set();
  teacherClasses.forEach(cls => {
    cls.students.forEach(s => studentSet.add(s.toString()));
  });

  return successResponse(res, "Global Telemetry Synced", {
    totalStudents: studentSet.size, 
    totalClasses: teacherClasses.length
  });
});

// ------------------------------------------------------------
// 💥 6. TERMINAL DELETION (Class Only - Assignments Protected)
// ------------------------------------------------------------

exports.deleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacherId = req.user?.id || req.user?._id;

  // 1. Find the target node
  const classroom = await Class.findById(id);

  if (!classroom) {
    return errorResponse(res, "Classroom node not found in registry.", 404);
  }

  // 2. Security Check: Only the authorized teacher can terminate this node
  if (classroom.teacher.toString() !== teacherId.toString()) {
    return errorResponse(res, "Access Denied: You lack clearance for this operation.", 403);
  }

  // 3. Terminate the Class Node Only
  // Hum assignments ko delete nahi kar rahe hain jaisa tune kaha
  await Class.findByIdAndDelete(id);

  // 4. Cache Invalidation (If using Redis)
  if (typeof redisClient !== "undefined" && redisClient?.status === "ready") {
    await redisClient.del("all_classes");
    await redisClient.del(`my_classes_${teacherId}`);
  }

  // 5. Neural Broadcast (Notify students if they are online)
  const io = getSocket();
  if (io) io.to(id).emit("class_terminated", { 
    message: "This classroom node has been decommissioned by the Teacher." 
  });

  return successResponse(res, "Classroom Node terminated successfully. Related tasks remain archived.");
});