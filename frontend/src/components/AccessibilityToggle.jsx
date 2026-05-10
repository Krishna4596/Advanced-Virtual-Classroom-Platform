/**
 * ============================================================
 * 🛠️ TITAN INCLUSION HUB (Accessibility Controls)
 * Ref: Report Section 3.3.1 (UX & Inclusion)
 * Purpose: Global font scaling, theme toggle, and contrast management.
 * ============================================================
 */

import React, { useContext, useEffect } from "react";
import { AccessibilityContext } from "../context/AccessibilityContext";
import { ThemeContext } from "../context/ThemeContext";
import { 
  Eye, 
  Type, 
  Moon, 
  Sun, 
  Settings, 
  ChevronRight 
} from "lucide-react";

const AccessibilityToggle = () => {
  // 🛰️ Global State Extraction
  const { fontSize, setFontSize, highContrast, setHighContrast } = useContext(AccessibilityContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const increaseFont = () => setFontSize(prev => Math.min(prev + 2, 24));
  const decreaseFont = () => setFontSize(prev => Math.max(prev - 2, 12));

  // 🧠 Effect to apply changes globally to the document node
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [fontSize, highContrast]);

  return (
    <div className="glass p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl animate-fade-in max-w-xs">
      
      {/* 🛠️ Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10">
          <Settings size={20} />
        </div>
        <div>
          <h2 className="text-white font-black uppercase tracking-tighter text-lg">Inclusion Hub</h2>
          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Accessibility Engine v4.2</p>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* 🌗 Theme Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3">
            <div className="text-blue-400">{theme === 'dark' ? <Moon size={18}/> : <Sun size={18}/>}</div>
            <span className="text-xs font-bold text-slate-300">Visual Theme</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="w-12 h-6 bg-slate-800 rounded-full relative transition-all shadow-inner"
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${theme === 'dark' ? 'right-1 bg-blue-500' : 'left-1 bg-slate-500'}`}></div>
          </button>
        </div>

        {/* 🔍 Font Size Control */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3">
            <div className="text-purple-400"><Type size={18}/></div>
            <span className="text-xs font-bold text-slate-300">Text Scaling</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={decreaseFont} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-bold hover:bg-slate-700 text-slate-300 transition-colors">-</button>
            <span className="text-[10px] font-black w-10 text-center text-white">{fontSize}px</span>
            <button onClick={increaseFont} className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-bold hover:bg-slate-700 text-slate-300 transition-colors">+</button>
          </div>
        </div>

        {/* 👁️ High Contrast Mode */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center gap-3">
            <div className="text-emerald-400"><Eye size={18}/></div>
            <span className="text-xs font-bold text-slate-300">High Contrast</span>
          </div>
          <button 
            onClick={() => setHighContrast(!highContrast)}
            className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all duration-300 ${highContrast ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}
          >
            {highContrast ? "Active" : "Enable"}
          </button>
        </div>

      </div>

      {/* 💡 Footer Note */}
      <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center gap-2 text-[9px] font-bold text-slate-600">
        <ChevronRight size={12}/> Syncing telemetry to user profile...
      </div>
    </div>
  );
};

export default AccessibilityToggle;