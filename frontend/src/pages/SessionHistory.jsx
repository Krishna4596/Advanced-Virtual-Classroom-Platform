/**
 * ============================================================
 * 🎞️ TITAN SESSION ARCHIVE (v4.2 - Production)
 * Ref: Report Section 3.5 (Digital Content Governance)
 * Purpose: Secure storage and playback of neural academic feeds.
 * ============================================================
 */

import React, { useEffect, useState, useCallback } from "react";
import API from "../api/api";
import { 
  PlayCircle, Download, Clock, Calendar, 
  Video, ChevronRight, History, X, Activity, Zap
} from "lucide-react";
import Loader from "../components/Loader";

function SessionHistory({ classId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlayback, setActivePlayback] = useState(null);

  // 🛰️ ARCHIVE SYNC: Fetching historical nodes from cluster
  const fetchSessions = useCallback(async () => {
    if (!classId) return;
    try {
      setLoading(true);
      const { data } = await API.get(`/sessions/${classId}`);
      // Handling both nested and direct array responses
      const sessionData = Array.isArray(data) ? data : (data?.data || []);
      setSessions(sessionData);
    } catch (err) {
      console.error("❌ ARCHIVE_LINK_FAILURE: Could not sync historical nodes.");
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="glass p-8 md:p-14 rounded-[3.5rem] md:rounded-[5rem] border-2 border-slate-900 shadow-3xl space-y-10 md:space-y-16 animate-in fade-in duration-700 relative overflow-hidden bg-[#020617]/40 backdrop-blur-3xl">
      
      {/* 🌫️ Ambient Emerald Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 blur-[120px] -z-10 animate-pulse"></div>

      {/* 🏛️ ARCHIVE HEADER CLUSTER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 border-b-2 border-slate-900 pb-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-3xl border-2 border-emerald-500/20 group-hover:scale-110 transition-transform">
            <History size={36} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Session Archive</h2>
            <div className="flex items-center gap-3">
               <Activity size={14} className="text-emerald-500 animate-pulse" />
               <p className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-[0.4em] italic leading-none">Institutional_Recording_Logs: SECURED</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-950 px-8 py-4 rounded-3xl border-2 border-slate-900 shadow-inner">
           <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest italic">Archived_Nodes: {sessions.length}</span>
        </div>
      </div>

      {/* 📂 REPOSITORY STREAM */}
      <div className="space-y-8">
        {loading ? (
          <div className="py-40 flex flex-col items-center gap-8">
            <Loader />
            <p className="text-[11px] font-black uppercase text-emerald-500 tracking-[0.8em] animate-pulse">Syncing Neural Archive...</p>
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((s) => (
            <div 
              key={s._id} 
              className="group bg-slate-950/40 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-slate-900 hover:border-emerald-500/30 transition-all duration-700 flex flex-col xl:flex-row xl:items-center justify-between gap-8 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-8 relative z-10">
                <div className={`w-20 h-20 shrink-0 rounded-[2rem] flex items-center justify-center shadow-inner border-2 transition-all duration-500 ${s.recordingUrl ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'bg-slate-900 text-slate-800 border-slate-800'}`}>
                  <Video size={36} strokeWidth={2.5} className={s.recordingUrl ? "animate-pulse" : ""} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic group-hover:text-emerald-400 transition-colors">
                      {new Date(s.startedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="flex items-center gap-2 bg-slate-900 text-slate-600 px-4 py-1.5 rounded-full font-black text-[9px] uppercase tracking-[0.3em] border border-white/5 italic">
                      <Zap size={10} /> NODE_{s._id.slice(-6).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-8 text-slate-500">
                    <span className="flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest italic"><Calendar size={16} className="text-emerald-500"/> {new Date(s.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex items-center gap-3 text-[10px] md:text-xs font-black uppercase tracking-widest italic"><Clock size={16} className="text-emerald-500"/> {s.duration || "45"} MINS</span>
                  </div>
                </div>
              </div>

              {/* ACTION HANDSHAKE */}
              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 w-full xl:w-auto">
                {s.recordingUrl ? (
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <button 
                      onClick={() => setActivePlayback(s)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-4 px-12 py-6 bg-white text-black rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-3xl italic"
                    >
                      <PlayCircle size={22} strokeWidth={2.5}/> Launch Playback
                    </button>
                    <button
                      onClick={() => window.open(`${import.meta.env.VITE_API_URL?.replace("/api","") || 'http://localhost:5000'}/${s.recordingUrl}`, '_blank')}
                      className="p-6 bg-slate-900 text-slate-400 hover:text-white rounded-[1.8rem] border-2 border-slate-800 transition-all hover:border-emerald-500/40 shadow-xl group/dl"
                      title="Fetch Archive Node"
                    >
                      <Download size={24} className="group-hover/dl:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-8 py-5 border-2 border-dashed border-slate-800 rounded-[2rem] bg-slate-950/20">
                    <div className="w-2.5 h-2.5 bg-slate-700 rounded-full animate-pulse"></div>
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-[0.4em] italic">Dossier_In_Sync...</span>
                  </div>
                )}
                <ChevronRight size={28} className="hidden xl:block text-slate-800 group-hover:translate-x-3 transition-transform duration-500 group-hover:text-emerald-500/40" />
              </div>
            </div>
          ))
        ) : (
          <div className="py-48 text-center border-4 border-dashed border-slate-900 rounded-[5rem] group hover:border-emerald-500/20 transition-all flex flex-col items-center justify-center gap-10 opacity-30">
            <History className="text-slate-800 group-hover:rotate-[-45deg] transition-transform duration-1000" size={100} strokeWidth={1} />
            <div className="space-y-4">
                <h4 className="text-3xl md:text-5xl font-black text-slate-700 uppercase tracking-[0.5em] italic leading-none">Archive Isolated</h4>
                <p className="text-slate-800 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Buffer clear: No neural recordings detected in this node instance.</p>
            </div>
          </div>
        )}
      </div>

      {/* 🎬 NEURAL PLAYBACK OVERLAY */}
      {activePlayback && (
        <div className="fixed inset-0 z-[250] bg-[#020617]/98 backdrop-blur-3xl flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-500">
           <div className="max-w-6xl w-full bg-[#020617] rounded-[4rem] border-2 border-white/5 shadow-[0_0_150px_rgba(16,185,129,0.2)] relative overflow-hidden animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center p-10 border-b-2 border-slate-900 bg-slate-950/40">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Neural Playback</h3>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.4em] italic">Instance_ID: {activePlayback._id.slice(-10).toUpperCase()}</p>
                  </div>
                  <button onClick={() => setActivePlayback(null)} className="p-4 bg-slate-900 rounded-2xl text-slate-500 hover:text-white transition-all hover:rotate-90 active:scale-90 shadow-inner">
                     <X size={28} />
                  </button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent"></div>
                  {/* Neural stream source would be mapped here */}
                  <div className="flex flex-col items-center gap-8 relative z-10">
                    <PlayCircle size={100} strokeWidth={1} className="text-emerald-500/20 animate-pulse" />
                    <p className="text-emerald-500/40 font-black uppercase tracking-[1.5em] text-xs italic text-center ml-[1.5em]">Establishing_Signal_Link</p>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* 🏛️ SYSTEM FOOTER METADATA */}
      <div className="pt-12 border-t-2 border-slate-900 flex justify-between items-center opacity-30">
        <span className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] italic">ARCHIVE_INSTANCE: ASIA_PAC_NODE_01</span>
        <div className="flex items-center gap-4">
           <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
           <span className="text-[9px] md:text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] italic">Auto_Purge_Protocol: DEACTIVATED</span>
        </div>
      </div>
    </div>
  );
}

export default SessionHistory;