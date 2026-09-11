import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import mockData from '../../data/mockData';
import {
  User, Mail, Phone, MapPin, Award, BookOpen, Briefcase, Code, FileText,
  Plus, Edit3, Trash2, CheckCircle2, ExternalLink, Upload, Download, Sparkles, Save
} from 'lucide-react';

export default function StudentPortfolio() {
  const { studentId } = useParams();
  const { user } = useAuth();
  const sid = studentId || user?.id || 'STU1001';

  // Load student data reactively
  const [student, setStudent] = useState(() => mockData.getStudent(sid));

  useEffect(() => {
    const load = () => {
      const s = mockData.getStudent(sid);
      if (s) setStudent(s);
    };
    load();
    const unsubscribe = mockData.subscribe(load);
    return () => unsubscribe();
  }, [sid, user]);

  // Local state for modals & forms
  const [editObjective, setEditObjective] = useState(false);
  const [objectiveText, setObjectiveText] = useState(
    student?.career_objective || 'Aspiring Software Engineer seeking a challenging role in full-stack development to leverage expertise in Java, React, and cloud systems.'
  );

  // Contact info modal state
  const [editContact, setEditContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    email: student?.email || `${student?.name?.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
    phone: student?.phone || '+91 98765 43210',
    linkedin: student?.linkedin || `https://linkedin.com/in/${student?.name?.toLowerCase().replace(/\s+/g, '')}`,
    github: student?.github || `https://github.com/${student?.name?.toLowerCase().replace(/\s+/g, '')}`,
  });

  // Dynamic Portfolio Collections
  const [projects, setProjects] = useState(student?.projects_list || [
    {
      id: 1,
      title: 'AI Placement Predictor & Placement Assistant',
      tech: ['React', 'Python', 'TailwindCSS', 'Scikit-Learn'],
      desc: 'Institutional web app predicting student employability DNA with SHAP explainability and interactive placement chatbot.',
      link: 'https://github.com/demo/placement-predictor'
    },
    {
      id: 2,
      title: 'Smart Campus Event Management Portal',
      tech: ['Node.js', 'Express', 'MongoDB', 'React'],
      desc: 'Real-time event registration, seat allocation, and QR-based attendance tracking platform for 2,000+ students.',
      link: 'https://github.com/demo/campus-events'
    }
  ]);

  const [internships, setInternships] = useState(student?.internships_list || [
    {
      id: 1,
      company: 'TechCorp Solutions',
      role: 'Full Stack Developer Intern',
      duration: 'Jun 2025 – Aug 2025 (3 Months)',
      desc: 'Built REST APIs in Node.js, optimized React dashboard rendering by 35%, and wrote SQL database migrations.'
    }
  ]);

  const [certifications, setCertifications] = useState(student?.certifications_list || [
    { id: 1, title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2025', link: '#' },
    { id: 2, title: 'Full Stack Web Development', issuer: 'Coursera', year: '2024', link: '#' }
  ]);

  // Skill state
  const [skills, setSkills] = useState([
    { name: 'Java', level: student?.skill_java || 85, category: 'Technical' },
    { name: 'Python', level: student?.skill_python || 80, category: 'Technical' },
    { name: 'React.js', level: student?.skill_react || 75, category: 'Technical' },
    { name: 'SQL & Databases', level: student?.skill_sql || 80, category: 'Technical' },
    { name: 'Git & GitHub', level: student?.skill_git || 85, category: 'Tools' },
    { name: 'Communication', level: student?.communication_score || 88, category: 'Soft Skill' },
    { name: 'Problem Solving', level: student?.coding_score || 82, category: 'Soft Skill' }
  ]);

  // Resume Upload State
  const [resumeName, setResumeName] = useState(`${student?.name?.replace(/\s+/g, '_')}_Resume_2026.pdf`);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Modals visibility
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', tech: '', desc: '', link: '' });

  const [showAddInternship, setShowAddInternship] = useState(false);
  const [newInternship, setNewInternship] = useState({ company: '', role: '', duration: '', desc: '' });

  const [showAddCert, setShowAddCert] = useState(false);
  const [newCert, setNewCert] = useState({ title: '', issuer: '', year: '' });

  // Save Contact Changes
  const handleSaveContact = (e) => {
    e.preventDefault();
    setEditContact(false);
  };

  // Add Project
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProject.title) return;
    const added = {
      id: Date.now(),
      title: newProject.title,
      tech: newProject.tech.split(',').map(t => t.trim()).filter(Boolean),
      desc: newProject.desc,
      link: newProject.link || '#'
    };
    setProjects([...projects, added]);
    setNewProject({ title: '', tech: '', desc: '', link: '' });
    setShowAddProject(false);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Add Internship
  const handleAddInternship = (e) => {
    e.preventDefault();
    if (!newInternship.company) return;
    const added = {
      id: Date.now(),
      company: newInternship.company,
      role: newInternship.role,
      duration: newInternship.duration,
      desc: newInternship.desc
    };
    setInternships([...internships, added]);
    setNewInternship({ company: '', role: '', duration: '', desc: '' });
    setShowAddInternship(false);
  };

  const handleDeleteInternship = (id) => {
    setInternships(internships.filter(i => i.id !== id));
  };

  // Add Certification
  const handleAddCert = (e) => {
    e.preventDefault();
    if (!newCert.title) return;
    setCertifications([...certifications, { id: Date.now(), title: newCert.title, issuer: newCert.issuer, year: newCert.year }]);
    setNewCert({ title: '', issuer: '', year: '' });
    setShowAddCert(false);
  };

  // Resume file change simulation
  const handleResumeChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  if (!student) {
    return <div className="text-center py-20 text-surface-500">Student Profile Not Found</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Portfolio Header Banner Card */}
      <div className="bg-white border border-surface-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 via-primary-600 to-purple-600 relative p-6 flex items-end">
          <span className="bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
            🎓 7th Semester Placement Candidate
          </span>
        </div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md border-2 border-primary-500 overflow-hidden shrink-0">
              <div className="w-full h-full rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-heading text-3xl font-bold">
                {student.name[0]}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-bold text-ink">{student.name}</h1>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Profile
                </span>
              </div>
              <p className="text-sm font-medium text-surface-600 mt-0.5">
                {student.department} • 7th Semester • USN: <span className="font-mono text-ink font-semibold">{student.student_id}</span>
              </p>
              <p className="text-xs text-surface-500 mt-1">
                CGPA: <span className="font-bold text-ink">{student.cgpa}</span> | Backlogs: <span className="font-bold text-ink">{student.backlogs}</span> | Readiness: <span className="font-bold text-indigo-600">{student.placement_probability}% Match</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Link
              to={`/student/${sid}/profile`}
              className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <User className="w-3.5 h-3.5" />
              <span>View &amp; Edit Full Profile</span>
            </Link>

            <button
              onClick={() => setEditContact(true)}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Contact Info</span>
            </button>

            <a
              href={`#resume-section`}
              className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Resume</span>
            </a>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="px-6 py-3 bg-surface-50 border-t border-surface-100 flex flex-wrap items-center gap-6 text-xs text-surface-600">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-surface-400" />
            <span>{contactForm.email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-surface-400" />
            <span>{contactForm.phone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-surface-400" />
            <span>Department of {student.department}, Campus</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <a href={contactForm.linkedin} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline flex items-center gap-1">
              LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a href={contactForm.github} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline flex items-center gap-1">
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid Layout for Portfolio Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: 2/3 Width */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Career Objective */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-bold text-ink text-base">Career Objective</h2>
              </div>
              <button
                onClick={() => setEditObjective(!editObjective)}
                className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {editObjective ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editObjective ? (
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={objectiveText}
                  onChange={(e) => setObjectiveText(e.target.value)}
                  className="input-field text-xs p-3"
                />
                <button
                  onClick={() => setEditObjective(false)}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Objective</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-surface-600 leading-relaxed bg-surface-50 p-3 rounded-xl border border-surface-100 font-medium">
                "{objectiveText}"
              </p>
            )}
          </div>

          {/* 2. Technical Projects Portfolio */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Code className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-bold text-ink text-base">Projects Portfolio</h2>
              </div>
              <button
                onClick={() => setShowAddProject(true)}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            {/* Add Project Form Modal Inline */}
            {showAddProject && (
              <form onSubmit={handleAddProject} className="mb-4 p-4 bg-surface-50 rounded-xl border border-surface-200 space-y-3">
                <h3 className="text-xs font-bold text-ink">Add New Project</h3>
                <input
                  type="text"
                  placeholder="Project Title *"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="input-field text-xs"
                />
                <input
                  type="text"
                  placeholder="Technologies Used (comma separated e.g. React, Node.js, SQL)"
                  value={newProject.tech}
                  onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                  className="input-field text-xs"
                />
                <textarea
                  placeholder="Project description & key highlights..."
                  rows={2}
                  value={newProject.desc}
                  onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                  className="input-field text-xs"
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddProject(false)} className="btn-ghost text-xs py-1 px-3">Cancel</button>
                  <button type="submit" className="btn-primary text-xs py-1 px-3">Save Project</button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-surface-200 hover:border-primary-300 transition bg-white shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading font-bold text-ink text-sm flex items-center gap-2">
                        {p.title}
                        {p.link && (
                          <a href={p.link} target="_blank" rel="noreferrer" className="text-primary-600 hover:text-primary-700">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {p.tech.map((t, idx) => (
                          <span key={idx} className="bg-surface-100 text-surface-700 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-1 text-surface-400 hover:text-danger-500 rounded-lg hover:bg-danger-50 transition"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-surface-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Internships & Experience */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-bold text-ink text-base">Internships & Work Experience</h2>
              </div>
              <button
                onClick={() => setShowAddInternship(true)}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Internship</span>
              </button>
            </div>

            {showAddInternship && (
              <form onSubmit={handleAddInternship} className="mb-4 p-4 bg-surface-50 rounded-xl border border-surface-200 space-y-3">
                <h3 className="text-xs font-bold text-ink">Add Internship Experience</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Company Name *"
                    required
                    value={newInternship.company}
                    onChange={(e) => setNewInternship({ ...newInternship, company: e.target.value })}
                    className="input-field text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Role / Title *"
                    value={newInternship.role}
                    onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                    className="input-field text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Duration (e.g. Jun 2025 – Aug 2025)"
                  value={newInternship.duration}
                  onChange={(e) => setNewInternship({ ...newInternship, duration: e.target.value })}
                  className="input-field text-xs"
                />
                <textarea
                  placeholder="Key achievements and responsibilities..."
                  rows={2}
                  value={newInternship.desc}
                  onChange={(e) => setNewInternship({ ...newInternship, desc: e.target.value })}
                  className="input-field text-xs"
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddInternship(false)} className="btn-ghost text-xs py-1 px-3">Cancel</button>
                  <button type="submit" className="btn-primary text-xs py-1 px-3">Save Internship</button>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {internships.map((i) => (
                <div key={i.id} className="p-4 rounded-xl border border-surface-200 bg-white shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading font-bold text-ink text-sm">{i.role}</h3>
                      <p className="text-xs font-semibold text-primary-600">{i.company} • <span className="text-surface-500 font-normal">{i.duration}</span></p>
                    </div>

                    <button
                      onClick={() => handleDeleteInternship(i.id)}
                      className="p-1 text-surface-400 hover:text-danger-500 rounded-lg hover:bg-danger-50 transition"
                      title="Delete Internship"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-surface-600 leading-relaxed">{i.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: 1/3 Width */}
        <div className="space-y-6">

          {/* Academic Profile Overview */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-ink text-base">Academic Details</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-surface-100">
                <span className="text-surface-500 font-medium">Department</span>
                <span className="font-bold text-ink">{student.department}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-100">
                <span className="text-surface-500 font-medium">Current Semester</span>
                <span className="font-bold text-ink">7th Semester</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-100">
                <span className="text-surface-500 font-medium">Current CGPA</span>
                <span className="font-bold text-primary-600 text-sm">{student.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-100">
                <span className="text-surface-500 font-medium">10th Percentage</span>
                <span className="font-bold text-ink">{student.tenth_pct || 88}%</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-surface-100">
                <span className="text-surface-500 font-medium">12th Percentage</span>
                <span className="font-bold text-ink">{student.twelfth_pct || 85}%</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-surface-500 font-medium">Active Backlogs</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${student.backlogs === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {student.backlogs} Backlogs
                </span>
              </div>
            </div>
          </div>

          {/* Technical & Soft Skills */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Code className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-bold text-ink text-base">Skills & Competencies</h2>
              </div>
            </div>

            <div className="space-y-3.5">
              {skills.map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-ink">{s.name}</span>
                    <span className="text-surface-500">{s.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications & Achievements */}
          <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="font-heading font-bold text-ink text-base">Certifications</h2>
              </div>
              <button
                onClick={() => setShowAddCert(true)}
                className="text-xs text-primary-600 hover:underline font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {showAddCert && (
              <form onSubmit={handleAddCert} className="mb-3 p-3 bg-surface-50 rounded-xl border border-surface-200 space-y-2">
                <input
                  type="text"
                  placeholder="Certificate Title *"
                  required
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  className="input-field text-xs"
                />
                <input
                  type="text"
                  placeholder="Issuer (e.g. AWS, Coursera)"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="input-field text-xs"
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddCert(false)} className="btn-ghost text-xs py-0.5 px-2">Cancel</button>
                  <button type="submit" className="btn-primary text-xs py-0.5 px-2">Save</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {certifications.map((c) => (
                <div key={c.id} className="p-3 bg-surface-50 rounded-xl border border-surface-100 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-ink">{c.title}</div>
                    <div className="text-surface-500">{c.issuer} {c.year ? `• ${c.year}` : ''}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Resume Upload & Management Section */}
          <div id="resume-section" className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-ink text-base">Resume Manager</h2>
            </div>

            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Resume updated successfully!</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                  PDF
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-ink truncate">{resumeName}</div>
                  <div className="text-[10px] text-surface-500">Verified for Campus Recruitment • 2.4 MB</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`#`}
                  onClick={(e) => { e.preventDefault(); alert(`Simulated Download of ${resumeName}`); }}
                  className="p-2 text-surface-600 hover:text-ink hover:bg-surface-200 rounded-lg transition"
                  title="Download Resume"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Interactive Upload Input */}
            <label className="block w-full cursor-pointer">
              <div className="w-full border-2 border-dashed border-surface-300 hover:border-primary-400 p-4 rounded-xl text-center hover:bg-primary-50/50 transition">
                <Upload className="w-5 h-5 text-surface-400 mx-auto mb-1" />
                <span className="text-xs font-semibold text-primary-600">Upload New Resume (PDF / DOCX)</span>
                <p className="text-[10px] text-surface-400 mt-0.5">Max size: 5MB</p>
              </div>
              <input type="file" accept=".pdf,.docx" onChange={handleResumeChange} className="hidden" />
            </label>
          </div>

        </div>

      </div>

      {/* Edit Contact Info Modal */}
      {editContact && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-surface-200">
            <h3 className="font-heading font-bold text-ink text-base">Edit Contact Details</h3>
            <form onSubmit={handleSaveContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-surface-600 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-surface-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-surface-600 font-semibold mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={contactForm.linkedin}
                  onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-surface-600 font-semibold mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={contactForm.github}
                  onChange={(e) => setContactForm({ ...contactForm, github: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setEditContact(false)} className="btn-ghost text-xs py-2 px-4">Cancel</button>
                <button type="submit" className="btn-primary text-xs py-2 px-4">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
