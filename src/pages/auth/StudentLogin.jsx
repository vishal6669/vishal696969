import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Target, Eye, EyeOff } from 'lucide-react';

export default function StudentLogin() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabledError, setDisabledError] = useState('');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabledError('');
    if (!studentId.trim() || !password.trim()) {
      toast.error('Please enter both Student ID and Password');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = await login(studentId.trim(), password, 'student');
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back! Redirecting to dashboard...');
      setTimeout(() => navigate(`/student/${studentId.trim().toUpperCase()}/dashboard`), 250);
    } else {
      if (result.disabled) {
        setDisabledError(result.error);
        toast.error('Access Disabled: Contact Training & Placement Office');
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-primary-600 mb-8 transition-colors">
          ← Back to home
        </Link>

        <div className="card p-8 shadow-card-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-ink">Student Login</h1>
            <p className="text-sm text-surface-500 mt-1">Access your placement readiness dashboard</p>
          </div>

          {disabledError && (
            <div className="mb-6 p-4 rounded-xl bg-danger-50 border border-danger-200 text-left animate-slide-up">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-danger-100 flex items-center justify-center flex-shrink-0 text-danger-600 font-bold text-sm">
                  !
                </div>
                <div>
                  <h3 className="text-sm font-bold text-danger-800">Access Disabled</h3>
                  <p className="text-xs text-danger-700 mt-1 leading-relaxed">{disabledError}</p>
                  <div className="mt-2.5 pt-2.5 border-t border-danger-200/60 text-[11px] text-danger-600">
                    <strong>TPO Helpdesk:</strong> tpo@sapthagiri.edu.in | Block B, Room 204
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-ink mb-1.5">
                Student ID / Register Number
              </label>
              <input
                id="studentId"
                type="text"
                className="input-field"
                placeholder="e.g. STU1001"
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-surface-600">Remember me</span>
              </label>
              <button type="button" className="text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-primary-50 rounded-lg border border-primary-100">
            <p className="text-xs text-primary-700 font-medium">Demo credentials</p>
            <p className="text-xs text-primary-600 mt-0.5">Student ID: <code className="font-mono bg-primary-100 px-1 rounded">STU1001</code> | Password: <code className="font-mono bg-primary-100 px-1 rounded">student123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
