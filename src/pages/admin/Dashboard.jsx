import { useState, useMemo, useEffect } from 'react';
import { mockData } from '../../data/mockData';
import {
  Users, CheckCircle2, AlertTriangle, Building2, TrendingUp, Target,
  ShieldCheck, ShieldAlert, ArrowRight, Eye, ChevronRight, UserX, AlertCircle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Reactive data
  const [students, setStudents] = useState(() => mockData.students);

  useEffect(() => {
    const unsub = mockData.subscribe((updated) => {
      setStudents([...updated]);
    });
    return unsub;
  }, []);

  const kpis = useMemo(() => mockData.getDashboardKPIs(), [students]);
  const deptSummary = useMemo(() => mockData.getDeptSummary(), [students]);

  // Students Requiring Attention (At-Risk / Backlogs / Low Soft Skills)
  const studentsRequiringAttention = useMemo(() => {
    return students
      .filter(s =>
        s.placement_probability < 55 ||
        s.backlogs > 0 ||
        (s.aptitude_score && s.aptitude_score < 50) ||
        (s.communication_score && s.communication_score < 50) ||
        s.readiness_status === 'Needs Training'
      )
      .slice(0, 6);
  }, [students]);

  // Interactive KPI Cards
  const kpiCards = [
    {
      label: 'Total Students',
      value: kpis.total_students,
      icon: Users,
      color: 'primary',
      filterUrl: '/admin/students',
      hint: 'View all students'
    },
    {
      label: 'Active Students',
      value: kpis.active_students,
      icon: ShieldCheck,
      color: 'success',
      filterUrl: '/admin/students?access=active',
      hint: 'Login permitted'
    },
    {
      label: 'Disabled Access',
      value: kpis.disabled_students,
      icon: ShieldAlert,
      color: 'danger',
      filterUrl: '/admin/students?access=disabled',
      hint: 'Login restricted'
    },
    {
      label: 'Placement Ready',
      value: `${kpis.ready_pct}%`,
      sub: `${kpis.ready_count} students`,
      icon: CheckCircle2,
      color: 'success',
      filterUrl: '/admin/students?readiness=Ready',
      hint: 'Ready for placement'
    },
    {
      label: 'Students Placed',
      value: `${kpis.placed_pct}%`,
      sub: `${kpis.placed_count} offers`,
      icon: Target,
      color: 'secondary',
      filterUrl: '/admin/students?placement=Selected',
      hint: 'Selected students'
    },
    {
      label: 'Recruiting Partners',
      value: kpis.companies,
      icon: Building2,
      color: 'primary',
      filterUrl: '/admin/companies',
      hint: 'Campus recruiters'
    },
  ];

  // Pie Data
  const pieData = [
    { name: 'Ready', value: kpis.ready_count, color: '#10B981', readiness: 'Ready' },
    { name: 'Near-Ready', value: kpis.near_ready_count, color: '#F59E0B', readiness: 'Near-Ready' },
    { name: 'Needs Training', value: kpis.needs_training_count, color: '#EF4444', readiness: 'Needs Training' },
  ];

  // Trend Data (mock monthly placement progress)
  const trendData = [
    { month: 'Jan', placed: 12 }, { month: 'Feb', placed: 18 }, { month: 'Mar', placed: 25 },
    { month: 'Apr', placed: 32 }, { month: 'May', placed: 40 }, { month: 'Jun', placed: 48 },
    { month: 'Jul', placed: 55 }, { month: 'Aug', placed: kpis.placed_count },
  ];

  // Placement status interactive pills
  const statusCounts = [
    { status: 'Selected', count: students.filter(s => s.placement_status === 'Selected').length, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { status: 'Shortlisted', count: students.filter(s => s.placement_status === 'Shortlisted').length, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { status: 'Interview Scheduled', count: students.filter(s => s.placement_status === 'Interview Scheduled').length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { status: 'Eligible', count: students.filter(s => s.placement_status === 'Eligible').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { status: 'Training Required', count: students.filter(s => s.placement_status === 'Training Required').length, color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-6 rounded-2xl border border-surface-200 shadow-card">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Welcome back, Placement Officer</h1>
          <p className="text-sm text-surface-500 mt-1">
            Training &amp; Placement Directorate • Institutional Readiness &amp; Outcomes Monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/students"
            className="btn-primary text-xs inline-flex items-center gap-2 py-2 px-4 shadow-sm"
          >
            <Users className="w-4 h-4" />
            <span>Manage Students</span>
          </Link>
          <Link
            to="/admin/at-risk"
            className="btn-secondary text-xs inline-flex items-center gap-2 py-2 px-3"
          >
            <AlertTriangle className="w-4 h-4 text-danger-500" />
            <span>At-Risk Interventions</span>
          </Link>
        </div>
      </div>

      {/* 1. Overview KPI Cards (Clickable & Responsive) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Institutional Overview</h2>
          <span className="text-xs text-surface-400">Click any metric card to filter directory</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {kpiCards.map((k, i) => (
            <div
              key={i}
              onClick={() => navigate(k.filterUrl)}
              className="card p-4 hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-${k.color}-50 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <k.icon className={`w-4 h-4 text-${k.color}-600`} />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-surface-300 group-hover:text-primary-600 transition-colors" />
                </div>
                <p className="stat-value text-2xl font-heading font-bold text-ink">{k.value}</p>
                <p className="stat-label text-xs font-medium text-surface-600 mt-0.5">{k.label}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-surface-100 flex items-center justify-between text-[11px] text-surface-400 group-hover:text-primary-600">
                <span>{k.sub || k.hint}</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Placement Analytics & Status Breakdown */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-heading font-semibold text-ink">Placement Analytics &amp; Pipeline</h2>
            <p className="text-xs text-surface-500 mt-0.5">Click any stage badge to filter students by recruitment milestone</p>
          </div>
          <Link to="/admin/placement-analytics" className="text-xs text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center gap-1">
            Detailed Analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Interactive Milestone Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {statusCounts.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/admin/students?placement=${encodeURIComponent(sc.status)}`)}
              className={`p-3 rounded-xl border text-left transition-all hover:shadow-sm cursor-pointer hover:scale-[1.02] ${sc.color}`}
            >
              <p className="text-[11px] font-semibold opacity-90">{sc.status}</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xl font-heading font-bold">{sc.count}</span>
                <span className="text-[10px] opacity-75">students →</span>
              </div>
            </button>
          ))}
        </div>

        {/* Trend chart */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }}
              />
              <Line
                type="monotone"
                dataKey="placed"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3 & 4. Department Performance & Student Readiness Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Performance (Clickable CSE, ISE, etc.) */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-heading font-semibold text-ink">Department Performance</h2>
              <p className="text-xs text-surface-500 mt-0.5">Click a department card to view its student roster</p>
            </div>
            <Link to="/admin/dept-analytics" className="text-xs text-primary-600 hover:text-primary-700 font-semibold">
              Deep Dive →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {deptSummary.map((d, i) => {
              const barClass = d.avg_probability >= 70
                ? 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/20'
                : d.avg_probability >= 55
                ? 'border-amber-200 hover:border-amber-400 bg-amber-50/20'
                : 'border-rose-200 hover:border-rose-400 bg-rose-50/20';

              return (
                <div
                  key={i}
                  onClick={() => navigate(`/admin/students?dept=${encodeURIComponent(d.department)}`)}
                  className={`card p-3.5 text-center cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${barClass}`}
                >
                  <div className="flex items-center justify-between text-xs font-heading font-bold text-ink">
                    <span>{d.department}</span>
                    <span className="text-[11px] font-mono text-surface-500">{d.student_count} st.</span>
                  </div>

                  <p className="text-2xl font-heading font-bold text-ink mt-2">{d.avg_probability}%</p>
                  <p className="text-[11px] text-surface-500 mt-0.5">Avg Readiness</p>

                  <div className="mt-2 pt-2 border-t border-surface-200/60 flex items-center justify-between text-[10px] text-surface-500">
                    <span className="text-emerald-700 font-semibold">{d.ready_count} Ready</span>
                    <span className="text-rose-700 font-semibold">{d.needs_training_count} Needs Tr.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Readiness Distribution (Interactive Donut) */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-heading font-semibold text-ink">Readiness Breakdown</h2>
            </div>
            <p className="text-xs text-surface-500 mb-4">Click any segment to view students in that category</p>

            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    onClick={(entry) => navigate(`/admin/students?readiness=${encodeURIComponent(entry.readiness)}`)}
                    className="cursor-pointer"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0' }}
                    formatter={(val, name) => [`${val} students`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-heading font-bold text-ink">{kpis.ready_pct}%</span>
                <span className="text-[10px] text-surface-500">Ready Rate</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-surface-100">
            {pieData.map((d, i) => (
              <button
                key={i}
                onClick={() => navigate(`/admin/students?readiness=${encodeURIComponent(d.readiness)}`)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-surface-50 transition-colors text-left text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-surface-700 font-medium">{d.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-ink">{d.value}</span>
                  <span className="text-surface-400">({Math.round((d.value / (kpis.total_students || 1)) * 100)}%) →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Students Requiring Attention */}
      <div className="card p-6 border-danger-100 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger-50 text-danger-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-heading font-bold text-ink">Students Requiring Attention</h2>
              <p className="text-xs text-surface-500 mt-0.5">
                Identified students with low readiness (&lt;55%), academic backlogs, or soft skill deficits
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/admin/students?readiness=Needs%20Training')}
            className="btn-secondary text-xs inline-flex items-center gap-2 py-1.5 px-3 self-start sm:self-auto"
          >
            <span>View All Needs Training</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-200 text-[11px] font-bold text-surface-500 uppercase tracking-wider bg-surface-50/50">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Backlogs</th>
                <th className="py-2.5 px-3">Probability</th>
                <th className="py-2.5 px-3">Deficit / Attention Factor</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 text-xs">
              {studentsRequiringAttention.map((s) => {
                const deficit = s.backlogs > 0
                  ? `${s.backlogs} Active Backlog(s)`
                  : s.coding_score < 50
                  ? `Low Coding Proficiency (${Math.round(s.coding_score)}%)`
                  : s.aptitude_score < 50
                  ? `Low Aptitude Score (${Math.round(s.aptitude_score)}%)`
                  : s.communication_score < 50
                  ? `Communication Gap (${Math.round(s.communication_score)}%)`
                  : 'Low Composite Readiness';

                return (
                  <tr
                    key={s.student_id}
                    onClick={() => navigate(`/admin/students?q=${encodeURIComponent(s.student_id)}`)}
                    className="hover:bg-danger-50/20 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 font-semibold text-ink">
                      {s.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-surface-600">
                      {s.student_id}
                    </td>
                    <td className="py-2.5 px-3">
                      {s.department} (Sem {s.semester})
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold">
                      {parseFloat(s.cgpa).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      {s.backlogs > 0 ? (
                        <span className="text-danger-600 font-bold bg-danger-50 px-2 py-0.5 rounded border border-danger-200">
                          {s.backlogs}
                        </span>
                      ) : (
                        <span className="text-surface-400">0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-danger-600">{Math.round(s.placement_probability)}%</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        {deficit}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/students?q=${encodeURIComponent(s.student_id)}`);
                        }}
                        className="text-primary-600 hover:text-primary-800 font-semibold text-xs inline-flex items-center gap-1"
                      >
                        Profile <ArrowRight className="w-3 h-3" />
                      </button>
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
