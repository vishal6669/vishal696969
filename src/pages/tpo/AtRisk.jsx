import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAtRisk } from '../../api/client'
import { LoadingSpinner, ErrorState, PageHeader, StatusBadge } from '../../components/UI'
import { AlertTriangle, SlidersHorizontal, Search, ChevronRight } from 'lucide-react'

const DEPARTMENTS = ['All', 'CSE', 'ISE', 'ECE', 'MECH']

export default function AtRisk() {
  const [students, setStudents] = useState([])
  const [threshold, setThreshold] = useState(60)
  const [dept, setDept] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('placement_probability')
  const [sortAsc, setSortAsc] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getAtRisk(threshold, dept === 'All' ? undefined : dept)
      .then(r => setStudents(r.data.students))
      .catch(() => setError('Failed to load at-risk students'))
      .finally(() => setLoading(false))
  }, [threshold, dept])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.toLowerCase().includes(search.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    const va = a[sortBy] ?? 0
    const vb = b[sortBy] ?? 0
    return sortAsc ? va - vb : vb - va
  })

  const handleSort = (col) => {
    if (sortBy === col) setSortAsc(!sortAsc)
    else { setSortBy(col); setSortAsc(true) }
  }

  const SortHeader = ({ col, children }) => (
    <th className="table-header cursor-pointer hover:text-violet-400 transition-colors select-none"
        onClick={() => handleSort(col)}>
      <div className="flex items-center gap-1">
        {children}
        {sortBy === col && <span className="text-violet-400">{sortAsc ? '↑' : '↓'}</span>}
      </div>
    </th>
  )

  return (
    <div className="animate-fade-in space-y-6">
      <PageHeader
        title="At-Risk Students"
        subtitle="Students below placement readiness threshold requiring intervention"
      />

      {/* Controls */}
      <div className="glass-card p-5 space-y-4">
        {/* Threshold Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400 flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-violet-400" />
              Risk Threshold
            </span>
            <span className="text-sm font-bold text-violet-300">{threshold}%</span>
          </div>
          <input
            id="risk-threshold"
            type="range"
            min={20} max={90} step={5}
            value={threshold}
            onChange={e => setThreshold(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #7c3aed ${((threshold - 20) / 70) * 100}%, rgba(255,255,255,0.1) 0%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-600 mt-1">
            <span>20%</span><span>90%</span>
          </div>
        </div>

        {/* Dept filter + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            {DEPARTMENTS.map(d => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  dept === d
                    ? 'bg-violet-600/40 border-violet-500/60 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              className="input-field pl-8 py-1.5 text-xs"
              placeholder="Search by name or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Count badge */}
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} className="text-rose-400" />
        <span className="text-sm text-slate-400">
          <span className="text-rose-400 font-bold">{sorted.length}</span> students below {threshold}% threshold
        </span>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner text="Filtering at-risk students…" />
       : error ? <ErrorState message={error} />
       : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-auto max-h-[520px]">
            <table className="w-full">
              <thead className="sticky top-0" style={{ background: 'rgba(15,14,32,0.95)' }}>
                <tr>
                  <SortHeader col="student_id">ID</SortHeader>
                  <SortHeader col="name">Name</SortHeader>
                  <SortHeader col="department">Dept</SortHeader>
                  <SortHeader col="semester">Sem</SortHeader>
                  <SortHeader col="placement_probability">Probability</SortHeader>
                  <th className="table-header">Status</th>
                  <SortHeader col="cgpa">CGPA</SortHeader>
                  <SortHeader col="coding_score">Coding</SortHeader>
                  <th className="table-header"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => (
                  <tr key={s.student_id} className="table-row cursor-pointer"
                      onClick={() => navigate(`/student/${s.student_id}/predict`)}>
                    <td className="table-cell font-mono text-violet-400 text-xs">{s.student_id}</td>
                    <td className="table-cell font-medium text-white">{s.name}</td>
                    <td className="table-cell">
                      <span className="px-2 py-0.5 rounded bg-brand-800/50 text-brand-300 text-xs">{s.department}</span>
                    </td>
                    <td className="table-cell text-slate-400">{s.semester}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-rose-500 transition-all"
                               style={{ width: `${s.placement_probability}%` }} />
                        </div>
                        <span className="text-rose-400 font-bold text-xs">{s.placement_probability.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="table-cell"><StatusBadge status={s.status} /></td>
                    <td className="table-cell text-sm">{s.cgpa?.toFixed(2)}</td>
                    <td className="table-cell text-sm">{s.coding_score?.toFixed(0)}</td>
                    <td className="table-cell"><ChevronRight size={14} className="text-slate-600" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
