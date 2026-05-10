/**
 * ============================================================
 * 🛰️ TITAN SYSTEM NAVIGATION HUB (v4.3 - Liquid UI)
 * Ref: Report Section 3.7 (Accessibility & Global State)
 * Fixed: Fluid Paddings, Mobile-Optimized Touch Targets,
 * Adaptive Avatars, and Scalable Action Buttons.
 * ============================================================
 */

import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { 
  Sun, 
  Moon, 
  LogOut, 
  ShieldCheck, 
  Bell,
  Cpu,
  Zap
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { highContrast } = useContext(AccessibilityContext);

  // 🛰️ Theme Configuration Matrix
  const activeStyles = highContrast 
    ? { bg: 'bg-black', border: 'border-yellow-500', text: 'text-yellow-500', accent: 'bg-yellow-500 text-black' }
    : { bg: 'bg-[#020617]/80', border: 'border-white/5', text: 'text-white', accent: 'bg-blue-600 text-white' };

  return (
    // 🔥 FIX: Adjusted paddings for mobile (px-4 py-3 on small screens)
    <nav className={`sticky top-0 z-[150] border-b-2 px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 flex justify-between items-center transition-all duration-500 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${activeStyles.bg} ${activeStyles.border}`}>
      
      {/* 🚀 1. BRAND IDENTITY NODE */}
      <Link to="/" className="flex items-center gap-2 sm:gap-3 md:gap-5 group shrink-0 min-w-0">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl md:rounded-[1.5rem] flex items-center justify-center font-black text-xl sm:text-2xl md:text-3xl shadow-2xl transition-all duration-500 shrink-0 ${activeStyles.accent} ${!highContrast && 'shadow-blue-600/30 group-hover:rotate-12 sm:group-hover:scale-110'}`}>
          V
        </div>
        {/* Hide text on very small screens, show on sm and above */}
        <div className="hidden sm:flex flex-col min-w-0">
          <h1 className={`text-xl md:text-3xl font-black tracking-tighter uppercase italic leading-none truncate ${activeStyles.text}`}>AVCP</h1>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
             <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse shrink-0 ${highContrast ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
             <span className={`text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-widest sm:tracking-[0.4em] md:tracking-[0.5em] italic truncate ${highContrast ? 'text-yellow-500' : 'text-blue-500/60'}`}>Neural_Link</span>
          </div>
        </div>
      </Link>

      {/* 🛠️ 2. SYSTEM CONTROLS & USER HUB */}
      <div className="flex items-center gap-2 sm:gap-4 md:gap-8 shrink-0">
        
        {/* ⚡ Status Indicators - Desktop Telemetry */}
        {user && (
          <div className="hidden xl:flex items-center gap-6 mr-4 border-r-2 border-white/5 pr-8">
             <div className={`flex items-center gap-3 px-5 py-2.5 bg-slate-950/50 border-2 rounded-xl shadow-inner ${activeStyles.border}`}>
               <Cpu size={16} className={`${highContrast ? 'text-yellow-500' : 'text-blue-500'} animate-spin-slow`} />
               <span className={`text-[10px] font-black uppercase tracking-widest italic ${highContrast ? 'text-yellow-500' : 'text-slate-400'}`}>Core_Active</span>
             </div>
             <button className="text-slate-500 hover:text-blue-500 transition-all relative group">
               <Bell size={24} strokeWidth={2.5} className="group-hover:animate-bounce" />
               <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border-2 border-[#020617] shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
             </button>
          </div>
        )}

        {/* Theme Engine Handshake */}
        {/* 🔥 FIX: Touch target size optimized for mobile (p-2.5 -> p-4) */}
        <button 
          onClick={toggleTheme} 
          className={`p-2.5 sm:p-3 md:p-4 border-2 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] transition-all duration-300 active:scale-90 flex items-center justify-center shrink-0 ${
            highContrast ? 'bg-black border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-blue-500 hover:border-blue-500/30'
          }`}
        >
          {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
            {/* Identity Node */}
            <div 
              className={`flex items-center gap-2 sm:gap-3 md:gap-5 group cursor-pointer bg-slate-950/40 p-1 md:p-2 md:pl-6 rounded-2xl md:rounded-[2rem] border-2 border-transparent transition-all duration-500 ${!highContrast && 'hover:border-blue-600/30 hover:bg-slate-900/60'}`} 
              onClick={() => navigate(`/${user.role}`)}
            >
              <div className="text-right hidden lg:block">
                <p className={`text-sm md:text-base font-black uppercase tracking-tighter leading-none ${activeStyles.text}`}>{user.name}</p>
                <div className="flex items-center justify-end gap-2 mt-1.5">
                  <ShieldCheck size={12} className={highContrast ? 'text-yellow-500' : 'text-blue-500'} />
                  <p className="text-[8px] uppercase tracking-[0.2em] text-slate-500 font-black italic">{user.role} Instance</p>
                </div>
              </div>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl md:text-2xl shadow-xl border border-white/10 group-hover:scale-105 transition-all duration-500 shrink-0 ${activeStyles.accent}`}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>

            {/* Logout Protocol */}
            <button 
              onClick={() => { logout(); navigate("/login"); }} 
              className={`p-2.5 sm:p-3 md:p-5 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] transition-all duration-300 border active:scale-95 group flex items-center justify-center shrink-0 ${
                highContrast ? 'bg-black border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black' : 'bg-red-600/10 border-red-500/10 text-red-500 hover:bg-red-600 hover:text-white shadow-lg shadow-red-600/5'
              }`}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" strokeWidth={3} />
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className={`px-4 sm:px-6 md:px-12 py-2.5 sm:py-3 md:py-5 rounded-xl sm:rounded-full md:rounded-[2rem] font-black text-[9px] sm:text-[10px] md:text-sm uppercase tracking-widest sm:tracking-[0.2em] md:tracking-[0.4em] transition-all active:scale-95 shadow-xl flex items-center gap-2 sm:gap-3 shrink-0 ${
              highContrast ? 'bg-yellow-500 text-black' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            }`}
          >
            <Zap className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" /> <span className="hidden sm:inline">Access_Node</span><span className="sm:hidden">Access</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;