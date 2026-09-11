import { useState, useMemo, useEffect } from 'react';
import { mockData } from '../../data/mockData';
import { getCompanies as fetchCompaniesApi, updateCompanyCutoffs, createCompany as createCompanyApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import {
  Building2, Users, ChevronDown, ChevronUp, CheckCircle2, Edit3,
  Plus, Sliders, X, Check, Award, Code, BookOpen
} from 'lucide-react';

const DEPARTMENTS = ['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'];

export default function Companies() {
  const toast = useToast();
  const [companies, setCompanies] = useState(() => mockData.companies);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCompaniesApi()
      .then(res => {
        if (isMounted && res.data && res.data.data) {
          setCompanies(res.data.data);
        }
      })
      .catch(err => {
        console.warn('API fetch companies notice:', err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    const unsub = mockData.subscribe(() => {
      setCompanies([...mockData.companies]);
    });
    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [editingCompany, setEditingCompany] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filtered = companies.filter(c =>
    !search ||
    c.company_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.role || c.job_role || '').toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Company Eligibility Criteria &amp; Drives</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Configure campus recruiter eligibility thresholds, minimum CGPA, backlog limits, and required skills
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary text-xs inline-flex items-center gap-2 py-2 px-4 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Company Drive</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          className="input-field max-w-md text-xs"
          placeholder="Search companies, roles, or industry..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <span className="text-xs text-surface-500 font-medium">
          Total: <strong className="text-ink">{filtered.length}</strong> companies
        </span>
      </div>

      <div className="space-y-4">
        {filtered.map((c, i) => {
          const isOpen = expanded === i;
          const recommended = isOpen ? mockData.getRecommendedStudents(c.company_id) : [];
          const minCGPA = c.minimumCGPA !== undefined ? c.minimumCGPA : c.min_cgpa;
          const allowedBranches = c.allowedBranches || c.eligible_departments || [];
          const reqSkills = c.requiredSkills || c.required_skills || [];
          const maxBacklogs = c.maximumBacklogs !== undefined ? c.maximumBacklogs : c.max_backlogs;

          return (
            <div key={c.company_id} className="card overflow-hidden shadow-card">
              <div className="w-full p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-surface-50/50 transition-colors gap-4">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpanded(isOpen ? null : i)}>
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-heading font-bold text-lg shadow-2xs">
                    {c.company_name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-bold text-ink text-base">{c.company_name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Completed' ? 'bg-surface-100 text-surface-600' :
                        c.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {c.status || 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {c.role || c.job_role} • {c.industry} • <strong className="text-emerald-700 font-semibold">{c.package}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-surface-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-surface-600">
                    <span className="bg-surface-100 px-2 py-1 rounded font-mono">Min CGPA: <strong>{parseFloat(minCGPA).toFixed(1)}</strong></span>
                    <span className="bg-surface-100 px-2 py-1 rounded font-mono">Max Backlogs: <strong>{maxBacklogs || 0}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCompany(c)}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Edit Criteria</span>
                    </button>

                    <button
                      onClick={() => setExpanded(isOpen ? null : i)}
                      className="p-2 rounded-lg text-surface-400 hover:text-ink hover:bg-surface-100"
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-surface-100 bg-surface-50/30 animate-fade-in space-y-4 pt-4">
                  {/* Detailed Eligibility Rules Display */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-surface-200">
                      <p className="text-[11px] text-surface-500 font-medium">Allowed Branches</p>
                      <p className="font-semibold text-ink mt-0.5">{allowedBranches.join(', ')}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-surface-200">
                      <p className="text-[11px] text-surface-500 font-medium">Required Skills</p>
                      <p className="font-semibold text-ink mt-0.5">{reqSkills.join(', ')}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-surface-200">
                      <p className="text-[11px] text-surface-500 font-medium">Required Assessment Scores</p>
                      <p className="font-semibold text-ink mt-0.5">
                        Coding ≥ {c.minimumCodingScore || 60}% | Comm ≥ {c.minimumCommunicationScore || 60}%
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-surface-200">
                      <p className="text-[11px] text-surface-500 font-medium">Recruitment Stats</p>
                      <p className="font-semibold text-ink mt-0.5">
                        {c.students_shortlisted || 0} Shortlisted • {c.students_selected || 0} Hired
                      </p>
                    </div>
                  </div>

                  {/* Recommended students */}
                  <div>
                    <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-primary-600" />
                      Eligible Student Matches for {c.company_name} ({recommended.length})
                    </h4>
                    {recommended.length > 0 ? (
                      <div className="overflow-x-auto card">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-surface-200 bg-surface-50/75">
                              <th className="py-2 px-3 font-semibold text-surface-600">Student</th>
                              <th className="py-2 px-3 font-semibold text-surface-600">Dept</th>
                              <th className="py-2 px-3 font-semibold text-surface-600">CGPA</th>
                              <th className="py-2 px-3 font-semibold text-surface-600">Match Score</th>
                              <th className="py-2 px-3 font-semibold text-surface-600">Matching Factors</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-surface-100">
                            {recommended.slice(0, 6).map((s, j) => (
                              <tr key={j} className="hover:bg-surface-50">
                                <td className="py-2 px-3 font-semibold text-ink">{s.name} ({s.student_id})</td>
                                <td className="py-2 px-3">{s.department}</td>
                                <td className="py-2 px-3 font-mono font-semibold">{s.cgpa}</td>
                                <td className="py-2 px-3">
                                  <span className="font-bold text-emerald-600">{s.match_pct}%</span>
                                </td>
                                <td className="py-2 px-3">
                                  <div className="flex flex-wrap gap-1">
                                    {s.reasons.slice(0, 3).map((r, k) => (
                                      <span key={k} className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded flex items-center gap-0.5">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {r}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-xs text-surface-400 italic py-2">No eligible students found matching this criteria.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Company Criteria Modal */}
      {editingCompany && (
        <CompanyCriteriaModal
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSuccess={(updated) => {
            setEditingCompany(null);
            toast.success(`Criteria updated for ${updated.company_name}. Student eligibility recalculated across system.`);
          }}
        />
      )}

      {/* Add Company Drive Modal */}
      {isAddModalOpen && (
        <CompanyCriteriaModal
          mode="add"
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(created) => {
            setIsAddModalOpen(false);
            toast.success(`Company drive ${created.company_name} added successfully.`);
          }}
        />
      )}
    </div>
  );
}

function CompanyCriteriaModal({ company, onClose, onSuccess, mode = 'edit' }) {
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState(() => {
    if (company) {
      return {
        company_name: company.company_name || '',
        role: company.role || company.job_role || 'Software Engineer',
        industry: company.industry || 'Technology',
        minimumCGPA: company.minimumCGPA !== undefined ? company.minimumCGPA : (company.min_cgpa || 7.0),
        maximumBacklogs: company.maximumBacklogs !== undefined ? company.maximumBacklogs : (company.max_backlogs || 0),
        allowedBranches: company.allowedBranches || company.eligible_departments || ['CSE', 'ISE', 'ECE'],
        requiredSkills: (company.requiredSkills || company.required_skills || []).join(', '),
        minimumCodingScore: company.minimumCodingScore || 60,
        minimumCommunicationScore: company.minimumCommunicationScore || 60,
        minimumAptitudeScore: company.minimumAptitudeScore || 60,
        package: company.package || '7.5 LPA',
        status: company.status || 'Ongoing'
      };
    }
    return {
      company_name: '',
      role: 'Software Engineer',
      industry: 'IT Services',
      minimumCGPA: 7.0,
      maximumBacklogs: 0,
      allowedBranches: ['CSE', 'ISE', 'ECE'],
      requiredSkills: 'Java, SQL, Python',
      minimumCodingScore: 60,
      minimumCommunicationScore: 60,
      minimumAptitudeScore: 60,
      package: '8.0 LPA',
      status: 'Ongoing'
    };
  });

  const handleBranchToggle = (branch) => {
    const current = formData.allowedBranches;
    if (current.includes(branch)) {
      setFormData({ ...formData, allowedBranches: current.filter(b => b !== branch) });
    } else {
      setFormData({ ...formData, allowedBranches: [...current, branch] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      minimumCGPA: parseFloat(formData.minimumCGPA) || 6.0,
      min_cgpa: parseFloat(formData.minimumCGPA) || 6.0,
      maximumBacklogs: parseInt(formData.maximumBacklogs, 10) || 0,
      max_backlogs: parseInt(formData.maximumBacklogs, 10) || 0,
      minimumCodingScore: parseInt(formData.minimumCodingScore, 10) || 60,
      minimumCommunicationScore: parseInt(formData.minimumCommunicationScore, 10) || 60,
      minimumAptitudeScore: parseInt(formData.minimumAptitudeScore, 10) || 60,
      requiredSkills: typeof formData.requiredSkills === 'string' ? formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : formData.requiredSkills,
      eligible_departments: formData.allowedBranches || ['CSE', 'ISE'],
    };

    try {
      if (isEdit) {
        await updateCompanyCutoffs(company.company_id || company._id, payload);
        const updated = mockData.updateCompanyCriteria(company.company_id, payload);
        onSuccess(updated);
      } else {
        await createCompanyApi(payload);
        const created = mockData.addCompany(payload);
        onSuccess(created);
      }
    } catch (err) {
      console.warn('API update notice:', err.message);
      if (isEdit) {
        const updated = mockData.updateCompanyCriteria(company.company_id, payload);
        onSuccess(updated);
      } else {
        const created = mockData.addCompany(payload);
        onSuccess(created);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full z-10 overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50/50">
          <div>
            <h3 className="font-heading text-lg font-bold text-ink">
              {isEdit ? `Edit Criteria: ${company.company_name}` : 'Add Campus Recruiter Criteria'}
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">
              Configured criteria drives the student eligibility engine
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-surface-400 hover:text-ink hover:bg-surface-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 overflow-y-auto text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-ink mb-1">Company Name</label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink mb-1">Job Role</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="input-field text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-ink mb-1">Minimum CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.minimumCGPA}
                onChange={e => setFormData({ ...formData, minimumCGPA: e.target.value })}
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink mb-1">Max Backlogs Allowed</label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.maximumBacklogs}
                onChange={e => setFormData({ ...formData, maximumBacklogs: e.target.value })}
                className="input-field text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-ink mb-1">Package Offered</label>
              <input
                type="text"
                value={formData.package}
                onChange={e => setFormData({ ...formData, package: e.target.value })}
                className="input-field text-xs"
              />
            </div>
          </div>

          {/* Allowed Branches Multi-select Checkboxes */}
          <div>
            <label className="block font-semibold text-ink mb-1.5">Eligible Departments</label>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map(d => {
                const checked = formData.allowedBranches.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleBranchToggle(d)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      checked
                        ? 'bg-primary-600 text-white border-primary-600 shadow-2xs'
                        : 'bg-white text-surface-600 border-surface-200 hover:border-surface-300'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3" />}
                    <span>{d}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-ink mb-1">Required Skills (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Java, SQL, Python, React"
              value={formData.requiredSkills}
              onChange={e => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="input-field text-xs"
            />
          </div>

          {/* Assessment Score Cutoffs */}
          <div className="pt-2 border-t border-surface-100">
            <label className="block font-bold text-surface-500 uppercase tracking-wider text-[10px] mb-2">
              Assessment Cutoff Thresholds (%)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-surface-700 font-medium mb-1">Min Coding Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.minimumCodingScore}
                  onChange={e => setFormData({ ...formData, minimumCodingScore: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-surface-700 font-medium mb-1">Min Comm Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.minimumCommunicationScore}
                  onChange={e => setFormData({ ...formData, minimumCommunicationScore: e.target.value })}
                  className="input-field text-xs"
                />
              </div>

              <div>
                <label className="block text-surface-700 font-medium mb-1">Min Aptitude Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.minimumAptitudeScore}
                  onChange={e => setFormData({ ...formData, minimumAptitudeScore: e.target.value })}
                  className="input-field text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-ink mb-1">Drive Status</label>
            <select
              className="select-field text-xs"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Ongoing">Ongoing (Active Drive)</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="pt-4 border-t border-surface-200 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs shadow-sm">
              {isEdit ? 'Save Eligibility Criteria' : 'Add Drive'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
