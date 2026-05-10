/**
 * ============================================================
 * 👨‍👩‍👦 TITAN GUARDIAN: Presence Telemetry (Attendance)
 * Purpose: Track and display student presence in neural nodes.
 * Upgrades: Fluid Grids, Mobile-Native List View, Smart Paddings.
 * ============================================================
 */

import React, { useState, useEffect } from "react";
import API from "../api/api";
import Loader from "../components/Loader";
import { CalendarDays, CheckCircle, XCircle, AlertTriangle, Activity, Clock } from "lucide-react";

function ParentAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childrenList, setChildrenList] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, percentage: 0 });

  // 1. Fetch linked children
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const parentRes = await API.get("/parent/dashboard");
        const kids = parentRes.data?.data?.children || parentRes.data?.children || [];
        setChildrenList(kids);

        if (kids.length > 0) {
          const firstChildId = kids[0].childId || kids[0]._id;
          setSelectedChild(firstChildId);
          fetchAttendance(firstChildId);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch child nodes", err);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Fetch Attendance data
  const fetchAttendance = async (childId) => {
    setLoading(true);
    try {
      const res = await API.get(`/attendance/${childId}`); 
      const data = res.data?.data || [];
      setAttendance(data);
      calculateStats(data);
    } catch (err) {
      console.error("Attendance fetch error", err);
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChildChange = (e) => {
    const childId = e.target.value;
    setSelectedChild(childId);
    fetchAttendance(childId);
  };

  const calculateStats = (records) => {
    if (!records || records.length === 0) return setStats({ total: 0, present: 0, percentage: 0 });
    const total = records.length;
    // Handle both uppercase and lowercase 'present' defensively
    const present = records.filter(r => r.status?.toLowerCase() === 'present').length;
    const percentage = ((present / total) * 100).toFixed(1);
    setStats({ total, present, percentage });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

  return (
    // 🔥 FIX: Adjusted global spacing for mobile
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-in fade-in duration-700">
      
      {/* 🏛️ HEADER: Responsive Stack */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 border-b border-slate-800 pb-4 sm:pb-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="p-3 sm:p-4 bg-emerald-500/10 rounded-xl sm:rounded-2xl border border-emerald-500/30 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] shrink-0">
            <CalendarDays size={28} className="sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-white">Presence Sync</h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 sm:mt-1">Daily Telemetry Logs</p>
          </div>
        </div>

        {/* Dropdown for multiple kids */}
        {childrenList.length > 0 && (
          <select 
            onChange={handleChildChange} 
            value={selectedChild || ""}
            className="input-neural text-xs w-full sm:max-w-xs !py-3 !rounded-xl border-emerald-500/30 focus:border-emerald-500 bg-slate-900 text-white mt-2 sm:mt-0"
          >
            {childrenList.map(c => (
              <option key={c.childId || c._id} value={c.childId || c._id}>
                {c.childName || c.name || "Unknown"} Node
              </option>
            ))}
          </select>
        )}
      </header>

      {/* 📊 STATS CARDS: Grid adjusts based on screen size */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
          <div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1 sm:mb-2">Total Syncs</p>
            <p className="text-3xl sm:text-4xl font-black text-white italic">{stats.total}</p>
          </div>
          <Activity size={32} className="text-slate-700 group-hover:text-blue-500 transition-colors sm:w-10 sm:h-10"/>
        </div>
        
        <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
          <div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1 sm:mb-2">Verified Presence</p>
            <p className="text-3xl sm:text-4xl font-black text-emerald-500 italic">{stats.present}</p>
          </div>
          <CheckCircle size={32} className="text-emerald-500/20 group-hover:text-emerald-500 transition-colors sm:w-10 sm:h-10"/>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-slate-800 shadow-xl flex items-center justify-between group hover:border-emerald-500/30 transition-colors">
          <div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1 sm:mb-2">Sync Ratio</p>
            <p className="text-3xl sm:text-4xl font-black text-yellow-500 italic">{stats.percentage}%</p>
          </div>
          <Clock size={32} className="text-yellow-500/20 group-hover:text-yellow-500 transition-colors sm:w-10 sm:h-10"/>
        </div>
      </div>

      {/* 🚀 TELEMETRY LIST: The Adaptive Table */}
      {attendance.length === 0 ? (
        <div className="text-center py-12 sm:py-20 border-2 border-dashed border-slate-800 rounded-[2rem] sm:rounded-[3rem] bg-slate-900/20 px-4">
          <AlertTriangle size={40} className="mx-auto text-slate-600 mb-4 sm:w-12 sm:h-12" />
          <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest">No presence logs detected.</p>
        </div>
      ) : (
        <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl">
          
          {/* 🔥 TABLE HEADER: Hidden on mobile (sm breakpoint) */}
          <div className="hidden sm:grid grid-cols-3 gap-4 p-6 border-b border-slate-800 bg-slate-900/80">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Module / Subject</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Node Status</p>
          </div>
          
          <div className="divide-y divide-slate-800/50">
            {attendance.map((record) => {
              const isPresent = record.status?.toLowerCase() === 'present';
              
              return (
                // 🔥 ADAPTIVE ROW: Flex column on mobile, Grid on desktop
                <div key={record._id} className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4 p-5 sm:p-6 items-start sm:items-center hover:bg-slate-900/40 transition-colors">
                  
                  {/* Column 1: Date (and Subject on mobile) */}
                  <div className="flex flex-col sm:block">
                    <p className="text-xs sm:text-sm font-bold text-white uppercase italic tracking-widest">
                      {new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    {/* Only visible on mobile */}
                    <p className="sm:hidden text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                      {record.subject || 'General Assembly'}
                    </p>
                  </div>

                  {/* Column 2: Subject (Only visible on desktop) */}
                  <p className="hidden sm:block text-sm font-bold text-slate-400 uppercase tracking-widest text-center">
                    {record.subject || 'General Assembly'}
                  </p>
                  
                  {/* Column 3: Status Badge */}
                  <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/50">
                    {/* Status Label for mobile context */}
                    <span className="sm:hidden text-[9px] font-black text-slate-600 uppercase tracking-widest">Sync Status</span>
                    
                    {isPresent ? (
                      <div className="flex items-center gap-2 bg-emerald-500/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-emerald-500/20">
                        <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                        <span className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Present</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-red-500/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-red-500/20">
                        <XCircle size={14} className="text-red-500 shrink-0" />
                        <span className="text-[9px] sm:text-[10px] font-black text-red-500 uppercase tracking-widest italic">Absent</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ParentAttendance;