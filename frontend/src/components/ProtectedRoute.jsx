/**
 * ============================================================
 * 🛡️ TITAN PROTECTED ROUTE (v4.2 - Production)
 * Ref: Report Section 3.3.4 (Security Architecture)
 * Purpose: Role-based access control (RBAC) & session validation.
 * ============================================================
 */

import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ShieldAlert, Zap } from "lucide-react";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 🌀 NEURAL AUTH HANDSHAKE: Verifying identity in background
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -z-10"></div>
        
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-slate-900 rounded-2xl shadow-inner"></div>
          <div className="absolute inset-0 border-4 border-blue-500 rounded-2xl border-t-transparent animate-spin shadow-[0_0_20px_rgba(37,99,235,0.3)]"></div>
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
                <Zap size={14} className="text-blue-500 animate-pulse" />
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] italic">
                  Establishing Neural Link
                </p>
            </div>
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">
                Protocol: SSL_Access_Verified
            </p>
        </div>
      </div>
    );
  }

  // 🛡️ REDIRECT PROTOCOL: No session detected
  if (!user) {
    console.info("⚠️ Redirecting to Auth Node: No active session.");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🔐 ROLE AUTHORIZATION HUB: Support for RBAC (Role Based Access Control)
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(user.role)) {
      console.error(`🛑 ACCESS_DENIED: Instance role '${user.role}' unauthorized for node '${location.pathname}'.`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // ✅ HANDSHAKE SUCCESSFUL: Rendering Protected Node
  return children;
};

export default ProtectedRoute;