import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPrediction, getExplanation } from '../api/client'
import { LoadingSpinner, ErrorState, PageHeader, StatusBadge } from '../components/UI'
import GaugeChart from '../components/GaugeChart'
import ShapBar from '../components/ShapBar'
import { BarChart3, Map, Sliders, Trophy, HelpCircle } from 'lucide-react'

function CareerMatchCard({ track, fit_pct, rank }) {
  const rankColors = ['text-amber-400', 'text-slate-400', 'text-orange-600']
  const rankLabels = ['1st', '2nd', '3rd', '4th']
  return (
    <div className="glass-card-hover p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="text-sm font-semibold text-white leading-tight">{track}</div>
        <span className={`text-xs font-bold ${rankColors[rank] || 'text-slate-500'}`}>
          #{rank + 1}
        </span>
      </div>
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
          style={{
            width: `${fit_pct}%`,
            background: fit_pct >= 75 ? 'linear-gradient(90deg,#10b981,#6ee7b7)'
              : fit_pct >= 50 ? 'linear-gradient(90deg,#f59e0b,#fcd34d)'
              : 'linear-gradient(90deg,#ef4444,#fca5a5)',
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Career fit</span>
        <span className={`text-lg font-extrabold ${
          fit_pct >= 75 ? 'text-emerald-400' : fit_pct >= 50 ? 'text-amber-400' : 'text-rose-400'
        }`}>{fit_pct}%</span>
      </div>
    </div>
  )
}

export default function PredictionDashboard() {
  const { id } = useParams()
  const [prediction, setPrediction] = useState(null)
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getPrediction(id), getExplanation(id)])
      .then(([pred, expl]) => {
        setPrediction(pred.data)
        setExplanation(expl.data.explanation)
      })
      .catch(() => setError('Failed to load prediction data'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Running ML model…" />
  if (error) return <ErrorState message={error} />

  return (
    <div className="animate-fade-in space-y-8">
      <PageHeader
        title="Placement Prediction"
        subtitle={`Student ${id} · AI-powered readiness analysis`}
      >
        <div className="flex gap-3 mt-4">
          <Link to={`/student/${id}/skill-gap`} className="btn-secondary">
            <BarChart3 size={14} /> Skill Gap
          </Link>
          <Link to={`/student/${id}/roadmap`} className="btn-secondary">
            <Map size={14} /> Roadmap
          </Link>
          <Link to={`/student/${id}/what-if`} className="btn-secondary">
            <Sliders size={14} /> What-If
          </Link>
        </div>
      </PageHeader>

      {/* Main prediction panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gauge */}
        <div className="glass-card p-8 flex flex-col items-center gap-4">
          <GaugeChart value={prediction.placement_probability} size={280} />
          <div className="flex flex-col items-center gap-2">
            <StatusBadge status={prediction.status} />
            <p className="text-xs text-slate-500 text-center max-w-56">
              {prediction.status === 'Ready'
                ? 'This student shows strong placement indicators across all dimensions.'
                : prediction.status === 'Near-Ready'
                ? 'A few targeted improvements could push this student into the Ready tier.'
                : 'Significant skill gaps identified — a structured training plan is recommended.'}
            </p>
          </div>
        </div>

        {/* Career Matches */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={16} className="text-violet-400" />
            <h2 className="font-semibold text-white">Best Career Track Matches</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prediction.top_career_matches.map((m, i) => (
              <CareerMatchCard key={m.track} {...m} rank={i} />
            ))}
          </div>
        </div>
      </div>

      {/* SHAP Explanation */}
      {explanation && explanation.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={16} className="text-violet-400" />
            <h2 className="font-semibold text-white">Why this score?</h2>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            AI-derived feature attributions — how each factor nudged the placement probability
          </p>
          <ShapBar data={explanation} />
        </div>
      )}
    </div>
  )
}
