// backend/routes/exportRoutes.js
const express = require("express");
const router = express.Router();
const XLSX = require("xlsx");
const Attendance = require("../models/Attendance");
const Class = require("../models/Class");
const auth = require("../middleware/authMiddleware");
const { isTeacher } = require("../middleware/roleMiddleware");

/**
 * 📊 NEURAL DATA EXPORTER (TITAN v4.2)
 * Ref: Report Section 3.6 (Institutional Reporting & Auditing)
 * Purpose: Converting live attendance telemetry into standardized Excel/XLSX reports.
 */

router.get("/attendance/:classId", auth, isTeacher, async (req, res) => {
  try {
    const { classId } = req.params;

    // 🚀 SYNC: Fetch attendance records and Class metadata in parallel
    const [attendance, classInfo] = await Promise.all([
      Attendance.find({ classId }).populate("student", "name email specialization"),
      Class.findById(classId).select("className")
    ]);

    if (!attendance.length) {
      return res.status(404).json({ success: false, message: "No records found for export" });
    }

    // 🔍 DATA NORMALIZATION: Formatting for spreadsheet structure
    const data = attendance.map(a => ({
      "Class": classInfo?.className || "N/A",
      "Student Name": a.student?.name || "Unknown Node",
      "Email": a.student?.email || "N/A",
      "Specialization": a.student?.specialization || "General",
      "Date": new Date(a.date || a.createdAt).toLocaleDateString(),
      "Status": a.status,
      "Duration (Mins)": a.duration ? Math.floor(a.duration) : 0
    }));

    // 🏗️ XLSX CONSTRUCTION
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance_Report");

    // Buffer generation
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // 🛰️ DELIVERY HEADERS
    const filename = `Attendance_${classInfo?.className || classId}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

    res.status(200).send(buffer);
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Export synchronization failed", 
      error: err.message 
    });
  }
});

module.exports = router;