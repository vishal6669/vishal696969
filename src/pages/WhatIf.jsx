import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getProfile, postWhatIf } from '../api/client'
import { LoadingSpinner, ErrorState, PageHeader, StatusBadge } from '../components/UI'
import { Sliders, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'

const ADJUSTABLE = [
  { key: 'coding_score', label: 'Coding Score', min: 0, max: 100, step: 1 },
  { key: 'aptitude_score', label: 'Aptitude Score', min: 0, max: 100, step: 1 },
  { key: 'communication_score', label: 'Communication', min: 0, max: 100, step: 1 },
  { key: 'cgpa', label: 'CGPA', min: 0, max: 10, step: 0.1 },
  { key: 'internships_count', label: 'Internships', min: 0, max: 5, step: 1 },
  { key: 'projects_count', label: 'Projects', min: 0, max: 10, step: 1 },
  { key: 'certifications_count', label: 'Certifications', min: 0, max: 8, step: 1 },
  { key: 'skill_python', label: 'Python Skill', min: 0, max: 100, step: 1 },
  { key: 'skill_sql', label: 'SQL Skill', min: 0, max: 100, step: 1 },
  { key: 'skill_javascript', label: 'JavaScript Skill', min: 0, max: 100, step: 1 },
  { key: 'skill_react', label: 'React Skill', min: 0, max: 100, step: 1 },
  { key: 'skill_cloud', label: 'Cloud Skills', min: 0, max: 100, step: 1 },
]

export default function WhatIf() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [overrides, setOverrides] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [simulating, setSimulating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProfile(id)
      .then(r => {
        setProfile(r.data)
        // Initialize overrides with current values
        const init = {}
        ADJUSTABLE.forEach(a => { init[a.key] = r.data[a.key] ?? 0 })
        setOverrides(init)
      })
      .catch(() => setError('Failed to load student profile'))
      .finally(() => setLoading(false))
  }, [id])

  const runSimulation = useCallback(async (newOverrides) => {
    setSimulating(true)
    try {
      const res = await postWhatIf(id, newOverrides)
      setResult(res.data)
    } catch {
      // silent
    } finally {
      setSimulating(false)
    }
  }, [id])

  // Debounce simulation on slider change
  useEffect(() => {
    if (!profile) return
    const timer = setTimeout(() => runSimulation(overrides), 400)
    return () => clearTimeout(timer)
  }, [overrides, profile])

  const handleChange = (key, val) => {
    setOverrides(prev => ({ ...prev, [key]: parseFloat(val) }))
  }

  const resetAll = () => {
    if (!profile) return
    const init = {}
    ADJUSTABLE.forEach(a => { init[a.key] = profile[a.key] ?? 0 })
    setOverrides(init)
    setResult(null)
  }

  if (loading) return <LoadingSpinner text="Loading profile…" />
  if (error) return <ErrorState message={error} />

  const delta = result?.delta ?? 0
  const newProb = result?.new_probability ?? null
  const baseProb = result?.base_probability ?? null

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="What-If Simulator"
        subtitle="Adjust any metric and instantly see how it changes placement probability"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="lg:col-span-2 glass-card p-6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-white flex items-center gap-2"><Sliders size={16} className="text-violet-400" /> Adjust Parameters</h2>
            <button onClick={resetAll} className="btn-secondary text-xs py-1.5 px-3">
              <RefreshCw size={12} /> Reset
            </button>
          </div>
          {ADJUSTABLE.map(({ key, label, min, max, step }) => {
            const base = profile[key] ?? 0
            const current = overrides[key] ?? base
            const changed = Math.abs(current - base) > 0.01
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-sm ${changed ? 'text-violet-300 font-medium' : 'text-slate-400'}`}>
                    {label}
                    {changed && <span className="ml-2 text-xs">(was {step < 1 ? base.toFixed(1) : Math.round(base)})</span>}
                  </span>
                  <span className={`text-sm font-bold ${changed ? 'text-violet-300' : 'text-slate-300'}`}>
                    {step < 1 ? current.toFixed(1) : Math.round(current)}
                    {max === 100 ? '/100' : max === 10 ? '/10' : ''}
                  </span>
                </div>
                <input
                  id={`slider-${key}`}
                  type="range"
                  min={min} max={max} step={step}
                  value={current}
                  onChange={e => handleChange(key, e.target.value)}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${changed ? '#7c3aed' : '#4f46e5'} ${((current - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 0%)`,
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* Result panel */}
        <div className="glass-card p-6 flex flex-col gap-6">
          <h2 className="font-semibold text-white">Simulated Result</h2>

          {/* Base */}
          <div className="glass-card p-4 text-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="text-xs text-slate-500 mb-1">Current Score</div>
            <div className="text-3xl font-extrabold text-slate-300">{baseProb?.toFixed(1) ?? '—'}%</div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            {delta > 0
              ? <TrendingUp size={28} className="text-emerald-400" />
              : delta < 0
              ? <TrendingDown size={28} className="text-rose-400" />
              : <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-slate-500 text-xs">→</div>
            }
          </div>

          {/* New */}
          <div className={`glass-card p-4 text-center border ${
            delta > 0 ? 'border-emerald-500/30' : delta < 0 ? 'border-rose-500/30' : 'border-white/10'
          }`}>
            <div className="text-xs text-slate-500 mb-1">Simulated Score</div>
            <div className={`text-4xl font-extrabold ${
              delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-slate-300'
            }`}>
              {simulating ? '…' : (newProb?.toFixed(1) ?? '—')}%
            </div>
            {result && (
              <div className={`text-sm font-semibold mt-2 ${delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                {delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`}
              </div>
            )}
          </div>

          {result && (
            <div className="text-center">
              <StatusBadge status={result.new_status} />
            </div>
          )}

          <p className="text-xs text-slate-600 text-center">
            Adjust sliders to instantly simulate how changes would affect placement probability
          </p>
        </div>
      </div>
    </div>
  )
}
