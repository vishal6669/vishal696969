import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudents, uploadCSV } from '../api/client'
import { Search, Upload, ChevronRight, GraduationCap, Sparkles } from 'lucide-react'
import { LoadingSpinner, ErrorState, StatusBadge } from '../components/UI'

const HERO_STUDENTS = [
  { id: 'STU0598', name: 'Alex Chen', dept: 'CSE', note: 'High coder, no internships' },
  { id: 'STU0599', name: 'Priya Sharma', dept: 'ISE', note: 'Strong comms, weak SQL/Python' },
  { id: 'STU0600', name: 'Rohan Mehta', dept: 'ECE', note: 'All-rounder, Cloud/DevOps ready' },
]

export default function StudentSelect() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getStudents({ limit: 600 })
      .then(r => setStudents(r.data))
      .catch(e => setError('Cannot reach backend. Is it running?'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  )

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadCSV(file)
      setUploadMsg(`✓ Inserted ${res.data.inserted} students (${res.data.skipped} skipped)`)
      const r = await getStudents({ limit: 600 })
      setStudents(r.data)
    } catch {
      setUploadMsg('✗ Upload failed. Check file format.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <div className="glass-card p-8 mb-8 text-center"
           style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(99,102,241,0.08))' }}>
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-brand-600
                          flex items-center justify-center shadow-xl shadow-violet-500/30">
            <Sparkles size={28} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">
          Career Readiness <span className="text-gradient">Intelligence</span>
        </h1>
        <p className="text-slate-400 text-lg mb-1">
          <span className="text-violet-400 font-semibold">Predict</span> →{' '}
          <span className="text-violet-400 font-semibold">Explain</span> →{' '}
          <span className="text-violet-400 font-semibold">Improve</span>
        </p>
        <p className="text-slate-500 text-sm">Select a student to view their placement intelligence report</p>
      </div>

      {/* Hero demo students */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Sparkles size={14} /> Demo Students
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HERO_STUDENTS.map(s => (
            <button
              key={s.id}
              onClick={() => navigate(`/student/${s.id}/predict`)}
              className="glass-card-hover p-5 text-left group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-white group-hover:text-violet-300 transition-colors">{s.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.id} · {s.dept}</div>
                  <div className="text-xs text-violet-400 mt-2 italic">"{s.note}"</div>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-violet-400 mt-1 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search + Upload */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="student-search"
            className="input-field pl-9"
            placeholder="Search by name, ID, or department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <label className="btn-secondary cursor-pointer">
          <Upload size={15} />
          {uploading ? 'Uploading…' : 'Upload CSV'}
          <input type="file" accept=".csv" className="hidden" onChange={handleUpload} />
        </label>
      </div>
      {uploadMsg && (
        <div className={`text-sm mb-4 px-4 py-2 rounded-lg ${uploadMsg.startsWith('✓') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {uploadMsg}
        </div>
      )}

      {/* Student list */}
      {loading ? <LoadingSpinner text="Loading students…" />
       : error ? <ErrorState message={error} />
       : (
        <div className="glass-card overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-500">{filtered.length} students</span>
          </div>
          <div className="overflow-auto max-h-[480px]">
            <table className="w-full">
              <thead className="sticky top-0" style={{ background: 'rgba(15,14,32,0.9)' }}>
                <tr>
                  {['Student ID', 'Name', 'Department', 'Semester', 'CGPA', ''].map(h => (
                    <th key={h} className="table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 100).map(s => (
                  <tr key={s.student_id} className="table-row cursor-pointer"
                      onClick={() => navigate(`/student/${s.student_id}/predict`)}>
                    <td className="table-cell font-mono text-violet-400">{s.student_id}</td>
                    <td className="table-cell font-medium text-white">{s.name}</td>
                    <td className="table-cell">
                      <span className="px-2 py-0.5 rounded bg-brand-800/50 text-brand-300 text-xs">{s.department}</span>
                    </td>
                    <td className="table-cell">Sem {s.semester}</td>
                    <td className="table-cell">
                      <span className={s.cgpa >= 8 ? 'text-emerald-400' : s.cgpa >= 6 ? 'text-amber-400' : 'text-rose-400'}>
                        {s.cgpa?.toFixed(2)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <ChevronRight size={14} className="text-slate-600" />
                    </td>
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
