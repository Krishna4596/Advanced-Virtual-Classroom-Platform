/**
 * ============================================================
 * 📋 TITAN GRADING CENTER (v4.2 - Final Stabilized)
 * Fixed: Telemetry Sync, Dynamic Navigation, and Data Resiliency.
 * ============================================================
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import Loader from "../components/Loader"; // 🔥 Standardized path
import { FileText, ChevronRight, ClipboardCheck, Zap, Activity } from "lucide-react";

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 🛰️ Synchronizing with Academic Command Node
    const fetchAll = async () => {
      try {
        setLoading(true);
        // 🔥 SYNC FIX: Backend uses 'req.user.id' to filter teacher's tasks
        const res = await API.get("/assignments/my-assignments");
        
        // Data Extraction from Trinity Response Schema
        const dataNode = res.data?.assignments || res.data?.data || res.data;
        setAssignments(Array.isArray(dataNode) ? dataNode : []);
      } catch (err) { 
        console.error("❌ NEURAL_LINK_ERROR: Assignment telemetry sync failed."); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <div className="py-32 flex flex-col items-center justify-center bg-[#020617] gap-6 min-h-screen">
       <Loader />
       <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">Syncing Grading Telemetry...</p>
    </div>
  );

  return (
    <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700 min-h-screen font-sans">
      
      {/* 🏛️ COMMAND CENTER HEADER */}
      <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-950/40 p-10 rounded-[4rem] border-2 border-slate-900 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10"></div>
        
        <div className="p-6 bg-emerald-500/10 text-emerald-500 rounded-[2rem] border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
          <ClipboardCheck size={40} strokeWidth={2.5} className="animate-pulse" />
        </div>
        
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Grading Center</h2>
          <div className="flex items-center justify-center md:justify-start gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] italic">Active_Protocol_Monitor: {assignments.length} Tasks Live</p>
          </div>
        </div>
      </div>
      
      {/* 🏁 ASSIGNMENT STREAM */}
      <div className="space-y-6 max-w-[1400px] mx-auto">
        {assignments.length > 0 ? (
          assignments.map(asm => (
            <div 
              key={asm._id} 
              className="group bg-slate-950/40 backdrop-blur-xl p-8 md:p-10 rounded-[3.5rem] border-2 border-slate-900 flex flex-col md:flex-row justify-between items-center hover:border-blue-500/30 transition-all duration-700 shadow-2xl relative overflow-hidden"
            >
              {/* Background Neural Aura */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/5 blur-[80px] group-hover:bg-blue-600/10 transition-all duration-700"></div>

              <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10 w-full md:w-auto">
                <div className="p-6 bg-slate-900 rounded-[2.2rem] border border-slate-800 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                  <FileText size={32} strokeWidth={2.5}/>
                </div>
                <div className="space-y-3 text-center sm:text-left">
                  <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none group-hover:text-blue-400 transition-colors">
                    {asm.title}
                  </h3>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4">
                    <div className="bg-slate-950 px-5 py-2 rounded-full border border-white/5 flex items-center gap-3">
                      <Zap size={12} className="text-yellow-500"/>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic">
                        Submissions: <span className="text-blue-500">{asm.submissions?.length || 0}</span>
                      </p>
                    </div>
                    <div className="bg-slate-950 px-5 py-2 rounded-full border border-white/5 flex items-center gap-3">
                      <Activity size={12} className="text-emerald-500"/>
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic">
                        Node: {asm.classId?.name || "Global_Grid"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔥 FIXED NAVIGATION HUB */}
              <button 
                onClick={() => navigate(`/teacher/assignment/${asm._id}/submissions`)}
                className="mt-8 md:mt-0 w-full md:w-auto bg-white text-black px-12 py-6 rounded-[2.2rem] font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-3xl active:scale-95 flex items-center justify-center gap-4 relative z-10 italic"
              >
                Audit Node <ChevronRight size={18} strokeWidth={3} className="group-hover:translate-x-2 transition-transform"/>
              </button>
            </div>
          ))
        ) : (
          <div className="py-40 border-4 border-dashed border-slate-900 rounded-[5rem] flex flex-col items-center justify-center opacity-30 gap-8">
             <FileText size={80} strokeWidth={1} className="text-slate-800" />
             <div className="text-center space-y-2">
                <p className="text-2xl font-black uppercase tracking-[0.5em] text-slate-700 italic">No Protocols Found</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">Uplink established but no task nodes detected.</p>
             </div>
          </div>
        )}
      </div>

      {/* 🏛️ TELEMETRY FOOTER */}
      <div className="mt-20 flex justify-between items-center opacity-30">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="px-10 text-[9px] font-black text-slate-700 uppercase tracking-[1em]">TITAN_GRADING_CORE_V4.2</span>
          <div className="h-px flex-1 bg-slate-800"></div>
      </div>
    </div>
  );
};

export default TeacherAssignments;