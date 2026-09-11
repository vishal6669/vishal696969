import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { getRoadmap } from '../api/client'
import { LoadingSpinner, ErrorState, PageHeader } from '../components/UI'
import { CheckCircle2, Clock, ChevronDown, ChevronUp, Target } from 'lucide-react'

const TRACKS = ['Full-Stack Developer', 'Data Analyst', 'Cloud/DevOps Engineer', 'QA Specialist']

const PHASE_COLORS = [
  { bg: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/30', badge: 'bg-rose-500/20 text-rose-400', dot: 'bg-rose-500' },
  { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400', dot: 'bg-amber-500' },
  { bg: 'from-sky-500/20 to-sky-600/10', border: 'border-sky-500/30', badge: 'bg-sky-500/20 text-sky-400', dot: 'bg-sky-500' },
  { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-400', dot: 'bg-emerald-500' },
]

function PhaseCard({ phase, title, duration_weeks, tasks, colorScheme, delay }) {
  const [open, setOpen] = useState(true)
  const [checked, setChecked] = useState(new Set())
  const c = colorScheme

  return (
    <div
      className={`glass-card border ${c.border} bg-gradient-to-br ${c.bg} animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        className="w-full flex items-center justify-between p-5"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${c.dot} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
            {phase}
          </div>
          <div className="text-left">
            <div className="font-semibold text-white">{title}</div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <Clock size={11} />
              {duration_weeks} week{duration_weeks !== 1 ? 's' : ''}
              <span className="mx-1">·</span>
              {checked.size}/{tasks.length} done
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>Phase {phase}</span>
          {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-2 border-t border-white/5 pt-3">
          {tasks.map((task, i) => (
            <label key={i} className="flex items-start gap-3 cursor-pointer group">
              <button
                className="mt-0.5 shrink-0"
                onClick={() => {
                  const next = new Set(checked)
                  if (next.has(i)) next.delete(i); else next.add(i)
                  setChecked(next)
                }}
              >
                {checked.has(i)
                  ? <CheckCircle2 size={18} className="text-emerald-400" />
                  : <div className="w-[18px] h-[18px] rounded-full border-2 border-white/20 group-hover:border-violet-400 transition-colors" />
                }
              </button>
              <span className={`text-sm transition-all ${checked.has(i) ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                {task}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Roadmap() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const initialTrack = searchParams.get('track') || TRACKS[0]
  const [selectedTrack, setSelectedTrack] = useState(initialTrack)
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getRoadmap(id, selectedTrack)
      .then(r => setRoadmap(r.data))
      .catch(() => setError('Failed to load roadmap'))
      .finally(() => setLoading(false))
  }, [id, selectedTrack])

  const totalWeeks = roadmap?.roadmap?.reduce((s, p) => s + p.duration_weeks, 0) || 0

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader title="Improvement Roadmap" subtitle="Phased action plan to close skill gaps and achieve placement readiness" />

      {/* Track selector */}
      <div className="glass-card p-4">
        <div className="text-xs text-slate-500 mb-3 uppercase tracking-wide">Target Career Track</div>
        <div className="flex flex-wrap gap-2">
          {TRACKS.map(track => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
                selectedTrack === track
                  ? 'bg-violet-600/40 border-violet-500/60 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <Target size={13} />
              {track}
            </button>
          ))}
        </div>
      </div>

      {/* Total duration */}
      {!loading && roadmap && (
        <div className="glass-card p-4 flex items-center gap-4">
          <Clock size={20} className="text-violet-400" />
          <div>
            <div className="text-white font-semibold">Total duration: {totalWeeks} weeks</div>
            <div className="text-xs text-slate-500">{roadmap.roadmap.length} phases · {roadmap.track}</div>
          </div>
        </div>
      )}

      {loading ? <LoadingSpinner text="Generating roadmap…" />
       : error ? <ErrorState message={error} />
       : (
        <div className="space-y-4">
          {roadmap.roadmap.map((phase, i) => (
            <PhaseCard
              key={phase.phase}
              {...phase}
              colorScheme={PHASE_COLORS[i % PHASE_COLORS.length]}
              delay={i * 100}
            />
          ))}
        </div>
      )}
    </div>
  )
}
