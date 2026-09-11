import { useState, useMemo } from 'react';
import mockData from '../../data/mockData';
import {
  Users, Search, Filter, BookOpen, Award, Briefcase, Code, FileText,
  ExternalLink, Download, CheckCircle2, ChevronRight, Eye, Sparkles
} from 'lucide-react';

export default function StudentPortfolios() {
  const students = mockData.getStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.student_id || 'STU1001');

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.student_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = deptFilter === 'ALL' || s.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [students, searchTerm, deptFilter]);

  const activeStudent = useMemo(() => {
    return students.find(s => s.student_id === selectedStudentId) || filteredStudents[0] || students[0];
  }, [students, selectedStudentId, filteredStudents]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-heading font-bold text-ink">Student Portfolios Repository</h1>
          </div>
          <p className="mt-1 text-xs text-surface-500 font-medium">
            Review 7th Semester student profiles, verified resumes, technical projects, and placement portfolios.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>{students.length} Verified Student Portfolios</span>
        </div>
      </div>

      {/* Two-Column Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Student Directory List (4/12 width) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-surface-200 shadow-sm p-4 space-y-4">
          
          {/* Search & Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-surface-400" />
              <input
                type="text"
                placeholder="Search student or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field text-xs pl-9 py-2"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              aria-label="Filter by department"
              className="input-field text-xs py-2 bg-white"
            >
              <option value="ALL">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="ISE">ISE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>

          {/* Student List */}
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredStudents.map(s => (
              <button
                key={s.student_id}
                onClick={() => setSelectedStudentId(s.student_id)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                  s.student_id === activeStudent.student_id
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                    : 'bg-white border-surface-100 hover:bg-surface-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center shrink-0">
                    {s.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-ink truncate">{s.name}</div>
                    <div className="text-[10px] text-surface-500">{s.department} • CGPA {s.cgpa}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-surface-200 text-indigo-600">
                    {s.placement_probability}%
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Selected Portfolio Inspector (8/12 width) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-surface-200 shadow-sm p-6 space-y-6">
          
          {/* Header Card */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md text-white font-bold text-xl flex items-center justify-center border border-white/20">
                {activeStudent.name[0]}
              </div>
              <div>
                <h2 className="font-heading font-bold text-base">{activeStudent.name}</h2>
                <p className="text-xs text-slate-300">
                  {activeStudent.department} • 7th Semester • USN: <span className="font-mono text-indigo-300 font-semibold">{activeStudent.student_id}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Placement Probability</div>
              <div className="text-xl font-bold text-emerald-400 font-mono">{activeStudent.placement_probability}%</div>
            </div>
          </div>

          {/* Academic Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-surface-50 rounded-xl border border-surface-100">
              <div className="text-surface-500 text-[10px] font-medium">CGPA</div>
              <div className="font-bold text-ink text-sm mt-0.5">{activeStudent.cgpa} / 10.0</div>
            </div>

            <div className="p-3 bg-surface-50 rounded-xl border border-surface-100">
              <div className="text-surface-500 text-[10px] font-medium">Active Backlogs</div>
              <div className={`font-bold text-sm mt-0.5 ${activeStudent.backlogs === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {activeStudent.backlogs} Backlogs
              </div>
            </div>

            <div className="p-3 bg-surface-50 rounded-xl border border-surface-100">
              <div className="text-surface-500 text-[10px] font-medium">Coding Score</div>
              <div className="font-bold text-ink text-sm mt-0.5">{activeStudent.coding_score} / 100</div>
            </div>

            <div className="p-3 bg-surface-50 rounded-xl border border-surface-100">
              <div className="text-surface-500 text-[10px] font-medium">Communication</div>
              <div className="font-bold text-ink text-sm mt-0.5">{activeStudent.communication_score} / 100</div>
            </div>
          </div>

          {/* Key Portfolio Sections */}
          <div className="space-y-4">
            
            {/* Technical Skills */}
            <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
              <h3 className="font-bold text-xs text-ink mb-2 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-primary-600" /> Verified Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Java', 'Python', 'React', 'SQL', 'Git', 'Data Structures'].map((sk, idx) => (
                  <span key={idx} className="bg-white border border-surface-200 text-surface-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Document Viewer */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">{activeStudent.name.replace(/\s+/g, '_')}_Resume_2026.pdf</div>
                  <div className="text-[10px] text-surface-500">Verified Portfolio Document • Uploaded 2026</div>
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading verified resume for ${activeStudent.name}...`)}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
