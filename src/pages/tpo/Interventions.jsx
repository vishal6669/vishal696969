import { useState, useEffect } from 'react'
import { getInterventions } from '../../api/client'
import { LoadingSpinner, ErrorState, PageHeader } from '../../components/UI'
import { Lightbulb, AlertCircle, ArrowRight, Users, BookOpen } from 'lucide-react'

export default function Interventions() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterDept, setFilterDept] = useState('All')

  useEffect(() => {
    getInterventions()
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load interventions'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner text="Generating intervention recommendations…" />
  if (error) return <ErrorState message={error} />

  const interventions = data?.interventions || []
  const allDepts = ['All', ...new Set(interventions.map(i => i.department))]
  const filtered = filterDept === 'All' ? interventions : interventions.filter(i => i.department === filterDept)

  const highCount = filtered.filter(i => i.priority === 'high').length
  const medCount = filtered.filter(i => i.priority === 'medium').length

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Intervention Recommendations"
        subtitle="AI-generated action items based on cohort skill gap analysis"
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="stat-label">Total Flags</div>
          <div className="stat-value text-violet-400">{filtered.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">High Priority</div>
          <div className="stat-value text-rose-400">{highCount}</div>
          <div className="text-xs text-slate-500">&gt;70% lacking proficiency</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Medium Priority</div>
          <div className="stat-value text-amber-400">{medCount}</div>
          <div className="text-xs text-slate-500">50–70% lacking proficiency</div>
        </div>
      </div>

      {/* Dept filter */}
      <div className="flex gap-2">
        {allDepts.map(d => (
          <button
            key={d}
            onClick={() => setFilterDept(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              filterDept === d
                ? 'bg-violet-600/40 border-violet-500/60 text-white'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Intervention cards */}
      <div className="space-y-4">
        {filtered.map((item, i) => {
          const isHigh = item.priority === 'high'
          return (
            <div
              key={`${item.department}-${item.semester}-${item.skill}`}
              className={`glass-card border ${isHigh ? 'border-rose-500/30' : 'border-amber-500/30'} p-5 animate-slide-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isHigh ? 'bg-rose-500/20' : 'bg-amber-500/20'
                }`}>
                  {isHigh ? <AlertCircle size={20} className="text-rose-400" /> : <Lightbulb size={20} className="text-amber-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      isHigh ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {isHigh ? 'HIGH' : 'MEDIUM'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.department} · Semester {item.semester}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-xs text-slate-400">
                      {item.skill}
                    </span>
                  </div>

                  {/* Recommendation */}
                  <p className="text-sm text-slate-300 mb-3">{item.recommendation}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {item.affected_students}/{item.cohort_size} students affected
                    </span>
                    <span className={`font-semibold ${isHigh ? 'text-rose-400' : 'text-amber-400'}`}>
                      {item.pct_lacking.toFixed(0)}% lacking proficiency
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${isHigh ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${item.pct_lacking}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <BookOpen size={32} className="text-emerald-400 mx-auto mb-3" />
            <div className="text-white font-semibold">No interventions needed!</div>
            <div className="text-xs text-slate-500 mt-1">All cohorts meet the proficiency threshold</div>
          </div>
        )}
      </div>
    </div>
  )
}
