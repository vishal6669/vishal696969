import { useState } from 'react';
import UnifiedHeader from '../components/UnifiedHeader';
import StudentDashboard from './student/Dashboard';
import AdminDashboard from './admin/Dashboard';
import Students from './admin/Students';
import Companies from './admin/Companies';
import PlacementAnalytics from './admin/PlacementAnalytics';
import PlacementAssistant from '../components/PlacementAssistant';
import { LayoutDashboard, Shield, Users, Building2, TrendingUp, Sparkles } from 'lucide-react';

export default function UnifiedMasterDashboard() {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'admin' | 'students' | 'companies' | 'analytics'
  const [activeStudentId, setActiveStudentId] = useState('STU1001');

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans">
      {/* Top Header Switcher */}
      <UnifiedHeader currentRole={activeTab} activeStudentId={activeStudentId} />

      {/* Main Tab Controller Bar */}
      <div className="bg-white border-b border-surface-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-heading font-bold text-ink">AI Placement Hub</h1>
              <p className="text-[10px] text-surface-500 font-medium">All Dashboards Unified • Single Localhost View</p>
            </div>
          </div>

          {/* Tab Selection Switcher */}
          <div className="flex items-center gap-1 bg-surface-100 p-1 rounded-xl text-xs font-semibold text-surface-600">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'student' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'hover:text-ink'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>🎓 Student Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'admin' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'hover:text-ink'}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>🛡️ TPO Admin Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'students' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'hover:text-ink'}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>👥 Student Management</span>
            </button>

            <button
              onClick={() => setActiveTab('companies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'companies' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'hover:text-ink'}`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>🏢 Company Cutoffs</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'hover:text-ink'}`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>📊 Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Render Body */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
        {activeTab === 'student' && <StudentDashboard />}
        {activeTab === 'admin' && <AdminDashboard />}
        {activeTab === 'students' && <Students />}
        {activeTab === 'companies' && <Companies />}
        {activeTab === 'analytics' && <PlacementAnalytics />}
      </main>

      {/* Global AI Placement Assistant Chatbot Drawer */}
      <PlacementAssistant studentId={activeStudentId} />
    </div>
  );
}
