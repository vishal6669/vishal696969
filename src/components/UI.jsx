// Shared small components used across pages

export function StatusBadge({ status }) {
  const cls = {
    Ready: 'badge-ready',
    'Near-Ready': 'badge-near-ready',
    'Needs Training': 'badge-needs-training',
  }[status] || 'badge-needs-training'

  const dot = {
    Ready: 'bg-emerald-400',
    'Near-Ready': 'bg-amber-400',
    'Needs Training': 'bg-rose-400',
  }[status] || 'bg-rose-400'

  return (
    <span className={cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      {status}
    </span>
  )
}

export function LoadingSpinner({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
      <div className="w-10 h-10 rounded-full border-2 border-violet-600/30 border-t-violet-500 animate-spin" />
      <p className="text-slate-400 text-sm">{text}</p>
    </div>
  )
}

export function ErrorState({ message }) {
  return (
    <div className="glass-card p-8 text-center animate-fade-in">
      <div className="text-4xl mb-3">⚠️</div>
      <p className="text-rose-400 font-medium">{message}</p>
      <p className="text-slate-500 text-sm mt-1">Check that the backend is running on port 8000</p>
    </div>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-8 animate-slide-up">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
      {children}
    </div>
  )
}

export function StatCard({ label, value, sub, color = 'text-white' }) {
  return (
    <div className="stat-card animate-slide-up">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${color}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  )
}

export function GapStatusIcon({ status }) {
  return <span className="text-lg">{status}</span>
}
