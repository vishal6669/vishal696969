import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { mockData } from '../../data/mockData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

const TRACKS = Object.keys(mockData.careerTracks);

export default function SkillAnalysis() {
  const { studentId } = useParams();
  const student = useMemo(() => mockData.getStudent(studentId), [studentId]);
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0]);
  const gaps = useMemo(() => mockData.getSkillGaps(studentId, selectedTrack), [studentId, selectedTrack]);

  if (!student) return <div className="text-center py-20 text-surface-500">Student not found</div>;

  // Radar data
  const radarData = gaps.map(g => ({
    skill: g.skill.length > 12 ? g.skill.slice(0, 12) + '…' : g.skill,
    current: g.current,
    required: g.required,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Skill Analysis</h1>
          <p className="text-sm text-surface-500 mt-0.5">Gap analysis for your target career track</p>
        </div>
        <select
          value={selectedTrack}
          onChange={e => setSelectedTrack(e.target.value)}
          className="select-field w-full sm:w-64"
        >
          {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Radar chart */}
      <div className="card p-6">
        <h2 className="text-base font-heading font-semibold text-ink mb-4">Current vs. Required Skills</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#334155' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Radar name="Current" dataKey="current" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="Required" dataKey="required" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
              <Legend wrapperStyle={{ fontSize: '13px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill gap table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-100">
          <h2 className="text-base font-heading font-semibold text-ink">Your Skill Gaps</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                <th className="table-header">Skill</th>
                <th className="table-header text-center">Current</th>
                <th className="table-header text-center">Required</th>
                <th className="table-header text-center">Gap</th>
                <th className="table-header">Visual</th>
                <th className="table-header text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g, i) => {
                const sevColor = g.severity === 'good' ? 'success' : g.severity === 'small' ? 'warning' : g.severity === 'medium' ? 'warning' : 'danger';
                const barClass = g.severity === 'good' ? 'readiness-bar-ready' : g.severity === 'high' ? 'readiness-bar-needs' : 'readiness-bar-near';
                return (
                  <tr key={i} className={`table-row ${barClass}`}>
                    <td className="table-cell font-medium">{g.skill}</td>
                    <td className="table-cell text-center">{g.current}%</td>
                    <td className="table-cell text-center">{g.required}%</td>
                    <td className="table-cell text-center">
                      <span className={`font-semibold ${
                        g.gap === 0 ? 'text-success-600' : g.gap <= 15 ? 'text-warning-600' : 'text-danger-600'
                      }`}>
                        {g.gap === 0 ? '—' : g.gap}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1.5 w-32">
                        <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-${sevColor}-500`}
                            style={{ width: `${Math.min(g.current / g.required * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded bg-${sevColor}-50 text-${sevColor}-700`}>
                        {g.status_label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
