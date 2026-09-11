import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { mockData } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PlacementPrediction() {
  const { studentId } = useParams();
  const student = useMemo(() => mockData.getStudent(studentId), [studentId]);
  const prediction = useMemo(() => mockData.getStudentPrediction(studentId), [studentId]);

  if (!student || !prediction) return <div className="text-center py-20 text-surface-500">Student not found</div>;

  const readiness = student.readiness_status;
  const readinessColor = readiness === 'Ready' ? 'success' : readiness === 'Near-Ready' ? 'warning' : 'danger';

  const colorMap = {
    success: { bg: 'bg-success-50', text: 'text-success-700', border: 'border-success-200', hex: '#10B981' },
    warning: { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200', hex: '#F59E0B' },
    danger: { bg: 'bg-danger-50', text: 'text-danger-700', border: 'border-danger-200', hex: '#EF4444' },
  };
  const rc = colorMap[readinessColor];
  const barClass = readiness === 'Ready' ? 'readiness-bar-ready' : readiness === 'Near-Ready' ? 'readiness-bar-near' : 'readiness-bar-needs';

  const categories = prediction.categories || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Placement Prediction</h1>
        <p className="text-sm text-surface-500 mt-0.5">AI-powered analysis of your placement readiness</p>
      </div>

      {/* Prediction card */}
      <div className={`card p-6 ${barClass}`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Gauge */}
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#E2E8F0" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={rc.hex}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - prediction.placement_probability / 100)}
                style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-heading font-bold text-ink">{Math.round(prediction.placement_probability)}%</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <h2 className="text-xl font-heading font-bold text-ink">Placement Probability</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rc.bg} ${rc.text} border ${rc.border}`}>
                {readiness}
              </span>
            </div>
            <p className="text-sm text-surface-500 mt-1">
              Confidence: <span className="font-semibold text-ink">{prediction.confidence || student.prediction_confidence}%</span>
            </p>
            <p className="text-sm text-surface-400 mt-2 max-w-lg">
              {readiness === 'Ready'
                ? 'You are well-prepared for placements. Keep building on your strengths.'
                : readiness === 'Near-Ready'
                ? 'You are close to being placement-ready. Focus on addressing your key gaps.'
                : 'Targeted improvement is needed. Follow your personalized roadmap to improve.'}
            </p>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="card p-6">
        <h2 className="text-base font-heading font-semibold text-ink mb-4">Contributing Categories</h2>
        <div className="space-y-4">
          {categories.map((cat, i) => {
            const catColor = cat.score >= 75 ? '#10B981' : cat.score >= 50 ? '#F59E0B' : '#EF4444';
            return (
              <div key={i} className="flex items-center gap-4">
                <span className="text-sm text-surface-600 w-40 shrink-0">{cat.category}</span>
                <div className="flex-1 h-3 bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${cat.score}%`, backgroundColor: catColor, animationDelay: `${i * 100}ms` }}
                  />
                </div>
                <span className="text-sm font-semibold text-ink w-12 text-right">{cat.score}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bar chart */}
      <div className="card p-6">
        <h2 className="text-base font-heading font-semibold text-ink mb-4">Category Comparison</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis type="category" dataKey="category" width={130} tick={{ fontSize: 12, fill: '#0F172A' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                formatter={(val) => [`${val}%`, 'Score']}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={18}>
                {categories.map((entry, idx) => (
                  <Cell key={idx} fill={entry.score >= 75 ? '#10B981' : entry.score >= 50 ? '#F59E0B' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
