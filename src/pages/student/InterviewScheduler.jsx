import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import mockData from '../../data/mockData';
import { bookInterviewSlot, cancelInterviewSlot, getInterviews } from '../../api/client';
import {
  Calendar, Clock, Building2, CheckCircle2, AlertCircle, Video, MapPin,
  Sparkles, X, UserCheck, Play, Plus, RefreshCw
} from 'lucide-react';

export default function InterviewScheduler() {
  const { studentId } = useParams();
  const { user } = useAuth();
  const sid = studentId || user?.id || 'STU1001';

  const [student, setStudent] = useState(() => mockData.getStudent(sid));
  const [recommendations, setRecommendations] = useState(() => mockData.getRecommendedCompanies(sid));
  const [scheduledInterviews, setScheduledInterviews] = useState(() => mockData.getStudentScheduledInterviews(sid));

  // Modal State
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const refreshData = () => {
      setStudent(mockData.getStudent(sid));
      setRecommendations(mockData.getRecommendedCompanies(sid));
      setScheduledInterviews(mockData.getStudentScheduledInterviews(sid));

      getInterviews({ student_id: sid })
        .then(res => {
          if (isMounted && res.data && res.data.data && res.data.data.length > 0) {
            setScheduledInterviews(res.data.data);
          }
        })
        .catch(err => console.warn('API interviews notice:', err.message));
    };

    refreshData();
    const unsubscribe = mockData.subscribe(refreshData);
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [sid]);

  // Open slot picker for a company
  const handleOpenSlotPicker = (comp) => {
    setSelectedCompany(comp);
    setBookingError('');
    setBookingSuccess(null);
    const slots = mockData.getAvailableInterviewSlots(comp.company_id) || [];
    setAvailableSlots(slots);
    setSelectedSlotId(slots[0]?.id || 'slot-1');
  };

  // Confirm schedule
  const handleConfirmSchedule = async (e) => {
    e.preventDefault();
    if (!selectedCompany || !selectedSlotId) return;

    const chosenSlot = availableSlots.find(s => s.id === selectedSlotId) || availableSlots[0];
    if (!chosenSlot) return;

    try {
      await bookInterviewSlot({
        student_id: sid,
        company_id: selectedCompany.company_id,
        company_name: selectedCompany.company_name,
        role: selectedCompany.role || 'Software Engineer',
        slot_date: chosenSlot.date,
        slot_time: chosenSlot.time,
        mode: chosenSlot.mode || 'Virtual (Google Meet)',
        panel: chosenSlot.panel || 'Technical Panel 1'
      });
    } catch (apiErr) {
      console.warn('API book slot notice:', apiErr.message);
    }

    const result = mockData.scheduleInterviewSlot(sid, selectedCompany.company_id, chosenSlot);
    if (result && result.success) {
      setBookingSuccess(`Interview successfully scheduled with ${selectedCompany.company_name} for ${chosenSlot.date} at ${chosenSlot.time}!`);
      setTimeout(() => {
        setSelectedCompany(null);
        setBookingSuccess(null);
      }, 2000);
    } else {
      setBookingError(result?.error || 'Failed to schedule interview slot. Please try again.');
    }
  };

  // Cancel interview
  const handleCancelInterview = async (interviewId) => {
    if (window.confirm('Are you sure you want to cancel this scheduled interview?')) {
      try {
        await cancelInterviewSlot(interviewId);
      } catch (err) {
        console.warn('API cancel interview notice:', err.message);
      }
      mockData.cancelScheduledInterview(sid, interviewId);
    }
  };

  // Filter eligible companies (where eligible === true or bestMatches)
  const allCompaniesRanked = recommendations?.allRanked || [];
  const eligibleCompanies = allCompaniesRanked.filter(c => c.eligible) || recommendations?.bestMatches || [];

  if (!student) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-surface-200">
        <p className="text-surface-500">Student Profile Not Found ({sid})</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-ink">Interview Scheduler</h1>
              <p className="text-xs text-surface-500 font-medium mt-0.5">
                Book & manage campus recruitment interview slots for companies matching your profile.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-surface-50 p-3 rounded-xl border border-surface-200">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center">
            {student.name[0]}
          </div>
          <div>
            <div className="text-xs font-bold text-ink">{student.name} ({student.student_id})</div>
            <div className="text-[10px] text-surface-500">{student.department} • 7th Semester • CGPA {student.cgpa}</div>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 ml-2">
            {eligibleCompanies.length} Qualified Drives
          </span>
        </div>
      </div>

      {/* SECTION 1: Scheduled Interviews Tracker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-heading font-bold text-ink">My Scheduled Interviews</h2>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-200">
              {(scheduledInterviews || []).length} Booked
            </span>
          </div>
        </div>

        {(!scheduledInterviews || scheduledInterviews.length === 0) ? (
          <div className="p-8 bg-white rounded-2xl border border-surface-200 text-center space-y-3">
            <Calendar className="w-10 h-10 text-surface-300 mx-auto" />
            <h3 className="font-heading font-bold text-ink text-sm">No Interviews Scheduled Yet</h3>
            <p className="text-xs text-surface-500 max-w-md mx-auto">
              Select any of your qualified companies below to pick an available date and time slot for your technical interview.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduledInterviews.map((int) => (
              <div key={int.interview_id} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm hover:shadow-md transition relative space-y-3">
                
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mb-1">
                      ✓ {int.status}
                    </span>
                    <h3 className="font-heading font-bold text-ink text-base">{int.company_name}</h3>
                    <p className="text-xs font-semibold text-primary-600">{int.role}</p>
                  </div>

                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Details Box */}
                <div className="bg-surface-50 p-3 rounded-xl border border-surface-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-surface-700">
                    <Calendar className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-ink">{int.date}</span>
                    <span className="text-surface-400">•</span>
                    <Clock className="w-4 h-4 text-indigo-500 ml-1" />
                    <span className="font-bold text-ink">{int.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-surface-600">
                    {int.mode?.includes('Virtual') ? (
                      <Video className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="truncate">{int.mode}</span>
                  </div>

                  <div className="text-[11px] text-surface-500 border-t border-surface-200 pt-1.5 mt-1 font-medium">
                    Panel: <span className="text-ink font-semibold">{int.panel}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleCancelInterview(int.interview_id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                  >
                    Cancel Slot
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-placement-assistant'));
                      }}
                      className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Interview Prep AI</span>
                    </button>

                    {int.meeting_link && int.meeting_link.startsWith('http') && (
                      <a
                        href={int.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Join Call</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Qualified Companies Ready For Interview Booking */}
      <div className="space-y-4 pt-4 border-t border-surface-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-heading font-bold text-ink">Eligible Campus Drives (Select & Book Slot)</h2>
          </div>
          <span className="text-xs text-surface-500">Filtered by actual company criteria</span>
        </div>

        {eligibleCompanies.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-surface-200 text-center">
            <p className="text-xs text-surface-500">No fully eligible drives found currently. Update your skills or profile metrics to unlock campus drives.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {eligibleCompanies.map((comp) => {
              const existingInt = (scheduledInterviews || []).find(i => i.company_id === comp.company_id);
              const minCGPAVal = comp.minCGPA !== undefined ? comp.minCGPA : (comp.minimumCGPA || comp.min_cgpa || 7.0);

              return (
                <div key={comp.company_id} className="bg-white p-5 rounded-2xl border border-surface-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-heading font-bold text-ink text-base">{comp.company_name}</h3>
                        <p className="text-xs font-semibold text-primary-600">{comp.role}</p>
                      </div>

                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full font-mono shrink-0">
                        {comp.matchPercentage || comp.match_pct || 85}% Match
                      </span>
                    </div>

                    <div className="text-xs text-surface-500 mb-3">
                      Package: <span className="font-bold text-ink">{comp.package || '6.5 LPA'}</span>
                    </div>

                    {/* Verified Criteria Badges */}
                    <div className="space-y-1 bg-surface-50 p-2.5 rounded-xl border border-surface-100 text-[11px]">
                      <div className="text-emerald-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{student.department} Branch Qualified</span>
                      </div>
                      <div className="text-emerald-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>CGPA {student.cgpa} ≥ {parseFloat(minCGPAVal).toFixed(1)}</span>
                      </div>
                      <div className="text-emerald-700 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{student.backlogs} Backlogs Satisfied</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {existingInt ? (
                      <button
                        onClick={() => handleOpenSlotPicker(comp)}
                        className="w-full btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Reschedule Slot ({existingInt.date})</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenSlotPicker(comp)}
                        className="w-full btn-primary text-xs py-2.5 flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Apply & Schedule Interview</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SLOT PICKER MODAL */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-surface-200 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-surface-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-ink text-base">
                  Schedule Interview — {selectedCompany.company_name}
                </h3>
                <p className="text-xs text-surface-500">{selectedCompany.role} • Match Score: {selectedCompany.matchPercentage || 85}%</p>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="p-1 rounded-lg hover:bg-surface-100 text-surface-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{bookingSuccess}</span>
              </div>
            )}

            {bookingError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-ink mb-2">
                  Select Available Date & Time Slot:
                </label>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {availableSlots.map((slot) => (
                    <label
                      key={slot.id}
                      className={`block p-3 rounded-xl border text-xs cursor-pointer transition ${
                        selectedSlotId === slot.id
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-semibold shadow-xs'
                          : 'bg-white border-surface-200 hover:bg-surface-50 text-surface-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="slotSelection"
                            value={slot.id}
                            checked={selectedSlotId === slot.id}
                            onChange={() => setSelectedSlotId(slot.id)}
                            className="text-indigo-600"
                          />
                          <span className="font-bold text-ink">{slot.date}</span>
                          <span className="text-surface-400">•</span>
                          <span>{slot.time}</span>
                        </div>
                        <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-surface-200 text-surface-600 font-mono">
                          {slot.mode?.includes('Virtual') ? 'Online' : 'On-Campus'}
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-surface-500 pl-6">
                        {slot.panel}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl border border-surface-200 text-xs text-surface-600 flex items-start gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>By confirming, your profile details & resume will be automatically transmitted to the recruiter panel.</span>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  className="btn-ghost text-xs py-2 px-4"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Interview Slot</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
