/**
 * ============================================================
 * 🛡️ TITAN GRADING NODE (v4.2 - Production)
 * Ref: Report Section 3.6 (Academic Analytics & Telemetry)
 * Purpose: Manual assessment handshake for student performance.
 * ============================================================
 */

import React, { useState } from 'react';
import { Award, MessageSquare, X, ShieldCheck, Zap } from "lucide-react";

const GradeModal = ({ isOpen, onClose, onGrade, studentName }) => {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    // 🛡️ Data Integrity Check
    if (grade < 0 || grade > 100) {
      alert("❌ PROTOCOL_ERROR: Grade must be within 0-100 range.");
      return;
    }
    
    setLoading(true);
    // Triggering the parent-level grading handshake
    await onGrade(grade, feedback);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-6 animate-in fade-in duration-300">
      <div className="bg-[#020617] w-full max-w-md rounded-[3rem] p-10 border-2 border-blue-500/20 shadow-[0_0_50px_-12px_rgba(37,99,235,0.2)] relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* 🌫️ Ambient Neural Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] -z-10"></div>

        {/* 🛠️ Header Node */}
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-inner">
                <Award size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Grade Node</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Target: {studentName}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-white transition-all">
             <X size={24} />
          </button>
        </div>

        {/* 📝 Input Cluster */}
        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-widest italic flex items-center gap-2">
              <Zap size={10} className="text-blue-500" /> Quantitative Score (0-100)
            </label>
            <input 
              type="number" 
              placeholder="Enter Marks" 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)} 
              className="w-full p-6 bg-slate-950 border border-slate-800 rounded-2xl text-white font-black outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-widest italic flex items-center gap-2">
              <MessageSquare size={10} className="text-purple-500" /> Qualitative Feedback
            </label>
            <textarea 
              placeholder="Specify academic observations..." 
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              className="w-full p-6 bg-slate-950 border border-slate-800 rounded-3xl text-white font-bold h-32 outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-800 resize-none"
            ></textarea>
          </div>
        </div>

        {/* 🚀 Action Handshake */}
        <button 
          onClick={handleSave} 
          disabled={loading || !grade}
          className="w-full mt-8 py-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 disabled:text-slate-700 text-white font-black uppercase text-xs tracking-[0.5em] rounded-[2rem] transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-4"
        >
          {loading ? "Synchronizing..." : <><ShieldCheck size={18} strokeWidth={3}/> Commit Grade</>}
        </button>

        {/* Footer Metadata */}
        <p className="mt-8 text-center text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">
          Telemetry_Link: Secure_Audit_Stream
        </p>
      </div>
    </div>
  );
};

export default GradeModal;