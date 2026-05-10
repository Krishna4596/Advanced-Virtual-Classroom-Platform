/**
 * ============================================================
 * 🧠 TITAN AI PREDICTIVE INSIGHTS (v4.2)
 * Ref: Report Section 3.6 (Neural Analytics & Telemetry)
 * Purpose: Real-time student performance forecasting.
 * ============================================================
 */

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Sparkles, AlertCircle, TrendingUp, Clock, BrainCircuit, ShieldAlert } from "lucide-react";

function AIInsights({ classId }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classId) return;
    const fetchInsights = async () => {
      try {
        setLoading(true);
        // 🛰️ Calling the Predictive Logic endpoint we built in analyticsRoutes
        const res = await API.get(`/analytics/${classId}`);
        // Assuming backend returns an array of student predictions for that class
        const data = res.data?.data?.predictions || res.data?.data || [];
        setInsights(Array.isArray(data) ? data : []);
      } catch (err) { 
        console.error("AI Neural Node Error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchInsights();
  }, [classId]);

  return (
    <div className="glass p-8 rounded-[3rem] border border-indigo-500/10 relative overflow-hidden group shadow-2xl bg-slate-950/50 backdrop-blur-2xl">
      {/* 🔮 Neural Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10 group-hover:bg-indigo-600/15 transition-all duration-1000"></div>
      
      {/* Header Node */}
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800/50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] animate-pulse-slow">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Neural Insights</h3>
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Predictive Telemetry Engine</p>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="flex flex-col items-end">
            <span className="text-[9px] bg-slate-900 text-slate-400 px-4 py-1.5 rounded-full font-black border border-slate-800 tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              ENGINE: ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Insights Content */}
      <div className="space-y-5">
        {loading ? (
          <div className="py-20 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Scanning Neural Network...</p>
          </div>
        ) : insights.length > 0 ? (
          insights.map((item, idx) => {
            const riskValue = item.riskLevel?.toLowerCase() || 'stable';
            const isCritical = riskValue === 'critical';
            const isAtRisk = riskValue === 'at risk' || isCritical;
            
            return (
              <div 
                key={idx} 
                className={`p-6 rounded-[2rem] border transition-all duration-500 group/item ${
                    isCritical 
                    ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/50' 
                    : 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/30'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${isAtRisk ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}></div>
                    <div>
                        <span className="font-black text-base text-slate-100 uppercase tracking-tight block">
                        {item.studentName || "Neural Node " + (idx + 1)}
                        </span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase">{item.recommendation || "System monitoring active"}</span>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border ${
                    isAtRisk 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  }`}>
                    {isCritical ? <ShieldAlert size={14}/> : isAtRisk ? <AlertCircle size={14}/> : <TrendingUp size={14}/>}
                    <span className="text-[10px] font-black uppercase tracking-widest">{riskValue}</span>
                  </div>
                </div>

                {/* Telemetry Visualizer */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-black/20 p-3 rounded-2xl border border-slate-800/50">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock size={12} className="text-slate-500"/>
                            <span className="text-[9px] font-black text-slate-500 uppercase">Attendance</span>
                        </div>
                        <span className="text-sm font-black text-slate-200">{item.metrics?.attendanceRate || "0%"}</span>
                    </div>
                    <div className="bg-black/20 p-3 rounded-2xl border border-slate-800/50">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={12} className="text-indigo-400"/>
                            <span className="text-[9px] font-black text-slate-500 uppercase">Academic Avg</span>
                        </div>
                        <span className="text-sm font-black text-slate-200">{item.metrics?.academicAvg || "0%"}</span>
                    </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-slate-800/50 rounded-[3rem] bg-slate-900/20">
             <BrainCircuit className="mx-auto text-slate-800 mb-6 animate-pulse" size={48}/>
             <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Neural Data Pending</p>
             <p className="text-slate-700 text-[10px] mt-2 font-bold italic uppercase tracking-widest">Awaiting engagement metrics from student nodes.</p>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-10 pt-6 border-t border-slate-800/50 flex items-center justify-between">
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Protocol: Encrypted Telemetry</span>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
            <span className="text-[8px] font-black text-indigo-500/50 uppercase tracking-[0.3em]">AI-CORE: TITAN_V4.2</span>
        </div>
      </div>
    </div>
  );
}

export default AIInsights;