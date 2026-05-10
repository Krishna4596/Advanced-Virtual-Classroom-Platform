/**
 * ============================================================
 * 🛰️ AVCP NEURAL ASSEMBLY (v5.5 - Profile System Patch)
 * Upgraded: Added GlobalAssignments route for Teacher Task Hub.
 * Upgraded: Integrated Forgot/Reset Password Public Nodes.
 * Upgraded: Added Global Profile/Settings Route for all Nodes.
 * ============================================================
 */

import React, { useContext, Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// 🛡️ NEURAL PROVIDERS
import { AuthContext, AuthProvider } from "./context/AuthContext"; 
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { ThemeProvider } from "./context/ThemeContext"; 
import { GoogleOAuthProvider } from "@react-oauth/google";

// 🏗️ CORE ARCHITECTURE
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";

// ⚡ NEURAL CHUNKING (Code Splitting)
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const ParentDashboard = lazy(() => import("./pages/ParentDashboard"));
const ClassroomDetail = lazy(() => import("./pages/ClassroomDetail"));
const GlobalAssignments = lazy(() => import("./pages/GlobalAssignments"));
const AssignmentSubmissions = lazy(() => import("./pages/AssignmentSubmissions"));
const GlobalAnalytics = lazy(() => import("./pages/GlobalAnalytics"));
const VideoRoom = lazy(() => import("./components/VideoRoom"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Landing = lazy(() => import("./pages/Landing"));
const VerifyOTP = lazy(() => import("./pages/VerifyEmail"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

// 🔥 IMPORTS: Neural Key Recovery & Config Nodes
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile")); // 👈 NEW: Profile Component

// 🔥 FIXED IMPORTS: Grading & Attendance Nodes
const TeacherGrading = lazy(() => import("./pages/TeacherGrading"));
const TeacherAttendance = lazy(() => import("./pages/TeacherAttendance")); 
const ParentGrades = lazy(() => import("./pages/ParentGrades"));
const ParentAttendance = lazy(() => import("./pages/ParentAttendance")); 

// 📜 SCROLL_RECOVERY_PROTOCOL
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const dashboardPaths = ["/teacher", "/student", "/parent", "/grading-center", "/my-tasks", "/settings"];
    const isDashboard = dashboardPaths.some(path => pathname.startsWith(path));
    if (!isDashboard || window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);
  return null;
};

// 🛰️ DYNAMIC_ROLE_ROUTER
const RoleRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  const dashboardMap = { teacher: "/teacher", student: "/student", parent: "/parent" };
  return <Navigate to={dashboardMap[user.role] || "/unauthorized"} replace />;
};

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center p-12 text-center">
      <Loader />
      <p className="mt-10 text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] animate-pulse italic">
        Verifying_Identity_Dossier...
      </p>
    </div>
  );

  return (
    <Suspense fallback={<div className="h-screen w-screen bg-[#020617] flex items-center justify-center"><Loader /></div>}>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC_NODES */}
        <Route path="/" element={user ? <RoleRedirect /> : <Landing />} />
        <Route path="/login" element={user ? <RoleRedirect /> : <Login />} />
        <Route path="/register" element={user ? <RoleRedirect /> : <Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        
        {/* 🔥 Key Recovery Public Routes */}
        <Route path="/forgot-password" element={user ? <RoleRedirect /> : <ForgotPassword />} />
        <Route path="/reset-password/:token" element={user ? <RoleRedirect /> : <ResetPassword />} />
        
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* SECURE_VIDEO_LINK */}
        <Route path="/video-session/:roomId" element={
          <ProtectedRoute>
            <div className="h-screen w-screen bg-black fixed inset-0 z-[9999]">
                <VideoRoom />
            </div>
          </ProtectedRoute>
        } />

        {/* TEACHER_CLUSTER */}
        <Route path="/teacher/*" element={
          <ProtectedRoute role="teacher">
            <DashboardLayout>
              <Routes>
                <Route index element={<TeacherDashboard />} />
                <Route path="class/:id" element={<ClassroomDetail />} />
                <Route path="assignments" element={<GlobalAssignments />} />
                <Route path="assignment/:assignmentId/submissions" element={<AssignmentSubmissions />} />
                <Route path="analytics" element={<GlobalAnalytics />} />
                <Route path="attendance" element={<TeacherAttendance />} />
                <Route path="*" element={<Navigate to="/teacher" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* STUDENT_CLUSTER */}
        <Route path="/student/*" element={
          <ProtectedRoute role="student">
            <DashboardLayout>
              <Routes>
                <Route index element={<StudentDashboard />} />
                <Route path="class/:id" element={<ClassroomDetail />} />
                <Route path="*" element={<Navigate to="/student" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* PARENT_CLUSTER */}
        <Route path="/parent/*" element={
          <ProtectedRoute role="parent">
            <DashboardLayout>
              <Routes>
                <Route index element={<ParentDashboard />} />
                <Route path="attendance" element={<ParentAttendance />} />
                <Route path="grades" element={<ParentGrades />} /> 
                <Route path="*" element={<Navigate to="/parent" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* GLOBAL_TASKS_ENGINE */}
        <Route path="/grading-center" element={
          <ProtectedRoute role="teacher">
            <DashboardLayout><TeacherGrading /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/my-tasks" element={
          <ProtectedRoute role="student">
            <DashboardLayout><GlobalAssignments /></DashboardLayout>
          </ProtectedRoute>
        } />

        {/* 🔥 NEW: GLOBAL_CONFIG_NODE (Profile / Settings) - Accessible to all logged-in users */}
        <Route path="/settings" element={
          <ProtectedRoute>
            <DashboardLayout><Profile /></DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <AccessibilityProvider>
            <Router>
              <div className="min-h-screen bg-[#020617] font-sans antialiased text-slate-200 selection:bg-blue-600/40 overflow-x-hidden scroll-smooth">
                <AppRoutes />
              </div>
            </Router>
          </AccessibilityProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;