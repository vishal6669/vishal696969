import { useParams } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';
import { mockData } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Target, BookOpen, Code, Briefcase, Award, TrendingUp, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { studentId } = useParams();
  const { user } = useAuth();
  const sid = studentId || user?.id || 'STU1001';
  const student = useMemo(() => mockData.getStudent(sid), [sid]);
  const prediction = useMemo(() => mockData.getStudentPrediction(sid), [sid]);

  // Animated gauge
  const [gaugeValue, setGaugeValue] = useState(0);
  useEffect(() => {
    const target = prediction?.placement_probability || 0;
    const timer = setTimeout(() => setGaugeValue(target), 100);
    return () => clearTimeout(timer);
  }, [prediction]);

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-surface-500">Student not found: {sid}</p>
      </div>
    );
  }

  if (student.accountStatus === 'disabled' || student.account_status === 'disabled') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="card p-8 text-center border-danger-200 shadow-card-lg">
          <div className="w-16 h-16 rounded-2xl bg-danger-50 text-danger-600 flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl font-bold text-ink">Access Disabled</h2>
          <p className="text-surface-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Your student portal access has been temporarily disabled. Please contact the Training &amp; Placement Office.
          </p>
          <div className="mt-6 p-4 bg-surface-50 rounded-xl border border-surface-200 text-xs text-surface-600 space-y-1 max-w-md mx-auto text-left">
            <p><strong className="text-ink">Department of Training &amp; Placement</strong></p>
            <p>Admin Block, Level 2, Room 204</p>
            <p>Email: <a href="mailto:tpo@sapthagiri.edu.in" className="text-primary-600 hover:underline">tpo@sapthagiri.edu.in</a> | Desk: 080-28372800 Ext. 104</p>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/login/student" className="btn-secondary text-sm">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const readiness = student.readiness_status;
  const readinessColor = readiness === 'Ready' ? 'success' : readiness === 'Near-Ready' ? 'warning' : 'danger';
  const barClass = readiness === 'Ready' ? 'readiness-bar-ready' : readiness === 'Near-Ready' ? 'readiness-bar-near' : 'readiness-bar-needs';

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (gaugeValue / 100) * circumference;

  const quickStats = [
    { label: 'CGPA', value: student.cgpa, icon: BookOpen, color: 'primary' },
    { label: 'Coding Score', value: `${Math.round(student.coding_score)}%`, icon: Code, color: 'secondary' },
    { label: 'Projects', value: student.projects_count, icon: Briefcase, color: 'success' },
    { label: 'Certifications', value: student.certifications_count, icon: Award, color: 'warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Banner with Profile Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-surface-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">
            Welcome back, {student.name.split(' ')[0]}
          </h1>
          <p className="text-surface-500 text-sm mt-1">
            {student.department} | Semester {student.semester} | {student.student_id}
          </p>
        </div>
        <Link
          to={`/student/${sid}/profile`}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white self-start sm:self-auto"
        >
          <User className="w-4 h-4" />
          <span>View &amp; Edit Profile</span>
        </Link>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Placement Probability Gauge */}
        <div className={`card p-6 lg:col-span-1 ${barClass} flex flex-col items-center`}>
          <h2 className="text-sm font-medium text-surface-500 mb-4">Placement Probability</h2>

          {/* Circular gauge */}
          <div className="relative w-40 h-40">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={readinessColor === 'success' ? '#10B981' : readinessColor === 'warning' ? '#F59E0B' : '#EF4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-heading font-bold text-ink">{Math.round(gaugeValue)}%</span>
              <span className={`text-xs font-semibold mt-0.5 ${
                readinessColor === 'success' ? 'text-success-600' : readinessColor === 'warning' ? 'text-warning-600' : 'text-danger-600'
              }`}>
                {readiness.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-surface-500">
              Confidence: <span className="font-semibold text-ink">{student.prediction_confidence}%</span>
            </p>
          </div>

          <Link
            to={`/student/${sid}/prediction`}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Quick stats + links */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickStats.map((s, i) => (
              <div key={i} className="card p-4 animate-slide-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}>
                <div className={`w-8 h-8 rounded-lg bg-${s.color}-50 flex items-center justify-center mb-2`}>
                  <s.icon className={`w-4 h-4 text-${s.color}-600`} />
                </div>
                <p className="text-xs text-surface-500">{s.label}</p>
                <p className="text-xl font-heading font-bold text-ink mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Top career match */}
          {prediction?.top_career_matches?.[0] && (
            <div className="card p-5 readiness-bar-ready">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-surface-500 font-medium">Top Career Match</p>
                  <p className="text-lg font-heading font-bold text-ink mt-1">
                    {prediction.top_career_matches[0].track}
                  </p>
                  <p className="text-sm text-surface-500 mt-0.5">
                    {prediction.top_career_matches[0].match_pct || prediction.top_career_matches[0].fit_pct}% match
                  </p>
                </div>
                <Link
                  to={`/student/${sid}/career-tracks`}
                  className="btn-secondary text-sm"
                >
                  Explore tracks <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Recommended For You Section (Req #22) */}
          <div className="card p-5 border-primary-100 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-ink text-base">Recommended For You</h3>
                <p className="text-xs text-surface-500 mt-0.5">Top campus placement drives matching your 7th Semester profile</p>
              </div>
              <button
                onClick={() => {
                  // Trigger Assistant to show all company recommendations
                  const btn = document.querySelector('button:has(svg)');
                  if (btn) btn.click();
                }}
                className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
              >
                View All Recommendations <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {mockData.getRecommendedCompanies(sid).allRanked.slice(0, 3).map((comp, idx) => (
                <div key={comp.company_id} className="p-3.5 rounded-xl border border-surface-200 bg-surface-50/50 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink text-sm">{comp.company_name}</span>
                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        comp.matchPercentage >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {comp.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="text-xs text-surface-600 mt-0.5">{comp.role}</p>
                    <p className="text-[11px] text-surface-500 font-semibold">{comp.package}</p>
                  </div>

                  <div className="pt-2 border-t border-surface-200/60 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      comp.eligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {comp.eligible ? 'ELIGIBLE' : 'NEAR MATCH'}
                    </span>

                    <button
                      onClick={() => {
                        const assistantBtn = document.querySelector('.fixed.bottom-6.right-6');
                        if (assistantBtn) assistantBtn.click();
                      }}
                      className="text-[11px] font-semibold text-primary-600 hover:underline flex items-center gap-0.5"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Next Step Section */}
          <div className="card p-5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                  Your Next Step
                </span>
                <span className="text-xs text-primary-100">AI Counselor Advice</span>
              </div>
              <p className="text-sm font-medium leading-relaxed">
                Apply to TCS &amp; Infosys eligible drives. Improve SQL &amp; React skills to qualify for Accenture.
              </p>
            </div>

            <button
              onClick={() => {
                const assistantBtn = document.querySelector('.fixed.bottom-6.right-6');
                if (assistantBtn) assistantBtn.click();
              }}
              className="px-4 py-2 rounded-xl bg-white text-primary-700 hover:bg-surface-50 font-heading font-bold text-xs shadow-sm flex items-center gap-2 whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              <span>Open Placement Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to={`/student/${sid}/explainable`} className="card-hover p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Why this score?</p>
                <p className="text-xs text-surface-500">Explainable AI</p>
              </div>
            </Link>
            <Link to={`/student/${sid}/skills`} className="card-hover p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-warning-50 flex items-center justify-center">
                <Code className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Skill Analysis</p>
                <p className="text-xs text-surface-500">Gap matrix</p>
              </div>
            </Link>
            <Link to={`/student/${sid}/roadmap`} className="card-hover p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-success-50 flex items-center justify-center">
                <Target className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Action Plan</p>
                <p className="text-xs text-surface-500">Personalized roadmap</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
