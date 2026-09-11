import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Shield, Users, Building2, TrendingUp, Bot, Sparkles, ChevronDown, UserCheck, LogOut
} from 'lucide-react';
import { useState } from 'react';
import mockData from '../data/mockData';

export default function UnifiedHeader({ currentRole = 'student', activeStudentId = 'STU1001' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const students = mockData.getStudents ? mockData.getStudents() : [];
  const currentStudent = students.find(s => s.student_id === activeStudentId) || students[0];

  const isStudentPortal = location.pathname.startsWith('/student') || (user && user.role === 'student');

  const handleHeaderLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4 text-xs font-medium">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-full text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isStudentPortal ? 'Student Placement Portal' : 'TPO Admin Management Portal'}</span>
          </div>
        </div>

        {/* Center: Navigation Links (Strictly Filtered by Role) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
          {isStudentPortal ? (
            /* Student Portal Status Bar - ONLY Student Related Info */
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student Profile: <strong className="text-white">{currentStudent?.name || user?.name || 'Rahul Kumar'}</strong> ({activeStudentId || user?.id || 'STU1001'})</span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold ml-2">
                {currentStudent?.placement_probability || 82}% Readiness
              </span>
            </div>
          ) : (
            /* TPO Portal Header - TPO Navigation Links */
            <>
              <button
                onClick={() => navigate('/tpo/dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${location.pathname.includes('/dashboard') ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>TPO Dashboard</span>
              </button>

              <button
                onClick={() => navigate('/tpo/students')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${location.pathname.includes('/students') ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Students Directory</span>
              </button>

              <button
                onClick={() => navigate('/tpo/portfolios')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${location.pathname.includes('/portfolios') ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Student Portfolios</span>
              </button>

              <button
                onClick={() => navigate('/tpo/companies')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${location.pathname.includes('/companies') ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Company Cutoffs</span>
              </button>

              <button
                onClick={() => navigate('/tpo/analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${location.pathname.includes('/analytics') ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </>
          )}
        </div>

        {/* Right: AI Placement Assistant Widget Trigger & Logout */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('open-placement-assistant'));
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition shadow-sm font-semibold text-[11px]"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Placement Assistant</span>
          </button>

          <button
            onClick={handleHeaderLogout}
            className="flex items-center gap-1 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition text-[11px] font-semibold border border-slate-700 hover:border-rose-500"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
