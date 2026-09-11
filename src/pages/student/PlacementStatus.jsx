import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { mockData } from '../../data/mockData';
import { Briefcase, CheckCircle2, Clock, XCircle, AlertTriangle, Users } from 'lucide-react';

const STATUS_CONFIG = {
  'Eligible': { icon: CheckCircle2, color: 'primary', bg: 'bg-primary-50', text: 'text-primary-700' },
  'Shortlisted': { icon: Users, color: 'secondary', bg: 'bg-secondary-50', text: 'text-secondary-700' },
  'Interview Scheduled': { icon: Clock, color: 'warning', bg: 'bg-warning-50', text: 'text-warning-700' },
  'Selected': { icon: CheckCircle2, color: 'success', bg: 'bg-success-50', text: 'text-success-700' },
  'Not Selected': { icon: XCircle, color: 'danger', bg: 'bg-danger-50', text: 'text-danger-700' },
  'Training Required': { icon: AlertTriangle, color: 'warning', bg: 'bg-warning-50', text: 'text-warning-700' },
};

export default function PlacementStatus() {
  const { studentId } = useParams();
  const student = useMemo(() => mockData.getStudent(studentId), [studentId]);

  if (!student) return <div className="text-center py-20 text-surface-500">Student not found</div>;

  const statusCfg = STATUS_CONFIG[student.placement_status] || STATUS_CONFIG['Eligible'];
  const StatusIcon = statusCfg.icon;

  const counters = [
    { label: 'Companies Applied', value: student.companies_applied, icon: Briefcase },
    { label: 'Shortlisted', value: student.shortlisted_count, icon: Users },
    { label: 'Interviews', value: student.interviews_count, icon: Clock },
    { label: 'Offers', value: student.offers_count, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-ink">Placement Status</h1>
        <p className="text-sm text-surface-500 mt-0.5">Track your placement journey</p>
      </div>

      {/* Status card */}
      <div className={`card p-8 text-center ${statusCfg.bg} border border-${statusCfg.color}-200`}>
        <div className={`w-16 h-16 rounded-2xl ${statusCfg.bg} flex items-center justify-center mx-auto mb-4 border border-${statusCfg.color}-200`}>
          <StatusIcon className={`w-8 h-8 ${statusCfg.text}`} />
        </div>
        <h2 className="font-heading text-2xl font-bold text-ink">{student.placement_status}</h2>
        <p className="text-sm text-surface-500 mt-2">
          {student.placement_status === 'Selected' ? 'Congratulations! You have been placed.' :
           student.placement_status === 'Training Required' ? 'Focus on improving your skills to become placement-ready.' :
           student.placement_status === 'Not Selected' ? 'Keep working on your skills. More opportunities are ahead.' :
           student.placement_status === 'Interview Scheduled' ? 'Prepare well for your upcoming interview.' :
           student.placement_status === 'Shortlisted' ? 'You have been shortlisted. Stay prepared.' :
           'You are eligible for upcoming placement drives.'}
        </p>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {counters.map((c, i) => (
          <div key={i} className="card p-5 text-center animate-slide-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
            <c.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-heading font-bold text-ink">{c.value}</p>
            <p className="text-xs text-surface-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Journey timeline */}
      <div className="card p-6">
        <h2 className="text-base font-heading font-semibold text-ink mb-4">Placement Journey</h2>
        <div className="space-y-0">
          {['Eligible', 'Shortlisted', 'Interview Scheduled', 'Selected'].map((step, i) => {
            const stepOrder = ['Eligible', 'Shortlisted', 'Interview Scheduled', 'Selected'];
            const currentIdx = stepOrder.indexOf(student.placement_status);
            const isCompleted = i <= currentIdx && student.placement_status !== 'Not Selected' && student.placement_status !== 'Training Required';
            const isCurrent = step === student.placement_status;

            return (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isCompleted ? 'bg-success-500 text-white' : isCurrent ? 'bg-primary-500 text-white' : 'bg-surface-200 text-surface-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  {i < 3 && <div className={`w-0.5 h-8 ${isCompleted ? 'bg-success-300' : 'bg-surface-200'}`} />}
                </div>
                <div className="pb-6">
                  <p className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-ink' : 'text-surface-400'}`}>{step}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
