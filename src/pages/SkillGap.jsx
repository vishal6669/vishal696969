import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getSkillGap } from '../api/client'
import { LoadingSpinner, ErrorState, PageHeader } from '../components/UI'
import RadarChart from '../components/RadarChart'
import { Map } from 'lucide-react'

const TRACKS = ['Full-Stack Developer', 'Data Analyst', 'Cloud/DevOps Engineer', 'QA Specialist']

function GapRow({ skill, current, required, gap, status, status_label }) {
  const pct = Math.min(100, (current / required) * 100)
  return (
    <tr className="table-row">
      <td className="table-cell font-medium text-white">{skill}</td>
      <td className="table-cell">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: gap <= 0 ? '#10b981' : gap <= 20 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
          <span className={`text-sm font-bold w-10 text-right ${
            gap <= 0 ? 'text-emerald-400' : gap <= 20 ? 'text-amber-400' : 'text-rose-400'
          }`}>{current?.toFixed(0)}</span>
        </div>
      </td>
      <td className="table-cell text-slate-400">{required}</td>
      <td className="table-cell">
        <span className={`font-semibold ${gap <= 0 ? 'text-emerald-400' : gap <= 20 ? 'text-amber-400' : 'text-rose-400'}`}>
          {gap <= 0 ? '+' + Math.abs(gap).toFixed(0) : '-' + gap.toFixed(0)}
        </span>
      </td>
      <td className="table-cell">
        <span className="text-lg">{status}</span>
      </td>
    </tr>
  )
}

export default function SkillGap() {
  const { id } = useParams()
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0])
  const [gapData, setGapData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getSkillGap(id, selectedTrack)
      .then(r => setGapData(r.data))
      .catch(() => setError('Failed to load skill gap data'))
      .finally(() => setLoading(false))
  }, [id, selectedTrack])

  const radarData = gapData?.gaps.map(g => ({
    skill: g.skill.split(' ')[0], // shorten for radar
    current: g.current,
    required: g.required,
  })) || []

  const metCount = gapData?.gaps.filter(g => g.gap <= 0).length || 0
  const totalCount = gapData?.gaps.length || 1

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Skill Gap Analysis" subtitle="Compare your current skills against career track requirements">
        <div className="flex gap-3 mt-4">
          <Link to={`/student/${id}/roadmap?track=${encodeURIComponent(selectedTrack)}`} className="btn-primary">
            <Map size={14} /> View Roadmap
          </Link>
        </div>
      </PageHeader>

      {/* Track Selector */}
      <div className="glass-card p-4">
        <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide">Select Career Track</div>
        <div className="flex flex-wrap gap-2">
          {TRACKS.map(track => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                selectedTrack === track
                  ? 'bg-violet-600/40 border-violet-500/60 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner text="Analyzing skill gaps…" />
       : error ? <ErrorState message={error} />
       : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{metCount}</div>
              <div className="text-xs text-slate-500 mt-1">Skills Met</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-rose-400">{totalCount - metCount}</div>
              <div className="text-xs text-slate-500 mt-1">Gaps to Close</div>
            </div>
            <div className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-violet-400">{Math.round(metCount / totalCount * 100)}%</div>
              <div className="text-xs text-slate-500 mt-1">Track Readiness</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="glass-card p-6">
              <h2 className="font-semibold text-white mb-4">Skills Radar</h2>
              <RadarChart data={radarData} />
            </div>

            {/* Gap Table */}
            <div className="glass-card overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="font-semibold text-white">Detailed Gap Breakdown</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedTrack}</p>
              </div>
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {['Skill', 'Your Score', 'Required', 'Gap', 'Status'].map(h => (
                        <th key={h} className="table-header">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gapData.gaps.map(g => <GapRow key={g.skill} {...g} />)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
