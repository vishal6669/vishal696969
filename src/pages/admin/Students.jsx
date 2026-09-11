import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { mockData } from '../../data/mockData';
import { getStudents as getStudentsApi, createStudent, updateStudent as updateStudentApi, deleteStudent as deleteStudentApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import {
  Search, Filter, UserPlus, Eye, Edit3, Trash2, ShieldCheck, ShieldAlert,
  X, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle,
  RotateCcw, Download, BookOpen, Award, Code, Briefcase,
  GraduationCap, Building2, Check, ExternalLink, Activity
} from 'lucide-react';

const DEPARTMENTS = ['All', 'CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const SEMESTERS = ['All', '5', '6', '7', '8'];
const READINESS_LEVELS = ['All', 'Ready', 'Near-Ready', 'Needs Training'];
const PLACEMENT_STATUSES = [
  'All', 'Selected', 'Shortlisted', 'Interview Scheduled', 'Eligible', 'Not Selected', 'Training Required'
];
const ACCESS_STATUSES = ['All', 'Active', 'Disabled'];

const PAGE_SIZE = 10;

export default function Students() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Reactive students list from mockData and MongoDB Atlas
  const [students, setStudents] = useState(() => mockData.students);

  useEffect(() => {
    let isMounted = true;
    getStudentsApi()
      .then(res => {
        if (isMounted && res.data && res.data.data && res.data.data.length > 0) {
          setStudents(res.data.data);
        }
      })
      .catch(err => console.warn('API fetch students notice:', err.message));

    const unsub = mockData.subscribe((updated) => {
      setStudents([...updated]);
    });
    return () => {
      isMounted = false;
      unsub();
    };
  }, []);

  // Filter States initialized from URL params or defaults
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [deptFilter, setDeptFilter] = useState(searchParams.get('dept') || 'All');
  const [semFilter, setSemFilter] = useState(searchParams.get('sem') || 'All');
  const [readinessFilter, setReadinessFilter] = useState(searchParams.get('readiness') || 'All');
  const [placementFilter, setPlacementFilter] = useState(searchParams.get('placement') || 'All');
  const [accessFilter, setAccessFilter] = useState(searchParams.get('access') || 'All');

  // Sorting
  const [sortCol, setSortCol] = useState('student_id');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  // Modals and Drawer state
  const [profileStudent, setProfileStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Sync URL search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (deptFilter !== 'All') params.set('dept', deptFilter);
    if (semFilter !== 'All') params.set('sem', semFilter);
    if (readinessFilter !== 'All') params.set('readiness', readinessFilter);
    if (placementFilter !== 'All') params.set('placement', placementFilter);
    if (accessFilter !== 'All') params.set('access', accessFilter);
    setSearchParams(params, { replace: true });
  }, [search, deptFilter, semFilter, readinessFilter, placementFilter, accessFilter, setSearchParams]);

  // Handle URL query changes if navigated from other pages
  useEffect(() => {
    const qDept = searchParams.get('dept');
    const qReadiness = searchParams.get('readiness');
    const qAccess = searchParams.get('access');
    const qPlacement = searchParams.get('placement');
    const qQuery = searchParams.get('q');

    if (qDept && DEPARTMENTS.includes(qDept)) setDeptFilter(qDept);
    if (qReadiness && READINESS_LEVELS.includes(qReadiness)) setReadinessFilter(qReadiness);
    if (qAccess) {
      const formatted = qAccess.charAt(0).toUpperCase() + qAccess.slice(1).toLowerCase();
      if (ACCESS_STATUSES.includes(formatted)) setAccessFilter(formatted);
    }
    if (qPlacement && PLACEMENT_STATUSES.includes(qPlacement)) setPlacementFilter(qPlacement);
    if (qQuery) setSearch(qQuery);
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearch('');
    setDeptFilter('All');
    setSemFilter('All');
    setReadinessFilter('All');
    setPlacementFilter('All');
    setAccessFilter('All');
    setPage(1);
    toast.info('Filters have been reset.');
  };

  const hasActiveFilters = search || deptFilter !== 'All' || semFilter !== 'All' ||
    readinessFilter !== 'All' || placementFilter !== 'All' || accessFilter !== 'All';

  // Filtered & Sorted Student List
  const filteredStudents = useMemo(() => {
    let list = [...students];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(s =>
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.student_id && s.student_id.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q))
      );
    }

    if (deptFilter !== 'All') {
      list = list.filter(s => s.department === deptFilter);
    }

    if (semFilter !== 'All') {
      list = list.filter(s => String(s.semester) === String(semFilter));
    }

    if (readinessFilter !== 'All') {
      list = list.filter(s => s.readiness_status === readinessFilter);
    }

    if (placementFilter !== 'All') {
      list = list.filter(s => s.placement_status === placementFilter);
    }

    if (accessFilter !== 'All') {
      const targetStatus = accessFilter.toLowerCase();
      list = list.filter(s => (s.accountStatus || 'active').toLowerCase() === targetStatus);
    }

    list.sort((a, b) => {
      let va = a[sortCol];
      let vb = b[sortCol];

      if (sortCol === 'student_id') {
        va = a.student_id;
        vb = b.student_id;
      } else if (sortCol === 'name') {
        va = (a.name || '').toLowerCase();
        vb = (b.name || '').toLowerCase();
      } else {
        va = va ?? 0;
        vb = vb ?? 0;
      }

      if (va === vb) return 0;
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

    return list;
  }, [students, search, deptFilter, semFilter, readinessFilter, placementFilter, accessFilter, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = useMemo(() => {
    return filteredStudents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  // Student Actions
  const handleToggleAccess = (student, e) => {
    if (e) e.stopPropagation();
    const isCurrentlyActive = (student.accountStatus || 'active') === 'active';
    const newStatus = isCurrentlyActive ? 'disabled' : 'active';
    mockData.setStudentStatus(student.student_id, newStatus);

    if (newStatus === 'disabled') {
      toast.warning(`Student access disabled for ${student.name} (${student.student_id}).`);
    } else {
      toast.success(`Student access restored for ${student.name} (${student.student_id}).`);
    }

    // Update opened drawer student if matched
    if (profileStudent && profileStudent.student_id === student.student_id) {
      setProfileStudent(prev => ({ ...prev, accountStatus: newStatus, account_status: newStatus }));
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingStudent) return;
    const { student_id, name } = deletingStudent;
    mockData.deleteStudent(student_id);
    toast.success(`Student ${name} (${student_id}) removed successfully.`);
    setDeletingStudent(null);
    if (profileStudent && profileStudent.student_id === student_id) {
      setProfileStudent(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Student Management</h1>
          <p className="text-sm text-surface-500 mt-1">
            Institutional directory, academic credentials, and placement readiness access control
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary inline-flex items-center gap-2 text-sm shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              className="input-field pl-9 text-sm"
              placeholder="Search students by name, ID, or email..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div>
            <select
              className="select-field text-sm"
              value={deptFilter}
              onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
            >
              {DEPARTMENTS.map(d => (
                <option key={d} value={d}>{d === 'All' ? 'Department: All' : d}</option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <select
              className="select-field text-sm"
              value={semFilter}
              onChange={e => { setSemFilter(e.target.value); setPage(1); }}
            >
              {SEMESTERS.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'Semester: All' : `Sem ${s}`}</option>
              ))}
            </select>
          </div>

          {/* Readiness Filter */}
          <div>
            <select
              className="select-field text-sm"
              value={readinessFilter}
              onChange={e => { setReadinessFilter(e.target.value); setPage(1); }}
            >
              {READINESS_LEVELS.map(r => (
                <option key={r} value={r}>{r === 'All' ? 'Readiness: All' : r}</option>
              ))}
            </select>
          </div>

          {/* Placement Status Filter */}
          <div>
            <select
              className="select-field text-sm"
              value={placementFilter}
              onChange={e => { setPlacementFilter(e.target.value); setPage(1); }}
            >
              {PLACEMENT_STATUSES.map(p => (
                <option key={p} value={p}>{p === 'All' ? 'Placement: All' : p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Access Status & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-surface-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-surface-500">Access:</span>
            <div className="inline-flex rounded-lg border border-surface-200 bg-surface-50 p-0.5">
              {ACCESS_STATUSES.map(status => (
                <button
                  key={status}
                  onClick={() => { setAccessFilter(status); setPage(1); }}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    accessFilter === status
                      ? 'bg-white text-ink shadow-sm'
                      : 'text-surface-600 hover:text-ink'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-surface-500 font-medium">
              Showing <strong className="text-ink">{filteredStudents.length}</strong> of {students.length} students
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-800 font-medium cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="card overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50/75">
                <th
                  className="table-header cursor-pointer select-none hover:text-primary-700"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student</span>
                    {sortCol === 'name' && (
                      <span className="text-primary-600 font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer select-none hover:text-primary-700"
                  onClick={() => handleSort('student_id')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>ID</span>
                    {sortCol === 'student_id' && (
                      <span className="text-primary-600 font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer select-none hover:text-primary-700"
                  onClick={() => handleSort('department')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Department</span>
                    {sortCol === 'department' && (
                      <span className="text-primary-600 font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer select-none hover:text-primary-700"
                  onClick={() => handleSort('cgpa')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>CGPA</span>
                    {sortCol === 'cgpa' && (
                      <span className="text-primary-600 font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer select-none hover:text-primary-700"
                  onClick={() => handleSort('readiness_status')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Readiness</span>
                    {sortCol === 'readiness_status' && (
                      <span className="text-primary-600 font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer select-none hover:text-primary-700"
                  onClick={() => handleSort('placement_probability')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Placement</span>
                    {sortCol === 'placement_probability' && (
                      <span className="text-primary-600 font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="table-header">Access</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <p className="text-sm font-medium text-surface-500">No students match the selected criteria.</p>
                    <button onClick={handleResetFilters} className="btn-secondary text-xs mt-3">
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                pageData.map((s) => {
                  const isActive = (s.accountStatus || 'active') === 'active';
                  const prob = Math.round(s.placement_probability || 0);

                  return (
                    <tr
                      key={s.student_id}
                      onClick={() => setProfileStudent(s)}
                      className={`table-row cursor-pointer transition-colors ${
                        !isActive ? 'bg-surface-50/50 opacity-80' : ''
                      }`}
                    >
                      {/* Student Name & Email */}
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                            isActive
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-surface-200 text-surface-600'
                          }`}>
                            {s.name ? s.name[0] : 'S'}
                          </div>
                          <div>
                            <p className="font-semibold text-ink text-sm hover:text-primary-600 transition-colors">
                              {s.name}
                            </p>
                            <p className="text-xs text-surface-500">{s.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="table-cell">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-100 text-surface-800 border border-surface-200">
                          {s.student_id}
                        </span>
                      </td>

                      {/* Department & Semester */}
                      <td className="table-cell">
                        <span className="text-sm font-medium text-ink">{s.department}</span>
                        <span className="text-xs text-surface-500 block">Sem {s.semester}</span>
                      </td>

                      {/* CGPA */}
                      <td className="table-cell">
                        <span className={`inline-block font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          s.cgpa >= 8.0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          s.cgpa >= 7.0 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {parseFloat(s.cgpa).toFixed(2)}
                        </span>
                        {s.backlogs > 0 && (
                          <span className="block text-[11px] text-danger-600 font-medium mt-0.5">
                            {s.backlogs} {s.backlogs === 1 ? 'backlog' : 'backlogs'}
                          </span>
                        )}
                      </td>

                      {/* Readiness Badge */}
                      <td className="table-cell">
                        <ReadinessBadge status={s.readiness_status} />
                      </td>

                      {/* Placement Probability & Status */}
                      <td className="table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-ink">{prob}%</span>
                            <div className="w-16 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  prob >= 75 ? 'bg-emerald-500' :
                                  prob >= 60 ? 'bg-amber-500' :
                                  'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, prob)}%` }}
                              />
                            </div>
                          </div>
                          <PlacementStatusBadge status={s.placement_status} />
                        </div>
                      </td>

                      {/* Access Status Badge */}
                      <td className="table-cell">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="table-cell text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {/* View Profile */}
                          <button
                            title="View Student Profile"
                            onClick={() => setProfileStudent(s)}
                            className="p-1.5 rounded-lg text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Student */}
                          <button
                            title="Edit Student Information"
                            onClick={() => setEditingStudent(s)}
                            className="p-1.5 rounded-lg text-surface-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Toggle Access (Disable / Enable) */}
                          <button
                            title={isActive ? 'Disable Student Access' : 'Enable Student Access'}
                            onClick={(e) => handleToggleAccess(s, e)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'text-surface-500 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-surface-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {isActive ? (
                              <ShieldAlert className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </button>

                          {/* Remove Student */}
                          <button
                            title="Remove Student"
                            onClick={() => setDeletingStudent(s)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-surface-200 gap-3 bg-surface-50/50">
          <p className="text-xs text-surface-500">
            Showing <span className="font-semibold text-ink">{filteredStudents.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}</span> to{' '}
            <span className="font-semibold text-ink">{Math.min(currentPage * PAGE_SIZE, filteredStudents.length)}</span> of{' '}
            <span className="font-semibold text-ink">{filteredStudents.length}</span> students
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-surface-200 text-surface-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                    pageNum === currentPage
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'border border-surface-200 text-surface-600 hover:bg-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-surface-200 text-surface-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Side Drawer: Detailed Student Profile */}
      {profileStudent && (
        <StudentProfileDrawer
          student={profileStudent}
          onClose={() => setProfileStudent(null)}
          onEdit={() => {
            const s = profileStudent;
            setProfileStudent(null);
            setEditingStudent(s);
          }}
          onToggleAccess={() => handleToggleAccess(profileStudent)}
          onDelete={() => {
            const s = profileStudent;
            setProfileStudent(null);
            setDeletingStudent(s);
          }}
        />
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <StudentFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          mode="add"
          onSuccess={(newStudent) => {
            setIsAddModalOpen(false);
            toast.success('Student added successfully.');
            // Automatically select & show profile of new student
            setProfileStudent(newStudent);
          }}
        />
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <StudentFormModal
          isOpen={!!editingStudent}
          initialData={editingStudent}
          onClose={() => setEditingStudent(null)}
          mode="edit"
          onSuccess={(updatedStudent) => {
            setEditingStudent(null);
            toast.success('Student information updated.');
            setProfileStudent(updatedStudent);
          }}
        />
      )}

      {/* Permanent Deletion Confirmation Dialog */}
      {deletingStudent && (
        <DeleteConfirmModal
          student={deletingStudent}
          onClose={() => setDeletingStudent(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

// ── BADGE COMPONENTS ──

function ReadinessBadge({ status }) {
  if (status === 'Ready') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Ready
      </span>
    );
  }
  if (status === 'Near-Ready') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Near-Ready
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
      Needs Training
    </span>
  );
}

function PlacementStatusBadge({ status }) {
  const styles = {
    'Selected': 'bg-purple-50 text-purple-700 border-purple-200',
    'Shortlisted': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Interview Scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
    'Eligible': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Training Required': 'bg-rose-50 text-rose-700 border-rose-200',
    'Not Selected': 'bg-surface-100 text-surface-600 border-surface-200'
  };

  const currentClass = styles[status] || 'bg-surface-100 text-surface-600 border-surface-200';

  return (
    <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded border ${currentClass}`}>
      {status || 'Eligible'}
    </span>
  );
}

// ── STUDENT PROFILE SIDE DRAWER ──

function StudentProfileDrawer({ student, onClose, onEdit, onToggleAccess, onDelete }) {
  const prediction = useMemo(() => mockData.getStudentPrediction(student.student_id), [student.student_id]);
  const explanation = useMemo(() => mockData.getExplanation(student.student_id), [student.student_id]);
  const gaps = useMemo(() => mockData.getSkillGaps(student.student_id, 'Full-Stack Developer'), [student.student_id]);

  const isActive = (student.accountStatus || 'active') === 'active';
  const prob = Math.round(student.placement_probability || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col z-10 animate-slide-in-right overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-6 border-b border-surface-200 bg-surface-50/50 sticky top-0 bg-white/95 backdrop-blur z-20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-bold text-xl ${
                isActive ? 'bg-primary-600 text-white shadow-md' : 'bg-surface-300 text-surface-700'
              }`}>
                {student.name ? student.name[0] : 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-bold text-ink">{student.name}</h2>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {isActive ? 'Active Access' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-surface-500 font-mono mt-0.5">
                  {student.student_id} • {student.department} • Semester {student.semester}
                </p>
                <p className="text-xs text-surface-500">{student.email} • {student.phone}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-surface-400 hover:text-ink hover:bg-surface-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Action Buttons inside drawer */}
          <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-surface-200">
            <button
              onClick={onEdit}
              className="btn-secondary text-xs inline-flex items-center gap-1.5 py-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Information
            </button>

            <button
              onClick={onToggleAccess}
              className={`text-xs inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium transition-colors border ${
                isActive
                  ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {isActive ? (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Disable Access
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Enable Access
                </>
              )}
            </button>

            <button
              onClick={onDelete}
              className="text-xs inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg font-medium text-danger-700 bg-danger-50 border border-danger-200 hover:bg-danger-100 transition-colors ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Student
            </button>
          </div>
        </div>

        {/* Drawer Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Section 1: Placement Prediction Summary */}
          <div className="card p-5 bg-gradient-to-br from-surface-50 to-primary-50/20 border-primary-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Placement Readiness</span>
                <h3 className="text-lg font-heading font-bold text-ink">Institutional Readiness Verdict</h3>
              </div>
              <ReadinessBadge status={student.readiness_status} />
            </div>

            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={prob >= 75 ? 'text-emerald-500' : prob >= 60 ? 'text-amber-500' : 'text-rose-500'}
                    strokeDasharray={`${prob}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-heading font-extrabold text-ink">{prob}%</span>
                  <span className="text-[9px] text-surface-500 font-medium">Probability</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <p className="text-sm text-surface-700">
                  Current Status: <strong className="text-ink">{student.placement_status || 'Eligible'}</strong>
                </p>
                <p className="text-xs text-surface-500 leading-relaxed">
                  Calculated based on normalized 4-dimensional assessment: Academic performance (CGPA, backlog clearance), coding assessments, soft skills aptitude, and practical internships.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Performance Cards */}
          <div>
            <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Academic Performance</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Current CGPA" value={parseFloat(student.cgpa).toFixed(2)} sub="Scale of 10.0" highlight />
              <StatCard label="10th Marks" value={`${student.tenth_pct || 85}%`} sub="Secondary" />
              <StatCard label="12th / Diploma" value={`${student.twelfth_pct || 80}%`} sub="Higher Sec" />
              <StatCard
                label="Backlogs"
                value={student.backlogs || 0}
                sub={student.backlogs > 0 ? 'Action Required' : 'All Clear'}
                danger={student.backlogs > 0}
              />
            </div>
          </div>

          {/* Section 3: Technical Skills with Proficiency Bars */}
          <div>
            <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Technical Competencies</h4>
            <div className="card p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <SkillScoreBar label="Coding Assessment" score={student.coding_score || 60} />
                <SkillScoreBar label="Aptitude & Logic" score={student.aptitude_score || 65} />
                <SkillScoreBar label="Communication" score={student.communication_score || 70} />
                <SkillScoreBar label="Presentation Skills" score={student.presentation_score || 65} />
                <SkillScoreBar label="Python Proficiency" score={student.skill_python || 60} />
                <SkillScoreBar label="SQL & Databases" score={student.skill_sql || 65} />
                <SkillScoreBar label="Git & Version Control" score={student.skill_git || 70} />
                <SkillScoreBar label="Cloud / Infrastructure" score={student.skill_cloud || 50} />
              </div>
            </div>
          </div>

          {/* Section 4: Projects, Internships & Activities */}
          <div>
            <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Portfolio &amp; Activities</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Projects" value={student.projects_count || 0} sub="Completed" />
              <StatCard label="Internships" value={student.internships_count || 0} sub="Verified" />
              <StatCard label="Certifications" value={student.certifications_count || 0} sub="Credentials" />
              <StatCard label="Hackathons" value={student.hackathons_count || 0} sub="Attended" />
            </div>
          </div>

          {/* Section 5: Skill Gaps identified */}
          {gaps && gaps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Identified Skill Gaps</h4>
              <div className="card p-4 space-y-2.5">
                {gaps.slice(0, 4).map((g, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${g.gap > 20 ? 'bg-danger-500' : 'bg-warning-500'}`} />
                      <span className="font-medium text-ink">{g.skill}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-surface-500">Current: <strong>{g.student_score}%</strong></span>
                      <span className="text-surface-400">|</span>
                      <span className="text-surface-500">Required: <strong>{g.required_score}%</strong></span>
                      <span className={`font-semibold ${g.gap > 20 ? 'text-danger-600' : 'text-warning-600'}`}>
                        -{g.gap}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Placement Application History */}
          <div>
            <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Placement Drive History</h4>
            <div className="card p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center border-b border-surface-100 pb-3 mb-3">
                <div>
                  <p className="text-xs text-surface-500">Applied</p>
                  <p className="text-lg font-heading font-bold text-ink">{student.companies_applied || 4}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500">Shortlisted</p>
                  <p className="text-lg font-heading font-bold text-ink">{student.shortlisted_count || 2}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500">Interviews</p>
                  <p className="text-lg font-heading font-bold text-ink">{student.interviews_count || 1}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500">Offers</p>
                  <p className="text-lg font-heading font-bold text-emerald-600">{student.offers_count || 0}</p>
                </div>
              </div>
              <p className="text-xs text-surface-500 text-center">
                Current Institutional Placement Status: <strong className="text-ink">{student.placement_status}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, highlight, danger }) {
  return (
    <div className={`card p-3 text-center ${
      highlight ? 'border-primary-200 bg-primary-50/20' :
      danger ? 'border-danger-200 bg-danger-50/20' : ''
    }`}>
      <p className="text-[11px] text-surface-500 font-medium">{label}</p>
      <p className={`text-xl font-heading font-bold mt-0.5 ${
        danger ? 'text-danger-600' :
        highlight ? 'text-primary-700' : 'text-ink'
      }`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-surface-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function SkillScoreBar({ label, score }) {
  const rounded = Math.round(score);
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-surface-700 font-medium">{label}</span>
        <span className="font-bold text-ink">{rounded}%</span>
      </div>
      <div className="w-full h-1.5 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            rounded >= 75 ? 'bg-emerald-500' :
            rounded >= 60 ? 'bg-amber-500' :
            'bg-rose-500'
          }`}
          style={{ width: `${Math.min(100, rounded)}%` }}
        />
      </div>
    </div>
  );
}

// ── ADD & EDIT STUDENT MODAL ──

function StudentFormModal({ isOpen, onClose, onSuccess, initialData, mode = 'add' }) {
  const isEdit = mode === 'edit';

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        student_id: initialData.student_id || '',
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        department: initialData.department || 'CSE',
        semester: initialData.semester || 7,
        cgpa: initialData.cgpa || '',
        tenth_pct: initialData.tenth_pct || '',
        twelfth_pct: initialData.twelfth_pct || '',
        backlogs: initialData.backlogs !== undefined ? initialData.backlogs : 0,
        programming_skills: initialData.programming_skills || 'Python, Java',
        frameworks: initialData.frameworks || 'React, Express',
        certifications_count: initialData.certifications_count || 1,
        projects_count: initialData.projects_count || 2,
        internships_count: initialData.internships_count || 0,
        open_source_contributions: initialData.open_source_contributions || 0,
        aptitude_score: initialData.aptitude_score || 70,
        coding_score: initialData.coding_score || 70,
        communication_score: initialData.communication_score || 70,
        presentation_score: initialData.presentation_score || 70,
        hackathons_count: initialData.hackathons_count || 0,
        leadership_roles: initialData.leadership_roles || 0,
        clubs: Array.isArray(initialData.clubs) ? initialData.clubs.join(', ') : 'Coding Club',
        placement_status: initialData.placement_status || 'Eligible',
        placement_probability: initialData.placement_probability || '',
        readiness_status: initialData.readiness_status || 'Ready',
        accountStatus: initialData.accountStatus || 'active'
      };
    }
    return {
      student_id: '',
      name: '',
      email: '',
      phone: '',
      department: 'CSE',
      semester: 7,
      cgpa: '7.8',
      tenth_pct: '85',
      twelfth_pct: '82',
      backlogs: 0,
      programming_skills: 'Python, JavaScript, SQL',
      frameworks: 'React, Node.js',
      certifications_count: 2,
      projects_count: 3,
      internships_count: 1,
      open_source_contributions: 2,
      aptitude_score: 75,
      coding_score: 72,
      communication_score: 70,
      presentation_score: 68,
      hackathons_count: 1,
      leadership_roles: 1,
      clubs: 'Coding Club, IEEE',
      placement_status: 'Eligible',
      placement_probability: '',
      readiness_status: 'Ready',
      accountStatus: 'active'
    };
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full Name is required';
    if (!formData.student_id.trim()) errs.student_id = 'Student ID is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid institutional email is required';

    const cgpaVal = parseFloat(formData.cgpa);
    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      errs.cgpa = 'CGPA must be between 0.0 and 10.0';
    }

    if (formData.tenth_pct) {
      const v = parseFloat(formData.tenth_pct);
      if (isNaN(v) || v < 0 || v > 100) errs.tenth_pct = 'Percentage must be 0-100';
    }

    if (formData.twelfth_pct) {
      const v = parseFloat(formData.twelfth_pct);
      if (isNaN(v) || v < 0 || v > 100) errs.twelfth_pct = 'Percentage must be 0-100';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setActiveTab('basic');
      return;
    }

    const payload = {
      ...formData,
      cgpa: parseFloat(formData.cgpa) || 7.0,
      tenth_pct: parseFloat(formData.tenth_pct) || 80,
      twelfth_pct: parseFloat(formData.twelfth_pct) || 80,
      backlogs: parseInt(formData.backlogs, 10) || 0,
      projects_count: parseInt(formData.projects_count, 10) || 1,
      internships_count: parseInt(formData.internships_count, 10) || 0,
      certifications_count: parseInt(formData.certifications_count, 10) || 0,
      hackathons_count: parseInt(formData.hackathons_count, 10) || 0,
      open_source_contributions: parseInt(formData.open_source_contributions, 10) || 0,
      coding_score: parseFloat(formData.coding_score) || 60,
      aptitude_score: parseFloat(formData.aptitude_score) || 60,
      communication_score: parseFloat(formData.communication_score) || 60,
      presentation_score: parseFloat(formData.presentation_score) || 60,
      clubs: formData.clubs ? formData.clubs.split(',').map(c => c.trim()).filter(Boolean) : []
    };

    if (isEdit) {
      const updated = mockData.updateStudent(formData.student_id, payload);
      onSuccess(updated);
    } else {
      const created = mockData.addStudent(payload);
      onSuccess(created);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50/50">
          <div>
            <h3 className="font-heading text-lg font-bold text-ink">
              {isEdit ? 'Edit Student Record' : 'Add New Student'}
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">
              Enter academic metrics, assessment scores, and placement credentials
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-surface-400 hover:text-ink hover:bg-surface-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-surface-200 bg-surface-50/30 px-6 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-surface-500 hover:text-ink'
            }`}
          >
            1. Basic &amp; Academic
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('technical')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'technical'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-surface-500 hover:text-ink'
            }`}
          >
            2. Technical &amp; Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assessments')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'assessments'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-surface-500 hover:text-ink'
            }`}
          >
            3. Assessments &amp; Placement
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: BASIC & ACADEMIC */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Student ID <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={isEdit}
                    placeholder="e.g. STU1081"
                    value={formData.student_id}
                    onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                    className={`input-field text-sm ${errors.student_id ? 'border-danger-500' : ''}`}
                  />
                  {errors.student_id && <p className="text-[11px] text-danger-600 mt-1">{errors.student_id}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Full Name <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`input-field text-sm ${errors.name ? 'border-danger-500' : ''}`}
                  />
                  {errors.name && <p className="text-[11px] text-danger-600 mt-1">{errors.name}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">
                    Institutional Email <span className="text-danger-600">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul.sharma@sapthagiri.edu.in"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`input-field text-sm ${errors.email ? 'border-danger-500' : ''}`}
                  />
                  {errors.email && <p className="text-[11px] text-danger-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9845012345"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Department</label>
                  <select
                    className="select-field text-sm"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                  >
                    {DEPARTMENTS.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Semester</label>
                  <select
                    className="select-field text-sm"
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: parseInt(e.target.value, 10) })}
                  >
                    {[5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-100">
                <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Academic Performance</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">CGPA (0-10) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="8.4"
                      value={formData.cgpa}
                      onChange={e => setFormData({ ...formData, cgpa: e.target.value })}
                      className={`input-field text-sm ${errors.cgpa ? 'border-danger-500' : ''}`}
                    />
                    {errors.cgpa && <p className="text-[10px] text-danger-600 mt-0.5">{errors.cgpa}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">10th %</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="88.5"
                      value={formData.tenth_pct}
                      onChange={e => setFormData({ ...formData, tenth_pct: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">12th %</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="84.0"
                      value={formData.twelfth_pct}
                      onChange={e => setFormData({ ...formData, twelfth_pct: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Backlogs</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.backlogs}
                      onChange={e => setFormData({ ...formData, backlogs: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL & PROJECTS */}
          {activeTab === 'technical' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Programming Skills</label>
                <input
                  type="text"
                  placeholder="e.g. Python, Java, JavaScript, C++"
                  value={formData.programming_skills}
                  onChange={e => setFormData({ ...formData, programming_skills: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Frameworks &amp; Tools</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Spring Boot, Docker, SQL"
                  value={formData.frameworks}
                  onChange={e => setFormData({ ...formData, frameworks: e.target.value })}
                  className="input-field text-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Projects Count</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.projects_count}
                    onChange={e => setFormData({ ...formData, projects_count: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Internships</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.internships_count}
                    onChange={e => setFormData({ ...formData, internships_count: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Certifications</label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={formData.certifications_count}
                    onChange={e => setFormData({ ...formData, certifications_count: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Open Source / PRs</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.open_source_contributions}
                    onChange={e => setFormData({ ...formData, open_source_contributions: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-surface-100">
                <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Activities &amp; Engagement</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Hackathons</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={formData.hackathons_count}
                      onChange={e => setFormData({ ...formData, hackathons_count: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Leadership Roles</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={formData.leadership_roles}
                      onChange={e => setFormData({ ...formData, leadership_roles: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Technical Clubs</label>
                    <input
                      type="text"
                      placeholder="Coding Club, IEEE"
                      value={formData.clubs}
                      onChange={e => setFormData({ ...formData, clubs: e.target.value })}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ASSESSMENTS & PLACEMENT */}
          {activeTab === 'assessments' && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Assessment Scores (0–100%)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Aptitude Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.aptitude_score}
                    onChange={e => setFormData({ ...formData, aptitude_score: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Coding Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.coding_score}
                    onChange={e => setFormData({ ...formData, coding_score: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Communication</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.communication_score}
                    onChange={e => setFormData({ ...formData, communication_score: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Presentation</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.presentation_score}
                    onChange={e => setFormData({ ...formData, presentation_score: e.target.value })}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-surface-100">
                <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">Placement &amp; Access Controls</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Placement Status</label>
                    <select
                      className="select-field text-sm"
                      value={formData.placement_status}
                      onChange={e => setFormData({ ...formData, placement_status: e.target.value })}
                    >
                      {PLACEMENT_STATUSES.filter(p => p !== 'All').map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Readiness Status</label>
                    <select
                      className="select-field text-sm"
                      value={formData.readiness_status}
                      onChange={e => setFormData({ ...formData, readiness_status: e.target.value })}
                    >
                      {READINESS_LEVELS.filter(r => r !== 'All').map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Account Access</label>
                    <select
                      className="select-field text-sm"
                      value={formData.accountStatus}
                      onChange={e => setFormData({ ...formData, accountStatus: e.target.value })}
                    >
                      <option value="active">Active (Login Enabled)</option>
                      <option value="disabled">Disabled (Blocked)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-surface-200 flex items-center justify-between">
            <div>
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'assessments' ? 'technical' : 'basic')}
                  className="btn-ghost text-xs"
                >
                  ← Previous section
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>

              {activeTab !== 'assessments' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'basic' ? 'technical' : 'assessments')}
                  className="btn-secondary text-sm font-semibold"
                >
                  Next Section →
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn-primary text-sm shadow-sm"
                >
                  {isEdit ? 'Save Changes' : 'Add Student'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── DELETE CONFIRMATION MODAL ──

function DeleteConfirmModal({ student, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 animate-slide-up">
        <div className="w-12 h-12 rounded-xl bg-danger-50 text-danger-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-heading font-bold text-ink">Remove Student Account</h3>
          <p className="text-xs text-surface-600 mt-2 leading-relaxed">
            Are you sure you want to remove this student? This action will permanently delete the student's account and associated data.
          </p>
        </div>

        <div className="mt-4 p-3 bg-surface-50 rounded-xl border border-surface-200 text-xs text-left">
          <p className="font-semibold text-ink">{student.name}</p>
          <p className="text-surface-500 font-mono mt-0.5">{student.student_id} • {student.department} • CGPA {student.cgpa}</p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-danger-600 hover:bg-danger-700 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
}
