/**
 * ============================================================
 * 🏫 TITAN CLASS CLUSTER (v4.2 - Neural Grid)
 * Ref: Report Section 3.3.1 (Dashboard UI)
 * Purpose: Iterating through active subject nodes.
 * ============================================================
 */

import React from "react";
import ClassCard from "./ClassCard"; // Reuse the premium card we built
import { ShieldAlert, Zap } from "lucide-react";

function ClassList({ classes = [] }) {
  // 🛡️ Safety Handshake: Check if nodes exist
  if (!Array.isArray(classes) || classes.length === 0) {
    return (
      <div className="py-20 border-4 border-dashed border-slate-900 rounded-[4rem] flex flex-col items-center justify-center opacity-30 gap-6">
        <ShieldAlert size={60} className="text-slate-800" />
        <p className="text-slate-700 font-black uppercase text-2xl tracking-[0.5em] text-center">
          No Active Nodes Linked
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 📋 Cluster Header */}
      <div className="flex items-center gap-4 mb-10 px-4">
        <div className="w-2 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
            Your Neural Clusters
          </h2>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-2">
            Status: {classes.length} Nodes Operational
          </p>
        </div>
      </div>

      {/* 🏁 Grid Protocol */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {classes.map((cls) => (
          <ClassCard key={cls?._id} cls={cls} />
        ))}
      </div>

      {/* 🛰️ Footer Telemetry */}
      <div className="pt-10 border-t border-slate-800/50 flex justify-between items-center opacity-40">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-blue-500" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Syncing via TITAN_CORE_V4.2
          </span>
        </div>
        <div className="h-px flex-1 mx-10 bg-slate-800"></div>
      </div>
    </div>
  );
}

export default ClassList;