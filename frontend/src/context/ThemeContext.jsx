/**
 * ============================================================
 * 🌓 TITAN THEME ENGINE (v4.2 - Production)
 * Ref: Report Section 3.7 (UI/UX Engineering)
 * Purpose: Global theme state and system-level color sync.
 * ============================================================
 */

import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 🛰️ Initial State: Logic for Persistence + System Preference
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("avcp_theme_pref");
      if (saved) return saved;
      
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return systemPreference ? "dark" : "light";
    } catch (e) {
      // Default to 'dark' for the premium TITAN institutional feel
      return "dark"; 
    }
  });

  // 🔄 Optimized Handshake Toggle
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // 🎨 Global DOM Calibration
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Smooth transition for browser UI elements
    root.style.colorScheme = theme;

    // 📱 Meta-tag Calibration for Mobile Viewports
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#020617" : "#ffffff");
    }
    
    // Persistent Storage Node
    localStorage.setItem("avcp_theme_pref", theme);
  }, [theme]);

  // 📡 Real-time System Telemetry Sync
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      // Sync with system only if the user hasn't locked a manual preference
      if (!localStorage.getItem("avcp_theme_pref")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Performance Cluster
  const value = useMemo(() => ({ 
    theme, 
    toggleTheme,
    isDarkMode: theme === "dark"
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {/* 🌌 Neural Layout Wrapper */}
      <div className={`theme-engine ${theme} min-h-screen transition-all duration-700 ease-in-out bg-transparent`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};