/**
 * ============================================================
 * 🌓 TITAN VISUAL ENGINE TOGGLE (v4.2 - Production)
 * Ref: Report Section 3.7 (UX Customization & Telemetry)
 * Purpose: Secure theme-mode switching with real-time feedback.
 * ============================================================
 */

import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Sun, Moon, Sparkles, Zap } from "lucide-react";

function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="flex items-center gap-4 bg-slate-950/60 p-2 rounded-[1.5rem] border-2 border-white/5 backdrop-blur-3xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] group transition-all duration-700 hover:border-blue-500/20 shrink-0">
      
      {/* 🌓 NEURAL SWITCH CORE */}
      <button
        onClick={toggleTheme}
        className="relative flex items-center group/btn active:scale-90 transition-transform duration-300 focus:outline-none"
        aria-label={`Switch to ${theme === "dark" ? "Solar" : "Midnight"} Interface`}
        title={`Engage ${theme === "dark" ? "Solar" : "Midnight"} Protocol`}
      >
        <div className="relative w-14 h-8 md:w-16 md:h-9 bg-slate-900 rounded-full border-2 border-slate-800 transition-all duration-700 overflow-hidden shadow-inner">
          
          {/* 🌌 Dynamic Atmospheric Pulse */}
          <div 
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              theme === "dark" 
              ? "bg-blue-600/20 opacity-100" 
              : "bg-yellow-500/20 opacity-100"
            }`}
          >
            {/* Subtle Binary Particles */}
            <div className={`absolute inset-0 opacity-30 ${theme === 'dark' ? 'animate-pulse' : 'animate-reverse-spin'}`}>
               <div className="absolute top-1 left-4 w-1 h-1 bg-white rounded-full blur-[1px]"></div>
               <div className="absolute bottom-2 right-5 w-1 h-1 bg-white rounded-full blur-[1px]"></div>
            </div>
          </div>

          {/* 🕹️ Sliding Engine Knob Node */}
          <div 
            className={`absolute top-0.5 md:top-0.5 w-6 h-6 md:w-7 md:h-7 rounded-xl flex items-center justify-center transition-all duration-700 cubic-bezier(0.68, -0.6, 0.32, 1.6) shadow-2xl ${
              theme === "dark" 
              ? "left-7 md:left-8 bg-blue-600 shadow-blue-600/50 rotate-0" 
              : "left-0.5 md:left-0.5 bg-yellow-500 shadow-yellow-500/50 rotate-[360deg]"
            }`}
          >
            <div className="md:scale-100 scale-75 drop-shadow-md">
              {theme === "dark" ? (
                <Moon size={16} className="text-white fill-white" />
              ) : (
                <Sun size={16} className="text-white fill-white" />
              )}
            </div>
          </div>
        </div>
      </button>

      {/* 📡 ENGINE STATUS FEEDBACK (Desktop Only) */}
      <div className="hidden lg:flex flex-col pr-4 select-none border-l border-white/5 pl-4">
        <span className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em] leading-none mb-2">
          Engine_Status
        </span>
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className={`absolute inset-0 blur-md rounded-full animate-ping ${theme === 'dark' ? 'bg-blue-500/40' : 'bg-yellow-500/40'}`}></div>
             <div className={`w-1.5 h-1.5 rounded-full relative ${theme === 'dark' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-700 italic ${
            theme === 'dark' ? 'text-blue-500' : 'text-yellow-500'
          }`}>
            {theme === "dark" ? "Midnight_Core" : "Solar_Core"}
          </span>
          <Sparkles size={12} className={`transition-all duration-700 ${
            theme === 'dark' ? 'text-blue-600 rotate-12 scale-110' : 'text-yellow-500 rotate-0 scale-100'
          }`} />
        </div>
      </div>

    </div>
  );
}

export default ThemeToggle;