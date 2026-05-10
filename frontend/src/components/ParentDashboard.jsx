/**
 * ============================================================
 * 🏛️ TITAN PARENTAL CONTROL PORTAL (v4.2 - Production)
 * Ref: Report Section 3.3.1 (Role-Based Dashboards)
 * Purpose: Secure guardian access to student academic telemetry.
 * ============================================================
 */

import React, { useEffect, useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import { 
  User, Calendar, ShieldCheck, 
  Award, Bell, Clock, ArrowRight, Activity, Zap
} from "lucide-react";

function ParentDashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        setLoading(true);
        // 🛰️ Synchronizing with the Guardian Telemetry Node
        const res = await API.get("/parent/dashboard");
        setData(res.data?.data || res.data);
      } catch (err) {
        setError("Unable to sync child data. Neural link lost.");
      } finally {
        setLoading(false);
      }
    };
    fetchParentData();
  }, []);

  if (!user) return null;

  return (
    <div className="animate-fade-in p-6 md:p-10 space-y-12 min-h-screen bg-slate-950/20 backdrop-blur-3xl pb-20">
      
      {/* 🏛️ PORTAL HEADER NODE */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-slate-900/40 p-10 rounded-[3.5rem] border border-slate-800 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -z-10"></div>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="bg-yellow-500 w-2.5 h-10 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]"></span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-none">Parental Control</h1>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em]">Guardian Instance:</p>
            <span className="text-yellow-500 font-black text-xs uppercase italic tracking-widest">{user?.name}</span>
          </div>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-slate-950/80 border-2 border-emerald-500/20 px-8 py-4 rounded-[2rem] hidden md:flex items-center gap-4 shadow-xl">
             <ShieldCheck size={20} className="text-emerald-500"/>
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">Neural Child Link: STABLE</span>
           </div>
        </div>
      </header>

      {/* 📊 MATRIX STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard title="Linked Students" value={data?.children?.length || 0} icon={<User className="text-blue-500"/>} />
        <StatCard title="Global Attendance" value="94.2%" icon={<Activity className="text-yellow-500"/>} />
        <StatCard title="Alerts Processed" value="02" icon={<Bell className="text-purple-500"/>} />
      </div>

      {/* 🚀 CHILD NODES GRID */}
      <main>
        {loading ? (
          <div className="py-32 flex flex-col items-center gap-6">
            <Loader />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">Syncing Guardian Telemetry...</p>
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {data?.children?.map((child) => (
              <div key={child._id} className="glass p-10 rounded-[4rem] border-2 border-slate-900 relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-700 shadow-2xl">
                
                {/* 🌫️ Ambient Aura Node */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[100px] -z-10 group-hover:bg-yellow-500/10 transition-all"></div>
                
                {/* Child Identity Interface */}
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(234,179,8,0.2)] border-4 border-slate-950">
                    <User size={36} strokeWidth={2.5}/>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-3">{child.name}</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Node Cluster: v4.2 / ACTIVE</p>
                    </div>
                  </div>
                </div>

                {/* Performance Intelligence Nodes */}
                <div className="grid grid-cols-2 gap-6 mb-10">
                   <div className="bg-slate-950/60 p-6 rounded-[2rem] border border-slate-900 group-hover:bg-slate-900 transition-colors">
                      <p className="text-[10px] font-black text-slate-600 uppercase mb-2 tracking-widest italic">Cumulative CGPA</p>
                      <p className="text-3xl font-black text-white italic">8.80</p>
                   </div>
                   <div className="bg-slate-950/60 p-6 rounded-[2rem] border border-slate-900 group-hover:bg-slate-900 transition-colors">
                      <p className="text-[10px] font-black text-slate-600 uppercase mb-2 tracking-widest italic">Node Progress</p>
                      <p className="text-3xl font-black text-blue-500">92%</p>
                      <div className="w-full h-1 bg-slate-800 mt-4 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[92%]"></div>
                      </div>
                   </div>
                </div>

                {/* 📋 Attendance Telemetry Log */}
                <div className="space-y-6 bg-slate-900/30 p-8 rounded-[2.5rem] border border-slate-800/50">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3 mb-4">
                    <Clock size={16} className="text-yellow-500"/> Historical Telemetry Log
                  </h4>
                  <div className="space-y-3">
                    {data.attendance?.filter(a => (a.student?._id || a.student) === child._id).length > 0 ? (
                      data.attendance?.filter(a => (a.student?._id || a.student) === child._id).slice(0, 3).map((a) => (
                        <div key={a._id} className="flex justify-between items-center p-4 bg-slate-950/40 rounded-2xl border border-white/5 hover:border-slate-700 transition-all group/row">
                          <span className="text-xs font-black text-slate-400 group-hover/row:text-white transition-colors">📅 {new Date(a.date).toLocaleDateString('en-GB')}</span>
                          <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${a.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}>
                            {a.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center flex flex-col items-center gap-4 opacity-40">
                         <Zap size={30} className="text-slate-800" />
                         <p className="text-[9px] text-slate-600 italic font-black uppercase tracking-widest">No Recent Signals Detected</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* View Detailed Action */}
                <button className="w-full mt-10 py-8 bg-slate-900 hover:bg-yellow-500 hover:text-black transition-all duration-500 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-3xl active:scale-95 group/btn">
                  Access Performance Matrix <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* 🏛️ Dashboard Footer Branding */}
      <div className="mt-20 flex justify-between items-center opacity-30">
          <div className="h-px flex-1 bg-slate-800"></div>
          <span className="px-10 text-[9px] font-black text-slate-700 uppercase tracking-[0.8em]">TITAN_GUARDIAN_CORE_V4.2</span>
          <div className="h-px flex-1 bg-slate-800"></div>
      </div>
    </div>
  );
}

// 🃏 Optimized Stat Card Node
function StatCard({ title, value, icon }) {
  return (
    <div className="glass p-10 rounded-[3rem] border-2 border-slate-900 hover:border-yellow-500/20 transition-all duration-500 group bg-slate-950/20 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 group-hover:border-yellow-500/30 transition-all shadow-inner">{icon}</div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 group-hover:text-yellow-500 transition-colors">{title}</h4>
      </div>
      <p className="text-5xl font-black text-white tracking-tighter italic">{value}</p>
    </div>
  );
}

export default ParentDashboard;