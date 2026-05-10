/**
 * ============================================================
 * ✅ TITAN ATTENDANCE CONTROLLER (v6.0 - Final Production Build)
 * ============================================================
 * High-Precision Telemetry Node with Data Retention Protocol.
 * Features: 
 * - 8-Day Data Retention limit for Parents (Performance Sync)
 * - Full Analytics History for Teachers/HOD
 * - Crash-proof Bulk Sync Logic
 * ============================================================
 */
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const Session = require("../models/Session"); 
const User = require("../models/User"); 
const { successResponse, errorResponse } = require("../utils/apiResponse");

// ================= ✍️ 1. BULK SYNC (Teacher Manual Push) =================
exports.markBulkAttendance = async (req, res) => {
  try {
    const teacherId = req.user?.id || req.user?._id;
    const { records, date, classId } = req.body; 

    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ success: false, message: "Invalid Payload: records array required" });
    }

    // Dynamic object creation to avoid MongoDB 'null' CastError
    const attendanceData = {
      teacher: teacherId,
      date: date || new Date(),
      records: records.map(r => ({
        student: r.studentId || r.student, 
        status: (r.status || "present").toLowerCase() 
      }))
    };

    if (classId) {
      attendanceData.classId = classId;
    }

    const attendance = new Attendance(attendanceData);
    await attendance.save();

    return res.status(201).json({ success: true, message: "Telemetry Synchronized Successfully! ✅" });

  } catch (err) {
    console.error("❌ BULK_SYNC_ERROR:", err.message);
    return res.status(500).json({ success: false, message: "DB Error: " + err.message });
  }
};

// ================= 🤖 2. STEALTH MODE: AUTO-MARK (Student) =================
exports.autoMarkAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const studentId = req.user?.id || req.user?._id;
    
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);

    let attendance = await Attendance.findOne({
      classId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!attendance) {
      await Attendance.create({
        classId,
        date: new Date(),
        records: [{ student: studentId, status: "present" }]
      });
      return res.status(201).json({ success: true, message: "New Register Created & Presence Logged 📶" });
    }

    const alreadyMarked = attendance.records.find(r => r.student.toString() === studentId.toString());
    
    if (!alreadyMarked) {
      attendance.records.push({ student: studentId, status: "present" });
      await attendance.save();
      return res.status(200).json({ success: true, message: "Presence Added to Today's Register 📶" });
    }

    return res.status(200).json({ success: true, message: "Presence already active 🟢" });

  } catch (err) {
    return res.status(500).json({ success: false, message: "Stealth Handshake Failed" });
  }
};

// ================= 📊 3. GET ATTENDANCE (Role-Based + 8-Day Limit) =================
exports.getAttendance = async (req, res) => {
  try {
    const paramId = req.params.studentId || req.params.classId; 
    const userId = req.user?.id || req.user?._id;
    const userRole = req.user?.role;

    console.log(`📡 Fetching Attendance | Role: ${userRole} | TargetID: ${paramId}`);

    let query = {};

    // 🔥 DYNAMIC DATA RETENTION LOGIC (8 Days for Parents/Students)
    if (userRole === "parent" || userRole === "student") {
      const retentionLimit = new Date();
      retentionLimit.setDate(retentionLimit.getDate() - 8);

      query = { 
        "records.student": paramId || userId,
        date: { $gte: retentionLimit } // Only fetch records from last 8 days
      };
    } else {
      // Teachers & Admins see full history
      query = paramId ? { $or: [{ classId: paramId }, { teacher: userId }] } : { teacher: userId };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("records.student", "name email")
      .sort({ date: -1 });

    // 🔥 PARENT & STUDENT VIEW FORMATTING
    if (userRole === "parent" || userRole === "student") {
      const targetId = (userRole === "parent") ? paramId : userId;
      
      const refinedTelemetry = attendanceRecords.map(record => {
        const studentEntry = record.records.find(r => 
          r.student && (r.student._id?.toString() === targetId?.toString() || r.student?.toString() === targetId?.toString())
        );

        return {
          _id: record._id,
          date: record.date,
          status: studentEntry ? studentEntry.status : "absent",
          markedBy: "Teacher"
        };
      });

      return res.status(200).json({ success: true, data: refinedTelemetry });
    }

    // 🔥 TEACHER VIEW FORMATTING
    return res.status(200).json({ success: true, data: attendanceRecords });

  } catch (err) {
    console.error("❌ GET_ATTENDANCE_ERROR:", err);
    return res.status(500).json({ success: false, message: "Telemetry Link Failed" });
  }
};

// ================= 📈 4. STUDENT PRESENCE INDEX =================
exports.getStudentPresenceIndex = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.user?.id;
    
    // Index should calculate from all-time history for accuracy
    const presentCount = await Attendance.countDocuments({ 
      "records.student": studentId, 
      "records.status": "present" 
    });
    
    const totalSessions = await Attendance.countDocuments({ "records.student": studentId });

    const percentage = totalSessions > 0 ? ((presentCount / totalSessions) * 100).toFixed(1) : 0;
    
    return res.status(200).json({ success: true, presenceIndex: percentage });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Index failed" });
  }
};

// ================= 📉 5. ATTENDANCE TREND =================
exports.getAttendanceTrend = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats = await Attendance.aggregate([
      { $match: { teacher: teacherId, date: { $gte: sevenDaysAgo } } },
      { $unwind: "$records" },
      { $match: { "records.status": "present" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formattedData = stats.map(item => ({
      date: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
      count: item.count
    }));

    return res.status(200).json({ success: true, data: formattedData });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Trend engine failure" });
  }
};

// ================= 🧠 6. SPECIFIC CLASS ANALYTICS =================
exports.getClassAttendanceAnalytics = async (req, res) => {
  try {
    const { classId } = req.params;
    
    const [attendance, sessions] = await Promise.all([
      Attendance.find({ classId }).sort({ date: 1 }),
      Session.find({ classId }).catch(() => []) 
    ]);

    const totalRecords = attendance.length;
    
    if (totalRecords === 0) {
      return res.json({
        success: true, isDemo: true,
        message: "No live telemetry found. Displaying simulation data.",
        data: [
          { day: "Mon", present: 12 }, { day: "Tue", present: 18 },
          { day: "Wed", present: 15 }, { day: "Thu", present: 22 }, { day: "Fri", present: 20 }
        ],
        stats: { totalAttendanceRecords: 0, averageDuration: "0.00", totalSessions: 0 }
      });
    }

    const dayMap = {};
    attendance.forEach(record => {
      const day = new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' });
      const presentCount = record.records.filter(r => r.status.toLowerCase() === "present").length;
      dayMap[day] = (dayMap[day] || 0) + presentCount;
    });

    const chartData = Object.keys(dayMap).map(day => ({ day: day, present: dayMap[day] }));

    return res.json({
      success: true, isDemo: false, data: chartData,
      stats: {
        totalAttendanceRecords: totalRecords,
        totalSessions: sessions.length
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Analytics synchronization failed" });
  }
};