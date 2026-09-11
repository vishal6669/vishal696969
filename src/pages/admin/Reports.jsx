import { useMemo, useState } from 'react';
import { mockData } from '../../data/mockData';
import { FileText, Download, Printer } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function Reports() {
  const toast = useToast();
  const kpis = useMemo(() => mockData.getDashboardKPIs(), []);
  const deptSummary = useMemo(() => mockData.getDeptSummary(), []);
  const students = useMemo(() => mockData.students, []);
  const [reportType, setReportType] = useState('summary');

  const handleExport = (format) => {
    toast.success(`${format.toUpperCase()} export initiated (mock)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Reports</h1>
          <p className="text-sm text-surface-500 mt-0.5">Generate and export placement reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('csv')} className="btn-secondary text-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => handleExport('pdf')} className="btn-primary text-sm">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button onClick={() => window.print()} className="btn-ghost text-sm">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Report type selector */}
      <div className="flex gap-2">
        {['summary', 'department', 'students'].map(type => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`tab-btn ${reportType === type ? 'active' : ''}`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Report
          </button>
        ))}
      </div>

      {/* Report content */}
      <div className="card p-8 print:shadow-none" id="report-content">
        <div className="text-center mb-8 border-b border-surface-200 pb-6">
          <h2 className="font-heading text-xl font-bold text-ink">AI Placement Predictor</h2>
          <p className="text-sm text-surface-500 mt-1">
            {reportType === 'summary' ? 'Institutional Placement Summary Report' :
             reportType === 'department' ? 'Department-wise Analytics Report' :
             'Student-wise Placement Report'}
          </p>
          <p className="text-xs text-surface-400 mt-1">Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        {reportType === 'summary' && (
          <div className="space-y-6">
            <h3 className="font-heading font-semibold text-ink">Key Performance Indicators</h3>
            <div className="grid grid-cols-3 gap-4">
              <ReportKPI label="Total Students" value={kpis.total_students} />
              <ReportKPI label="Placement Ready" value={`${kpis.ready_pct}%`} />
              <ReportKPI label="Students Placed" value={`${kpis.placed_pct}%`} />
              <ReportKPI label="Near-Ready" value={`${kpis.near_ready_pct}%`} />
              <ReportKPI label="Needs Training" value={`${kpis.needs_training_pct}%`} />
              <ReportKPI label="Companies" value={kpis.companies} />
            </div>
          </div>
        )}

        {reportType === 'department' && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-ink">Department Performance</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="table-header">Department</th>
                  <th className="table-header text-center">Students</th>
                  <th className="table-header text-center">Avg Readiness</th>
                  <th className="table-header text-center">Ready</th>
                  <th className="table-header text-center">Near-Ready</th>
                  <th className="table-header text-center">Needs Training</th>
                </tr>
              </thead>
              <tbody>
                {deptSummary.map((d, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell font-medium">{d.department}</td>
                    <td className="table-cell text-center">{d.student_count}</td>
                    <td className="table-cell text-center font-semibold">{d.avg_probability}%</td>
                    <td className="table-cell text-center text-success-600">{d.ready_count}</td>
                    <td className="table-cell text-center text-warning-600">{d.near_ready_count}</td>
                    <td className="table-cell text-center text-danger-600">{d.needs_training_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'students' && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-ink">Student-wise Summary (Top 20)</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200">
                  <th className="table-header">ID</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Dept</th>
                  <th className="table-header">CGPA</th>
                  <th className="table-header">Probability</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 20).map((s, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell font-mono text-xs">{s.student_id}</td>
                    <td className="table-cell">{s.name}</td>
                    <td className="table-cell">{s.department}</td>
                    <td className="table-cell">{s.cgpa}</td>
                    <td className="table-cell font-semibold">{Math.round(s.placement_probability)}%</td>
                    <td className="table-cell">{s.readiness_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportKPI({ label, value }) {
  return (
    <div className="p-4 bg-surface-50 rounded-lg text-center">
      <p className="text-xs text-surface-500">{label}</p>
      <p className="text-xl font-heading font-bold text-ink mt-1">{value}</p>
    </div>
  );
}
