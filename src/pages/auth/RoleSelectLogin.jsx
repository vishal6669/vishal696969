import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Target, Users, Shield, ArrowRight, Lock, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

export default function RoleSelectLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginAsStudent, loginAsAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'tpo'
  const [idInput, setIdInput] = useState('STU1001');
  const [passwordInput, setPasswordInput] = useState('student123');
  const [errorMessage, setErrorMessage] = useState(
    searchParams.get('disabled') ? 'Your student portal access has been disabled by TPO.' : ''
  );
  const [loading, setLoading] = useState(false);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setErrorMessage('');
    if (tab === 'student') {
      setIdInput('STU1001');
      setPasswordInput('student123');
    } else {
      setIdInput('admin');
      setPasswordInput('admin123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const roleToLogin = activeTab === 'tpo' ? 'admin' : 'student';
    const result = await login(idInput, passwordInput, roleToLogin);

    setLoading(false);
    if (result.success) {
      if (activeTab === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/tpo/dashboard');
      }
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleQuickDemoStudent = (sId) => {
    loginAsStudent(sId);
    navigate('/student/dashboard');
  };

  const handleQuickDemoTPO = () => {
    loginAsAdmin();
    navigate('/tpo/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Branding Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600 text-white shadow-md mb-3">
          <Target className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-ink">AI Placement Portal</h2>
        <p className="mt-1 text-sm text-surface-500 font-medium">Select your portal role to log in</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-surface-200/50 rounded-2xl border border-surface-200 sm:px-10">
          
          {/* Dual Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-surface-100 p-1.5 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleTabSwitch('student')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'student'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-surface-600 hover:text-ink'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('tpo')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-heading font-bold transition-all ${
                activeTab === 'tpo'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-surface-600 hover:text-ink'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>TPO / Admin</span>
            </button>
          </div>

          {/* Role Header Banner */}
          <div className={`p-3 rounded-xl mb-5 flex items-center gap-3 text-xs font-medium border ${
            activeTab === 'student' 
              ? 'bg-primary-50 text-primary-700 border-primary-200' 
              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
          }`}>
            {activeTab === 'student' ? (
              <>
                <Users className="w-4 h-4 text-primary-600 shrink-0" />
                <span>Student Access: Manage your placement portfolio, track readiness & apply for interviews.</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>TPO Access: Institutional placement management, student profiles & company cutoffs.</span>
              </>
            )}
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-xl text-xs text-danger-700 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">
                {activeTab === 'student' ? 'Student ID / USN' : 'TPO Admin ID'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                  placeholder={activeTab === 'student' ? 'e.g. STU1001' : 'e.g. admin'}
                  className="input-field pl-9 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
                  {activeTab === 'student' ? <Users className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-surface-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-9 text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-surface-400">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn py-3 text-sm font-semibold rounded-xl text-white shadow-md flex items-center justify-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-200'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {loading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <span>Sign In as {activeTab === 'student' ? 'Student' : 'TPO'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-surface-100">
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>One-Click Demo Access</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoStudent('STU1001')}
                className="p-2 bg-surface-50 hover:bg-surface-100 border border-surface-200 rounded-lg text-left text-xs transition"
              >
                <div className="font-semibold text-ink">Rahul (CSE)</div>
                <div className="text-[10px] text-surface-500">Student • STU1001</div>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoTPO}
                className="p-2 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-lg text-left text-xs transition text-indigo-950"
              >
                <div className="font-semibold text-indigo-900">Dr. Rajesh Kumar</div>
                <div className="text-[10px] text-indigo-600">TPO Officer • Admin</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
