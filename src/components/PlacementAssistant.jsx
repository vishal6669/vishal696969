import { useState, useEffect, useRef } from 'react';
import { mockData } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import {
  MessageSquare, X, Send, Mic, MicOff, Volume2, VolumeX, Sparkles,
  CheckCircle2, AlertTriangle, XCircle, ArrowRight, BookOpen, Target,
  Briefcase, Award, ChevronRight, RotateCcw, ShieldCheck, HelpCircle,
  FileText, ExternalLink, Play
} from 'lucide-react';

const QUICK_ACTIONS = [
  { label: 'Which companies can I apply for?', icon: '🏢' },
  { label: 'Show my best matches', icon: '⭐' },
  { label: 'Why am I not eligible?', icon: '❓' },
  { label: 'What skills am I missing?', icon: '📊' },
  { label: 'Recommend courses', icon: '📚' },
  { label: 'How ready am I?', icon: '🎯' },
  { label: 'Show my applications', icon: '📝' },
  { label: 'Prepare me for an interview', icon: '💡' },
];

export default function PlacementAssistant({ studentId = 'STU1001', isOpen: initialIsOpen = false, onClose: externalOnClose }) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  useEffect(() => {
    if (initialIsOpen !== undefined) setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (externalOnClose) externalOnClose();
  };

  // Student context
  const [student, setStudent] = useState(() => mockData.getStudent(studentId));
  useEffect(() => {
    setStudent(mockData.getStudent(studentId));
    const unsub = mockData.subscribe(() => {
      setStudent(mockData.getStudent(studentId));
    });
    return unsub;
  }, [studentId]);

  // Messages State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [readAloud, setReadAloud] = useState(false);

  // Application Modal state
  const [applyingCompany, setApplyingCompany] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      rec.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition error. Please try typing.');
      };

      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  // Initial welcome message
  useEffect(() => {
    if (student && messages.length === 0) {
      const recs = mockData.getRecommendedCompanies(student.student_id);
      const readyPct = Math.round(student.placement_probability || 0);

      setMessages([
        {
          id: 'msg-welcome',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Hello ${student.name.split(' ')[0]}! I am your AI Placement Assistant. Based on your 7th Semester ${student.department} profile (CGPA ${parseFloat(student.cgpa).toFixed(1)}, ${readyPct}% readiness), you currently qualify for ${recs.bestMatches.length} active company drives!`,
          type: 'company_list',
          data: recs
        }
      ]);
    }
  }, [student]);

  // Auto scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Speak response using SpeechSynthesis
  const speakText = (text) => {
    if (!readAloud || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = (textToSend = input) => {
    const query = textToSend.trim();
    if (!query || !student) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate backend response processing
    setTimeout(() => {
      const response = mockData.getAssistantResponse(student.student_id, query);
      const assistantMsg = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ...response
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);

      if (readAloud && response.text) {
        speakText(response.text);
      }
    }, 450);
  };

  const toggleVoiceListen = () => {
    if (!recognitionRef.current) {
      toast.info('Voice recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info('Listening... Speak your placement question.');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleConfirmApplication = () => {
    if (!applyingCompany || !student) return;

    const res = mockData.applyForCompany(student.student_id, applyingCompany.company_id);

    if (res.success) {
      toast.success(`Application submitted for ${applyingCompany.company_name} - ${applyingCompany.role}`);
      setApplyingCompany(null);

      // Add success response to chat
      setMessages(prev => [
        ...prev,
        {
          id: `app-success-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `✓ Your application for ${applyingCompany.company_name} (${applyingCompany.role}) has been successfully submitted! Mandatory eligibility confirmed. Would you like to start interview preparation?`,
          type: 'interview_prep',
          student,
          eligibleCompanies: [applyingCompany]
        }
      ]);
    } else if (res.alreadyApplied) {
      toast.info(`You have already applied for ${applyingCompany.company_name}.`);
      setApplyingCompany(null);
    } else {
      toast.error(res.error || 'Failed to submit application.');
      setApplyingCompany(null);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 btn-primary py-3 px-4 rounded-full shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
          </div>
          <span className="font-heading font-bold text-sm tracking-wide">Placement Assistant</span>
        </button>
      )}

      {/* Slide-in Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/30 backdrop-blur-xs transition-opacity"
            onClick={handleClose}
          />

          {/* Drawer Container */}
          <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10 animate-slide-in-right">
            {/* Header */}
            <div className="p-4 border-b border-surface-200 bg-white sticky top-0 z-20 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm font-heading font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-ink">AI Placement Counselor</h3>
                  <p className="text-[11px] text-surface-500">
                    {student ? `${student.name.split(' ')[0]} • ${student.department} (Sem 7) • CGPA ${student.cgpa}` : 'Digital Placement Guidance'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Voice read aloud toggle */}
                <button
                  title={readAloud ? 'Disable Speech Output' : 'Enable Speech Output'}
                  onClick={() => setReadAloud(!readAloud)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    readAloud ? 'bg-primary-50 text-primary-600' : 'text-surface-400 hover:text-surface-600'
                  }`}
                >
                  {readAloud ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Clear Chat */}
                <button
                  title="Clear conversation"
                  onClick={() => {
                    const recs = mockData.getRecommendedCompanies(studentId);
                    setMessages([
                      {
                        id: 'msg-welcome-reset',
                        sender: 'assistant',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        text: `Conversation cleared. How can I assist your placement preparation today?`,
                        type: 'company_list',
                        data: recs
                      }
                    ]);
                  }}
                  className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Close */}
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-surface-400 hover:text-ink hover:bg-surface-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="p-2.5 bg-surface-50 border-b border-surface-200 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.label)}
                  className="px-2.5 py-1 rounded-full bg-white border border-surface-200 text-surface-700 hover:border-primary-300 hover:text-primary-700 text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 shadow-2xs"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
                >
                  {/* Bubble */}
                  <div
                    className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-primary-600 text-white rounded-br-2px'
                        : 'bg-white text-ink border border-surface-200 rounded-bl-2px'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* RICH CARD TYPE 1: COMPANY LIST (BEST MATCHES / NEAR ELIGIBLE / NOT ELIGIBLE) */}
                    {msg.type === 'company_list' && msg.data && (
                      <CompanyListCard
                        data={msg.data}
                        onApply={(comp) => setApplyingCompany(comp)}
                        onInspect={(comp) => handleSend(`Why am I not eligible for ${comp.company_name}?`)}
                      />
                    )}

                    {/* RICH CARD TYPE 2: ELIGIBILITY BREAKDOWN */}
                    {msg.type === 'eligibility_breakdown' && msg.company && msg.evaluation && (
                      <EligibilityBreakdownCard
                        company={msg.company}
                        evaluation={msg.evaluation}
                        onApply={(comp) => setApplyingCompany(comp)}
                      />
                    )}

                    {/* RICH CARD TYPE 3: SKILL GAP ANALYSIS */}
                    {msg.type === 'skill_gap_analysis' && msg.gaps && (
                      <SkillGapCard
                        gaps={msg.gaps}
                        probability={msg.probability}
                        readiness={msg.readiness}
                        onAskCourse={() => handleSend('Recommend courses')}
                      />
                    )}

                    {/* RICH CARD TYPE 4: READINESS SUMMARY */}
                    {msg.type === 'readiness_summary' && (
                      <ReadinessSummaryCard
                        probability={msg.probability}
                        readiness={msg.readiness}
                        eligibleCount={msg.eligibleCount}
                        nearEligibleCount={msg.nearEligibleCount}
                        applicationsCount={msg.applicationsCount}
                        onFindCompanies={() => handleSend('Which companies can I apply for?')}
                      />
                    )}

                    {/* RICH CARD TYPE 5: COURSE RECOMMENDATIONS */}
                    {msg.type === 'course_recommendations' && msg.courses && (
                      <CourseRecommendationsCard courses={msg.courses} />
                    )}

                    {/* RICH CARD TYPE 6: APPLICATIONS LIST */}
                    {msg.type === 'applications_list' && msg.applications && (
                      <ApplicationsListCard applications={msg.applications} />
                    )}

                    {/* RICH CARD TYPE 7: INTERVIEW PREP */}
                    {msg.type === 'interview_prep' && (
                      <InterviewPrepCard
                        eligibleCompanies={msg.eligibleCompanies}
                        onStartMock={() => toast.info('Starting Mock Technical Interview module...')}
                      />
                    )}
                  </div>

                  <span className="text-[10px] text-surface-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white p-3 rounded-2xl border border-surface-200 w-fit text-surface-400 text-xs">
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] text-surface-500 font-medium">Analyzing company criteria...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-surface-200 bg-white sticky bottom-0 z-20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                {/* Voice Mic Button */}
                <button
                  type="button"
                  onClick={toggleVoiceListen}
                  className={`p-2.5 rounded-xl transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse shadow-md'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200 hover:text-ink'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Speak Question'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  placeholder={isListening ? 'Listening to voice...' : 'Ask about companies, criteria, readiness...'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 input-field py-2.5 text-xs rounded-xl"
                />

                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Apply for Interview */}
      {applyingCompany && (
        <ApplyConfirmationModal
          company={applyingCompany}
          onClose={() => setApplyingCompany(null)}
          onConfirm={handleConfirmApplication}
        />
      )}
    </>
  );
}

