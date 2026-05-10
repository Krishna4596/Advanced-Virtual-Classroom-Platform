/**
 * ============================================================
 * 📝 TITAN ASSIGNMENT NODE (v4.2 - Production Final)
 * Fixed: Unified Identity Sync, Unlocked Resubmission, & Grade Persistent UI.
 * ============================================================
 */

import React from 'react';
import { 
  FileText, Calendar, ArrowRight, CheckCircle, Clock, 
  ShieldCheck, Download, FileSearch, Archive, BarChart3, Zap, RefreshCw 
} from "lucide-react";

const AssignmentCard = ({ assignment, user, onAction }) => {
  // Use VITE env for dynamic API routing
  const API_URL = import.meta.env.VITE_BACKEND_API || "http://localhost:5000"; 

  // 🛡️ Identity Normalization (Handles both MongoDB _id and virtual id)
  const currentUserId = user?.id || user?._id;
  
  // 🔥 SYNC FIX: Finding student's own submission from the array
  const mySubmission = assignment.submissions?.find(s => 
    (s.student === currentUserId || s.student?._id === currentUserId)
  );

  const isSubmitted = !!mySubmission;
  const isTeacher = user?.role === 'teacher';
  const isGraded = mySubmission?.status === "graded";

  // Resource Logic
  const pdfUrl = assignment.attachment || assignment.fileUrl;
  const isZip = pdfUrl?.toLowerCase().endsWith('.zip') || pdfUrl?.toLowerCase().endsWith('.rar');

  const formatDeadlineDate = (dateString) => {
    if (!dateString) return "NO_DEADLINE";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "INVALID_DATE";
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className={`group glass p-8 md:p-10 rounded-[3.5rem] md:rounded-[4rem] border-2 transition-all duration-500 relative overflow-hidden flex flex-col h-full shadow-2xl ${
      isSubmitted ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-slate-800 hover:border-blue-500/50'
    }`}>
      
      {/* 🌫️ Neural Glow Dynamic Background */}
      <div className={`absolute -top-10 -right-10 w-64 h-64 blur-[120px] -z-10 transition-opacity duration-700 ${
        isSubmitted ? 'bg-emerald-500/10 opacity-100' : 'bg-blue-600/5 group-hover:bg-blue-600/15'
      }`}></div>

      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.8rem] flex items-center justify-center transition-all duration-500 shadow-3xl ${
          isSubmitted ? 'bg-emerald-500/20 text-emerald-500' : 'bg-blue-600/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white'
        }`}>
          {isZip ? <Archive size={32} /> : <FileText size={32} />}
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
             <Calendar size={14} className={isSubmitted ? "text-emerald-500" : "text-blue-500"} />
             <span className="text-[11px] font-black text-white uppercase tracking-tighter italic">
               {formatDeadlineDate(assignment.dueDate || assignment.deadline)}
             </span>
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight group-hover:text-blue-400 transition-colors italic">
            {assignment.title}
          </h3>
          <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] italic">
              NODE_ID: {assignment._id?.slice(-8).toUpperCase()}
          </p>
        </div>
        
        <p className="text-base text-slate-400 font-medium leading-relaxed italic line-clamp-3">
          {assignment.description || "System protocol active."}
        </p>

        {/* 📄 RESOURCE LINKAGE (Assignment File from Teacher) */}
        {pdfUrl && (
           <div className="bg-slate-950/80 p-5 rounded-[2rem] border-2 border-dashed border-blue-500/20 flex justify-between items-center hover:border-blue-500/50 transition-all shadow-inner relative z-10">
              <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl">
                    {isZip ? <Archive size={18}/> : <FileSearch size={18}/>}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate max-w-[120px]">
                      {pdfUrl.split('/').pop()?.split('-').pop()}
                    </span>
                  </div>
              </div>
              <a 
                href={`${API_URL}${pdfUrl}`} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl shadow-xl transition-all active:scale-90"
              >
                <Download size={16} strokeWidth={3}/>
              </a>
           </div>
        )}

        {/* 🔥 GRADING TELEMETRY (Persistent View for Graded Submissions) */}
        {!isTeacher && isGraded && (
          <div className="bg-emerald-500/10 border-2 border-emerald-500/20 p-5 rounded-[2rem] flex items-center justify-between animate-in zoom-in-95 shadow-lg shadow-emerald-500/5">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-yellow-500 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Evaluation Sync</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase italic mt-1">Audit Complete</span>
              </div>
            </div>
            <div className="text-2xl font-black text-white italic text-center">
              <span className="text-emerald-500">{mySubmission.marks || mySubmission.grade || 0}</span>
              <span className="text-slate-700 text-xs ml-1">/ 100</span>
            </div>
          </div>
        )}
      </div>

      {/* 🚀 ACTION HANDSHAKE (Fully Unlocked Logic) */}
      <div className="mt-8">
        <button 
          onClick={() => onAction && onAction(assignment)}
          className={`w-full py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 active:scale-95 group/btn italic ${
            isTeacher 
            ? "bg-white text-black hover:bg-slate-200" 
            : isSubmitted 
              ? "bg-slate-900 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white"
              : "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20"
          }`}
        >
          {isTeacher ? (
            <>Audit Submissions <ArrowRight size={18}/></>
          ) : isGraded ? (
            <>Improve Submission <RefreshCw size={18} className="group-hover/btn:rotate-180 transition-transform duration-500"/></>
          ) : isSubmitted ? (
            <>Update Submission <RefreshCw size={18} className="group-hover/btn:rotate-180 transition-transform duration-500"/></>
          ) : (
            <>Initiate Submission <ArrowRight size={18}/></>
          )}
        </button>
      </div>

      {/* Footer Branding */}
      <div className="mt-6 flex justify-between items-center opacity-20">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="px-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.6em]">TITAN_CORE_V4.2</span>
          <div className="h-px flex-1 bg-slate-800"></div>
      </div>
    </div>
  );
};

export default AssignmentCard;