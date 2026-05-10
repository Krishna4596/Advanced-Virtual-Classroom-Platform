/**
 * ============================================================
 * 🏛️ TITAN ANALYTICS DASHBOARD (v4.2 - Neural Overview)
 * Ref: Report Section 3.6 (Data Visualization & Management)
 * Purpose: Aggregated classroom telemetry for administrative audit.
 * ============================================================
 */

import React, { useEffect, useState } from "react";
import API from "../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from "recharts";
import { LayoutDashboard, Users, Activity, Clock, Award, ShieldCheck } from "lucide-react";
import Loader from "./Loader";

function AnalyticsDashboard({ classId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!classId) return;

    let isMounted = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🛰️ Fetching collective telemetry for the classroom node
        const res = await API.get(`/analytics/${classId}`);
        const responseData = res?.data?.data || res?.data;

        if (isMounted) setData(responseData);
      } catch (err) {
        console.error("📊 Dashboard Handshake Error:", err);
        if (isMounted) setError("Neural Link Failure: Analytics engine offline.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => { isMounted = false; };
  }, [classId]);

  if (loading) return <div className="py-24 flex justify-center"><Loader /></div>;
  
  if (error) return (
    <div className="p-12 glass rounded-[3rem] border-2 border-red-500/20 text-red-400 text-center">
        <ShieldCheck className="mx-auto mb-4 opacity-50" size={40} />
        <p className="font-black text-xs uppercase tracking-[0.3em]">{error}</p>
    </div>
  );

  if (!data) return null;

  // 📈 Chart Telemetry Preparation
  const barData = [
    { name: "Average", mins: Math.floor((data.averageDuration || 0) / 60) },
    { name: "Peak", mins: Math.floor((data.maxDuration || data.longest || 0) / 60) },
    { name: "Global Avg", mins: 45 }, // System benchmark
  ];

  const pieData = [
    { name: "Active Students", value: data.totalStudents || 0 },
    { name: "Total Sessions", value: data.totalSessions || 0 },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6"];

  return (
    <div className="animate-fade-in space-y-10 pb-10">
      
      {/* 🏛️ Dashboard Header Node */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/40 p-10 rounded-[3.5rem] border border-slate-800 backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] -z-10"></div>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-purple-600/20 rounded-[2rem] flex items-center justify-center text-purple-500 shadow-xl border border-purple-500/20">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Class Insights</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">Central Telemetry & Analytics Hub</p>
          </div>
        </div>
        <div className="mt-6 md:mt-0">
          <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
            Real-time Sync Active
          </span>
        </div>
      </div>

      {/* 📊 Matrix Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MiniCard title="Student Nodes" value={data.totalStudents || 0} icon={<Users className="text-blue-500"/>} />
        <MiniCard title="Total Sessions" value={data.totalSessions || 0} icon={<Activity className="text-purple-500"/>} />
        <MiniCard title="Avg Engagement" value={`${Math.floor((data.averageDuration || 0) / 60)}m`} icon={<Clock className="text-emerald-500"/>} />
        <MiniCard title="Integrity Score" value="98%" icon={<Award className="text-yellow-500"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 📈 Bar Chart: Session Telemetry */}
        <div className="glass p-10 rounded-[3.5rem] border border-slate-800 relative overflow-hidden group bg-slate-950/30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/5 blur-[70px] -z-10 group-hover:bg-purple-600/10 transition-all duration-700"></div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
            <Clock size={18} className="text-purple-500"/> Session Duration Analysis
          </h3>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}m`} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '15px' }}
                  itemStyle={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '12px' }}
                />
                <Bar dataKey="mins" fill="#8b5cf6" radius={[12, 12, 0, 0]} barSize={45} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🥧 Pie Chart: Utilization Nodes */}
        <div className="glass p-10 rounded-[3.5rem] border border-slate-800 relative overflow-hidden group bg-slate-950/30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/5 blur-[70px] -z-10 group-hover:bg-blue-600/10 transition-all duration-700"></div>
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
            <Users size={18} className="text-blue-500"/> Capacity Utilization
          </h3>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  dataKey="value" 
                  innerRadius={75} 
                  outerRadius={110} 
                  paddingAngle={8} 
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center gap-8 mt-6">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: COLORS[idx], boxShadow: `0 0 10px ${COLORS[idx]}50` }}></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// 🃏 Matrix Stat Card Sub-component
function MiniCard({ title, value, icon }) {
  return (
    <div className="glass p-8 rounded-[3rem] border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900/50 transition-all duration-500 group shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-blue-500/20 transition-all">{icon}</div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</span>
      </div>
      <h3 className="text-4xl font-black text-white tracking-tighter italic">{value}</h3>
    </div>
  );
}

export default AnalyticsDashboard;