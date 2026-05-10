/**
 * ============================================================
 * 📊 TITAN PERFORMANCE MATRIX (v4.2 - Analytics)
 * Ref: Report Section 3.6 (Data Visualization & Telemetry)
 * Purpose: Visualizing class-wide engagement and attendance risk.
 * ============================================================
 */

import React, { useEffect, useState } from "react";
import API from "../api/api";
import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend 
} from "chart.js";
import { TrendingUp, Info, Activity, DownloadCloud } from "lucide-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AnalyticsChart({ classId }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classId) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        // 🛰️ Synchronizing with the TITAN Analytics Engine
        const res = await API.get(`/analytics/${classId}`);
        const rawData = res.data?.data?.students || res.data?.data || [];

        setChartData({
          labels: rawData.map(item => item.studentName || "Node"),
          datasets: [{
            label: "Attendance Rate (%)",
            data: rawData.map(item => parseFloat(item.attendanceRate || item.attendance) || 0),
            // ✅ HEURISTIC COLORING: Highlighting Risk Nodes
            backgroundColor: rawData.map(item => {
              const val = parseFloat(item.attendanceRate || item.attendance);
              return val < 75 ? "rgba(239, 68, 68, 0.6)" : "rgba(16, 185, 129, 0.6)";
            }),
            borderColor: rawData.map(item => {
              const val = parseFloat(item.attendanceRate || item.attendance);
              return val < 75 ? "#ef4444" : "#10b981";
            }),
            borderWidth: 2,
            borderRadius: 12,
            hoverBackgroundColor: "#3b82f6",
            hoverBorderColor: "#ffffff",
          }],
        });
      } catch (err) {
        console.error("📊 Analytics Handshake Failed:", err);
      } finally { setLoading(false); }
    };
    fetchData();
  }, [classId]);

  if (!classId) return null;

  return (
    <div className="glass p-8 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group h-[480px] bg-slate-950/40 backdrop-blur-3xl">
      {/* 🌫️ Ambient Neural Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[80px] -z-10 group-hover:bg-blue-600/10 transition-all duration-700"></div>
      
      {/* Header Info Node */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600/10 rounded-[1.5rem] flex items-center justify-center text-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] border border-blue-500/20">
            <Activity size={26} />
          </div>
          <div>
            <h3 className="text-white font-black tracking-tighter text-2xl uppercase leading-none italic">Performance Matrix</h3>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1.5">Telemetry Pattern: v4.2</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Logic Threshold</span>
                <span className="text-xs font-black text-emerald-500">75% STABLE</span>
            </div>
            <TrendingUp size={20} className="text-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] w-full relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] animate-pulse">Compiling Neural Data...</p>
          </div>
        ) : chartData ? (
          <Bar 
            data={chartData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false, 
              plugins: { 
                legend: { display: false },
                tooltip: {
                  backgroundColor: '#0f172a',
                  titleColor: '#94a3b8',
                  bodyColor: '#ffffff',
                  padding: 15,
                  cornerRadius: 15,
                  displayColors: false,
                  bodyFont: { weight: 'bold' }
                }
              },
              scales: { 
                y: { 
                  max: 100, 
                  beginAtZero: true, 
                  grid: { color: "rgba(255,255,255,0.02)", drawBorder: false },
                  ticks: { color: "#475569", font: { weight: 'bold', size: 10 }, callback: (v) => v + "%" }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: "#64748b", font: { weight: 'bold', size: 10 }}
                }
              }
            }} 
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800/50 rounded-[2.5rem] bg-slate-900/10">
             <Info className="text-slate-800 mb-4" size={40} />
             <p className="text-slate-600 font-black uppercase tracking-[0.2em] text-xs">Insufficient Telemetry Data</p>
             <p className="text-slate-700 text-[9px] mt-2 font-bold uppercase tracking-widest">Requires active student engagement nodes.</p>
          </div>
        )}
      </div>

      {/* Bottom Interface */}
      <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Optimal Node</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Risk Alert</span>
            </div>
         </div>
         <button className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-tighter hover:text-blue-400 transition-colors group/btn">
            <DownloadCloud size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
            Generate Intelligence Report
         </button>
      </div>
    </div>
  );
}

export default AnalyticsChart;