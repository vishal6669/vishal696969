import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { mockData } from '../../data/mockData';
import { Map, Clock, Target, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

const TRACKS = Object.keys(mockData.careerTracks);

export default function Roadmap() {
  const { studentId } = useParams();
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0]);
  const roadmap = useMemo(() => mockData.getRoadmap(studentId, selectedTrack), [studentId, selectedTrack]);
  const [expandedPhase, setExpandedPhase] = useState(0);

  if (!roadmap.length) return <div className="text-center py-20 text-surface-500">No data</div>;

  const totalWeeks = roadmap.reduce((sum, p) => sum + (p.duration_weeks || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">My Roadmap</h1>
          <p className="text-sm text-surface-500 mt-0.5">Personalized improvement plan ({totalWeeks}-week plan)</p>
        </div>
        <select
          value={selectedTrack}
          onChange={e => setSelectedTrack(e.target.value)}
          className="select-field w-full sm:w-64"
        >
          {TRACKS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {roadmap.map((phase, i) => {
          const isOpen = expandedPhase === i;
          const phaseColors = [
            { bg: 'bg-danger-50', border: 'border-danger-200', icon: 'text-danger-600', dot: 'bg-danger-500' },
            { bg: 'bg-warning-50', border: 'border-warning-200', icon: 'text-warning-600', dot: 'bg-warning-500' },
            { bg: 'bg-primary-50', border: 'border-primary-200', icon: 'text-primary-600', dot: 'bg-primary-500' },
            { bg: 'bg-success-50', border: 'border-success-200', icon: 'text-success-600', dot: 'bg-success-500' },
          ];
          const pc = phaseColors[i % phaseColors.length];

          return (
            <div key={i} className="relative animate-slide-up" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
              {/* Timeline connector */}
              {i < roadmap.length - 1 && (
                <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-surface-200 -mb-4" />
              )}

              <div className={`card overflow-hidden border ${pc.border}`}>
                {/* Phase header */}
                <button
                  onClick={() => setExpandedPhase(isOpen ? -1 : i)}
                  className={`w-full p-5 flex items-center gap-4 hover:bg-surface-50/50 transition-colors`}
                >
                  {/* Phase dot */}
                  <div className={`w-12 h-12 rounded-xl ${pc.bg} flex items-center justify-center shrink-0`}>
                    <span className={`text-lg font-heading font-bold ${pc.icon}`}>{phase.phase}</span>
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="font-heading font-semibold text-ink">{phase.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {phase.weeks || `${phase.duration_weeks} weeks`}
                      </span>
                      <span>{phase.items?.length || phase.tasks?.length || 0} activities</span>
                    </div>
                  </div>

                  {isOpen ? <ChevronDown className="w-4 h-4 text-surface-400" /> : <ChevronRight className="w-4 h-4 text-surface-400" />}
                </button>

                {/* Items */}
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-surface-100 animate-fade-in">
                    <div className="mt-4 space-y-3">
                      {(phase.items || phase.tasks?.map(t => ({ activity: t, skill: '', time: '', priority: 'Medium', improvement: '' })) || []).map((item, j) => (
                        <div key={j} className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-surface-300 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-ink">{item.activity}</p>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                              {item.skill && (
                                <span className="text-xs px-2 py-0.5 bg-primary-50 text-primary-700 rounded font-medium">{item.skill}</span>
                              )}
                              {item.time && (
                                <span className="text-xs px-2 py-0.5 bg-surface-100 text-surface-600 rounded flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {item.time}
                                </span>
                              )}
                              {item.priority && (
                                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                  item.priority === 'Critical' ? 'bg-danger-50 text-danger-700' :
                                  item.priority === 'High' ? 'bg-warning-50 text-warning-700' :
                                  'bg-surface-100 text-surface-600'
                                }`}>{item.priority}</span>
                              )}
                              {item.improvement && (
                                <span className="text-xs px-2 py-0.5 bg-success-50 text-success-700 rounded font-medium flex items-center gap-0.5">
                                  <Target className="w-3 h-3" /> {item.improvement}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
