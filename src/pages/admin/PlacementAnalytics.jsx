import { useMemo } from 'react';
import { mockData } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
  PieChart, Pie, LineChart, Line, Legend
} from 'recharts';

export default function PlacementAnalytics() {
  const students = useMemo(() => mockData.students, []);
  const kpis = useMemo(() => mockData.getDashboardKPIs(), []);

  // Probability distribution histogram
  const distBuckets = useMemo(() => {
    const buckets = [
      { range: '0-20', count: 0 }, { range: '20-40', count: 0 },
      { range: '40-60', count: 0 }, { range: '60-80', count: 0 },
      { range: '80-100', count: 0 },
    ];
    students.forEach(s => {
      const p = s.placement_probability;
      if (p < 20) buckets[0].count++;
      else if (p < 40) buckets[1].count++;
      else if (p < 60) buckets[2].count++;
      else if (p < 80) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [students]);

  // Readiness distribution
  const readinessDist = [
    { status: 'Ready', count: kpis.ready_count, color: '#10B981' },
    { status: 'Near-Ready', count: kpis.near_ready_count, color: '#F59E0B' },
    { status: 'Needs Training', count: kpis.needs_training_count, color: '#EF4444' },
  ];

  // Company-wise placement
  const companyStats = useMemo(() =>
    mockData.companies.filter(c => c.students_selected > 0).map(c => ({
      company: c.company_name.length > 10 ? c.company_name.slice(0, 10) + '…' : c.company_name,
      selected: c.students_selected,
      shortlisted: c.students_shortlisted,
    })).sort((a, b) => b.selected - a.selected).slice(0, 8),
  []);

  // Semester performance
  const semesterData = useMemo(() => {
    const sems = {};
    students.forEach(s => {
      if (!sems[s.semester]) sems[s.semester] = { probs: [], count: 0 };
      sems[s.semester].probs.push(s.placement_probability);
      sems[s.semester].count++;
    });
    return Object.entries(sems).map(([sem, d]) => ({
      semester: `Sem ${sem}`,
      avg: Math.round(d.probs.reduce((a, b) => a + b, 0) / d.probs.length),
      count: d.count,
    })).sort((a, b) => a.semester.localeCompare(b.semester));
  }, [students]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Placement Analytics</h1>
        <p className="text-sm text-surface-500 mt-0.5">Institution-wide placement statistics and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Probability distribution */}
        <div className="card p-6">
          <h2 className="text-base font-heading font-semibold text-ink mb-4">Probability Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distBuckets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                  {distBuckets.map((_, idx) => (
                    <Cell key={idx} fill={['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#10B981'][idx]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness distribution */}
        <div className="card p-6">
          <h2 className="text-base font-heading font-semibold text-ink mb-4">Readiness Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={readinessDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="count" nameKey="status" stroke="none">
                  {readinessDist.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company-wise placement */}
        <div className="card p-6">
          <h2 className="text-base font-heading font-semibold text-ink mb-4">Company-wise Placements</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyStats} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis type="category" dataKey="company" width={80} tick={{ fontSize: 11, fill: '#0F172A' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                <Bar dataKey="selected" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={14} name="Selected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Semester performance */}
        <div className="card p-6">
          <h2 className="text-base font-heading font-semibold text-ink mb-4">Semester Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={semesterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="semester" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} formatter={(v) => [`${v}%`, 'Avg Probability']} />
                <Bar dataKey="avg" fill="#0EA5E9" radius={[4, 4, 0, 0]} barSize={35} name="Avg Probability" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
