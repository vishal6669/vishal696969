import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from 'recharts'

const CustomBar = (props) => {
  const { x, y, width, height, value } = props
  const color = value >= 0 ? '#10b981' : '#ef4444'
  const barY = value >= 0 ? y : y + height
  const barH = Math.abs(height)
  return (
    <g>
      <rect x={x} y={barY} width={width} height={barH} fill={color} fillOpacity={0.85} rx={3} />
      <rect x={x} y={barY} width={width} height={Math.min(barH, 3)} fill={color} rx={3} />
    </g>
  )
}

export default function ShapBar({ data }) {
  // data: [{ factor, impact, direction }]
  const sorted = [...data].sort((a, b) => b.impact - a.impact)

  return (
    <div className="space-y-2">
      {sorted.map((item, i) => {
        const isPos = item.impact >= 0
        const absImpact = Math.abs(item.impact)
        const barPct = Math.min(100, absImpact * 3.5) // scale for visual
        return (
          <div key={i} className="flex items-center gap-3 animate-slide-up"
               style={{ animationDelay: `${i * 50}ms` }}>
            {/* Factor label */}
            <div className="w-48 text-right text-xs text-slate-400 truncate" title={item.factor}>
              {item.factor}
            </div>
            {/* Bar */}
            <div className="flex-1 flex items-center gap-1.5">
              {/* Negative side */}
              <div className="flex-1 flex justify-end">
                {!isPos && (
                  <div
                    className="h-5 rounded-sm flex items-center justify-end pr-1 transition-all duration-500"
                    style={{
                      width: `${barPct}%`,
                      background: 'linear-gradient(to left, #ef4444, #fca5a5)',
                      minWidth: 4,
                    }}
                  >
                    <span className="text-[10px] font-semibold text-white">
                      {item.impact.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              {/* Center line */}
              <div className="w-px h-6 bg-white/20" />
              {/* Positive side */}
              <div className="flex-1">
                {isPos && (
                  <div
                    className="h-5 rounded-sm flex items-center pl-1 transition-all duration-500"
                    style={{
                      width: `${barPct}%`,
                      background: 'linear-gradient(to right, #10b981, #6ee7b7)',
                      minWidth: 4,
                    }}
                  >
                    <span className="text-[10px] font-semibold text-white">
                      +{item.impact.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-rose-500" /> Hurts placement chances
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" /> Boosts placement chances
        </div>
      </div>
    </div>
  )
}
