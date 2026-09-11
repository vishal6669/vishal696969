import { useMemo, useState } from 'react';
import { mockData } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend } from 'recharts';

export default function DeptAnalytics() {
  const deptSummary = useMemo(() => mockData.getDeptSummary(), []);
  const [selectedDept, setSelectedDept] = useState(null);
  const students = useMemo(() => mockData.students, []);

  // Department comparison data
  const comparisonData = deptSummary.map(d => ({
    department: d.department,
    avg: d.avg_probability,
    ready: d.ready_count,
    near: d.near_ready_count,
    needs: d.needs_training_count,
    total: d.student_count,
  }));

  // Selected department breakdown
  const deptStudents = selectedDept ? students.filter(s => s.department === selectedDept) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Department Analytics</h1>
        <p className="text-sm text-surface-500 mt-0.5">Compare placement readiness across departments</p>
      </div>

      {/* Department comparison bar chart */}
      <div className="card p-6">
        <h2 className="text-base font-heading font-semibold text-ink mb-4">Department Comparison</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="department" tick={{ fontSize: 12, fill: '#0F172A' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} formatter={(v) => [`${v}%`, 'Avg Readiness']} />
              <Bar dataKey="avg" radius={[6, 6, 0, 0]} barSize={45} name="Avg Readiness %" cursor="pointer"
                onClick={(data) => setSelectedDept(data.department)}
              >
                {comparisonData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.avg >= 70 ? '#10B981' : entry.avg >= 55 ? '#F59E0B' : '#EF4444'}
                    stroke={selectedDept === entry.department ? '#0F172A' : 'none'}
                    strokeWidth={selectedDept === entry.department ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {comparisonData.map((d, i) => {
          const barClass = d.avg >= 70 ? 'readiness-bar-ready' : d.avg >= 55 ? 'readiness-bar-near' : 'readiness-bar-needs';
          return (
            <button
              key={i}
              onClick={() => setSelectedDept(selectedDept === d.department ? null : d.department)}
              className={`card p-4 text-center ${barClass} transition-shadow ${selectedDept === d.department ? 'shadow-card-hover ring-2 ring-primary-300' : ''}`}
            >
              <p className="font-heading font-semibold text-ink">{d.department}</p>
              <p className="text-2xl font-heading font-bold text-ink mt-1">{d.avg}%</p>
              <p className="text-xs text-surface-500 mt-0.5">{d.total} students</p>
              <div className="flex justify-center gap-2 mt-2 text-[10px]">
                <span className="text-success-600">{d.ready} ✓</span>
                <span className="text-warning-600">{d.near} ~</span>
                <span className="text-danger-600">{d.needs} ✗</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Readiness distribution per department */}
      <div className="card p-6">
        <h2 className="text-base font-heading font-semibold text-ink mb-4">Readiness Breakdown by Department</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="department" tick={{ fontSize: 12, fill: '#0F172A' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
              <Legend wrapperStyle={{ fontSize: '13px' }} />
              <Bar dataKey="ready" stackId="a" fill="#10B981" name="Ready" radius={[0, 0, 0, 0]} />
              <Bar dataKey="near" stackId="a" fill="#F59E0B" name="Near-Ready" radius={[0, 0, 0, 0]} />
              <Bar dataKey="needs" stackId="a" fill="#EF4444" name="Needs Training" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Selected department detail */}
      {selectedDept && (
        <div className="card p-6 animate-fade-in">
          <h2 className="text-base font-heading font-semibold text-ink mb-4">
            {selectedDept} Department Students ({deptStudents.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100">
                  <th className="table-header">Student</th>
                  <th className="table-header">Sem</th>
                  <th className="table-header">CGPA</th>
                  <th className="table-header">Probability</th>
                  <th className="table-header">Readiness</th>
                </tr>
              </thead>
              <tbody>
                {deptStudents.slice(0, 15).map((s, i) => {
                  const barClass = s.readiness_status === 'Ready' ? 'readiness-bar-ready' : s.readiness_status === 'Near-Ready' ? 'readiness-bar-near' : 'readiness-bar-needs';
                  return (
                    <tr key={i} className={`table-row ${barClass}`}>
                      <td className="table-cell font-medium">{s.name}</td>
                      <td className="table-cell text-center">{s.semester}</td>
                      <td className="table-cell">{s.cgpa}</td>
                      <td className="table-cell font-semibold">{Math.round(s.placement_probability)}%</td>
                      <td className="table-cell text-xs">{s.readiness_status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
