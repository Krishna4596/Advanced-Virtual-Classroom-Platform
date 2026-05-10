/**
 * ============================================================
 * 📊 TITAN STUDENT ANALYTICS ENGINE (v4.2 - Production)
 * Ref: Report Section 3.6 (Academic Analytics & Telemetry)
 * Purpose: Detailed performance auditing and session logging.
 * ============================================================
 */

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { 
  X, User, Mail, History, 
  Clock, Calendar, Award, 
  ChevronRight, ArrowUpRight, ShieldCheck, Download
} from "lucide-react";
import Loader from "./Loader";

function StudentReport({ classId, studentId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classId || !studentId) return;

    let isMounted = true;

    const fetchReport = async () => {
      try {
        setLoading(true);
        // 🛰️ Synchronizing with Academic Telemetry Node
        const res = await API.get(`/student-analytics/${classId}/${studentId}`);
        const responseData = res?.data?.data || res?.data;

        if (isMounted) setData(responseData);
      } catch (err) {
        console.error("❌ ANALYTICS_LINK_FAILURE: Performance node unreachable.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReport();

    return () => { isMounted = false; };
  }, [classId, studentId]);

  if (loading) return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-[200] p-6 animate-in fade-in">
      <div className="glass p-12 rounded-[4rem] border border-slate-800 flex flex-col items-center shadow-3xl bg-slate-950/40">
        <Loader />
        <p className="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Compiling Neural Profile...</p>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[200] flex justify-center items-center p-4 md:p-10 animate-in zoom-in-95 duration-500">
      
      <div className="glass w-full max-w-5xl max-h-[85vh] rounded-[4rem] border-2 border-slate-900 shadow-[0_0_100px_rgba(37,99,235,0.1)] flex flex-col relative overflow-hidden bg-[#020617]/80">
        
        {/* 🌫️ Ambient Aura Node */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/5 blur-[100px] -z-10"></div>

        {/* ❌ Terminate Button */}
        <button 
          onClick={onClose} 
          className="absolute top-8 right-10 p-4 bg-slate-950/50 hover:bg-red-600 text-slate-600 hover:text-white rounded-2xl transition-all z-20 group border border-slate-800"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* 🏛️ Header Node: Student Identity Protocol */}
        <header className="p-10 md:p-14 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
               <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center text-white shadow-3xl border-4 border-slate-950 group">
                 <User size={48} strokeWidth={2.5}/>
               </div>
               <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-[#020617] shadow-xl">
                 <ShieldCheck size={16} className="text-white" />
               </div>
            </div>
            
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
                {data?.student?.name}
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                <span className="flex items-center gap-3 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
                  <Mail size={14} className="text-blue-500"/> {data?.student?.email}
                </span>
                <div className="h-4 w-px bg-slate-800 hidden md:block"></div>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Authorized Student</span>
              </div>
            </div>
          </div>
        </header>

        {/* 🚀 Analytics Content Stream */}
        <main className="flex-1 overflow-y-auto p-10 md:p-14 space-y-16 custom-scrollbar scroll-smooth">
          
          {/* 📊 Matrix: Performance Indicators */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ReportStat label="Neural Sessions" value={data?.totalSessions || 0} icon={<Calendar size={20}/>} color="text-blue-500" />
            <ReportStat label="Cumulative Sync" value={`${Math.floor((data?.totalDuration || 0) / 60)}h ${data?.totalDuration % 60}m`} icon={<Clock size={20}/>} color="text-purple-500" />
            <ReportStat label="Engagement Index" value="ALPHA" icon={<Award size={20}/>} color="text-yellow-500" />
          </section>

          {/* 📜 Timeline: Session Architecture */}
          <section className="space-y-10">
            <div className="flex items-center justify-between border-b border-slate-900 pb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.4em] flex items-center gap-4">
                  <History size={20} className="text-blue-500"/> Historical Telemetry Logs
                </h3>
                <div className="flex items-center gap-3 opacity-30">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Protocol: Log_Audit_v4.2</span>
                </div>
            </div>

            <div className="space-y-6">
              {data?.history?.length > 0 ? (
                data?.history?.map((h, idx) => (
                  <div key={h?._id || idx} className="group bg-slate-950/40 p-8 rounded-[2.5rem] border-2 border-slate-900 hover:border-blue-500/30 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                    <div className="flex gap-10">
                       <div className="text-left space-y-2">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Node Entrance</p>
                          <p className="text-sm font-black text-slate-200">{new Date(h?.joinTime).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                       <div className="text-left space-y-2">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Node Exit</p>
                          <p className="text-sm font-black text-slate-400">
                            {h?.leaveTime ? new Date(h.leaveTime).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : "ACTIVE_NODE"}
                          </p>
                       </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-10 bg-slate-950 p-6 rounded-[2rem] border border-slate-900 group-hover:border-blue-500/20 transition-all shadow-inner">
                       <div className="text-right">
                          <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1">Session Duration</p>
                          <p className="text-2xl font-black text-blue-500 italic leading-none">{Math.floor((h?.duration || 0) / 60)}<span className="text-xs ml-1">MIN</span></p>
                       </div>
                       <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500 opacity-30 group-hover:opacity-100 transition-opacity">
                          <ArrowUpRight size={20} strokeWidth={3} />
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-24 text-center border-4 border-dashed border-slate-900 rounded-[4rem] flex flex-col items-center gap-6 opacity-30">
                    <History size={48} className="text-slate-800" />
                    <p className="text-slate-700 font-black uppercase tracking-[0.5em] text-[10px]">No Neural Telemetry Recorded</p>
                </div>
              )}
            </div>
          </section>

        </main>

        {/* 🏁 Footer Handshake Summary */}
        <footer className="p-10 border-t border-slate-900 bg-slate-950/60 backdrop-blur-xl flex justify-between items-center relative z-10">
           <div className="flex items-center gap-4">
              <Zap size={14} className="text-yellow-500 animate-pulse" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Autonomous Reporting: Active</p>
           </div>
           <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95">
             <Download size={16} strokeWidth={3}/> Export Telemetry <ChevronRight size={14}/>
           </button>
        </footer>

      </div>
    </div>
  );
}

// 🃏 KPI Visualization Node
function ReportStat({ label, value, icon, color }) {
  return (
    <div className="bg-slate-950/40 p-8 rounded-[2.5rem] border-2 border-slate-900 flex flex-col gap-6 shadow-xl group hover:border-slate-800 transition-all">
      <div className="flex justify-between items-center">
        <div className={`p-4 bg-slate-900 rounded-2xl border border-slate-800 group-hover:scale-110 transition-transform ${color} shadow-inner`}>
            {icon}
        </div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{label}</span>
      </div>
      <p className={`text-4xl font-black ${color} tracking-tighter italic leading-none`}>{value}</p>
    </div>
  );
}

export default StudentReport;