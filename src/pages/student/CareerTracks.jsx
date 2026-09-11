import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { mockData } from '../../data/mockData';
import { Compass, ChevronDown, ChevronUp, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function CareerTracks() {
  const { studentId } = useParams();
  const matches = useMemo(() => mockData.getCareerMatches(studentId), [studentId]);
  const [expanded, setExpanded] = useState(null);

  if (!matches.length) return <div className="text-center py-20 text-surface-500">No data</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Career Tracks</h1>
        <p className="text-sm text-surface-500 mt-0.5">Recommended career tracks based on your profile</p>
      </div>

      <div className="space-y-4">
        {matches.map((m, i) => {
          const isOpen = expanded === i;
          const matchColor = m.match_pct >= 75 ? 'success' : m.match_pct >= 55 ? 'warning' : 'danger';
          const barClass = m.match_pct >= 75 ? 'readiness-bar-ready' : m.match_pct >= 55 ? 'readiness-bar-near' : 'readiness-bar-needs';

          return (
            <div key={i} className={`card overflow-hidden ${barClass}`}>
              {/* Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full p-5 flex items-center justify-between hover:bg-surface-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-${matchColor}-50 flex items-center justify-center`}>
                    <Compass className={`w-5 h-5 text-${matchColor}-600`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-heading font-semibold text-ink">{m.track}</h3>
                    <p className="text-xs text-surface-500 mt-0.5">
                      Confidence: {m.confidence}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Match percentage circle */}
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                      <circle
                        cx="20" cy="20" r="16" fill="none"
                        stroke={matchColor === 'success' ? '#10B981' : matchColor === 'warning' ? '#F59E0B' : '#EF4444'}
                        strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 16}
                        strokeDashoffset={2 * Math.PI * 16 * (1 - m.match_pct / 100)}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-heading font-bold text-ink">
                      {m.match_pct}%
                    </span>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-surface-400" /> : <ChevronDown className="w-4 h-4 text-surface-400" />}
                </div>
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="px-5 pb-5 pt-0 border-t border-surface-100 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Skills Met */}
                    <div>
                      <h4 className="text-sm font-semibold text-success-700 flex items-center gap-1 mb-2">
                        <CheckCircle2 className="w-4 h-4" /> Skills Already Met
                      </h4>
                      {m.met.length > 0 ? (
                        <div className="space-y-1.5">
                          {m.met.map((s, j) => (
                            <div key={j} className="flex items-center gap-2 p-2 bg-success-50 rounded text-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-success-500" />
                              <span className="text-ink">{s.skill}</span>
                              <span className="text-surface-500 ml-auto text-xs">{s.current}% / {s.required}%</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-surface-400 italic">No skills fully met yet</p>
                      )}
                    </div>

                    {/* Skills Missing */}
                    <div>
                      <h4 className="text-sm font-semibold text-danger-700 flex items-center gap-1 mb-2">
                        <XCircle className="w-4 h-4" /> Skills Missing
                      </h4>
                      {m.missing.length > 0 ? (
                        <div className="space-y-1.5">
                          {m.missing.map((s, j) => (
                            <div key={j} className="flex items-center gap-2 p-2 bg-danger-50 rounded text-sm">
                              <XCircle className="w-3.5 h-3.5 text-danger-400" />
                              <span className="text-ink">{s.skill}</span>
                              <span className="text-surface-500 ml-auto text-xs">{s.current}% / {s.required}% (gap: {s.gap})</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-surface-400 italic">All skills met!</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Link
                      to={`/student/${studentId}/skills`}
                      className="btn-primary text-sm"
                    >
                      View Skill Gaps <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/student/${studentId}/roadmap`}
                      className="btn-secondary text-sm"
                    >
                      View Roadmap
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
