import { useMemo } from 'react';
import { mockData } from '../../data/mockData';
import { Grid3X3 } from 'lucide-react';

const DEPARTMENTS = ['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'];

export default function SkillHeatmap() {
  const heatmapData = useMemo(() => mockData.getSkillHeatmap(), []);

  // Get unique skills
  const skills = useMemo(() => {
    const set = new Set();
    heatmapData.forEach(d => set.add(d.skill));
    return Array.from(set);
  }, [heatmapData]);

  // Build grid: skill -> dept -> data
  const grid = useMemo(() => {
    const map = {};
    heatmapData.forEach(d => {
      if (!map[d.skill]) map[d.skill] = {};
      map[d.skill][d.group] = d;
    });
    return map;
  }, [heatmapData]);

  const getColor = (avgScore) => {
    if (avgScore >= 70) return { bg: 'bg-success-100', text: 'text-success-800' };
    if (avgScore >= 55) return { bg: 'bg-success-50', text: 'text-success-700' };
    if (avgScore >= 45) return { bg: 'bg-warning-50', text: 'text-warning-700' };
    if (avgScore >= 35) return { bg: 'bg-warning-100', text: 'text-warning-800' };
    return { bg: 'bg-danger-100', text: 'text-danger-800' };
  };

  const getIntensity = (avgScore) => {
    // Returns opacity-based background for the cell
    if (avgScore >= 70) return 'rgba(16, 185, 129, 0.3)';
    if (avgScore >= 55) return 'rgba(16, 185, 129, 0.15)';
    if (avgScore >= 45) return 'rgba(245, 158, 11, 0.15)';
    if (avgScore >= 35) return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(239, 68, 68, 0.3)';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Skill Gap Heatmap</h1>
        <p className="text-sm text-surface-500 mt-0.5">
          Department × Skill deficiency matrix showing average proficiency scores
        </p>
      </div>

      {/* Legend */}
      <div className="card p-4">
        <div className="flex items-center gap-6 text-xs">
          <span className="font-medium text-surface-600">Score intensity:</span>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(239, 68, 68, 0.3)' }} />
            <span className="text-surface-500">&lt;35</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(245, 158, 11, 0.3)' }} />
            <span className="text-surface-500">35-44</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(245, 158, 11, 0.15)' }} />
            <span className="text-surface-500">45-54</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(16, 185, 129, 0.15)' }} />
            <span className="text-surface-500">55-69</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-6 h-4 rounded" style={{ background: 'rgba(16, 185, 129, 0.3)' }} />
            <span className="text-surface-500">70+</span>
          </div>
        </div>
      </div>

      {/* Heatmap table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                <th className="table-header sticky left-0 bg-surface-50 z-10 min-w-[140px]">Skill</th>
                {DEPARTMENTS.map(dept => (
                  <th key={dept} className="table-header text-center min-w-[100px]">{dept}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skills.map((skill, i) => (
                <tr key={i} className="border-b border-surface-50">
                  <td className="table-cell font-medium sticky left-0 bg-white z-10">{skill}</td>
                  {DEPARTMENTS.map(dept => {
                    const cell = grid[skill]?.[dept];
                    const avg = cell?.avg_score || 0;
                    const pctBelow = cell?.pct_below_threshold || 0;
                    const colors = getColor(avg);

                    return (
                      <td key={dept} className="p-1.5">
                        <div
                          className="rounded-lg p-3 text-center transition-all hover:scale-105 cursor-default"
                          style={{ background: getIntensity(avg) }}
                          title={`${skill} in ${dept}: Avg ${avg}%, ${pctBelow}% below threshold`}
                        >
                          <p className="text-sm font-heading font-bold text-ink">{avg}%</p>
                          <p className="text-[10px] text-surface-500 mt-0.5">{pctBelow}% low</p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
