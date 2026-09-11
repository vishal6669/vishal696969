import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Target, Eye, EyeOff, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminId.trim() || !password.trim()) {
      toast.error('Please enter both Admin ID and Password');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = await login(adminId.trim(), password, 'admin');
    setLoading(false);
    if (result.success) {
      toast.success('Welcome! Redirecting to admin dashboard...');
      setTimeout(() => navigate('/admin/dashboard'), 300);
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-surface-500 hover:text-primary-600 mb-8 transition-colors">
          ← Back to home
        </Link>

        <div className="card p-8 shadow-card-lg">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-secondary-500 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-ink">Admin / TPO Login</h1>
            <p className="text-sm text-surface-500 mt-1">Institutional placement analytics portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="adminId" className="block text-sm font-medium text-ink mb-1.5">Admin ID</label>
              <input
                id="adminId"
                type="text"
                className="input-field"
                placeholder="Enter admin ID"
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">Password</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-base bg-secondary-500 text-white hover:bg-secondary-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in to Admin Portal'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-secondary-50 rounded-lg border border-secondary-100">
            <p className="text-xs text-secondary-700 font-medium">Demo credentials</p>
            <p className="text-xs text-secondary-600 mt-0.5">Admin ID: <code className="font-mono bg-secondary-100 px-1 rounded">admin</code> | Password: <code className="font-mono bg-secondary-100 px-1 rounded">admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
