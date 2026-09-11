import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import mockData from '../../data/mockData';
import { getStudentById, updateStudent as updateStudentApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  User, BookOpen, Code, Briefcase, MessageSquare, Edit3, Save, X
} from 'lucide-react';

export default function Profile() {
  const { studentId } = useParams();
  const { user } = useAuth();
  const sid = studentId || user?.id || 'STU1001';

  const [student, setStudent] = useState(() => mockData.getStudent(sid) || mockData.students[0]);
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const load = () => {
      const s = mockData.getStudent(sid) || mockData.students[0];
      if (s) setStudent(s);

      getStudentById(sid)
        .then(res => {
          if (isMounted && res.data && res.data.data) {
            setStudent(res.data.data);
          }
        })
        .catch(err => console.warn('API get student notice:', err.message));
    };
    load();
    const unsubscribe = mockData.subscribe(load);
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [sid, user]);

  const activeStudent = student || mockData.students[0] || {};

  const name = activeStudent.name || 'Student Name';
  const initial = name[0] || 'S';
  const displayId = activeStudent.student_id || sid || 'STU1001';
  const dept = activeStudent.department || 'CSE';
  const sem = activeStudent.semester || 7;
  const placementProb = activeStudent.placement_probability !== undefined ? activeStudent.placement_probability : 75;
  const readiness = activeStudent.readiness_status || 'Ready';

  const cgpa = typeof activeStudent.cgpa === 'number' ? activeStudent.cgpa : parseFloat(activeStudent.cgpa || 7.5);
  const tenth = typeof activeStudent.tenth_pct === 'number' ? activeStudent.tenth_pct : parseFloat(activeStudent.tenth_pct || 80);
  const twelfth = typeof activeStudent.twelfth_pct === 'number' ? activeStudent.twelfth_pct : parseFloat(activeStudent.twelfth_pct || 80);
  const backlogs = activeStudent.backlogs !== undefined ? activeStudent.backlogs : 0;

  const codingScore = Math.round(parseFloat(activeStudent.coding_score || 70));
  const commScore = Math.round(parseFloat(activeStudent.communication_score || 70));
  const aptScore = Math.round(parseFloat(activeStudent.aptitude_score || 70));
  const presScore = Math.round(parseFloat(activeStudent.presentation_score || 70));

  const projectsCount = activeStudent.projects_count !== undefined ? activeStudent.projects_count : 2;
  const internshipsCount = activeStudent.internships_count !== undefined ? activeStudent.internships_count : 1;
  const hackathonsCount = activeStudent.hackathons_count !== undefined ? activeStudent.hackathons_count : 0;
  const certsCount = activeStudent.certifications_count !== undefined ? activeStudent.certifications_count : 1;

  const startEdit = () => {
    setFormData({
      name,
      email: activeStudent.email || `${name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      phone: activeStudent.phone || '+91 98765 43210',
      department: dept,
      semester: sem,
      cgpa,
      tenth_pct: tenth,
      twelfth_pct: twelfth,
      backlogs,
      coding_score: codingScore,
      communication_score: commScore,
      aptitude_score: aptScore,
      presentation_score: presScore,
      projects_count: projectsCount,
      internships_count: internshipsCount,
      hackathons_count: hackathonsCount,
      skill_python: activeStudent.skill_python || 70,
      skill_java: activeStudent.skill_java || 75,
      skill_react: activeStudent.skill_react || 70,
      skill_sql: activeStudent.skill_sql || 75,
      skill_git: activeStudent.skill_git || 80,
      skill_cloud: activeStudent.skill_cloud || 60,
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormData(null);
  };

  const handleFormChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!formData) return;

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      semester: parseInt(formData.semester, 10) || 7,
      cgpa: parseFloat(formData.cgpa) || 7.5,
      tenth_pct: parseFloat(formData.tenth_pct) || 80,
      twelfth_pct: parseFloat(formData.twelfth_pct) || 80,
      backlogs: parseInt(formData.backlogs, 10) || 0,
      coding_score: parseFloat(formData.coding_score) || 70,
      communication_score: parseFloat(formData.communication_score) || 70,
      aptitude_score: parseFloat(formData.aptitude_score) || 70,
      presentation_score: parseFloat(formData.presentation_score) || 70,
      projects_count: parseInt(formData.projects_count, 10) || 0,
      internships_count: parseInt(formData.internships_count, 10) || 0,
      hackathons_count: parseInt(formData.hackathons_count, 10) || 0,
      skill_python: parseFloat(formData.skill_python) || 70,
      skill_java: parseFloat(formData.skill_java) || 75,
      skill_react: parseFloat(formData.skill_react) || 70,
      skill_sql: parseFloat(formData.skill_sql) || 75,
      skill_git: parseFloat(formData.skill_git) || 80,
      skill_cloud: parseFloat(formData.skill_cloud) || 60,
    };

    try {
      await updateStudentApi(displayId, payload);
    } catch (err) {
      console.warn('API update student notice:', err.message);
    }

    const updated = mockData.updateStudent(displayId, payload);

    if (updated) {
      setStudent(updated);
      setEditing(false);
      if (toast && toast.success) {
        toast.success('Profile updated & placement probability recalculated!');
      } else {
        alert('Profile updated & placement probability recalculated!');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 font-bold text-xl flex items-center justify-center shrink-0">
            {initial}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-heading font-bold text-ink">{name}</h1>
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
                {displayId}
              </span>
            </div>
            <p className="text-xs text-surface-500 font-medium mt-0.5">
              {dept} • {sem}th Semester • Placement Readiness: <strong className="text-indigo-600 font-mono">{placementProb}% Match ({readiness})</strong>
            </p>
          </div>
        </div>

        {!editing ? (
          <button onClick={startEdit} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm">
            <Edit3 className="w-4 h-4" /> Edit Profile Data
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancelEdit} className="btn-ghost text-xs py-2 px-3 flex items-center gap-1">
              <X className="w-4 h-4" /> Cancel
            </button>
            <button onClick={saveEdit} className="btn-primary text-xs py-2 px-4 flex items-center gap-1 shadow-sm bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        )}
      </div>

      {/* EDITING FORM VIEW */}
      {editing && formData ? (
        <form onSubmit={saveEdit} className="space-y-6">
          
          {/* Section 1: Personal & Contact */}
          <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
              <User className="w-4 h-4 text-indigo-600" />
              <h2 className="font-heading font-bold text-ink text-sm">Personal & Contact Info</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleFormChange('department', e.target.value)}
                  className="input-field text-xs bg-white"
                >
                  <option value="CSE">CSE</option>
                  <option value="ISE">ISE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Semester</label>
                <input
                  type="number"
                  min="5"
                  max="8"
                  value={formData.semester}
                  onChange={(e) => handleFormChange('semester', e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <h2 className="font-heading font-bold text-ink text-sm">Academic Performance</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 mb-1">CGPA (0 - 10.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={formData.cgpa}
                  onChange={(e) => handleFormChange('cgpa', e.target.value)}
                  className="input-field text-xs font-bold text-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">10th Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.tenth_pct}
                  onChange={(e) => handleFormChange('tenth_pct', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">12th Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.twelfth_pct}
                  onChange={(e) => handleFormChange('twelfth_pct', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Active Backlogs</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.backlogs}
                  onChange={(e) => handleFormChange('backlogs', e.target.value)}
                  className="input-field text-xs font-bold text-rose-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Assessment Cutoffs & Scores */}
          <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h2 className="font-heading font-bold text-ink text-sm">Assessment Scores (0 - 100)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 mb-1">Coding Assessment</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.coding_score}
                  onChange={(e) => handleFormChange('coding_score', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Communication Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.communication_score}
                  onChange={(e) => handleFormChange('communication_score', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Quantitative Aptitude</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.aptitude_score}
                  onChange={(e) => handleFormChange('aptitude_score', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Presentation Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.presentation_score}
                  onChange={(e) => handleFormChange('presentation_score', e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Skills & Projects */}
          <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-surface-100">
              <Code className="w-4 h-4 text-purple-600" />
              <h2 className="font-heading font-bold text-ink text-sm">Skills & Project Counts</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 mb-1">Python Skill (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.skill_python}
                  onChange={(e) => handleFormChange('skill_python', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Java Skill (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.skill_java}
                  onChange={(e) => handleFormChange('skill_java', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">React Skill (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.skill_react}
                  onChange={(e) => handleFormChange('skill_react', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">SQL Skill (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.skill_sql}
                  onChange={(e) => handleFormChange('skill_sql', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Projects Count</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.projects_count}
                  onChange={(e) => handleFormChange('projects_count', e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-surface-700 mb-1">Internships Count</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.internships_count}
                  onChange={(e) => handleFormChange('internships_count', e.target.value)}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>

          {/* Form Controls Footer */}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={cancelEdit} className="btn-ghost text-xs py-2.5 px-5">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-2.5 px-6 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 shadow-md">
              <Save className="w-4 h-4" />
              <span>Save & Recalculate Placement Score</span>
            </button>
          </div>

        </form>
      ) : (
        /* READ-ONLY VIEW */
        <>
          {/* Personal Info */}
          <Section icon={User} title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="Full Name" value={name} />
              <Field label="Student ID" value={displayId} />
              <Field label="Department" value={dept} />
              <Field label="Semester" value={`${sem}th Semester`} />
              <Field label="Email" value={activeStudent.email || `${name.toLowerCase().replace(/\s+/g, '.')}@college.edu`} />
              <Field label="Phone" value={activeStudent.phone || '+91 98765 43210'} />
            </div>
          </Section>

          {/* Academic */}
          <Section icon={BookOpen} title="Academic Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FieldCard label="CGPA" value={cgpa} sub="/10.0" color={cgpa >= 7.5 ? 'success' : cgpa >= 6 ? 'warning' : 'danger'} />
              <FieldCard label="10th Percentage" value={`${tenth}%`} color={tenth >= 75 ? 'success' : 'warning'} />
              <FieldCard label="12th Percentage" value={`${twelfth}%`} color={twelfth >= 70 ? 'success' : 'warning'} />
              <FieldCard label="Backlogs" value={`${backlogs} Backlogs`} color={backlogs === 0 ? 'success' : 'danger'} />
            </div>
          </Section>

          {/* Technical Skills */}
          <Section icon={Code} title="Technical Skills">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { skill: 'Java', level: activeStudent.skill_java || 75 },
                { skill: 'Python', level: activeStudent.skill_python || 70 },
                { skill: 'React', level: activeStudent.skill_react || 70 },
                { skill: 'SQL', level: activeStudent.skill_sql || 75 },
                { skill: 'Git', level: activeStudent.skill_git || 80 },
                { skill: 'Cloud (AWS)', level: activeStudent.skill_cloud || 60 },
              ].map((sk, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-surface-50 rounded-lg">
                  <span className="text-xs font-medium text-ink w-24">{sk.skill}</span>
                  <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        sk.level >= 75 ? 'bg-emerald-500' : sk.level >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${sk.level}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-surface-600 w-10 text-right">{sk.level}%</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Practical Experience */}
          <Section icon={Briefcase} title="Practical Experience">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <FieldCard label="Projects" value={projectsCount} sub="Completed" color="primary" />
              <FieldCard label="Internships" value={internshipsCount} sub="Completed" color={internshipsCount >= 1 ? 'success' : 'warning'} />
              <FieldCard label="Hackathons" value={hackathonsCount} sub="Participated" color="primary" />
              <FieldCard label="Certifications" value={certsCount} sub="Verified" color="secondary" />
            </div>
          </Section>

          {/* Soft Skills */}
          <Section icon={MessageSquare} title="Assessment Scores">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SkillBar label="Coding Assessment" value={codingScore} />
              <SkillBar label="Communication" value={commScore} />
              <SkillBar label="Aptitude" value={aptScore} />
              <SkillBar label="Presentation" value={presScore} />
            </div>
          </Section>
        </>
      )}

    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
      <h2 className="flex items-center gap-2 text-base font-heading font-semibold text-ink mb-4">
        <Icon className="w-5 h-5 text-indigo-600" /> {title}
      </h2>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-surface-500 font-medium">{label}</p>
      <p className="text-sm text-ink font-medium mt-0.5">{value || '—'}</p>
    </div>
  );
}

function FieldCard({ label, value, sub }) {
  return (
    <div className="p-3 bg-surface-50 border border-surface-100 rounded-xl">
      <p className="text-xs text-surface-500">{label}</p>
      <p className="text-xl font-heading font-bold text-ink mt-0.5">
        {value}
        {sub && <span className="text-xs font-normal text-surface-500 ml-1">{sub}</span>}
      </p>
    </div>
  );
}

function SkillBar({ label, value }) {
  const color = value >= 75 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-surface-600 font-medium">{label}</span>
        <span className="font-bold text-ink">{value}%</span>
      </div>
      <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
