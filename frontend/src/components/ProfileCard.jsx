/**
 * ============================================================
 * 👤 TITAN PROFILE TELEMETRY CARD (v4.2 - Production)
 * Ref: Report Section 3.3.1 (Role-Based Dashboards)
 * Purpose: Secure identity visualization and role-based UI adaptation.
 * ============================================================
 */

import React from 'react';
import { User, ShieldCheck, Mail, ChevronRight, Activity, Zap, Cpu } from "lucide-react";

const ProfileCard = ({ user }) => {
  // 🛰️ Role-based Intelligent Logic Calibration
  const isTeacher = user?.role === 'teacher';
  
  // 🎨 Visual Signature Matrix
  const roleStyles = {
    gradient: isTeacher ? 'from-blue-600 to-indigo-700' : 'from-emerald-500 to-teal-600',
    shadow: isTeacher ? 'shadow-blue-600/30' : 'shadow-emerald-500/30',
    accent: isTeacher ? 'text-blue-500' : 'text-emerald-500',
    border: isTeacher ? 'group-hover:border-blue-500/30' : 'group-hover:border-emerald-500/30'
  };

  return (
    <div className={`glass p-8 rounded-[4rem] border-2 border-slate-900/50 ${roleStyles.border} transition-all duration-700 group relative overflow-hidden bg-slate-950/20 backdrop-blur-3xl shadow-2xl`}>
      
      {/* 🌫️ Neural Background Handshake */}
      <div className={`absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br ${roleStyles.gradient} opacity-5 blur-[80px] group-hover:opacity-20 transition-all duration-1000`}></div>
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-slate-900/20 blur-[60px] -z-10"></div>

      <div className="flex items-center gap-8 relative z-10">
        
        {/* 👤 Professional Identity Node */}
        <div className="relative shrink-0">
          <div className={`w-24 h-24 bg-gradient-to-br ${roleStyles.gradient} ${roleStyles.shadow} rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-2 border-white/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-700`}>
            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={40} />}
          </div>
          {/* Neural Activity Pulse */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-950 rounded-2xl flex items-center justify-center border-2 border-slate-800 shadow-xl">
            <Activity size={14} className={`${roleStyles.accent} animate-pulse`} />
          </div>
        </div>

        {/* 📝 Identity Telemetry Terminal */}
        <div className="flex-1 min-w-0 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter truncate leading-none group-hover:text-blue-400 transition-colors">
                {user?.name || "ANONYMOUS_NODE"}
              </h3>
              {isTeacher && (
                <div className="p-1 bg-blue-600/10 rounded-lg border border-blue-500/20">
                  <ShieldCheck size={18} className="text-blue-500" />
                </div>
              )}
            </div>
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${roleStyles.accent} opacity-60 italic`}>
              Verified Instance #{user?._id?.slice(-6).toUpperCase() || 'SYNC_ERROR'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-2xl border border-white/5 w-fit">
             <div className="p-2 bg-slate-950 rounded-xl shadow-inner">
               <Mail size={14} className="text-slate-600" />
             </div>
             <p className="text-xs font-black text-slate-500 truncate tracking-tight lowercase pr-4">
               {user?.email || "node@auth.avcp"}
             </p>
          </div>

          {/* Role Badge Protocol */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800/50">
            <div className="flex items-center gap-3">
              <span className={`px-6 py-2 bg-slate-950 border-2 border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-inner ${roleStyles.accent} group-hover:border-blue-500/20 transition-all`}>
                {user?.role || "STUDENT"}
              </span>
            </div>
            <button className="flex items-center gap-3 text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] group-hover:text-white transition-all hover:translate-x-2 group/btn">
              Identity Dossier <ChevronRight size={14} className="group-hover/btn:text-blue-500 transition-colors" />
            </button>
          </div>
        </div>

      </div>

      {/* 🛰️ Authenticated Signal Hub */}
      <div className="absolute top-8 right-10 flex items-center gap-3 bg-slate-950/80 px-5 py-2.5 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-md group-hover:border-blue-500/20 transition-all">
         <Cpu size={14} className="text-yellow-500 animate-spin-slow" />
         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Auth_Link: Stable</span>
      </div>
    </div>
  );
};

export default ProfileCard;