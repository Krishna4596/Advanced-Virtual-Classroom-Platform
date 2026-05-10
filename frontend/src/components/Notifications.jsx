/**
 * ============================================================
 * 📡 TITAN EVENT HUB (v4.2 - Production)
 * Ref: Report Section 1.3 (Event-Driven Architecture)
 * Purpose: Real-time system telemetry and user notifications.
 * ============================================================
 */

import React, { useEffect, useState } from "react";
import { getSocket } from "../socket/socket";
import API from "../api/api";
import { 
  Bell, 
  Zap, 
  MessageSquare, 
  AlertCircle, 
  Clock,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // 🛰️ Initial Neural Link Handshake
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(res.data?.data || res.data || []);
      } catch (err) { 
        console.error("❌ Neural Node: Notification sync failed."); 
      }
    };

    fetchNotifications();
    const socket = getSocket();
    
    if (socket) {
      // 📡 Listening to Live Socket Stream
      socket.on("new_notification", (data) => {
        setNotifications(prev => [data, ...prev]);
        // Trigger browser notification if needed
      });
    }
    return () => socket?.off("new_notification");
  }, []);

  const markAllRead = async () => {
    try {
      await API.post("/notifications/mark-read");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) { console.error("Handshake failed."); }
  };

  return (
    <div className="glass p-8 rounded-[3rem] border-2 border-slate-800 shadow-2xl relative overflow-hidden group bg-slate-950/20 backdrop-blur-3xl">
      
      {/* 🌫️ Ambient Neural Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] -z-10 group-hover:bg-blue-600/10 transition-all duration-1000"></div>

      {/* 🛠️ Header Node */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800/50 pb-6">
        <h3 className="text-sm font-black text-white uppercase tracking-[0.4em] flex items-center gap-4">
          <div className="relative">
            <Bell size={20} className="text-blue-500" />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-[#020617] animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
            )}
          </div>
          System Alerts
        </h3>
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              {notifications.length} Signals
            </span>
        </div>
      </div>

      {/* 🌊 Alert Stream Container */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar scroll-smooth">
        {notifications.length === 0 ? (
          <div className="py-20 text-center space-y-6 opacity-30">
            <Zap size={48} strokeWidth={1} className="mx-auto text-slate-600" />
            <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em] italic">Telemetry Clear: No Active Alerts</p>
          </div>
        ) : (
          notifications.map((n) => {
            const isAssignment = n.title.toLowerCase().includes("assignment") || n.title.toLowerCase().includes("task");
            return (
              <div 
                key={n._id} 
                className={`group/item relative p-6 rounded-[2.5rem] border transition-all duration-500 hover:bg-slate-900/40 ${
                  !n.isRead 
                  ? "bg-blue-600/5 border-blue-500/20 shadow-xl shadow-blue-600/5" 
                  : "bg-slate-950/20 border-slate-900"
                }`}
              >
                <div className="flex items-start gap-5">
                  {/* 🎭 Adaptive Icon Node */}
                  <div className={`p-3 rounded-2xl transition-all duration-500 ${!n.isRead ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-600'}`}>
                    {isAssignment ? <AlertCircle size={16} strokeWidth={2.5}/> : <MessageSquare size={16} strokeWidth={2.5}/>}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <p className={`text-[11px] font-black uppercase tracking-tight group-hover/item:text-blue-400 transition-colors ${!n.isRead ? 'text-white' : 'text-slate-500'}`}>
                        {n.title}
                      </p>
                      <span className="text-[8px] font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-widest">
                        <Clock size={10}/> {n.createdAt ? "SIGNAL_RECEIVED" : "ARCHIVED"}
                      </span>
                    </div>
                    <p className={`text-[10px] font-bold leading-relaxed ${!n.isRead ? 'text-slate-300' : 'text-slate-600'}`}>
                      {n.message}
                    </p>
                  </div>

                  {!n.isRead && (
                     <ChevronRight size={16} className="text-blue-500 mt-2 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🚀 Footer Control Protocol */}
      <div className="mt-8 pt-8 border-t border-slate-800/50 flex justify-between items-center">
         <button 
           onClick={markAllRead}
           className="text-[10px] font-black text-slate-500 hover:text-blue-500 uppercase tracking-[0.2em] transition-all flex items-center gap-2 group/btn"
         >
           <ShieldCheck size={14} className="group-hover/btn:scale-110 transition-transform" />
           Acknowledge All Signals
         </button>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-[0.3em]">
              WebSocket_v4.2: Stable
            </p>
         </div>
      </div>
    </div>
  );
}

export default Notifications;