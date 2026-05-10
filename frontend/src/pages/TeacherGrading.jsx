/**
 * ============================================================
 * 👨‍🏫 TITAN COMMAND: Grading Center (v5.0 - Liquid UI)
 * Purpose: Secure portal for Instructors to upload telemetry.
 * Upgrades: Fluid Paddings, Responsive Grids, Mobile-Optimized
 * Touch Targets, and Scalable Typography.
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import API from "../api/api";
import { Send, Users, BookOpen, Award, FileText, Zap } from "lucide-react";

function TeacherGrading() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "", 
    subject: "",
    examType: "Mid-Term",
    score: "",
    totalMarks: "",
    remarks: ""
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/auth/students"); 
        if (res.data && res.data.success) {
            setStudents(res.data.data);
        } else {
            setStudents([]);
        }
      } catch (err) {
        console.error("❌ Telemetry Error: Failed to load student nodes.", err);
        setStudents([]); 
      }
    };
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "studentId") {
      const selectedStudent = students.find(s => s._id === e.target.value);
      
      setFormData({ 
        ...formData, 
        studentId: e.target.value,
        studentName: selectedStudent ? selectedStudent.name : "" 
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.studentId) {
        setMessage("⚠️ Selection Required: Please select a target student.");
        return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await API.post("/grades/upload", formData);
      if (res.data.success) {
        setMessage("✅ Telemetry Sync Complete: Grade Uploaded Successfully!");
        setFormData({ ...formData, score: "", totalMarks: "", remarks: "" }); 
      }
    } catch (err) {
      setMessage("❌ Protocol Failure: Grade upload rejected by server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🔥 FIX: Added horizontal padding for mobile and adjusted top/bottom spacing
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in duration-700 px-4 sm:px-6 md:px-8 pb-20">
      
      {/* 🔥 FIX: Header padding and text scaling */}
      <header className="flex items-center gap-4 sm:gap-6 border-b border-slate-800 pb-4 sm:pb-6 mt-4 sm:mt-0">
        <div className="p-3 sm:p-4 bg-blue-600/10 rounded-xl sm:rounded-2xl border border-blue-500/30 text-blue-500 shrink-0">
          <Award className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white truncate pr-2">Grading Center</h1>
          <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 sm:mt-2 truncate">Push Performance Telemetry</p>
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-xl border-l-4 text-[10px] sm:text-xs font-black uppercase tracking-widest animate-pulse flex items-center ${message.includes('✅') ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400' : 'bg-red-900/20 border-red-500 text-red-400'}`}>
          <span className="truncate whitespace-normal break-words">{message}</span>
        </div>
      )}

      {/* 🔥 FIX: Responsive form paddings and border-radius */}
      <form onSubmit={handleSubmit} className="bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] border border-slate-800 shadow-2xl space-y-6 sm:space-y-8">
        
        {/* Grid adapts perfectly from 1 to 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Target Student Dropdown */}
          <div className="space-y-2 sm:space-y-3">
            <label className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"/> Target Node (Student)
            </label>
            <select name="studentId" required onChange={handleChange} value={formData.studentId} className="input-neural w-full text-xs sm:text-sm py-3 sm:py-4">
              <option value="">-- Select Student --</option>
              {students && students.length > 0 ? (
                students.map(s => <option key={s._id} value={s._id} className="bg-slate-900 text-white">{s.name}</option>)
              ) : (
                <option disabled>No students detected...</option>
              )}
            </select>
          </div>

          {/* Subject */}
          <div className="space-y-2 sm:space-y-3">
            <label className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"/> Module (Subject)
            </label>
            <input type="text" name="subject" required placeholder="e.g. Full-Stack Dev" onChange={handleChange} value={formData.subject} className="input-neural w-full text-xs sm:text-sm py-3 sm:py-4" />
          </div>

          {/* Exam Type */}
          <div className="space-y-2 sm:space-y-3">
            <label className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"/> Assessment Type
            </label>
            <select name="examType" onChange={handleChange} value={formData.examType} className="input-neural w-full text-xs sm:text-sm py-3 sm:py-4">
              <option value="Mid-Term">Mid-Term</option>
              <option value="Finals">Finals</option>
              <option value="Unit Test">Unit Test</option>
              <option value="Practical">Practical Sync</option>
            </select>
          </div>

          {/* Marks - Using internal grid for spacing */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold">Score</label>
              <input type="number" name="score" required placeholder="Obtained" onChange={handleChange} value={formData.score} className="input-neural w-full text-xs sm:text-sm py-3 sm:py-4" />
            </div>
            <div className="space-y-2 sm:space-y-3">
              <label className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total</label>
              <input type="number" name="totalMarks" required placeholder="Max" onChange={handleChange} value={formData.totalMarks} className="input-neural w-full text-xs sm:text-sm py-3 sm:py-4" />
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"/> Instructor Notes
          </label>
          <textarea name="remarks" rows="3" placeholder="Enter behavioral or academic feedback..." onChange={handleChange} value={formData.remarks} className="input-neural w-full text-xs sm:text-sm py-3 sm:py-4 custom-scrollbar"></textarea>
        </div>

        {/* 🔥 FIX: Touch-optimized Submit Button */}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest sm:tracking-[0.4em] text-[10px] sm:text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 sm:gap-4 italic mt-6 sm:mt-8 border-b-4 border-blue-800 hover:border-b-0 active:translate-y-1">
          {loading ? (
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Syncing Telemetry...
             </div>
          ) : (
             <>Push Telemetry <Send className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-2" /></>
          )}
        </button>
      </form>
    </div>
  );
}

export default TeacherGrading;