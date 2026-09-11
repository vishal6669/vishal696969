import { Link } from 'react-router-dom';
import { Target, Brain, BarChart3, Compass, TrendingUp, Users, ArrowRight, Shield, Building2, Bot, Sparkles } from 'lucide-react';
import UnifiedHeader from '../components/UnifiedHeader';

const FEATURES = [
  { icon: Target, title: 'AI-powered prediction', desc: 'Machine learning models predict placement readiness with explainable results' },
  { icon: Brain, title: 'Explainable placement score', desc: 'Understand exactly which factors increase or decrease your placement probability' },
  { icon: BarChart3, title: 'Skill-gap analysis', desc: 'Identify precise skill gaps between your current profile and target career roles' },
  { icon: Compass, title: 'Personalized career roadmap', desc: 'Time-boxed, phased action plans tailored to close your specific skill gaps' },
  { icon: TrendingUp, title: 'Institutional analytics', desc: 'Department-level insights, skill heatmaps, and at-risk student identification' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <UnifiedHeader />
      
      {/* Header */}
      <header className="border-b border-surface-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-ink text-lg">AI Placement Predictor</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/student/STU1001/dashboard" className="btn-ghost text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Student Dashboard</span>
            </Link>
            <Link to="/admin/dashboard" className="btn-primary text-sm flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 lg:pt-20 lg:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>All Dashboards Unified Under One Localhost</span>
            </div>

            <h1 className="font-heading text-4xl lg:text-5xl xl:text-6xl font-bold text-ink leading-tight">
              AI Placement Predictor
            </h1>
            <p className="mt-4 text-lg lg:text-xl text-surface-600 font-heading font-medium">
              Decode Employability DNA. Predict Placement Readiness. Launch Campus Placements.
            </p>
            <p className="mt-4 text-base text-surface-500 leading-relaxed max-w-2xl">
              An AI-powered institutional platform connecting student readiness scoring, intelligent eligibility matching, AI placement counseling, and TPO administration.
            </p>

            {/* Combined Dashboards Launch Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl">
              <Link
                to="/student/STU1001/dashboard"
                className="group p-4 bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-300 transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-ink text-sm">Student Dashboard</h3>
                    <p className="text-xs text-surface-500">Readiness & Chatbot</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-medium text-primary-600">
                  <span>Open STU1001</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/admin/dashboard"
                className="group p-4 bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-300 transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-ink text-sm">TPO Admin Portal</h3>
                    <p className="text-xs text-surface-500">Campus KPIs & Pipeline</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-medium text-purple-600">
                  <span>Open Admin</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/admin/students"
                className="group p-4 bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-300 transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-ink text-sm">Student Management</h3>
                    <p className="text-xs text-surface-500">Filter, Edit & Access</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-medium text-emerald-600">
                  <span>Manage Students</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/admin/companies"
                className="group p-4 bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-300 transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-ink text-sm">Company Criteria</h3>
                    <p className="text-xs text-surface-500">Eligibility & Cutoffs</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-medium text-amber-600">
                  <span>Set Cutoffs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                to="/admin/analytics"
                className="group p-4 bg-white rounded-xl border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-300 transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-ink text-sm">Placement Analytics</h3>
                    <p className="text-xs text-surface-500">Department Heatmaps</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-medium text-blue-600">
                  <span>View Analytics</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* Decorative element */}
          <div className="hidden lg:block absolute right-0 top-16 w-96 h-96 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full text-primary-600">
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.3" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <line
                  key={angle}
                  x1="100" y1="100"
                  x2={100 + 80 * Math.cos(angle * Math.PI / 180)}
                  y2={100 + 80 * Math.sin(angle * Math.PI / 180)}
                  stroke="currentColor" strokeWidth="0.3"
                />
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-t border-surface-100 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl lg:text-3xl font-bold text-ink">
              Everything you need for placement readiness
            </h2>
            <p className="mt-3 text-surface-500 max-w-xl mx-auto">
              From individual skill assessment to institution-wide analytics
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card p-6 flex gap-4 animate-slide-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm text-surface-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two portals section */}
      <section className="max-w-6xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card p-8 border-l-4 border-l-primary-600">
            <h3 className="font-heading text-xl font-bold text-ink flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" /> Student Portal
            </h3>
            <p className="mt-3 text-surface-500 text-sm leading-relaxed">
              Diagnose your placement readiness, understand the factors behind your score,
              identify skill gaps, and follow a personalized roadmap to become placement-ready.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-surface-600">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-500" /> Placement probability with confidence score</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-500" /> Explainable AI factor breakdown</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-500" /> Career track recommendations</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary-500" /> Personalized improvement roadmap</li>
            </ul>
            <Link to="/login/student" className="btn-primary mt-6 inline-flex">
              Enter Student Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="card p-8 border-l-4 border-l-secondary-500">
            <h3 className="font-heading text-xl font-bold text-ink flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary-500" /> Admin / TPO Portal
            </h3>
            <p className="mt-3 text-surface-500 text-sm leading-relaxed">
              Analyze placement readiness across the institution, identify at-risk students,
              discover institutional skill deficits, and plan targeted training interventions.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-surface-600">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary-500" /> Institutional KPI dashboard</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary-500" /> Department-wise skill gap heatmap</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary-500" /> At-risk student identification</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary-500" /> Company-student matching</li>
            </ul>
            <Link to="/login/admin" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg font-semibold text-sm bg-secondary-500 text-white hover:bg-secondary-600 transition-colors">
              Enter Admin Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-100 bg-surface-50">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-surface-500">
          <p>AI Placement Predictor. Built for hackathon demonstration.</p>
          <p className="mt-1">Demo accounts: Student (STU1001 / student123) | Admin (admin / admin123)</p>
        </div>
      </footer>
    </div>
  );
}
