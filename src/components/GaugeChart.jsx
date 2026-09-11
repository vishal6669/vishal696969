import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const RADIAN = Math.PI / 180

// Custom needle for gauge
function Needle({ cx, cy, midAngle, innerRadius, outerRadius, value }) {
  const angle = 180 - (value / 100) * 180
  const length = (innerRadius + outerRadius) / 2
  const sin = Math.sin(-RADIAN * angle)
  const cos = Math.cos(-RADIAN * angle)
  const x = cx + length * cos
  const y = cy + length * sin
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="#7c3aed" />
      <line
        x1={cx} y1={cy} x2={x} y2={y}
        stroke="#c4b5fd" strokeWidth={3} strokeLinecap="round"
      />
    </g>
  )
}

export default function GaugeChart({ value = 0, size = 260 }) {
  const clampedValue = Math.min(100, Math.max(0, value))

  const segments = [
    { name: 'Needs Training', value: 50, color: '#ef4444' },
    { name: 'Near-Ready', value: 25, color: '#f59e0b' },
    { name: 'Ready', value: 25, color: '#10b981' },
  ]

  const midAngle = 180 - (clampedValue / 100) * 180
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: size, height: size / 2 + 40, overflow: 'hidden' }}>
        <ResponsiveContainer width="100%" height={size}>
          <PieChart>
            <Pie
              data={segments}
              cx={cx}
              cy={cy}
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.28}
              outerRadius={size * 0.46}
              dataKey="value"
              stroke="none"
            >
              {segments.map((seg, i) => (
                <Cell key={i} fill={seg.color} opacity={0.85} />
              ))}
            </Pie>
            {/* Needle overlay */}
            <Pie
              data={[{ value: 1 }]}
              cx={cx}
              cy={cy}
              startAngle={180}
              endAngle={0}
              innerRadius={size * 0.20}
              outerRadius={size * 0.25}
              dataKey="value"
              stroke="none"
              fill="transparent"
              customized={<Needle midAngle={midAngle} cx={cx} cy={cy}
                innerRadius={size * 0.20} outerRadius={size * 0.42} value={clampedValue} />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Value label */}
      <div className="text-center -mt-2">
        <div className="text-5xl font-extrabold text-gradient">{clampedValue.toFixed(1)}%</div>
        <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Placement Probability</div>
      </div>
    </div>
  )
}
