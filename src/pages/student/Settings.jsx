import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Settings as SettingsIcon, Bell, Lock, User } from 'lucide-react';
import { useState } from 'react';

export default function StudentSettings() {
  const { user } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState({ email: true, sms: false, placement: true });

  const handleSave = () => toast.success('Settings saved successfully');

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Settings</h1>
        <p className="text-sm text-surface-500 mt-0.5">Manage your account preferences</p>
      </div>

      {/* Account */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 text-base font-heading font-semibold text-ink mb-4">
          <User className="w-5 h-5 text-primary-600" /> Account
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Name</label>
            <input className="input-field" defaultValue={user?.name || ''} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Student ID</label>
            <input className="input-field bg-surface-50" value={user?.id || ''} disabled />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 text-base font-heading font-semibold text-ink mb-4">
          <Bell className="w-5 h-5 text-primary-600" /> Notifications
        </h2>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email notifications' },
            { key: 'sms', label: 'SMS notifications' },
            { key: 'placement', label: 'Placement drive alerts' },
          ].map(n => (
            <label key={n.key} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg cursor-pointer">
              <span className="text-sm text-ink">{n.label}</span>
              <input
                type="checkbox"
                checked={notifications[n.key]}
                onChange={e => setNotifications(prev => ({ ...prev, [n.key]: e.target.checked }))}
                className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Password */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 text-base font-heading font-semibold text-ink mb-4">
          <Lock className="w-5 h-5 text-primary-600" /> Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Current Password</label>
            <input type="password" className="input-field" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">New Password</label>
            <input type="password" className="input-field" placeholder="Enter new password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Confirm New Password</label>
            <input type="password" className="input-field" placeholder="Confirm new password" />
          </div>
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary">Save Settings</button>
    </div>
  );
}
