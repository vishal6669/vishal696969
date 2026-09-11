import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, Target, Brain, BarChart3,
  Compass, Map, Briefcase, Settings, LogOut, Menu, X, ChevronRight, Calendar
} from 'lucide-react';
import { useState } from 'react';
import PlacementAssistant from '../components/PlacementAssistant';
import UnifiedHeader from '../components/UnifiedHeader';

const NAV_ITEMS = [
  { to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: 'interview-scheduler', label: 'Interview Scheduler', icon: Calendar },
  { to: 'portfolio', label: 'My Portfolio', icon: User },
  { to: 'profile', label: 'My Profile', icon: User },
  { to: 'prediction', label: 'Placement Prediction', icon: Target },
  { to: 'explainable', label: 'Explainable AI', icon: Brain },
  { to: 'skills', label: 'Skill Analysis', icon: BarChart3 },
  { to: 'career-tracks', label: 'Career Tracks', icon: Compass },
  { to: 'roadmap', label: 'My Roadmap', icon: Map },
  { to: 'placement-status', label: 'Placement Status', icon: Briefcase },
  { to: 'settings', label: 'Settings', icon: Settings },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const currentStudId = studentId || user?.id || 'STU1001';
  const basePath = studentId ? `/student/${studentId}` : '/student';

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <UnifiedHeader currentRole="student" activeStudentId={currentStudId} />
      <div className="flex-1 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white border-r border-surface-200
        flex flex-col
        transform transition-transform duration-200 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-heading font-bold text-ink">AI Placement</h1>
              <p className="text-[10px] text-surface-500 font-medium">Student Portal</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={`${basePath}/${item.to}`}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-surface-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
              {(user?.name || 'S')[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate">{user?.name || 'Student'}</p>
              <p className="text-xs text-surface-500">{user?.id || 'STU1001'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link w-full mt-1 text-danger-500 hover:text-danger-600 hover:bg-danger-50">
            <LogOut className="w-[18px] h-[18px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-surface-200">
          <div className="flex items-center gap-4 px-4 lg:px-8 h-14">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-surface-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-1 text-sm text-surface-500">
              <span>Student Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-ink font-medium">{user?.name || 'Dashboard'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 animate-fade-in">
          <Outlet />
        </main>

        {/* Global Floating AI Placement Assistant */}
        <PlacementAssistant studentId={currentStudId} />
      </div>
    </div>
  </div>
);
}
