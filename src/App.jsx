import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Auth & Protection
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleSelectLogin from './pages/auth/RoleSelectLogin';

// Pages
import Landing from './pages/Landing';
import UnifiedMasterDashboard from './pages/UnifiedMasterDashboard';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentPortfolio from './pages/student/StudentPortfolio';
import InterviewScheduler from './pages/student/InterviewScheduler';
import Profile from './pages/student/Profile';
import PlacementPrediction from './pages/student/PlacementPrediction';
import ExplainableAI from './pages/student/ExplainableAI';
import SkillAnalysis from './pages/student/SkillAnalysis';
import CareerTracks from './pages/student/CareerTracks';
import Roadmap from './pages/student/Roadmap';
import PlacementStatus from './pages/student/PlacementStatus';
import StudentSettings from './pages/student/Settings';

// TPO / Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import Students from './pages/admin/Students';
import StudentPortfolios from './pages/admin/StudentPortfolios';
import Companies from './pages/admin/Companies';
import PlacementAnalytics from './pages/admin/PlacementAnalytics';
import DeptAnalytics from './pages/admin/DeptAnalytics';
import SkillHeatmap from './pages/admin/SkillHeatmap';
import AtRisk from './pages/admin/AtRisk';
import Reports from './pages/admin/Reports';
import DataUpload from './pages/admin/DataUpload';
import AdminSettings from './pages/admin/Settings';

import ErrorBoundary from './components/ErrorBoundary';

// Root Route Handler
function RootRouteHandler() {
  const { user } = useAuth();
  if (!user) return <RoleSelectLogin />;
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/tpo/dashboard" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Routes>
            {/* Login & Role Selection */}
            <Route path="/" element={<RootRouteHandler />} />
            <Route path="/login" element={<RoleSelectLogin />} />
            <Route path="/login/student" element={<RoleSelectLogin />} />
            <Route path="/login/admin" element={<RoleSelectLogin />} />
            <Route path="/hub" element={<UnifiedMasterDashboard />} />
            <Route path="/welcome" element={<Landing />} />

            {/* STRICT STUDENT PORTAL (Protected for Student Role Only) */}
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="interview-scheduler" element={<InterviewScheduler />} />
              <Route path="portfolio" element={<StudentPortfolio />} />
              <Route path="profile" element={<Profile />} />
              <Route path="prediction" element={<PlacementPrediction />} />
              <Route path="explainable" element={<ExplainableAI />} />
              <Route path="skills" element={<SkillAnalysis />} />
              <Route path="career-tracks" element={<CareerTracks />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="placement-status" element={<PlacementStatus />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

            {/* Legacy Student Route Compatibility */}
            <Route
              path="/student/:studentId/*"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="interview-scheduler" element={<InterviewScheduler />} />
              <Route path="portfolio" element={<StudentPortfolio />} />
              <Route path="profile" element={<Profile />} />
              <Route path="prediction" element={<PlacementPrediction />} />
              <Route path="explainable" element={<ExplainableAI />} />
              <Route path="skills" element={<SkillAnalysis />} />
              <Route path="career-tracks" element={<CareerTracks />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="placement-status" element={<PlacementStatus />} />
              <Route path="settings" element={<StudentSettings />} />
            </Route>

            {/* STRICT TPO PORTAL (Protected for TPO / Admin Role Only) */}
            <Route
              path="/tpo"
              element={
                <ProtectedRoute allowedRole="tpo">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="portfolios" element={<StudentPortfolios />} />
              <Route path="companies" element={<Companies />} />
              <Route path="placement-analytics" element={<PlacementAnalytics />} />
              <Route path="analytics" element={<PlacementAnalytics />} />
              <Route path="dept-analytics" element={<DeptAnalytics />} />
              <Route path="skill-heatmap" element={<SkillHeatmap />} />
              <Route path="at-risk" element={<AtRisk />} />
              <Route path="eligible" element={<AtRisk />} />
              <Route path="reports" element={<Reports />} />
              <Route path="data-upload" element={<DataUpload />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Admin Alias Route */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRole="tpo">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="portfolios" element={<StudentPortfolios />} />
              <Route path="companies" element={<Companies />} />
              <Route path="placement-analytics" element={<PlacementAnalytics />} />
              <Route path="analytics" element={<PlacementAnalytics />} />
              <Route path="dept-analytics" element={<DeptAnalytics />} />
              <Route path="skill-heatmap" element={<SkillHeatmap />} />
              <Route path="at-risk" element={<AtRisk />} />
              <Route path="reports" element={<Reports />} />
              <Route path="data-upload" element={<DataUpload />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}
