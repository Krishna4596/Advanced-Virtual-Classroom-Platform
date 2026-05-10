/**
 * ============================================================
 * 👓 TITAN ACCESSIBILITY ENGINE (v4.2 - Production)
 * Ref: Report Section 3.7 (Inclusive Design Protocols)
 * Purpose: Global accessibility scaling and contrast management.
 * ============================================================
 */

import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";

export const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  // 🛰️ State Persistence Handshake
  const [highContrast, setHighContrast] = useState(() => 
    localStorage.getItem("avcp_high_contrast") === "true"
  );
  
  const [fontSize, setFontSize] = useState(() => 
    parseInt(localStorage.getItem("avcp_font_size")) || 100
  );

  const [screenReaderMode, setScreenReaderMode] = useState(() => 
    localStorage.getItem("avcp_screen_reader") === "true"
  );

  // 📐 Neural Interface Calibration
  useEffect(() => {
    const root = document.documentElement;
    
    // --- High Contrast Protocol ---
    if (highContrast) {
      root.classList.add("high-contrast");
      // Applying WCAG compliant colors (Yellow on Black)
      root.style.setProperty('--bg-dark', '#000000');
      root.style.setProperty('--accent-blue', '#ffff00');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--focus-ring', '4px solid #ffff00');
    } else {
      root.classList.remove("high-contrast");
      root.style.removeProperty('--bg-dark');
      root.style.removeProperty('--accent-blue');
      root.style.removeProperty('--text-primary');
      root.style.removeProperty('--focus-ring');
    }

    // --- Dynamic Scalability ---
    root.style.fontSize = `${fontSize}%`;

    // --- Node Persistence Sync ---
    localStorage.setItem("avcp_high_contrast", highContrast);
    localStorage.setItem("avcp_font_size", fontSize);
    localStorage.setItem("avcp_screen_reader", screenReaderMode);

  }, [highContrast, fontSize, screenReaderMode]);

  // 🛠️ Recovery Protocol
  const resetAccessibility = useCallback(() => {
    setHighContrast(false);
    setFontSize(100);
    setScreenReaderMode(false);
  }, []);

  const value = useMemo(() => ({
    highContrast, setHighContrast,
    fontSize, setFontSize,
    screenReaderMode, setScreenReaderMode,
    resetAccessibility
  }), [highContrast, fontSize, screenReaderMode, resetAccessibility]);

  return (
    <AccessibilityContext.Provider value={value}>
      <div 
        aria-live="polite"
        className={`min-h-screen transition-all duration-500 ${highContrast ? 'contrast-optimized bg-black' : ''}`}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};