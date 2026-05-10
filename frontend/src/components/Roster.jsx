/**
 * ============================================================
 * 👥 TITAN ROSTER ENGINE (v5.4 - Ultimate Liquid Wrap)
 * Fix: Solved aggressive truncation ("K..") and button overlap
 * in constrained spaces (like DevTools or Split Screen).
 * Upgraded: Flex-wrap architecture ensures elements drop down 
 * gracefully instead of squishing together.
 * ============================================================
 */

import React, { useState } from "react";
import { UserMinus, ShieldCheck, ShieldAlert, Fingerprint, Loader2, PhoneCall } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { getSocket } from "../socket/socket";

const Roster = ({ students = [], isTeacher, classId, currentUser }) => {
  const [terminatingId, setTerminatingId] = useState(null);
  const navigate = useNavigate(); 

  // 🚨 TEACHER ACTION: Emergency PTM Trigger
  const handleCallGuardian = (student) => {
    const socket = getSocket();
    
    if (socket) {
      const targetParentId = student.parentId || student.guardian; 

      if (!targetParentId) {
        alert("⚠️ TITAN SYSTEM: Guardian Node not directly linked to this agent yet.");
        return;
      }

      // 1. Send signal to Parent
      socket.emit("trigger_ptm_alert", {
        parentId: targetParentId, 
        teacherName: currentUser.name, 
        classId: classId, 
        topic: `Urgent Performance Sync for ${student.name}`
      });

      // 2. Alert the Teacher
      alert(`📡 SIGNAL SENT: Emergency Handshake dispatched to ${student.name}'s Guardian. Redirecting to Secure Channel...`);
      
      // 3. Automatically transport the Teacher to the Video Room!
      navigate(`/video-session/${classId}?mode=ptm`);
    }
  };

  const handleKick = async (studentId) => {
    const confirmKick = window.confirm("⚠️ SECURITY OVERRIDE: Are you sure you want to terminate this node's access?");
    if (!confirmKick) return;

    try {
      setTerminatingId(studentId);
      const res = await API.post(`/classes/${classId}/kick`, { studentId });
      
      if (res.data.success) {
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Termination Failed:", err);
      alert(`❌ Termination Error: ${err.response?.data?.message || "Node unreachable."}`);
      setTerminatingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in duration-700">
      {students?.map((student, idx) => {
        const isSelf = student._id === (currentUser?._id || currentUser?.id);
        const isTerminating = terminatingId === student._id;
        
        return (
          <div 
            key={student._id || idx} 
            // 🔥 FIX: Changed to `flex-wrap`! If they don't fit horizontally, they gracefully drop to the next line.
            className={`bg-[#0f172a] p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-[2rem] border-2 flex flex-wrap items-center justify-between gap-4 transition-all duration-300 group shadow-xl relative overflow-hidden ${
              isTerminating ? 'border-red-500/50 opacity-50 grayscale' : 'border-slate-800 hover:border-blue-500/50 hover:bg-slate-900'
            }`}
          >
            {/* 🌫️ Ambient Aura Background */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-[50px] transition-all duration-700 group-hover:bg-blue-500/20 pointer-events-none"></div>

            {/* 👤 User Identity & Status (Left Side) */}
            {/* 🔥 FIX: min-w-[200px] ensures it takes enough space and forces buttons down if squeezed */}
            <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-[200px] relative z-10">
              
              <div className="relative shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-950 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl text-blue-500 group-hover:text-white transition-all duration-300 shadow-inner border border-slate-800 group-hover:border-blue-400">
                  {student.name?.[0] || <Fingerprint className="w-5 h-5 sm:w-6 sm:h-6"/>}
                </div>
                {student.isLinked && (
                  <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-lg shadow-lg border-2 border-[#0f172a]">
                     <ShieldCheck size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
              
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {/* 🔥 FIX: Removed `truncate` and added `break-words`. Name will never become "K.." again! */}
                    <p className="text-base sm:text-lg md:text-xl font-black text-white uppercase tracking-tight italic break-words leading-tight pr-2">
                        {student.name}
                    </p>
                    {isSelf && <span className="text-[8px] sm:text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-md tracking-widest shadow-lg shrink-0">YOU</span>}
                </div>
                
                {/* 📊 Link Status Protocol */}
                <div className="flex items-center gap-2 pt-0.5">
                  {student.isLinked ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Fingerprint size={12} className="animate-pulse shrink-0" />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate">Guardian Synced</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <ShieldAlert size={12} className="shrink-0" />
                      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate">Standalone Node</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ⚔️ Administrative Actions (PTM & Kick) - (Right Side / Bottom) */}
            {isTeacher && !isSelf && (
              // 🔥 FIX: w-full sm:w-auto + flex-wrap ensures buttons scale properly
              <div className="flex items-center gap-3 w-full sm:w-auto relative z-20 shrink-0 mt-2 sm:mt-0">
                
                <button 
                  onClick={() => handleCallGuardian(student)}
                  disabled={isTerminating}
                  className="flex-1 sm:flex-none flex items-center justify-center p-3 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 hover:bg-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-500 transition-all duration-300 shadow-lg active:scale-95"
                  title="Initiate P.T.M Handshake"
                >
                  <PhoneCall size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                </button>

                <button 
                  onClick={() => handleKick(student._id)}
                  disabled={isTerminating}
                  className={`flex-1 sm:flex-none flex items-center justify-center p-3 sm:p-4 rounded-xl transition-all duration-300 shadow-lg border active:scale-95 ${
                    isTerminating 
                    ? 'bg-red-900/50 border-red-500/50 text-red-500' 
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-red-600 hover:border-red-500 hover:text-white'
                  }`}
                  title="Terminate Connection"
                >
                  {isTerminating ? (
                    <Loader2 size={18} className="sm:w-5 sm:h-5 animate-spin" strokeWidth={2.5} />
                  ) : (
                    <UserMinus size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
                  )}
                </button>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Roster;