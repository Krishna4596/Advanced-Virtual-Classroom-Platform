/**
 * ============================================================
 * 📢 TITAN BROADCAST PANEL (v4.2 - Neural Sync)
 * Upgrade: Socket Live-Listening & Multi-Priority Styling.
 * ============================================================
 */

import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { getSocket } from "../socket/socket"; // 🛰️ Socket connectivity
import { Megaphone, ShieldAlert, Zap, Activity } from 'lucide-react';

const BroadcastPanel = ({ classId }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;

    // 1. 📥 INITIAL_HYDRATION: Fetch history from DB
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/broadcast/class/${classId}`);
        // Backend data consistent handling
        const data = res.data?.data || res.data;
        setAlerts(Array.isArray(data) ? data : []);
      } catch (err) { 
        console.error("❌ BROADCAST_SYNC_FAILED"); 
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // 2. ⚡ LIVE_SIGNAL_LISTENER: Real-time update via Socket
    const socket = getSocket();
    if (socket) {
      socket.on("new_announcement_broadcast", (newAlert) => {
        // Sirf tab add karo agar announcement isi class ki ho
        if (newAlert.classId === classId) {
          setAlerts((prev) => {
            // Duplicate check
            if (prev.some(a => a._id === newAlert._id)) return prev;
            return [newAlert, ...prev]; // Naya alert sabse upar
          });
        }
      });
    }

    return () => {
      if (socket) socket.off("new_announcement_broadcast");
    };
  }, [classId]);

  if (loading) return (
    <div className="p-4 animate-pulse space-y-4">
      <div className="h-20 bg-slate-900 rounded-[2rem]"></div>
    </div>
  );

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
      {alerts.length > 0 ? (
        alerts.map((alert) => (
          <div 
            key={alert._id} 
            className={`glass p-6 rounded-[2rem] border-l-4 transition-all hover:scale-[1.02] duration-300 ${
              alert.priority === 'high' 
              ? "border-l-red-500 bg-red-500/5 shadow-lg shadow-red-500/10" 
              : "border-l-blue-500 bg-blue-500/5"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {alert.priority === 'high' ? (
                  <ShieldAlert size={18} className="text-red-500 animate-pulse" />
                ) : (
                  <Megaphone size={18} className="text-blue-500" />
                )}
                <h4 className="font-black text-white uppercase italic text-xs tracking-tighter">
                  {alert.title || "SYSTEM_UPDATE"}
                </h4>
              </div>
              <span className="text-[8px] font-black text-slate-600 uppercase italic">
                {new Date(alert.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-slate-400 text-[11px] leading-relaxed italic border-t border-white/5 pt-2 mt-2">
              {alert.message}
            </p>

            {alert.senderName && (
              <div className="flex items-center gap-2 mt-3 opacity-40">
                <Activity size={10} className="text-blue-500" />
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  Node: {alert.senderName}
                </span>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-10 opacity-20">
          <Zap size={24} className="mx-auto mb-2 text-slate-500" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">No_Active_Signals</p>
        </div>
      )}
    </div>
  );
};

export default BroadcastPanel;