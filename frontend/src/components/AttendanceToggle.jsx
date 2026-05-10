/**
 * ============================================================
 * 🛡️ TITAN ATTENDANCE TOGGLE (v4.2 - Neural Sync)
 * Ref: Report Section 3.4 (Attendance Module)
 * Purpose: Real-time single-node status verification.
 * ============================================================
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, AlertCircle } from "lucide-react";
import API from "../api/api";

const AttendanceToggle = ({ studentId, classId, initialStatus }) => {
  const [status, setStatus] = useState(initialStatus || 'absent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // 🔄 Syncing with Parent State Telemetry
  useEffect(() => {
    if (initialStatus) setStatus(initialStatus);
  }, [initialStatus]);

  const toggleStatus = async (e) => {
    e.stopPropagation(); 
    
    // 🛰️ Optimistic Update: Pehle UI badlo, phir server call karo
    const prevStatus = status;
    const newStatus = status === 'present' ? 'absent' : 'present';
    
    setLoading(true);
    setError(false);
    setStatus(newStatus); // Instant feedback

    try {
      await API.post("/attendance/mark-single", { 
        studentId, 
        classId, 
        status: newStatus,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error("❌ Neural Node Desync: Reverting status.");
      setStatus(prevStatus); // Error hone par wapas purana state
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleStatus}
      disabled={loading}
      className={`group relative flex items-center gap-4 px-6 py-3 rounded-[1.5rem] border-2 transition-all duration-500 active:scale-95 shadow-lg ${
        status === 'present' 
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-emerald-500/5' 
        : error 
        ? 'bg-red-500/5 border-red-500/30 text-red-500'
        : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-blue-500/40 hover:text-slate-300'
      }`}
    >
      {loading ? (
        <Zap size={16} className="animate-spin text-blue-500" />
      ) : error ? (
        <AlertCircle size={16} className="animate-shake" />
      ) : status === 'present' ? (
        <ShieldCheck size={18} className="animate-in zoom-in duration-300 stroke-[2.5] drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-slate-700 group-hover:border-blue-500/50 transition-colors shadow-inner"></div>
      )}
      
      <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">
        {loading ? "Syncing" : error ? "Failed" : status === 'present' ? "Verified" : "Standby"}
      </span>

      {/* 🌌 Neural Aura Effect */}
      <div className={`absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl -z-10 ${
        status === 'present' ? 'bg-emerald-500/20' : 'bg-blue-500/10'
      }`}></div>
    </button>
  );
};

export default AttendanceToggle;