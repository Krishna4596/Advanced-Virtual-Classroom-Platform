/**
 * ============================================================
 * 🛡️ TITAN AUTHENTICATION ENGINE (v4.4 - Crash-Proof)
 * Ref: Report Section 3.3 (Security Architecture)
 * Fixed: Aggressive Ghost Token cleanup to prevent 500 loops.
 * ============================================================
 */

import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import API from "../api/api";
import { disconnectSocket } from "../socket/socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await API.get("/auth/me");
      const userData = res.data?.user || res.data?.data || res.data;
      
      if (userData && userData.role) {
        setUser(userData);
      } else {
        setUser(null);
        localStorage.removeItem("token"); 
      }
    } catch (err) {
      console.error("Neural Auth Sync Failed:", err);
      setUser(null);
      
      // 🔥 THE FIX: Koi bhi error aaye (401, 403, ya 500), token uड़ा do!
      // Ye system ko infinite crash loop se bachayega.
      localStorage.removeItem("token"); 
      
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (token, userData) => {
    if (token) localStorage.setItem("token", token);
    if (userData && userData.role) {
      setUser(userData);
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error("Session termination failed.");
    }
    disconnectSocket();
    localStorage.removeItem("token"); 
    setUser(null);
    window.location.href = "/login";
  };

  const value = useMemo(() => ({ 
    user, 
    login, 
    logout, 
    loading,
    checkAuth,
    isAuthenticated: !!user,
    role: user?.role || null 
  }), [user, loading, checkAuth]);

  // 🌀 NEURAL GATEWAY UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] font-sans relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="relative w-32 h-32 text-center">
          <div className="absolute inset-0 border-[8px] border-slate-900 rounded-[3rem] shadow-inner"></div>
          <div className="absolute inset-0 border-[8px] border-blue-600 rounded-[3rem] border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-blue-500 font-black text-5xl italic animate-pulse">V</div>
        </div>
        <p className="mt-10 text-white font-black text-xl uppercase tracking-[0.5em] italic">Neural Gateway Syncing...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};