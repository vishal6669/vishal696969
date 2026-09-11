import { useMemo, useState } from 'react';
import { mockData } from '../../data/mockData';
import { AlertTriangle, Eye, Search } from 'lucide-react';

const DEPARTMENTS = ['All', 'CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'];

export default function AtRisk() {
  const [threshold, setThreshold] = useState(60);
  const [deptFilter, setDeptFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const atRiskStudents = useMemo(() => {
    let result = mockData.getAtRiskStudents(threshold, deptFilter === 'All' ? null : deptFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q));
    }
    return result;
  }, [threshold, deptFilter, search]);

  if (selectedStudent) {
    const s = selectedStudent;
    const factors = mockData.getExplanation(s.student_id);
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedStudent(null)} className="btn-ghost text-sm">← Back to at-risk list</button>
        <div className="card p-6 readiness-bar-needs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-danger-100 flex items-center justify-center text-danger-600 font-heading font-bold text-lg">{s.name[0]}</div>
            <div>
              <h2 className="font-heading text-xl font-bold text-ink">{s.name}</h2>
              <p className="text-sm text-surface-500">{s.student_id} | {s.department} | Sem {s.semester}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-heading font-bold text-danger-600">{Math.round(s.placement_probability)}%</p>
              <p className="text-sm text-surface-500">Below threshold ({threshold}%)</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniStat label="CGPA" value={s.cgpa} />
          <MiniStat label="Coding" value={`${Math.round(s.coding_score)}%`} />
          <MiniStat label="Communication" value={`${Math.round(s.communication_score)}%`} />
          <MiniStat label="Aptitude" value={`${Math.round(s.aptitude_score)}%`} />
        </div>
        {factors.length > 0 && (
          <div className="card p-6">
            <h3 className="font-heading font-semibold text-ink mb-3">Key Issues</h3>
            <div className="space-y-2">
              {factors.filter(f => f.impact < 0).map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-danger-50 rounded-lg readiness-bar-needs">
                  <span className="text-sm text-ink flex-1">{f.factor}</span>
                  <span className="text-sm font-heading font-bold text-danger-600">{f.impact.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">At-Risk Students</h1>
        <p className="text-sm text-surface-500 mt-0.5">Students below the readiness threshold requiring intervention</p>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-3 flex-1">
            <label className="text-sm font-medium text-ink whitespace-nowrap">Threshold:</label>
            <input
              type="range" min="30" max="80" value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="flex-1 accent-primary-600"
            />
            <span className="text-sm font-heading font-bold text-ink w-10">{threshold}%</span>
          </div>
          <select className="select-field w-full sm:w-36" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Depts' : d}</option>)}
          </select>
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input className="input-field pl-9 text-sm" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card p-4 bg-danger-50 border border-danger-100 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-danger-600 shrink-0" />
        <p className="text-sm text-danger-800">
          <strong>{atRiskStudents.length}</strong> students are below the {threshold}% readiness threshold
        </p>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                <th className="table-header">Student</th>
                <th className="table-header">Dept</th>
                <th className="table-header">Sem</th>
                <th className="table-header">CGPA</th>
                <th className="table-header">Probability</th>
                <th className="table-header">Coding</th>
                <th className="table-header">Communication</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {atRiskStudents.map((s, i) => (
                <tr key={i} className="table-row readiness-bar-needs">
                  <td className="table-cell">
                    <div>
                      <p className="font-medium text-ink">{s.name}</p>
                      <p className="text-xs text-surface-500">{s.student_id}</p>
                    </div>
                  </td>
                  <td className="table-cell">{s.department}</td>
                  <td className="table-cell text-center">{s.semester}</td>
                  <td className="table-cell">{s.cgpa}</td>
                  <td className="table-cell">
                    <span className="font-heading font-bold text-danger-600">{Math.round(s.placement_probability)}%</span>
                  </td>
                  <td className="table-cell">{Math.round(s.coding_score)}%</td>
                  <td className="table-cell">{Math.round(s.communication_score)}%</td>
                  <td className="table-cell">
                    <button onClick={() => setSelectedStudent(s)} className="p-1.5 rounded hover:bg-surface-100">
                      <Eye className="w-4 h-4 text-surface-500" />
                    </button>
                  </td>
                </tr>
              ))}
              {atRiskStudents.length === 0 && (
                <tr><td colSpan="8" className="table-cell text-center text-surface-400 py-12">No at-risk students found with current filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="card p-3 text-center">
      <p className="text-xs text-surface-500">{label}</p>
      <p className="text-lg font-heading font-bold text-ink">{value}</p>
    </div>
  );
}