// ── RICH CARDS ──

function CompanyListCard({ data, onApply, onInspect }) {
  const [tab, setTab] = useState('best');

  const list = tab === 'best' ? data.bestMatches : tab === 'near' ? data.nearEligible : data.notEligible;

  return (
    <div className="mt-3 space-y-3 pt-3 border-t border-surface-100">
      {/* Category Tabs */}
      <div className="flex rounded-lg bg-surface-100 p-0.5 text-[11px] font-semibold">
        <button
          onClick={() => setTab('best')}
          className={`flex-1 py-1 text-center rounded-md transition-colors ${
            tab === 'best' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-surface-600'
          }`}
        >
          Best ({data.bestMatches.length})
        </button>
        <button
          onClick={() => setTab('near')}
          className={`flex-1 py-1 text-center rounded-md transition-colors ${
            tab === 'near' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-surface-600'
          }`}
        >
          Near ({data.nearEligible.length})
        </button>
        <button
          onClick={() => setTab('not')}
          className={`flex-1 py-1 text-center rounded-md transition-colors ${
            tab === 'not' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-surface-600'
          }`}
        >
          Ineligible ({data.notEligible.length})
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-xs text-surface-500 py-2 text-center">No companies in this category.</p>
      ) : (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {list.map((c) => (
            <div
              key={c.company_id}
              className="p-3 rounded-xl border border-surface-200 bg-white hover:border-primary-300 transition-colors shadow-2xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-ink text-sm">{c.company_name}</h4>
                    <span className="text-[10px] text-surface-500">({c.package})</span>
                  </div>
                  <p className="text-[11px] text-surface-600">{c.role}</p>
                </div>

                <div className="text-right">
                  <span className={`inline-block font-mono font-extrabold text-xs px-2 py-0.5 rounded ${
                    c.matchPercentage >= 85 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    c.matchPercentage >= 70 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {c.matchPercentage}% Match
                  </span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-1 text-[11px] text-surface-600 bg-surface-50/70 p-2 rounded-lg">
                {c.matchedRequirements.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{m.text}</span>
                  </div>
                ))}
                {c.missingRequirements.slice(0, 2).map((m, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-rose-700 font-medium">
                    <XCircle className="w-3 h-3 text-rose-500 flex-shrink-0" />
                    <span className="truncate">{m.text}</span>
                  </div>
                ))}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.eligible ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {c.eligible ? 'STATUS: ELIGIBLE' : 'STATUS: NEAR MATCH'}
                </span>

                {c.applied ? (
                  <span className="text-[11px] text-primary-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                  </span>
                ) : c.eligible ? (
                  <button
                    onClick={() => onApply(c)}
                    className="px-2.5 py-1 rounded-lg bg-primary-600 text-white font-semibold text-[11px] hover:bg-primary-700 transition-colors shadow-2xs"
                  >
                    Apply for Interview
                  </button>
                ) : (
                  <button
                    onClick={() => onInspect(c)}
                    className="px-2 py-1 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 font-medium text-[11px] hover:bg-amber-100 transition-colors"
                  >
                    How To Qualify
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EligibilityBreakdownCard({ company, evaluation, onApply }) {
  return (
    <div className="mt-3 p-3 rounded-xl border border-surface-200 bg-surface-50/60 space-y-2.5">
      <div className="flex items-center justify-between border-b border-surface-200 pb-2">
        <div>
          <h4 className="font-bold text-ink text-sm">{company.company_name} — {company.role}</h4>
          <span className="text-[11px] text-surface-500">Official Campus Criteria Evaluation</span>
        </div>
        <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
          evaluation.eligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}>
          {evaluation.eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
        </span>
      </div>

      {evaluation.missingRequirements.length > 0 && (
        <div className="space-y-1 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
          <p className="text-[11px] font-bold text-rose-800">Unmet Mandatory Criteria:</p>
          {evaluation.missingRequirements.map((m, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-rose-700">
              <XCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{m.text}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
        <p className="text-[11px] font-bold text-emerald-800">Satisfied Requirements:</p>
        {evaluation.matchedRequirements.map((m, idx) => (
          <div key={idx} className="flex items-start gap-1.5 text-[11px] text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{m.text}</span>
          </div>
        ))}
      </div>

      {evaluation.eligible && (
        <button
          onClick={() => onApply(company)}
          className="btn-primary w-full py-1.5 text-xs font-semibold"
        >
          Apply for Interview Now
        </button>
      )}
    </div>
  );
}

function SkillGapCard({ gaps, probability, readiness, onAskCourse }) {
  return (
    <div className="mt-3 p-3 rounded-xl border border-surface-200 bg-surface-50/60 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-ink">Skill Deficit Matrix</span>
        <span className="text-[10px] text-surface-500">Readiness: {readiness} ({probability}%)</span>
      </div>

      <div className="space-y-2">
        {gaps.slice(0, 4).map((g, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="flex justify-between text-[11px]">
              <span className="font-medium text-ink">{g.skill}</span>
              <span className="text-surface-500">{g.student_score}% / {g.required_score}% (Gap -{g.gap}%)</span>
            </div>
            <div className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${g.gap > 20 ? 'bg-rose-500' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(100, g.student_score)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAskCourse}
        className="btn-secondary w-full py-1 text-xs font-semibold text-primary-700"
      >
        View Recommended Learning Modules →
      </button>
    </div>
  );
}

function ReadinessSummaryCard({ probability, readiness, eligibleCount, nearEligibleCount, applicationsCount, onFindCompanies }) {
  return (
    <div className="mt-3 p-3 rounded-xl border border-primary-200 bg-primary-50/30 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] text-primary-700 font-bold uppercase tracking-wider">Verdict</span>
          <h4 className="font-bold text-ink text-sm">Placement Probability: {probability}%</h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-600 text-white shadow-2xs">
          {readiness}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
        <div className="p-2 rounded-lg bg-white border border-surface-200">
          <p className="text-surface-500 text-[10px]">Eligible Drives</p>
          <p className="text-sm font-bold text-emerald-600">{eligibleCount}</p>
        </div>
        <div className="p-2 rounded-lg bg-white border border-surface-200">
          <p className="text-surface-500 text-[10px]">Near Eligible</p>
          <p className="text-sm font-bold text-amber-600">{nearEligibleCount}</p>
        </div>
        <div className="p-2 rounded-lg bg-white border border-surface-200">
          <p className="text-surface-500 text-[10px]">Applications</p>
          <p className="text-sm font-bold text-primary-600">{applicationsCount}</p>
        </div>
      </div>

      <button
        onClick={onFindCompanies}
        className="btn-primary w-full py-1.5 text-xs font-semibold shadow-2xs"
      >
        Explore Qualifiable Companies →
      </button>
    </div>
  );
}

function CourseRecommendationsCard({ courses }) {
  return (
    <div className="mt-3 space-y-2">
      <p className="text-[11px] font-bold text-ink">Personalized Learning &amp; Upskilling Modules:</p>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {courses.map((c) => (
          <div key={c.id} className="p-2.5 rounded-xl border border-surface-200 bg-white space-y-1 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-ink">{c.title}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                c.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-blue-50 text-blue-700'
              }`}>
                {c.priority} Priority
              </span>
            </div>
            <p className="text-[11px] text-surface-600 leading-tight">{c.reason}</p>
            <div className="flex items-center justify-between pt-1 text-[10px] text-surface-400">
              <span>Category: {c.category} • {c.duration}</span>
              <button
                onClick={() => alert(`Starting course: ${c.title}`)}
                className="text-primary-600 hover:underline font-bold"
              >
                Start Module →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApplicationsListCard({ applications }) {
  return (
    <div className="mt-3 space-y-2">
      {applications.length === 0 ? (
        <p className="text-xs text-surface-500">No applications submitted yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app.application_id} className="p-2.5 rounded-xl border border-surface-200 bg-white flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-ink">{app.company_name} — {app.role}</p>
              <p className="text-[10px] text-surface-500">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
            </div>
            <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-purple-50 text-purple-700 border border-purple-200">
              {app.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function InterviewPrepCard({ eligibleCompanies, onStartMock }) {
  return (
    <div className="mt-3 p-3 rounded-xl border border-surface-200 bg-surface-50/60 space-y-2.5 text-xs">
      <p className="font-bold text-ink">Interview Preparation Roadmap:</p>
      <div className="space-y-1.5">
        <div className="p-2 rounded-lg bg-white border border-surface-200 flex items-center justify-between">
          <span className="font-medium text-ink">1. Technical Round (DSA &amp; OOP)</span>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">High Priority</span>
        </div>
        <div className="p-2 rounded-lg bg-white border border-surface-200 flex items-center justify-between">
          <span className="font-medium text-ink">2. Database &amp; SQL Query Practice</span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Medium Priority</span>
        </div>
        <div className="p-2 rounded-lg bg-white border border-surface-200 flex items-center justify-between">
          <span className="font-medium text-ink">3. HR &amp; Cultural Fit Interview</span>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Completed</span>
        </div>
      </div>
      <button
        onClick={onStartMock}
        className="btn-primary w-full py-1.5 text-xs font-semibold shadow-2xs"
      >
        Launch Interactive Mock Technical Interview →
      </button>
    </div>
  );
}

// ── CONFIRMATION MODAL: APPLY FOR INTERVIEW ──

function ApplyConfirmationModal({ company, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink/40 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 animate-slide-up space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto">
          <Briefcase className="w-6 h-6" />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-heading font-bold text-ink">Confirm Campus Interview Application</h3>
          <p className="text-xs text-surface-500 mt-1">
            Submit your profile credentials for official placement review
          </p>
        </div>

        <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-surface-500">Company:</span>
            <span className="font-bold text-ink">{company.company_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Target Role:</span>
            <span className="font-medium text-ink">{company.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Compensation:</span>
            <span className="font-semibold text-emerald-600">{company.package}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Match Percentage:</span>
            <span className="font-mono font-bold text-primary-600">{company.matchPercentage}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Eligibility Status:</span>
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ Confirmed Eligible
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary text-xs">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-primary text-xs shadow-sm">
            Confirm Application
          </button>
        </div>
      </div>
    </div>
  );
}
