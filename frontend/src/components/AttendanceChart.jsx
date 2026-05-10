/**
 * ============================================================
 * 📊 TITAN ENGAGEMENT MATRIX (v4.2 - Analytics Node)
 * Ref: Report Section 3.6 (Visual Telemetry)
 * Purpose: Tracking historical attendance & engagement trends.
 * ============================================================
 */

import React, { useEffect, useState, useRef } from "react";
import API from "../api/api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { TrendingUp, Info, Activity } from "lucide-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AttendanceChart({ classId }) {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!classId) return;
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🛰️ Synchronizing with the TITAN Attendance Analytics endpoint
        const res = await API.get(`/analytics/attendance/${classId}`);
        const rawData = res.data?.data || [];

        if (isMounted) {
          if (rawData.length > 0) {
            // 🎨 NEURAL GRADIENT: Establishing visual depth
            const ctx = document.createElement('canvas').getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(37, 99, 235, 0.8)'); 
            gradient.addColorStop(1, 'rgba(37, 99, 235, 0.05)');

            setChartData({
              labels: rawData.map((item) => item.day || item.date?.split('T')[0] || "CYCLE"),
              datasets: [
                {
                  label: "Engagement",
                  data: rawData.map((item) => item.attendancePercentage || item.present || 0),
                  backgroundColor: gradient,
                  borderColor: "#3b82f6",
                  borderWidth: 2,
                  borderRadius: 12,
                  hoverBackgroundColor: "#2563eb",
                  barThickness: rawData.length > 10 ? 'flex' : 45, // 🧠 Auto-scale
                },
              ],
            });
          } else {
            setError("Insufficient telemetry data. No historical cycles detected.");
          }
        }
      } catch (err) {
        if (isMounted) setError("Neural Link Offline: Analytics relay failed.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [classId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-32 glass rounded-[4rem] border border-slate-800/50 bg-slate-950/20">
      <div className="relative w-14 h-14 mb-8">
          <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.6em] animate-pulse">Syncing Neural Nodes...</p>
    </div>
  );

  if (error) return (
    <div className="p-20 glass rounded-[4rem] border-2 border-slate-900/50 text-center space-y-6 bg-slate-950/40">
      <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl">
         <Info className="text-slate-600" size={36} />
      </div>
      <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] max-w-[200px] mx-auto leading-relaxed">{error}</p>
    </div>
  );

  if (!chartData) return null;

  return (
    <div className="glass p-10 rounded-[4rem] border border-slate-800/50 shadow-2xl relative overflow-hidden group bg-slate-950/30 backdrop-blur-3xl">
      {/* 🚀 Ambient Glow Protocol */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 blur-[120px] -z-10 group-hover:bg-blue-600/10 transition-all duration-1000"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-14 gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-[2rem] flex items-center justify-center text-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)] transition-transform group-hover:scale-105">
            <Activity size={28} />
          </div>
          <div>
            <h2 className="text-white font-black tracking-tighter text-3xl uppercase italic leading-none">Engagement Matrix</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Telemetry Cluster: v4.2</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 px-5 py-2 rounded-2xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Neural Link Active</span>
          </div>
          <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.5em] mr-2">Precision Mode: Enabled</p>
        </div>
      </div>
      
      <div className="h-[400px] w-full mt-4">
        <Bar 
          ref={chartRef}
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#020617',
                titleColor: '#94a3b8',
                titleFont: { size: 13, weight: '900', family: 'Inter' },
                bodyFont: { size: 12, family: 'Inter', weight: 'bold' },
                padding: 18,
                cornerRadius: 24,
                borderColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 1,
                displayColors: false,
                callbacks: { label: (ctx) => ` ⚡ ENGAGEMENT: ${ctx.raw}%` }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                grid: { color: "rgba(255,255,255,0.02)", drawBorder: false },
                ticks: { 
                  color: "#475569", 
                  font: { weight: '900', size: 10 },
                  callback: (v) => v + "%",
                  padding: 10
                }
              },
              x: {
                grid: { display: false },
                ticks: { color: "#64748b", font: { weight: '900', size: 10 }, padding: 10 }
              }
            },
            animation: {
              duration: 2500,
              easing: 'easeOutQuart'
            }
          }} 
        />
      </div>

      <div className="mt-12 pt-8 border-t border-slate-800/30 flex justify-between items-center opacity-60">
         <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-500">Node: Visual_Analytics</p>
         </div>
         <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Encrypted Data Stream</p>
      </div>
    </div>
  );
}

export default AttendanceChart;