import { useState, useEffect } from 'react'
import { getSkillHeatmap } from '../../api/client'
import { LoadingSpinner, ErrorState, PageHeader } from '../../components/UI'
import { Flame } from 'lucide-react'

function getColor(pct) {
  if (pct >= 70) return { bg: 'rgba(239,68,68,0.6)', text: 'text-white font-bold' }
  if (pct >= 50) return { bg: 'rgba(239,68,68,0.35)', text: 'text-rose-200' }
  if (pct >= 30) return { bg: 'rgba(245,158,11,0.3)', text: 'text-amber-200' }
  if (pct >= 15) return { bg: 'rgba(245,158,11,0.15)', text: 'text-amber-300/80' }
  return { bg: 'rgba(16,185,129,0.12)', text: 'text-emerald-400/80' }
}

export default function SkillHeatmap() {
  const [heatmap, setHeatmap] = useState(null)
  const [groupBy, setGroupBy] = useState('department')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getSkillHeatmap(groupBy)
      .then(r => setHeatmap(r.data))
      .catch(() => setError('Failed to load heatmap'))
      .finally(() => setLoading(false))
  }, [groupBy])

  if (loading) return <LoadingSpinner text="Building heatmap…" />
  if (error) return <ErrorState message={error} />

  const items = heatmap?.heatmap || []
  const groups = [...new Set(items.map(i => i.group))]
  const skills = [...new Set(items.map(i => i.skill))]

  // Build lookup
  const lookup = {}
  items.forEach(i => { lookup[`${i.group}__${i.skill}`] = i })

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="Skill Proficiency Heatmap"
        subtitle={`Percentage of students scoring below ${heatmap?.threshold || 60}/100 per skill`}
      />

      {/* Group toggle */}
      <div className="glass-card p-4 flex items-center gap-4">
        <span className="text-xs text-slate-500 uppercase tracking-wide">Group by:</span>
        <div className="flex gap-2">
          {['department', 'semester'].map(g => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                groupBy === g
                  ? 'bg-violet-600/40 border-violet-500/60 text-white'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {g === 'department' ? 'Department' : 'Semester'}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header sticky left-0 z-10" style={{ background: 'rgba(15,14,32,0.95)' }}>
                  {groupBy === 'department' ? 'Dept' : 'Semester'}
                </th>
                {skills.map(skill => (
                  <th key={skill} className="table-header text-center whitespace-nowrap">
                    <div className="transform -rotate-0 text-[10px]">{skill}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map(group => (
                <tr key={group} className="border-b border-white/5">
                  <td className="table-cell font-semibold text-white sticky left-0 z-10"
                      style={{ background: 'rgba(15,14,32,0.95)' }}>
                    {group}
                  </td>
                  {skills.map(skill => {
                    const cell = lookup[`${group}__${skill}`]
                    const pct = cell?.pct_below_threshold ?? 0
                    const { bg, text } = getColor(pct)
                    return (
                      <td key={skill} className="px-2 py-2.5 text-center transition-all duration-300"
                          style={{ background: bg, minWidth: 60 }}>
                        <div className={`text-xs font-semibold ${text}`}>{pct.toFixed(0)}%</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">avg {cell?.avg_score?.toFixed(0) ?? '—'}</div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded" style={{ background: 'rgba(16,185,129,0.12)' }} /> &lt;15% lacking
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded" style={{ background: 'rgba(245,158,11,0.15)' }} /> 15–30%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded" style={{ background: 'rgba(245,158,11,0.3)' }} /> 30–50%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded" style={{ background: 'rgba(239,68,68,0.35)' }} /> 50–70%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded" style={{ background: 'rgba(239,68,68,0.6)' }} /> &gt;70% <Flame size={11} className="text-rose-500" />
          </span>
        </div>
      </div>
    </div>
  )
}
