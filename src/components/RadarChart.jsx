import {
  RadarChart as ReRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function RadarChart({ data }) {
  // data: [{ skill, current, required }]
  return (
    <ResponsiveContainer width="100%" height={340}>
      <ReRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.1)" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fill: '#475569', fontSize: 10 }}
          axisLine={false}
        />
        <Radar
          name="Required"
          dataKey="required"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.08}
          strokeWidth={2}
          strokeDasharray="5 3"
        />
        <Radar
          name="Your Score"
          dataKey="current"
          stroke="#7c3aed"
          fill="#7c3aed"
          fillOpacity={0.25}
          strokeWidth={2.5}
        />
        <Tooltip
          contentStyle={{
            background: 'rgba(15,14,32,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: '#e2e8f0',
            fontSize: 12,
          }}
        />
        <Legend
          wrapperStyle={{ color: '#94a3b8', fontSize: 12 }}
        />
      </ReRadarChart>
    </ResponsiveContainer>
  )
}
