import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Settings as SettingsIcon, Sliders, Building2, Bell } from 'lucide-react';

export default function AdminSettings() {
  const toast = useToast();
  const [threshold, setThreshold] = useState(60);
  const [departments, setDepartments] = useState(['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL']);
  const [newDept, setNewDept] = useState('');
  const [notifications, setNotifications] = useState({ email: true, weekly: true, alerts: true });

  const handleSave = () => toast.success('Settings saved successfully');

  const addDept = () => {
    if (newDept.trim() && !departments.includes(newDept.trim().toUpperCase())) {
      setDepartments([...departments, newDept.trim().toUpperCase()]);
      setNewDept('');
      toast.success('Department added');
    }
  };

  const removeDept = (dept) => {
    setDepartments(departments.filter(d => d !== dept));
    toast.info(`${dept} removed`);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Settings</h1>
        <p className="text-sm text-surface-500 mt-0.5">Configure institutional settings</p>
      </div>

      {/* Readiness threshold */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 text-base font-heading font-semibold text-ink mb-4">
          <Sliders className="w-5 h-5 text-primary-600" /> Readiness Threshold
        </h2>
        <p className="text-sm text-surface-500 mb-4">
          Students below this threshold are flagged as "Needs Training" and appear in the At-Risk list.
        </p>
        <div className="flex items-center gap-4">
          <input
            type="range" min="40" max="80" value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className="flex-1 accent-primary-600"
          />
          <div className="w-16 text-center">
            <span className="text-xl font-heading font-bold text-ink">{threshold}%</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-surface-400 mt-1">
          <span>40%</span>
          <span>60%</span>
          <span>80%</span>
        </div>
      </div>

      {/* Department management */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 text-base font-heading font-semibold text-ink mb-4">
          <Building2 className="w-5 h-5 text-primary-600" /> Department List
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {departments.map(d => (
            <span key={d} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-100 rounded-lg text-sm font-medium text-ink">
              {d}
              <button onClick={() => removeDept(d)} className="text-surface-400 hover:text-danger-500">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="Add department..."
            value={newDept}
            onChange={e => setNewDept(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addDept()}
          />
          <button onClick={addDept} className="btn-secondary text-sm">Add</button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h2 className="flex items-center gap-2 text-base font-heading font-semibold text-ink mb-4">
          <Bell className="w-5 h-5 text-primary-600" /> Notifications
        </h2>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email notifications for placement updates' },
            { key: 'weekly', label: 'Weekly analytics digest' },
            { key: 'alerts', label: 'At-risk student alerts' },
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

      <button onClick={handleSave} className="btn-primary">Save Settings</button>
    </div>
  );
}
