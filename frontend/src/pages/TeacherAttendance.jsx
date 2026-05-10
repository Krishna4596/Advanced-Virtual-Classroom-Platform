/**
 * ============================================================
 * 👨‍🏫 TITAN COMMAND: Presence Control (v5.1 - Liquid UI)
 * Purpose: Secure portal for Instructors to mark daily attendance.
 * Upgrades: Fluid List Grids, Truncated Text Handling, 
 * Mobile-Optimized Touch Targets, and Scalable Paddings.
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import API from "../api/api";
import { Send, Users, CalendarCheck, CheckCircle, XCircle } from "lucide-react";
import Loader from "../components/Loader";

function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [attendanceState, setAttendanceState] = useState({}); // { studentId: "present" | "absent" }

  // 1. Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/auth/students"); 
        if (res.data && res.data.success) {
            setStudents(res.data.data);
            // Default sabko 'present' mark kar do taaki teacher ka time bache
            const initialObj = {};
            res.data.data.forEach(s => initialObj[s._id] = "present");
            setAttendanceState(initialObj);
        }
      } catch (err) {
        console.error("❌ Node Fetch Error.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // 2. Toggle Status
  const toggleStatus = (id) => {
    setAttendanceState(prev => ({
      ...prev,
      [id]: prev[id] === "present" ? "absent" : "present"
    }));
  };

  // 3. Submit to Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage("");

    // Prepare data format for backend
    const records = students.map(s => ({
      studentId: s._id,
      status: attendanceState[s._id]
    }));

    try {
      // Ensure backend has this route set up to receive the array
      const res = await API.post("/attendance/mark-bulk", { 
        date: new Date().toISOString(),
        records 
      });

      if (res.data.success) {
        setMessage("✅ Telemetry Sync Complete: Presence Logs Uploaded!");
      }
    } catch (err) {
      setMessage("❌ Error: Protocol Failure during sync.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20 sm:py-40"><Loader /></div>;

  return (
    // 🔥 FIX: Adjusted global container padding and space for mobile
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-10 animate-in fade-in duration-700 px-4 sm:px-6 md:px-8 pb-24">
      
      {/* 🔥 FIX: Header padding, icon scaling, and title sizing */}
      <header className="flex items-center gap-4 sm:gap-6 border-b border-slate-800 pb-4 sm:pb-6 mt-4 sm:mt-0">
        <div className="p-3 sm:p-4 bg-emerald-600/10 rounded-xl sm:rounded-2xl border border-emerald-500/30 text-emerald-500 shrink-0">
          <CalendarCheck className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white truncate pr-2">Presence Control</h1>
          <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 sm:mt-2 truncate">Push Daily Attendance Telemetry</p>
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-xl border-l-4 text-[10px] sm:text-xs font-black uppercase tracking-widest animate-pulse flex items-center ${message.includes('✅') ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400' : 'bg-red-900/20 border-red-500 text-red-400'}`}>
          <span className="truncate whitespace-normal break-words">{message}</span>
        </div>
      )}

      {/* 🔥 FIX: Form container paddings adapt to screen size */}
      <form onSubmit={handleSubmit} className="bg-slate-900/40 backdrop-blur-xl p-5 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] border border-slate-800 shadow-2xl space-y-6 sm:space-y-8">
        
        <div className="flex justify-between items-center px-2 sm:px-4 mb-2 sm:mb-4 border-b border-slate-800 pb-3 sm:pb-4">
          <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"/> <span className="hidden sm:inline">Student Node</span><span className="sm:hidden">Student</span>
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold">Status Sync</p>
        </div>

        {/* 🔥 FIX: Scrollable list with mobile-friendly row paddings */}
        <div className="space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
          {students.map((student) => {
            const isPresent = attendanceState[student._id] === "present";
            return (
              <div key={student._id} className="flex justify-between items-center bg-slate-950/50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/5 hover:border-slate-700 transition-colors gap-3">
                {/* Truncate ensures long names don't push buttons off the screen */}
                <span className="text-xs sm:text-sm font-black text-white uppercase italic truncate flex-1 min-w-0 pr-2">
                  {student.name}
                </span>
                
                <button 
                  type="button" 
                  onClick={() => toggleStatus(student._id)}
                  // Touch targets optimized for thumbs
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all shrink-0 active:scale-95 ${isPresent ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}
                >
                  {isPresent ? <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest italic w-[45px] sm:w-[50px] text-left">
                    {isPresent ? 'Present' : 'Absent'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* 🔥 FIX: Touch-optimized Submit Button */}
        <button type="submit" disabled={submitLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest sm:tracking-[0.4em] text-[10px] sm:text-xs transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 sm:gap-4 italic mt-6 sm:mt-8 border-b-4 border-emerald-800 hover:border-b-0 active:translate-y-1">
          {submitLoading ? (
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Syncing Telemetry...
             </div>
          ) : (
             <>Push Attendance Logs <Send className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-2" /></>
          )}
        </button>
      </form>
    </div>
  );
}

export default TeacherAttendance;