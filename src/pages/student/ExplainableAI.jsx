import { useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { mockData } from '../../data/mockData';
import { Brain, TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function ExplainableAI() {
  const { studentId } = useParams();
  const student = useMemo(() => mockData.getStudent(studentId), [studentId]);
  const factors = useMemo(() => mockData.getExplanation(studentId), [studentId]);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!student) return <div className="text-center py-20 text-surface-500">Student not found</div>;

  const positive = factors.filter(f => f.impact > 0).sort((a, b) => b.impact - a.impact);
  const negative = factors.filter(f => f.impact < 0).sort((a, b) => a.impact - b.impact);
  const maxAbs = Math.max(...factors.map(f => Math.abs(f.impact)), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Why this score?</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Explainable AI breakdown of your placement probability
        </p>
      </div>

      {/* Context card */}
      <div className="card p-5 flex items-start gap-3 bg-primary-50 border border-primary-100">
        <Info className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-primary-800">
            Your placement probability is <strong className="font-heading">{student.placement_probability}%</strong> ({student.readiness_status}).
            The chart below shows which factors are pushing your score up or down, and by how much.
          </p>
        </div>
      </div>

      {/* ── Hero: Diverging SHAP-style chart ── */}
      <div className="card p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-heading font-bold text-ink">Factor Impact Analysis</h2>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-success-500" />
            <span className="text-surface-600">Increasing your score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-danger-500" />
            <span className="text-surface-600">Reducing your score</span>
          </div>
        </div>

        {/* Diverging bars */}
        <div className="space-y-1">
          {/* Positive factors */}
          {positive.map((f, i) => (
            <DivergingBar
              key={`p-${i}`}
              factor={f.factor}
              impact={f.impact}
              maxAbs={maxAbs}
              direction="positive"
              animated={animated}
              delay={i * 100}
            />
          ))}

          {/* Divider */}
          {positive.length > 0 && negative.length > 0 && (
            <div className="relative py-2">
              <div className="absolute inset-x-0 top-1/2 h-px bg-surface-200" />
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-surface-400 font-medium">baseline</span>
              </div>
            </div>
          )}

          {/* Negative factors */}
          {negative.map((f, i) => (
            <DivergingBar
              key={`n-${i}`}
              factor={f.factor}
              impact={f.impact}
              maxAbs={maxAbs}
              direction="negative"
              animated={animated}
              delay={(positive.length + i) * 100}
            />
          ))}
        </div>
      </div>

      {/* Detailed breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-success-500" />
            <h3 className="font-heading font-semibold text-ink">Strengths</h3>
          </div>
          <div className="space-y-3">
            {positive.length > 0 ? positive.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-success-50 rounded-lg readiness-bar-ready">
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{f.factor}</p>
                </div>
                <span className="text-sm font-heading font-bold text-success-600">+{f.impact.toFixed(1)}%</span>
              </div>
            )) : (
              <p className="text-sm text-surface-400 italic">No significant positive factors</p>
            )}
          </div>
        </div>

        {/* Negative */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-danger-500" />
            <h3 className="font-heading font-semibold text-ink">Areas to Improve</h3>
          </div>
          <div className="space-y-3">
            {negative.length > 0 ? negative.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-danger-50 rounded-lg readiness-bar-needs">
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{f.factor}</p>
                </div>
                <span className="text-sm font-heading font-bold text-danger-600">{f.impact.toFixed(1)}%</span>
              </div>
            )) : (
              <p className="text-sm text-surface-400 italic">No significant negative factors</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DivergingBar({ factor, impact, maxAbs, direction, animated, delay }) {
  const isPositive = direction === 'positive';
  const widthPct = (Math.abs(impact) / maxAbs) * 100;
  const barColor = isPositive ? 'bg-success-500' : 'bg-danger-500';
  const textColor = isPositive ? 'text-success-600' : 'text-danger-600';

  return (
    <div className="flex items-center gap-3 py-1.5 group hover:bg-surface-50 rounded-lg px-2 -mx-2 transition-colors">
      {/* Factor name — right aligned for positive, left for negative */}
      <div className="w-52 shrink-0 text-right">
        <span className="text-sm text-surface-700 group-hover:text-ink transition-colors">
          {factor}
        </span>
      </div>

      {/* Bar area */}
      <div className="flex-1 flex items-center" style={{ minHeight: '28px' }}>
        {isPositive ? (
          <div className="flex items-center w-full">
            <div
              className={`h-7 ${barColor} rounded-r-md transition-all ease-out`}
              style={{
                width: animated ? `${widthPct}%` : '0%',
                transitionDuration: '800ms',
                transitionDelay: `${delay}ms`,
                minWidth: animated ? '4px' : '0',
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-end w-full">
            <div
              className={`h-7 ${barColor} rounded-l-md transition-all ease-out`}
              style={{
                width: animated ? `${widthPct}%` : '0%',
                transitionDuration: '800ms',
                transitionDelay: `${delay}ms`,
                minWidth: animated ? '4px' : '0',
              }}
            />
          </div>
        )}
      </div>

      {/* Impact value */}
      <div className="w-16 shrink-0">
        <span className={`text-sm font-heading font-bold ${textColor}`}>
          {isPositive ? '+' : ''}{impact.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
