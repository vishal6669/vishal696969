import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDeptSummary } from '../../api/client'
import { LoadingSpinner, ErrorState, PageHeader } from '../../components/UI'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { AlertTriangle, Flame, Lightbulb, Users, TrendingUp } from 'lucide-react'

const DEPT_COLORS = {
  CSE: '#7c3aed',
  ISE: '#6366f1',
  ECE: '#8b5cf6',
  MECH: '#a78bfa',
}

export default function TPODashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDeptSummary()
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load department summary'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Aggregating department data…" />
  if (error) return <ErrorState message={error} />

  const departments = data.departments || []
  const totalStudents = departments.reduce((s, d) => s + d.student_count, 0)
  const totalReady = departments.reduce((s, d) => s + d.ready_count, 0)
  const totalNeedsTraining = departments.reduce((s, d) => s + d.needs_training_count, 0)
  const overallAvg = departments.length
    ? (departments.reduce((s, d) => s + d.avg_probability, 0) / departments.length).toFixed(1)
    : 0

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="TPO Dashboard"
        subtitle="Identify → Analyze → Intervene · Department-level placement readiness analytics"
      >
        <div className="flex gap-3 mt-4">
          <Link to="/tpo/at-risk" className="btn-secondary"><AlertTriangle size={14} /> At-Risk</Link>
          <Link to="/tpo/heatmap" className="btn-secondary"><Flame size={14} /> Heatmap</Link>
          <Link to="/tpo/interventions" className="btn-primary"><Lightbulb size={14} /> Interventions</Link>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card animate-slide-up">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{totalStudents}</div>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="stat-label">Overall Readiness</div>
          <div className="stat-value text-gradient">{overallAvg}%</div>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="stat-label">Placement Ready</div>
          <div className="stat-value text-emerald-400">{totalReady}</div>
          <div className="text-xs text-slate-500">{((totalReady / totalStudents) * 100).toFixed(0)}% of total</div>
        </div>
        <div className="stat-card animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="stat-label">Needs Training</div>
          <div className="stat-value text-rose-400">{totalNeedsTraining}</div>
          <div className="text-xs text-slate-500">{((totalNeedsTraining / totalStudents) * 100).toFixed(0)}% of total</div>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="glass-card p-6">
        <h2 className="font-semibold text-white mb-1">Department Readiness</h2>
        <p className="text-xs text-slate-500 mb-6">Average placement probability by department</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={departments} layout="vertical" margin={{ left: 20 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }}
                   axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <YAxis type="category" dataKey="department" tick={{ fill: '#e2e8f0', fontSize: 13, fontWeight: 600 }}
                   axisLine={false} tickLine={false} width={60} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15,14,32,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', color: '#e2e8f0', fontSize: 12,
              }}
              formatter={(v) => [`${v.toFixed(1)}%`, 'Avg Readiness']}
            />
            <Bar dataKey="avg_probability" radius={[0, 6, 6, 0]} barSize={32}>
              {departments.map((d, i) => (
                <Cell key={d.department} fill={DEPT_COLORS[d.department] || '#6366f1'} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Department Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((d, i) => (
          <div key={d.department} className="glass-card-hover p-5 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold text-white">{d.department}</span>
              <span className="text-xs text-slate-500">{d.student_count} students</span>
            </div>
            <div className="space-y-2.5">
              {/* Ready */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ready
                </span>
                <span className="text-white font-semibold">{d.ready_count}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                     style={{ width: `${(d.ready_count / d.student_count) * 100}%` }} />
              </div>
              {/* Near-Ready */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Near-Ready
                </span>
                <span className="text-white font-semibold">{d.near_ready_count}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-700"
                     style={{ width: `${(d.near_ready_count / d.student_count) * 100}%` }} />
              </div>
              {/* Needs Training */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Needs Training
                </span>
                <span className="text-white font-semibold">{d.needs_training_count}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full transition-all duration-700"
                     style={{ width: `${(d.needs_training_count / d.student_count) * 100}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
