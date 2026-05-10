/**
 * ============================================================
 * 🏫 TITAN CLASSROOM ENTRY NODE (v4.2 - Production)
 * Ref: Report Section 3.3.1 (Role-Based Dashboards)
 * Purpose: Visual gateway to specific subject clusters.
 * ============================================================
 */

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Users } from 'lucide-react';

const ClassCard = ({ cls }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleEnter = () => {
    // 🛰️ DYNAMIC ROUTING: Directing based on Neural Role
    const rolePath = user?.role === 'teacher' ? 'teacher' : 'student';
    navigate(`/${rolePath}/class/${cls._id}`);
  };

  return (
    <div 
      className="group bg-white dark:bg-slate-900/40 p-8 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 cursor-pointer hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] relative overflow-hidden" 
      onClick={handleEnter}
    >
      {/* 🌫️ Background Aura */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[50px] -z-10 group-hover:bg-blue-500/10 transition-all"></div>

      {/* 🏷️ Avatar Node */}
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-6 flex items-center justify-center text-white text-3xl font-black shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
        {cls.name?.charAt(0).toUpperCase() || 'C'}
      </div>
      
      {/* 📝 Class Metadata */}
      <div className="space-y-1 mb-6">
        <h3 className="text-2xl font-black dark:text-white tracking-tighter uppercase italic leading-none group-hover:text-blue-500 transition-colors">
          {cls.name}
        </h3>
        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.4em] italic">
          Subject: {cls.subject || 'Core Protocol'}
        </p>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic mb-6 line-clamp-2">
        {cls.description || "Join the interactive neural session for advanced learning and collaboration."}
      </p>
      
      {/* 👤 Teacher/Node Footer */}
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700">
            <Users size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Lead Node</span>
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase">
              {cls.teacher?.name || 'Authorized Mentor'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-blue-500 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
           <span className="text-[10px] font-black uppercase tracking-tighter">Enter Node</span>
           <ArrowRight size={16} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default ClassCard;