/* eslint-disable no-unused-vars */
/**
 * Mock data for the entire application.
 * This file contains synthetic Indian college-style student data,
 * company data, and helper functions to drive the UI when the backend is unavailable.
 */

const DEPARTMENTS = ['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
const SEMESTERS = [5, 6, 7, 8];
const PLACEMENT_STATUSES = ['Eligible', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Not Selected', 'Training Required'];

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Ananya', 'Diya', 'Aditi', 'Myra', 'Sara', 'Aanya', 'Isha', 'Kavya', 'Riya', 'Navya',
  'Rohan', 'Karthik', 'Pranav', 'Rahul', 'Vikram', 'Suresh', 'Deepak', 'Nikhil', 'Amit', 'Rajesh',
  'Priya', 'Sneha', 'Pooja', 'Meera', 'Divya', 'Neha', 'Swati', 'Anjali', 'Tanvi', 'Shruti',
  'Harsh', 'Yash', 'Dev', 'Kunal', 'Manish', 'Varun', 'Akash', 'Sahil', 'Gaurav', 'Tushar',
  'Nisha', 'Pallavi', 'Rashmi', 'Simran', 'Komal', 'Bhavna', 'Ritika', 'Sonali', 'Megha', 'Aparna'
];
const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy', 'Nair', 'Iyer', 'Rao',
  'Joshi', 'Mishra', 'Agarwal', 'Chauhan', 'Yadav', 'Pandey', 'Kulkarni', 'Mehta', 'Shah', 'Das',
  'Hegde', 'Patil', 'Shetty', 'Gowda', 'Naik', 'Desai', 'Bhat', 'Kamath', 'Shenoy', 'Menon'
];

const SKILL_NAMES = ['Python', 'Java', 'JavaScript', 'React', 'SQL', 'C++', 'Git', 'Cloud', 'Node.js', 'Linux', 'Docker', 'MongoDB'];
const CERT_PLATFORMS = ['Coursera', 'Udemy', 'NPTEL', 'AWS', 'Google', 'Microsoft', 'HackerRank', 'LinkedIn Learning'];
const CERT_NAMES = [
  'Python for Everybody', 'AWS Cloud Practitioner', 'Google Data Analytics',
  'Full Stack Web Development', 'Machine Learning Specialization', 'SQL for Data Science',
  'Java Programming Masterclass', 'React Developer Certification', 'DevOps Foundations',
  'Cybersecurity Fundamentals', 'Data Structures & Algorithms', 'Cloud Computing Basics'
];
const CLUBS = ['Coding Club', 'Robotics Club', 'IEEE', 'ACM', 'Google DSC', 'Microsoft Learn', 'Entrepreneurship Cell', 'Drama Club', 'Sports Club', 'NSS'];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max, dec = 1) { return parseFloat((Math.random() * (max - min) + min).toFixed(dec)); }
function pick(arr) { return arr[rand(0, arr.length - 1)]; }
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(n, arr.length));
}

function generateStudent(index) {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const name = `${firstName} ${lastName}`;
  const dept = pick(DEPARTMENTS);
  const semester = pick(SEMESTERS);
  const studentId = `STU${String(1001 + index).padStart(4, '0')}`;

  const cgpa = randFloat(5.0, 9.8, 2);
  const tenthPct = randFloat(55, 98, 1);
  const twelfthPct = randFloat(50, 96, 1);
  const backlogs = cgpa > 7.5 ? (Math.random() < 0.8 ? 0 : rand(0, 1)) : rand(0, 4);

  // Technical skills with proficiency levels
  const numSkills = rand(3, 8);
  const selectedSkills = pickN(SKILL_NAMES, numSkills);
  const technicalSkills = selectedSkills.map(s => ({
    skill: s,
    level: rand(30, 95)
  }));

  // Certifications
  const certCount = rand(0, 5);
  const certifications = [];
  for (let i = 0; i < certCount; i++) {
    certifications.push({
      name: pick(CERT_NAMES),
      platform: pick(CERT_PLATFORMS),
      date: `2024-${String(rand(1, 12)).padStart(2, '0')}-${String(rand(1, 28)).padStart(2, '0')}`,
      verified: Math.random() > 0.3
    });
  }

  const projectsCount = rand(1, 8);
  const projectComplexity = pick(['Basic', 'Intermediate', 'Advanced']);
  const internshipsCount = rand(0, 3);
  const openSourceContributions = rand(0, 15);
  const hackathonsCount = rand(0, 6);
  const leadershipFlag = Math.random() > 0.6;
  const clubs = pickN(CLUBS, rand(0, 3));

  const communicationScore = randFloat(30, 95);
  const presentationScore = randFloat(30, 92);
  const interviewScore = randFloat(35, 90);
  const aptitudeScore = randFloat(30, 95);
  const codingScore = randFloat(25, 98);

  // Skill columns matching backend
  const skillJavascript = randFloat(20, 95);
  const skillReact = randFloat(15, 90);
  const skillSql = randFloat(25, 95);
  const skillPython = randFloat(20, 95);
  const skillGit = randFloat(30, 95);
  const skillCloud = randFloat(10, 85);
  const skillJava = randFloat(20, 90);
  const skillLinux = randFloat(15, 85);
  const skillTesting = randFloat(10, 80);
  const skillAutomation = randFloat(10, 75);
  const skillScripting = randFloat(15, 80);
  const skillExcel = randFloat(25, 90);

  // Compute placement probability using weighted scoring
  const prob = computePlacementProbability({
    cgpa, backlogs, tenthPct, twelfthPct,
    codingScore, aptitudeScore, communicationScore, presentationScore,
    internshipsCount, projectsCount, certCount, hackathonsCount,
    skillJavascript, skillReact, skillSql, skillPython, skillGit, skillCloud
  });

  const readinessStatus = prob >= 75 ? 'Ready' : prob >= 60 ? 'Near-Ready' : 'Needs Training';
  const predictionConfidence = rand(78, 94);

  // Placement status based on readiness
  let placementStatus;
  if (prob >= 80) placementStatus = pick(['Selected', 'Shortlisted', 'Interview Scheduled']);
  else if (prob >= 65) placementStatus = pick(['Eligible', 'Shortlisted', 'Interview Scheduled', 'Not Selected']);
  else placementStatus = pick(['Eligible', 'Not Selected', 'Training Required']);

  const companiesApplied = rand(1, 12);
  const shortlistedCount = Math.min(rand(0, companiesApplied), 6);
  const interviewsCount = Math.min(rand(0, shortlistedCount), 4);
  const offersCount = placementStatus === 'Selected' ? rand(1, Math.max(1, interviewsCount)) : 0;

  return {
    student_id: studentId,
    name,
    department: dept,
    semester,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@sapthagiri.edu.in`,
    phone: `+91 ${rand(70, 99)}${rand(10, 99)}${rand(10, 99)}${rand(1000, 9999)}`,
    cgpa,
    tenth_pct: tenthPct,
    twelfth_pct: twelfthPct,
    backlogs,
    technical_skills: technicalSkills,
    languages_known: JSON.stringify(selectedSkills.filter(s => ['Python', 'Java', 'JavaScript', 'C++'].includes(s))),
    frameworks_known: JSON.stringify(selectedSkills.filter(s => ['React', 'Node.js', 'Docker', 'MongoDB'].includes(s))),
    certifications,
    certifications_count: certCount,
    projects_count: projectsCount,
    project_complexity: projectComplexity,
    internships_count: internshipsCount,
    open_source_contributions: openSourceContributions,
    hackathons_count: hackathonsCount,
    leadership_flag: leadershipFlag,
    leadership_roles: leadershipFlag ? rand(1, 3) : 0,
    clubs,
    communication_score: communicationScore,
    presentation_score: presentationScore,
    interview_score: interviewScore,
    aptitude_score: aptitudeScore,
    coding_score: codingScore,
    skill_javascript: skillJavascript,
    skill_react: skillReact,
    skill_sql: skillSql,
    skill_python: skillPython,
    skill_git: skillGit,
    skill_cloud: skillCloud,
    skill_java: skillJava,
    skill_linux: skillLinux,
    skill_testing: skillTesting,
    skill_automation: skillAutomation,
    skill_scripting: skillScripting,
    skill_excel: skillExcel,
    accountStatus: 'active',
    account_status: 'active',
    placed: placementStatus === 'Selected' ? 1 : 0,
    placement_probability: prob,
    readiness_status: readinessStatus,
    prediction_confidence: predictionConfidence,
    placement_status: placementStatus,
    companies_applied: companiesApplied,
    shortlisted_count: shortlistedCount,
    interviews_count: interviewsCount,
    offers_count: offersCount,
  };
}

function computePlacementProbability(s) {
  // Weighted composite scoring: normalized to 0-100%
  const academicScore = (
    (Math.min(s.cgpa / 10, 1) * 40) +
    (Math.min(s.tenthPct / 100, 1) * 15) +
    (Math.min(s.twelfthPct / 100, 1) * 15) +
    (Math.max(0, 1 - s.backlogs * 0.15) * 30)
  ) / 100 * 100;

  const technicalScore = (
    (s.codingScore * 0.3) +
    (s.skillPython * 0.15) +
    (s.skillJavascript * 0.15) +
    (s.skillSql * 0.15) +
    (s.skillGit * 0.1) +
    (s.skillCloud * 0.15)
  );

  const practicalScore = (
    (Math.min(s.internshipsCount / 3, 1) * 35) +
    (Math.min(s.projectsCount / 5, 1) * 30) +
    (Math.min(s.certCount / 3, 1) * 20) +
    (Math.min(s.hackathonsCount / 3, 1) * 15)
  );

  const softScore = (
    (s.communicationScore * 0.4) +
    (s.aptitudeScore * 0.35) +
    ((s.presentationScore || 60) * 0.25)
  );

  const prob = (
    academicScore * 0.25 +
    technicalScore * 0.30 +
    practicalScore * 0.20 +
    softScore * 0.25
  );

  return Math.round(Math.min(99, Math.max(15, prob)) * 10) / 10;
}

function generateFactorContributions(student) {
  const positive = [];
  const negative = [];

  // Academic
  if (student.cgpa >= 8.0) positive.push({ factor: 'Strong academic CGPA', impact: randFloat(8, 18) });
  else if (student.cgpa < 6.5) negative.push({ factor: 'Low academic CGPA', impact: -randFloat(6, 14) });

  // Coding
  if (student.coding_score >= 75) positive.push({ factor: 'Strong coding assessment', impact: randFloat(6, 15) });
  else if (student.coding_score < 50) negative.push({ factor: 'Low coding score', impact: -randFloat(8, 16) });

  // Internships
  if (student.internships_count >= 2) positive.push({ factor: 'Good internship experience', impact: randFloat(8, 16) });
  else if (student.internships_count === 0) negative.push({ factor: 'No internship experience', impact: -randFloat(6, 12) });

  // Projects
  if (student.projects_count >= 4) positive.push({ factor: 'Strong project portfolio', impact: randFloat(6, 14) });
  else if (student.projects_count <= 1) negative.push({ factor: 'Weak project portfolio', impact: -randFloat(4, 10) });

  // Communication
  if (student.communication_score >= 75) positive.push({ factor: 'Good communication skills', impact: randFloat(5, 12) });
  else if (student.communication_score < 50) negative.push({ factor: 'Weak communication skills', impact: -randFloat(6, 14) });

  // Aptitude
  if (student.aptitude_score >= 70) positive.push({ factor: 'Good aptitude score', impact: randFloat(5, 10) });
  else if (student.aptitude_score < 45) negative.push({ factor: 'Low aptitude score', impact: -randFloat(8, 15) });

  // Certifications
  if (student.certifications_count >= 3) positive.push({ factor: 'Industry certifications', impact: randFloat(5, 12) });
  else if (student.certifications_count === 0) negative.push({ factor: 'No certifications', impact: -randFloat(3, 8) });

  // Cloud skills
  if (student.skill_cloud >= 70) positive.push({ factor: 'Cloud platform skills', impact: randFloat(4, 10) });
  else if (student.skill_cloud < 30) negative.push({ factor: 'Missing cloud skills', impact: -randFloat(3, 8) });

  // SQL
  if (student.skill_sql >= 75) positive.push({ factor: 'SQL proficiency', impact: randFloat(4, 9) });
  else if (student.skill_sql < 40) negative.push({ factor: 'Weak SQL skills', impact: -randFloat(4, 10) });

  // Hackathons
  if (student.hackathons_count >= 3) positive.push({ factor: 'Hackathon participation', impact: randFloat(3, 8) });

  // Backlogs
  if (student.backlogs >= 2) negative.push({ factor: 'Academic backlogs', impact: -randFloat(5, 12) });

  positive.sort((a, b) => b.impact - a.impact);
  negative.sort((a, b) => a.impact - b.impact);

  return [...positive.slice(0, 5), ...negative.slice(0, 5)];
}

// ── Career Track Matching ──
const CAREER_TRACKS = {
  'Full-Stack Developer': {
    skill_javascript: 80, skill_react: 75, skill_sql: 70,
    skill_git: 70, coding_score: 70, communication_score: 60,
  },
  'Data Analyst': {
    skill_python: 80, skill_sql: 85, skill_excel: 70,
    communication_score: 65, aptitude_score: 70,
  },
  'Cloud/DevOps Engineer': {
    skill_linux: 75, skill_cloud: 80, skill_git: 70,
    skill_scripting: 70, coding_score: 65,
  },
  'QA Specialist': {
    skill_testing: 75, skill_sql: 60, communication_score: 70,
    skill_automation: 65, aptitude_score: 65,
  },
};

const SKILL_DISPLAY = {
  skill_javascript: 'JavaScript', skill_react: 'React', skill_sql: 'SQL',
  skill_python: 'Python', skill_git: 'Git', skill_cloud: 'Cloud Platforms',
  skill_java: 'Java', skill_linux: 'Linux', skill_testing: 'Software Testing',
  skill_automation: 'Test Automation', skill_scripting: 'Shell Scripting',
  skill_excel: 'Excel / Stats', coding_score: 'Coding Proficiency',
  communication_score: 'Communication', aptitude_score: 'Aptitude',
};

function computeCareerMatch(student, trackName) {
  const requirements = CAREER_TRACKS[trackName];
  if (!requirements) return { track: trackName, match_pct: 0, met: [], missing: [] };

  const met = [];
  const missing = [];
  let totalFit = 0;
  const entries = Object.entries(requirements);

  for (const [skillCol, required] of entries) {
    const current = student[skillCol] || 0;
    const fit = Math.min(1.0, current / required);
    totalFit += fit;

    const displayName = SKILL_DISPLAY[skillCol] || skillCol;
    if (current >= required) {
      met.push({ skill: displayName, current: Math.round(current), required });
    } else {
      missing.push({ skill: displayName, current: Math.round(current), required, gap: required - Math.round(current) });
    }
  }

  return {
    track: trackName,
    match_pct: Math.round((totalFit / entries.length) * 100),
    confidence: rand(75, 92),
    met,
    missing,
  };
}

function computeSkillGaps(student, trackName) {
  const requirements = CAREER_TRACKS[trackName];
  if (!requirements) return [];

  return Object.entries(requirements).map(([skillCol, required]) => {
    const current = Math.round(student[skillCol] || 0);
    const gap = required - current;
    let statusLabel, severity;
    if (gap <= 0) { statusLabel = 'Good'; severity = 'good'; }
    else if (gap <= 15) { statusLabel = 'Small'; severity = 'small'; }
    else if (gap <= 30) { statusLabel = 'Medium'; severity = 'medium'; }
    else { statusLabel = 'High'; severity = 'high'; }

    return {
      skill: SKILL_DISPLAY[skillCol] || skillCol,
      skill_col: skillCol,
      current,
      required,
      gap: Math.max(0, gap),
      status_label: statusLabel,
      severity,
    };
  }).sort((a, b) => b.gap - a.gap);
}

function generateRoadmap(student, trackName) {
  const gaps = computeSkillGaps(student, trackName).filter(g => g.gap > 0);

  if (gaps.length === 0) {
    return [{
      phase: 1, title: 'Interview Preparation', weeks: 'Weeks 1-2', duration_weeks: 2,
      items: [
        { skill: 'Resume', activity: 'Polish resume and LinkedIn profile', time: '3 hours', priority: 'High', improvement: '+5%' },
        { skill: 'Mock Interviews', activity: 'Complete 5 mock technical interviews', time: '10 hours', priority: 'High', improvement: '+8%' },
        { skill: 'System Design', activity: 'Study system design basics', time: '8 hours', priority: 'Medium', improvement: '+4%' },
      ]
    }];
  }

  const critical = gaps.filter(g => g.gap > 25);
  const moderate = gaps.filter(g => g.gap > 10 && g.gap <= 25);
  const minor = gaps.filter(g => g.gap > 0 && g.gap <= 10);
  const phases = [];

  if (critical.length > 0) {
    phases.push({
      phase: phases.length + 1,
      title: 'Foundation',
      weeks: 'Weeks 1-3',
      duration_weeks: 3,
      items: critical.map(g => ({
        skill: g.skill,
        activity: getActivityForSkill(g.skill_col, 'critical'),
        time: `${rand(10, 20)} hours`,
        priority: 'Critical',
        improvement: `+${rand(12, 20)}%`,
      }))
    });
  }

  if (moderate.length > 0) {
    phases.push({
      phase: phases.length + 1,
      title: 'Project Development',
      weeks: `Weeks ${phases.length * 3 + 1}-${phases.length * 3 + 4}`,
      duration_weeks: 4,
      items: [
        ...moderate.map(g => ({
          skill: g.skill,
          activity: getActivityForSkill(g.skill_col, 'moderate'),
          time: `${rand(6, 12)} hours`,
          priority: 'High',
          improvement: `+${rand(8, 15)}%`,
        })),
        {
          skill: trackName,
          activity: `Build a capstone project using the ${trackName} stack`,
          time: '20 hours',
          priority: 'High',
          improvement: '+10%',
        }
      ]
    });
  }

  phases.push({
    phase: phases.length + 1,
    title: 'Interview Preparation',
    weeks: `Weeks ${phases.length * 3 + 1}-${phases.length * 3 + 3}`,
    duration_weeks: 3,
    items: [
      { skill: 'Aptitude', activity: 'Practice IndiaBix aptitude sets daily', time: '15 hours', priority: 'High', improvement: '+8%' },
      { skill: 'Coding', activity: 'Solve 3 LeetCode problems/day (Easy → Medium)', time: '20 hours', priority: 'High', improvement: '+12%' },
      { skill: 'Communication', activity: 'Mock GDs and presentation practice', time: '8 hours', priority: 'Medium', improvement: '+6%' },
    ]
  });

  phases.push({
    phase: phases.length + 1,
    title: 'Placement Readiness',
    weeks: `Weeks ${phases.length * 3 + 1}-${phases.length * 3 + 2}`,
    duration_weeks: 2,
    items: [
      { skill: 'Resume', activity: 'Resume review and optimization', time: '3 hours', priority: 'High', improvement: '+3%' },
      { skill: 'Interview', activity: 'Technical + HR mock interviews', time: '10 hours', priority: 'Critical', improvement: '+10%' },
      { skill: 'Assessment', activity: 'Final readiness self-assessment', time: '2 hours', priority: 'Medium', improvement: '+2%' },
    ]
  });

  return phases;
}

function getActivityForSkill(skillCol, level) {
  const activities = {
    skill_javascript: level === 'critical' ? 'Complete JavaScript30 course + build 3 mini-projects' : 'Practice advanced JS concepts and async patterns',
    skill_react: level === 'critical' ? 'Build a full React CRUD application from scratch' : 'Add state management and routing to existing projects',
    skill_sql: level === 'critical' ? 'Complete 50 SQL queries on HackerRank + build a DB project' : 'Practice complex joins and optimization',
    skill_python: level === 'critical' ? 'Complete Python for Data Science on Kaggle' : 'Build automation scripts and data analysis projects',
    skill_git: level === 'critical' ? 'Learn Git branching, merging, rebasing on learngitbranching.js.org' : 'Contribute to open source with proper Git workflow',
    skill_cloud: level === 'critical' ? 'Earn AWS/GCP Cloud Practitioner certification' : 'Deploy a project on cloud with CI/CD pipeline',
    skill_java: level === 'critical' ? 'Complete Java OOP course + build a Spring Boot app' : 'Practice design patterns and advanced Java features',
    skill_linux: level === 'critical' ? 'Practice Linux commands on OverTheWire Bandit wargame' : 'Set up a Linux server and deploy an application',
    skill_testing: level === 'critical' ? 'Learn Selenium/Playwright basics + write test suites' : 'Add integration tests to existing projects',
    skill_automation: level === 'critical' ? 'Build a test automation suite for a sample project' : 'Implement CI/CD automation with testing',
    skill_scripting: level === 'critical' ? 'Write 10 Bash/Python automation scripts' : 'Automate daily development tasks with scripts',
    skill_excel: level === 'critical' ? 'Take Excel for Data Analysis on Coursera' : 'Create data dashboards and pivot table reports',
    coding_score: level === 'critical' ? 'Solve 5 LeetCode Easy + 3 Medium problems daily' : 'Focus on Medium/Hard problems and contests',
    communication_score: level === 'critical' ? 'Join Toastmasters + practice mock GDs weekly' : 'Present technical topics to peers biweekly',
    aptitude_score: level === 'critical' ? 'Practice IndiaBix aptitude sets for 45 min/day' : 'Take timed aptitude mock tests weekly',
  };
  return activities[skillCol] || `Improve ${SKILL_DISPLAY[skillCol] || skillCol} through focused practice`;
}

// ── Generate & Persist students ──
function generateInitialStudents() {
  const list = [];
  for (let i = 0; i < 80; i++) {
    list.push(generateStudent(i));
  }
  // User Prompt required demo students
  list[0] = {
    ...list[0],
    student_id: 'STU1001',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@sapthagiri.edu.in',
    phone: '+91 9845012345',
    department: 'CSE',
    semester: 7,
    cgpa: 8.4,
    tenth_pct: 92.5,
    twelfth_pct: 89.0,
    backlogs: 0,
    readiness_status: 'Ready',
    placement_probability: 78,
    placement_status: 'Eligible',
    accountStatus: 'active',
    account_status: 'active',
    password: 'student123',
    coding_score: 82,
    aptitude_score: 79,
    communication_score: 75,
    presentation_score: 72,
    projects_count: 4,
    internships_count: 2,
    certifications_count: 3,
    hackathons_count: 2,
  };
  list[1] = {
    ...list[1],
    student_id: 'STU1002',
    name: 'Priya Sharma',
    email: 'priya.sharma@sapthagiri.edu.in',
    phone: '+91 9845023456',
    department: 'ECE',
    semester: 7,
    cgpa: 7.2,
    tenth_pct: 84.0,
    twelfth_pct: 81.5,
    backlogs: 0,
    readiness_status: 'Near-Ready',
    placement_probability: 67,
    placement_status: 'Eligible',
    accountStatus: 'active',
    account_status: 'active',
    password: 'student123',
    coding_score: 68,
    aptitude_score: 70,
    communication_score: 66,
    presentation_score: 64,
    projects_count: 3,
    internships_count: 1,
    certifications_count: 2,
    hackathons_count: 1,
  };
  list[2] = {
    ...list[2],
    student_id: 'STU1003',
    name: 'Arun Kumar',
    email: 'arun.kumar@sapthagiri.edu.in',
    phone: '+91 9845034567',
    department: 'MECH',
    semester: 7,
    cgpa: 6.1,
    tenth_pct: 72.0,
    twelfth_pct: 68.0,
    backlogs: 2,
    readiness_status: 'Needs Training',
    placement_probability: 48,
    placement_status: 'Training Required',
    accountStatus: 'disabled',
    account_status: 'disabled',
    password: 'student123',
    coding_score: 42,
    aptitude_score: 46,
    communication_score: 50,
    presentation_score: 48,
    projects_count: 1,
    internships_count: 0,
    certifications_count: 0,
    hackathons_count: 0,
  };
  return list;
}

const STORAGE_KEY = 'aipp_students_v3';
let STUDENTS_CACHE = [];

function loadStudentsFromStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load students from localStorage:', e);
    }
  }
  const initial = generateInitialStudents();
  saveStudentsToStorage(initial);
  return initial;
}

function saveStudentsToStorage(data) {
  STUDENTS_CACHE = data;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save students to localStorage:', e);
    }
  }
  notifySubscribers();
}

const subscribers = new Set();
function notifySubscribers() {
  subscribers.forEach(cb => {
    try { cb(STUDENTS_CACHE); } catch (e) { console.error(e); }
  });
}

STUDENTS_CACHE = loadStudentsFromStorage();

// ── Companies Data & Persistence ──
const INITIAL_COMPANIES = [
  {
    company_id: 'C001',
    company_name: 'TCS',
    role: 'Software Engineer',
    job_role: 'Software Engineer',
    industry: 'IT Services',
    minimumCGPA: 7.0,
    min_cgpa: 7.0,
    allowedBranches: ['CSE', 'ISE', 'ECE'],
    eligible_departments: ['CSE', 'ISE', 'ECE'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['Java', 'SQL', 'Python'],
    required_skills: ['Java', 'SQL', 'Python'],
    minimumCodingScore: 65,
    minimumCommunicationScore: 60,
    minimumAptitudeScore: 65,
    package: '7.5 LPA',
    students_shortlisted: 45,
    students_selected: 22,
    status: 'Ongoing'
  },
  {
    company_id: 'C002',
    company_name: 'Infosys',
    role: 'Systems Engineer',
    job_role: 'Systems Engineer',
    industry: 'IT Services',
    minimumCGPA: 6.5,
    min_cgpa: 6.5,
    allowedBranches: ['CSE', 'ISE', 'ECE', 'EEE'],
    eligible_departments: ['CSE', 'ISE', 'ECE', 'EEE'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['Java', 'SQL', 'Communication'],
    required_skills: ['Java', 'SQL', 'Communication'],
    minimumCodingScore: 60,
    minimumCommunicationScore: 60,
    minimumAptitudeScore: 60,
    package: '6.5 LPA',
    students_shortlisted: 60,
    students_selected: 35,
    status: 'Ongoing'
  },
  {
    company_id: 'C003',
    company_name: 'Wipro',
    role: 'Project Engineer',
    job_role: 'Project Engineer',
    industry: 'IT Services',
    minimumCGPA: 6.0,
    min_cgpa: 6.0,
    allowedBranches: ['CSE', 'ISE', 'ECE', 'EEE', 'MECH'],
    eligible_departments: ['CSE', 'ISE', 'ECE', 'EEE', 'MECH'],
    maximumBacklogs: 1,
    max_backlogs: 1,
    requiredSemester: 7,
    requiredSkills: ['Java', 'Python', 'Git'],
    required_skills: ['Java', 'Python', 'Git'],
    minimumCodingScore: 55,
    minimumCommunicationScore: 55,
    minimumAptitudeScore: 55,
    package: '6.0 LPA',
    students_shortlisted: 50,
    students_selected: 28,
    status: 'Ongoing'
  },
  {
    company_id: 'C004',
    company_name: 'Amazon',
    role: 'SDE-1',
    job_role: 'SDE-1',
    industry: 'E-Commerce / Cloud',
    minimumCGPA: 7.5,
    min_cgpa: 7.5,
    allowedBranches: ['CSE', 'ISE'],
    eligible_departments: ['CSE', 'ISE'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['DSA', 'Python', 'System Design', 'AWS'],
    required_skills: ['DSA', 'Python', 'System Design', 'AWS'],
    minimumCodingScore: 75,
    minimumCommunicationScore: 70,
    minimumAptitudeScore: 75,
    package: '28 LPA',
    students_shortlisted: 12,
    students_selected: 3,
    status: 'Ongoing'
  },
  {
    company_id: 'C005',
    company_name: 'Google',
    role: 'Software Engineer',
    job_role: 'Software Engineer',
    industry: 'Technology',
    minimumCGPA: 8.5,
    min_cgpa: 8.5,
    allowedBranches: ['CSE', 'ISE'],
    eligible_departments: ['CSE', 'ISE'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['DSA', 'System Design', 'Python', 'Cloud'],
    required_skills: ['DSA', 'System Design', 'Python', 'Cloud'],
    minimumCodingScore: 85,
    minimumCommunicationScore: 75,
    minimumAptitudeScore: 80,
    package: '35 LPA',
    students_shortlisted: 8,
    students_selected: 2,
    status: 'Completed'
  },
  {
    company_id: 'C006',
    company_name: 'Microsoft',
    role: 'Software Engineer',
    job_role: 'Software Engineer',
    industry: 'Technology',
    minimumCGPA: 8.0,
    min_cgpa: 8.0,
    allowedBranches: ['CSE', 'ISE'],
    eligible_departments: ['CSE', 'ISE'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['C++', 'DSA', 'System Design'],
    required_skills: ['C++', 'DSA', 'System Design'],
    minimumCodingScore: 80,
    minimumCommunicationScore: 70,
    minimumAptitudeScore: 75,
    package: '30 LPA',
    students_shortlisted: 10,
    students_selected: 4,
    status: 'Ongoing'
  },
  {
    company_id: 'C007',
    company_name: 'Accenture',
    role: 'Software Developer',
    job_role: 'Associate Software Engineer',
    industry: 'Consulting',
    minimumCGPA: 8.5, // Intentionally higher CGPA threshold for testing Near Match
    min_cgpa: 8.5,
    allowedBranches: ['CSE', 'ISE', 'ECE', 'EEE'],
    eligible_departments: ['CSE', 'ISE', 'ECE', 'EEE'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['Java', 'SQL', 'React', 'Testing'],
    required_skills: ['Java', 'SQL', 'React', 'Testing'],
    minimumCodingScore: 70,
    minimumCommunicationScore: 65,
    minimumAptitudeScore: 65,
    package: '6.5 LPA',
    students_shortlisted: 55,
    students_selected: 30,
    status: 'Ongoing'
  },
  {
    company_id: 'C008',
    company_name: 'Deloitte',
    role: 'Analyst',
    job_role: 'Analyst',
    industry: 'Consulting',
    minimumCGPA: 7.0,
    min_cgpa: 7.0,
    allowedBranches: ['CSE', 'ISE', 'ECE', 'MECH', 'CIVIL'],
    eligible_departments: ['CSE', 'ISE', 'ECE', 'MECH', 'CIVIL'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['Excel', 'SQL', 'Python', 'Communication'],
    required_skills: ['Excel', 'SQL', 'Python', 'Communication'],
    minimumCodingScore: 50,
    minimumCommunicationScore: 75,
    minimumAptitudeScore: 70,
    package: '8.5 LPA',
    students_shortlisted: 20,
    students_selected: 10,
    status: 'Ongoing'
  },
  {
    company_id: 'C009',
    company_name: 'HCL Technologies',
    role: 'Graduate Engineer Trainee',
    job_role: 'Graduate Engineer Trainee',
    industry: 'IT Services',
    minimumCGPA: 6.0,
    min_cgpa: 6.0,
    allowedBranches: ['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    eligible_departments: ['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'],
    maximumBacklogs: 2,
    max_backlogs: 2,
    requiredSemester: 7,
    requiredSkills: ['Java', 'Linux', 'SQL'],
    required_skills: ['Java', 'Linux', 'SQL'],
    minimumCodingScore: 50,
    minimumCommunicationScore: 50,
    minimumAptitudeScore: 50,
    package: '4.5 LPA',
    students_shortlisted: 70,
    students_selected: 40,
    status: 'Ongoing'
  },
  {
    company_id: 'C010',
    company_name: 'Razorpay',
    role: 'Backend Developer',
    job_role: 'Backend Developer',
    industry: 'FinTech',
    minimumCGPA: 7.5,
    min_cgpa: 7.5,
    allowedBranches: ['CSE', 'ISE'],
    eligible_departments: ['CSE', 'ISE'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['Python', 'SQL', 'Docker', 'Git'],
    required_skills: ['Python', 'SQL', 'Docker', 'Git'],
    minimumCodingScore: 75,
    minimumCommunicationScore: 65,
    minimumAptitudeScore: 70,
    package: '18 LPA',
    students_shortlisted: 15,
    students_selected: 5,
    status: 'Ongoing'
  },
  {
    company_id: 'C011',
    company_name: 'Cognizant',
    role: 'Programmer Analyst',
    job_role: 'Programmer Analyst',
    industry: 'IT Services',
    minimumCGPA: 6.5,
    min_cgpa: 6.5,
    allowedBranches: ['CSE', 'ISE', 'ECE'],
    eligible_departments: ['CSE', 'ISE', 'ECE'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['Java', 'SQL', 'Python'],
    required_skills: ['Java', 'SQL', 'Python'],
    minimumCodingScore: 60,
    minimumCommunicationScore: 60,
    minimumAptitudeScore: 60,
    package: '6.0 LPA',
    students_shortlisted: 40,
    students_selected: 20,
    status: 'Ongoing'
  },
  {
    company_id: 'C012',
    company_name: 'Zoho',
    role: 'Software Developer',
    job_role: 'Software Developer',
    industry: 'SaaS',
    minimumCGPA: 7.0,
    min_cgpa: 7.0,
    allowedBranches: ['CSE', 'ISE', 'ECE'],
    eligible_departments: ['CSE', 'ISE', 'ECE'],
    maximumBacklogs: 0,
    max_backlogs: 0,
    requiredSemester: 7,
    requiredSkills: ['Java', 'JavaScript', 'SQL', 'DSA'],
    required_skills: ['Java', 'JavaScript', 'SQL', 'DSA'],
    minimumCodingScore: 70,
    minimumCommunicationScore: 65,
    minimumAptitudeScore: 70,
    package: '12 LPA',
    students_shortlisted: 18,
    students_selected: 8,
    status: 'Ongoing'
  },
];

const COMPANY_STORAGE_KEY = 'aipp_companies_v2';
let COMPANIES_CACHE = [];

function loadCompaniesFromStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(COMPANY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { console.warn(e); }
  }
  return INITIAL_COMPANIES;
}

function saveCompaniesToStorage(data) {
  COMPANIES_CACHE = data;
  if (typeof window !== 'undefined' && window.localStorage) {
    try { localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.warn(e); }
  }
  notifySubscribers();
}

COMPANIES_CACHE = loadCompaniesFromStorage();

// ── Applications Data & Persistence ──
const APP_STORAGE_KEY = 'aipp_applications_v2';
let APPLICATIONS_CACHE = [];

function loadApplicationsFromStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(APP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { console.warn(e); }
  }
  // Default applications for STU1001
  return [
    {
      application_id: 'APP001',
      student_id: 'STU1001',
      company_id: 'C001',
      company_name: 'TCS',
      role: 'Software Engineer',
      applied_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: 'Shortlisted',
      match_pct: 94
    },
    {
      application_id: 'APP002',
      student_id: 'STU1001',
      company_id: 'C002',
      company_name: 'Infosys',
      role: 'Systems Engineer',
      applied_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      status: 'Applied',
      match_pct: 91
    }
  ];
}

function saveApplicationsToStorage(data) {
  APPLICATIONS_CACHE = data;
  if (typeof window !== 'undefined' && window.localStorage) {
    try { localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.warn(e); }
  }
  notifySubscribers();
}

APPLICATIONS_CACHE = loadApplicationsFromStorage();

// ── Interviews Persistence ──
const INTERVIEW_STORAGE_KEY = 'aipp_interviews_v1';
let INTERVIEWS_CACHE = [];

function loadInterviewsFromStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const saved = localStorage.getItem(INTERVIEW_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { console.warn(e); }
  }
  return [
    {
      interview_id: 'INT1001',
      student_id: 'STU1001',
      company_id: 'C001',
      company_name: 'TCS',
      role: 'Software Engineer',
      date: '2026-09-16',
      time: '10:00 AM - 10:45 AM',
      mode: 'Virtual Technical Interview (Google Meet)',
      panel: 'Panel 2 — Core Java & System Basics',
      status: 'Scheduled',
      meeting_link: 'https://meet.google.com/tcs-interview-stu1001'
    }
  ];
}

function saveInterviewsToStorage(data) {
  INTERVIEWS_CACHE = data;
  if (typeof window !== 'undefined' && window.localStorage) {
    try { localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.warn(e); }
  }
  notifySubscribers();
}

INTERVIEWS_CACHE = loadInterviewsFromStorage();

// ── Export mock data API ──
export const mockData = {
  get students() {
    return STUDENTS_CACHE;
  },

  getStudents() {
    return STUDENTS_CACHE;
  },

  subscribe(callback) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },

  companies: COMPANIES_CACHE,
  careerTracks: CAREER_TRACKS,
  skillDisplay: SKILL_DISPLAY,

  getStudent(studentId) {
    if (!studentId) return STUDENTS_CACHE[0];
    const target = String(studentId).trim().toUpperCase();
    return STUDENTS_CACHE.find(s => s.student_id && s.student_id.toUpperCase() === target) || STUDENTS_CACHE[0];
  },

  checkCompanyEligibility(student, company) {
    if (!student || !company) return null;

    const minCGPA = company.minimumCGPA !== undefined ? parseFloat(company.minimumCGPA) : parseFloat(company.min_cgpa || 6.0);
    const allowedBranches = company.allowedBranches || company.eligible_departments || ['CSE', 'ISE', 'ECE', 'EEE', 'MECH', 'CIVIL'];
    const maxBacklogs = company.maximumBacklogs !== undefined ? parseInt(company.maximumBacklogs, 10) : parseInt(company.max_backlogs || 0, 10);
    const reqSem = company.requiredSemester || 7;
    const minCoding = company.minimumCodingScore || 60;
    const minComm = company.minimumCommunicationScore || 60;
    const minApt = company.minimumAptitudeScore || 60;
    const requiredSkills = company.requiredSkills || company.required_skills || [];

    const matchedRequirements = [];
    const missingRequirements = [];
    const reasons = [];

    // 1. Branch Check
    const branchOk = allowedBranches.includes(student.department);
    if (branchOk) {
      matchedRequirements.push({ key: 'Branch', text: `Branch ${student.department} is eligible` });
    } else {
      missingRequirements.push({ key: 'Branch', text: `Department ${student.department} is not in allowed branches (${allowedBranches.join(', ')})` });
    }

    // 2. CGPA Check
    const studentCGPA = parseFloat(student.cgpa || 0);
    const cgpaOk = studentCGPA >= minCGPA;
    if (cgpaOk) {
      matchedRequirements.push({ key: 'CGPA', text: `CGPA ${studentCGPA.toFixed(1)} satisfies minimum requirement (${minCGPA.toFixed(1)})` });
    } else {
      missingRequirements.push({ key: 'CGPA', text: `Required CGPA: ${minCGPA.toFixed(1)} | Your CGPA: ${studentCGPA.toFixed(1)}` });
    }

    // 3. Backlog Check
    const studentBacklogs = parseInt(student.backlogs || 0, 10);
    const backlogOk = studentBacklogs <= maxBacklogs;
    if (backlogOk) {
      matchedRequirements.push({ key: 'Backlogs', text: `${studentBacklogs} active backlogs (Max allowed: ${maxBacklogs})` });
    } else {
      missingRequirements.push({ key: 'Backlogs', text: `${studentBacklogs} active backlogs exceeds maximum allowed limit of ${maxBacklogs}` });
    }

    // 4. Semester Check (All students are 7th Semester)
    const semOk = (student.semester || 7) >= reqSem;
    if (semOk) {
      matchedRequirements.push({ key: 'Semester', text: `Semester ${student.semester || 7} satisfies 7th Semester requirement` });
    } else {
      missingRequirements.push({ key: 'Semester', text: `7th Semester required` });
    }

    // 5. Coding Assessment
    const codingScore = parseFloat(student.coding_score || 60);
    const codingOk = codingScore >= minCoding;
    if (codingOk) {
      matchedRequirements.push({ key: 'Coding', text: `Coding score ${Math.round(codingScore)}% satisfies minimum ${minCoding}%` });
    } else {
      missingRequirements.push({ key: 'Coding', text: `Coding score ${Math.round(codingScore)}% is below required ${minCoding}%` });
    }

    // 6. Communication Assessment
    const commScore = parseFloat(student.communication_score || 60);
    const commOk = commScore >= minComm;
    if (commOk) {
      matchedRequirements.push({ key: 'Communication', text: `Communication score ${Math.round(commScore)}% satisfies minimum ${minComm}%` });
    } else {
      missingRequirements.push({ key: 'Communication', text: `Communication score ${Math.round(commScore)}% is below required ${minComm}%` });
    }

    // 7. Aptitude Assessment
    const aptScore = parseFloat(student.aptitude_score || 60);
    const aptOk = aptScore >= minApt;
    if (aptOk) {
      matchedRequirements.push({ key: 'Aptitude', text: `Aptitude score ${Math.round(aptScore)}% satisfies minimum ${minApt}%` });
    } else {
      missingRequirements.push({ key: 'Aptitude', text: `Aptitude score ${Math.round(aptScore)}% is below required ${minApt}%` });
    }

    // 8. Skill Matches
    const studentSkillsStr = [
      ...(student.technical_skills ? student.technical_skills.map(s => s.skill) : []),
      ...(student.programming_skills ? student.programming_skills.split(',') : []),
      ...(student.frameworks ? student.frameworks.split(',') : []),
      ...(student.languages_known ? JSON.parse(student.languages_known || '[]') : []),
      ...(student.frameworks_known ? JSON.parse(student.frameworks_known || '[]') : [])
    ].map(s => s.trim().toLowerCase());

    const missingSkills = [];
    requiredSkills.forEach(reqSkill => {
      const isMatched = studentSkillsStr.some(st => st.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(st));
      if (isMatched) {
        matchedRequirements.push({ key: 'Skill', text: `Required skill "${reqSkill}" matched` });
      } else {
        missingSkills.push(reqSkill);
        missingRequirements.push({ key: 'Skill', text: `Required skill "${reqSkill}" is missing` });
      }
    });

    const skillsOk = missingSkills.length === 0;

    // MANDATORY ELIGIBILITY VERDICT
    const eligible = branchOk && cgpaOk && backlogOk && semOk && codingOk && commOk && aptOk && skillsOk;

    // Composite Match Percentage (0–100%)
    let score = 0;
    if (branchOk) score += 15;
    score += Math.min(25, (studentCGPA / minCGPA) * 20);
    if (backlogOk) score += 10;
    score += Math.min(25, ((codingScore + commScore + aptScore) / 300) * 25);
    if (requiredSkills.length > 0) {
      const matchedCount = requiredSkills.length - missingSkills.length;
      score += Math.min(25, (matchedCount / requiredSkills.length) * 25);
    } else {
      score += 25;
    }

    const matchPercentage = Math.round(Math.min(98, Math.max(30, score)));

    // Recommendation Level
    let recommendationLevel = "Low Match";
    if (matchPercentage >= 90) recommendationLevel = "Excellent Match";
    else if (matchPercentage >= 75) recommendationLevel = "Strong Match";
    else if (matchPercentage >= 60) recommendationLevel = "Good Match";
    else if (matchPercentage >= 40) recommendationLevel = "Near Match";

    return {
      eligible,
      matchPercentage,
      reasons,
      missingRequirements,
      matchedRequirements,
      missingSkills,
      recommendationLevel,
      minCGPA,
      allowedBranches,
      maxBacklogs,
      requiredSkills
    };
  },

  getRecommendedCompanies(studentId) {
    const student = this.getStudent(studentId);
    if (!student) return { bestMatches: [], nearEligible: [], notEligible: [], allRanked: [] };

    const applications = this.getApplications(studentId);
    const appliedCompanyIds = new Set(applications.map(a => a.company_id));

    const evaluated = COMPANIES_CACHE.map(c => {
      const evalResult = this.checkCompanyEligibility(student, c);
      const hasApplied = appliedCompanyIds.has(c.company_id);
      const appInfo = applications.find(a => a.company_id === c.company_id);

      return {
        company_id: c.company_id,
        company_name: c.company_name,
        role: c.role || c.job_role || 'Software Engineer',
        industry: c.industry,
        package: c.package,
        status: c.status,
        applied: hasApplied,
        applicationStatus: appInfo ? appInfo.status : null,
        ...evalResult
      };
    });

    evaluated.sort((a, b) => b.matchPercentage - a.matchPercentage);

    const bestMatches = evaluated.filter(c => c.eligible && c.matchPercentage >= 70);
    const nearEligible = evaluated.filter(c => !c.eligible && (c.matchPercentage >= 55 || c.missingRequirements.length <= 2));
    const notEligible = evaluated.filter(c => !c.eligible && !nearEligible.includes(c));

    return {
      bestMatches,
      nearEligible,
      notEligible,
      allRanked: evaluated
    };
  },

  getApplications(studentId) {
    return APPLICATIONS_CACHE.filter(a => a.student_id === studentId);
  },

  applyForCompany(studentId, companyId) {
    const student = this.getStudent(studentId);
    const company = COMPANIES_CACHE.find(c => c.company_id === companyId);

    if (!student || !company) return { success: false, error: 'Student or Company not found' };

    const existing = APPLICATIONS_CACHE.find(a => a.student_id === studentId && a.company_id === companyId);
    if (existing) {
      return { success: false, alreadyApplied: true, application: existing, message: 'Already applied for this drive' };
    }

    const evalResult = this.checkCompanyEligibility(student, company);
    if (!evalResult.eligible) {
      return {
        success: false,
        ineligible: true,
        evalResult,
        error: `Ineligible: You do not meet the mandatory criteria for ${company.company_name}`
      };
    }

    const newApp = {
      application_id: `APP${String(APPLICATIONS_CACHE.length + 1).padStart(3, '0')}`,
      student_id: studentId,
      company_id: companyId,
      company_name: company.company_name,
      role: company.role || company.job_role || 'Software Engineer',
      applied_at: new Date().toISOString(),
      status: 'Applied',
      match_pct: evalResult.matchPercentage
    };

    saveApplicationsToStorage([newApp, ...APPLICATIONS_CACHE]);
    return { success: true, application: newApp, evalResult };
  },

  getAvailableInterviewSlots(companyId) {
    const company = COMPANIES_CACHE.find(c => c.company_id === companyId);
    const compName = company ? company.company_name : 'Recruiter';
    
    return [
      { id: 'slot-1', date: '2026-09-16', time: '10:00 AM - 10:45 AM', mode: 'Virtual (Google Meet)', panel: `${compName} Technical Panel 1 (DSA & Core CS)` },
      { id: 'slot-2', date: '2026-09-16', time: '02:00 PM - 02:45 PM', mode: 'Virtual (Google Meet)', panel: `${compName} Technical Panel 2 (System & DB)` },
      { id: 'slot-3', date: '2026-09-17', time: '11:30 AM - 12:15 PM', mode: 'On-Campus (Placement Cell Room 302)', panel: `${compName} Panel 3 (Tech + HR)` },
      { id: 'slot-4', date: '2026-09-18', time: '04:00 PM - 04:45 PM', mode: 'Virtual (MS Teams)', panel: `${compName} Executive HR Panel` },
    ];
  },

  scheduleInterviewSlot(studentId, companyId, slotData) {
    const student = this.getStudent(studentId);
    const company = COMPANIES_CACHE.find(c => c.company_id === companyId);

    if (!student || !company) return { success: false, error: 'Student or Company not found' };

    const evalResult = this.checkCompanyEligibility(student, company);
    if (!evalResult.eligible) {
      return { success: false, ineligible: true, error: `Ineligible: You do not satisfy mandatory criteria for ${company.company_name}` };
    }

    // Auto-apply if not already applied
    let app = APPLICATIONS_CACHE.find(a => a.student_id === studentId && a.company_id === companyId);
    if (!app) {
      const applyRes = this.applyForCompany(studentId, companyId);
      if (applyRes.success) app = applyRes.application;
    }

    const interviewId = `INT${String(INTERVIEWS_CACHE.length + 1001)}`;
    const newInterview = {
      interview_id: interviewId,
      student_id: studentId,
      company_id: companyId,
      company_name: company.company_name,
      role: company.role || company.job_role || 'Software Engineer',
      date: slotData.date || '2026-09-16',
      time: slotData.time || '10:00 AM - 10:45 AM',
      mode: slotData.mode || 'Virtual (Google Meet)',
      panel: slotData.panel || `${company.company_name} Panel 1`,
      status: 'Scheduled',
      meeting_link: slotData.mode?.includes('Virtual') ? `https://meet.google.com/${company.company_name.toLowerCase()}-int-${studentId.toLowerCase()}` : 'Placement Cell Room 302'
    };

    saveInterviewsToStorage([newInterview, ...INTERVIEWS_CACHE.filter(i => !(i.student_id === studentId && i.company_id === companyId))]);

    // Update application status
    if (app) {
      app.status = 'Interview Scheduled';
      saveApplicationsToStorage([...APPLICATIONS_CACHE]);
    }

    return { success: true, interview: newInterview };
  },

  getStudentScheduledInterviews(studentId) {
    return INTERVIEWS_CACHE.filter(i => i.student_id === studentId && i.status !== 'Cancelled');
  },

  cancelScheduledInterview(studentId, interviewId) {
    const updated = INTERVIEWS_CACHE.map(i => {
      if (i.interview_id === interviewId && i.student_id === studentId) {
        return { ...i, status: 'Cancelled' };
      }
      return i;
    });
    saveInterviewsToStorage(updated);
    return { success: true };
  },

  updateCompanyCriteria(companyId, criteria) {
    const index = COMPANIES_CACHE.findIndex(c => c.company_id === companyId);
    if (index === -1) return null;

    const current = COMPANIES_CACHE[index];
    const updated = {
      ...current,
      ...criteria,
      min_cgpa: criteria.minimumCGPA !== undefined ? criteria.minimumCGPA : current.min_cgpa,
      eligible_departments: criteria.allowedBranches !== undefined ? criteria.allowedBranches : current.eligible_departments,
      max_backlogs: criteria.maximumBacklogs !== undefined ? criteria.maximumBacklogs : current.max_backlogs,
      required_skills: criteria.requiredSkills !== undefined ? criteria.requiredSkills : current.required_skills,
    };

    const copy = [...COMPANIES_CACHE];
    copy[index] = updated;
    saveCompaniesToStorage(copy);
    return updated;
  },

  addCompany(companyData) {
    const companyId = `C${String(COMPANIES_CACHE.length + 1).padStart(3, '0')}`;
    const newCompany = {
      company_id: companyId,
      company_name: companyData.company_name || 'New Recruiter',
      role: companyData.role || companyData.job_role || 'Software Engineer',
      job_role: companyData.role || companyData.job_role || 'Software Engineer',
      industry: companyData.industry || 'Technology',
      minimumCGPA: parseFloat(companyData.minimumCGPA || companyData.min_cgpa || 7.0),
      min_cgpa: parseFloat(companyData.minimumCGPA || companyData.min_cgpa || 7.0),
      allowedBranches: companyData.allowedBranches || companyData.eligible_departments || ['CSE', 'ISE', 'ECE'],
      eligible_departments: companyData.allowedBranches || companyData.eligible_departments || ['CSE', 'ISE', 'ECE'],
      maximumBacklogs: parseInt(companyData.maximumBacklogs || 0, 10),
      max_backlogs: parseInt(companyData.maximumBacklogs || 0, 10),
      requiredSemester: 7,
      requiredSkills: Array.isArray(companyData.requiredSkills) ? companyData.requiredSkills : (companyData.required_skills || ['Java', 'SQL']),
      required_skills: Array.isArray(companyData.requiredSkills) ? companyData.requiredSkills : (companyData.required_skills || ['Java', 'SQL']),
      minimumCodingScore: parseInt(companyData.minimumCodingScore || 60, 10),
      minimumCommunicationScore: parseInt(companyData.minimumCommunicationScore || 60, 10),
      minimumAptitudeScore: parseInt(companyData.minimumAptitudeScore || 60, 10),
      package: companyData.package || '6.5 LPA',
      students_shortlisted: 0,
      students_selected: 0,
      status: 'Ongoing'
    };

    saveCompaniesToStorage([newCompany, ...COMPANIES_CACHE]);
    return newCompany;
  },

  getStudentCourseRecommendations(studentId) {
    const student = this.getStudent(studentId);
    if (!student) return [];

    const branch = student.department || 'CSE';
    const recs = [];

    if (['CSE', 'ISE'].includes(branch)) {
      if ((student.skill_python || 60) < 70) {
        recs.push({ id: 'crs1', title: 'Python Fundamentals & DSA', priority: 'High', reason: 'Required by TCS, Amazon & Razorpay', category: 'Programming', duration: '2 weeks' });
      }
      if ((student.skill_sql || 60) < 70) {
        recs.push({ id: 'crs2', title: 'SQL for Developers & Query Optimization', priority: 'High', reason: 'Required by Infosys, Accenture, Zoho & Deloitte', category: 'Databases', duration: '1 week' });
      }
      if ((student.coding_score || 60) < 75) {
        recs.push({ id: 'crs3', title: 'Data Structures & Algorithms Masterclass', priority: 'High', reason: 'Crucial for clearing technical interview rounds', category: 'Core CS', duration: '3 weeks' });
      }
      recs.push({ id: 'crs4', title: 'Full Stack Web Development (React & Node.js)', priority: 'Medium', reason: 'Required for Software Developer & SDE roles', category: 'Web Dev', duration: '2 weeks' });
      recs.push({ id: 'crs5', title: 'System Design & Cloud Computing (AWS)', priority: 'Medium', reason: 'Unlocks SDE-1 roles at Amazon & Google', category: 'Architecture', duration: '2 weeks' });
    } else if (['ECE', 'EEE'].includes(branch)) {
      recs.push({ id: 'crs6', title: 'Embedded Systems & C/C++ Programming', priority: 'High', reason: 'Core ECE requirement for hardware & IoT roles', category: 'Core Engg', duration: '3 weeks' });
      recs.push({ id: 'crs7', title: 'Python for Automation & Data Analytics', priority: 'High', reason: 'Required for technical analyst roles', category: 'Programming', duration: '2 weeks' });
    } else if (branch === 'MECH') {
      recs.push({ id: 'crs8', title: 'CAD / SolidWorks Design & Modeling', priority: 'High', reason: 'Core Mechanical design requirement', category: 'Design', duration: '3 weeks' });
      recs.push({ id: 'crs9', title: 'Python for Mechanical Data Analytics', priority: 'High', reason: 'Expands eligibility into consulting & IT roles', category: 'Analytics', duration: '2 weeks' });
    } else if (branch === 'CIVIL') {
      recs.push({ id: 'crs10', title: 'AutoCAD & STAAD.Pro Structural Design', priority: 'High', reason: 'Mandatory software for civil drives', category: 'Structural', duration: '3 weeks' });
    }

    if ((student.aptitude_score || 60) < 70) {
      recs.push({ id: 'crs11', title: 'Quantitative Aptitude & Logical Reasoning Crack Course', priority: 'High', reason: 'Tested in first-round elimination tests at all 12 companies', category: 'Aptitude', duration: '1 week' });
    }
    if ((student.communication_score || 60) < 70) {
      recs.push({ id: 'crs12', title: 'Corporate Communication & Technical Presentation', priority: 'Medium', reason: 'Boosts HR and Managerial interview performance', category: 'Soft Skills', duration: '1 week' });
    }

    return recs;
  },

  getAssistantResponse(studentId, queryText) {
    const student = this.getStudent(studentId);
    if (!student) return { text: "Student profile not found. Please log in." };

    const q = (queryText || '').toLowerCase().trim();
    const recs = this.getRecommendedCompanies(studentId);
    const applications = this.getApplications(studentId);
    const prob = Math.round(student.placement_probability || 0);

    // 1. Company eligibility & best matches
    if (q.includes('which companies') || q.includes('can i apply') || q.includes('best matches') || q.includes('eligible companies') || q.includes('recommendations')) {
      const count = recs.bestMatches.length;
      return {
        text: count > 0
          ? `Hello ${student.name.split(' ')[0]}! Based on your 7th Semester ${student.department} profile (CGPA ${parseFloat(student.cgpa).toFixed(1)}, ${student.backlogs} backlogs), you currently qualify for ${count} placement drives! Here are your top ranked matches:`
          : `Hello ${student.name.split(' ')[0]}! Based on your 7th Semester ${student.department} profile, you currently have 0 fully eligible companies, but ${recs.nearEligible.length} companies where you are close to qualifying.`,
        type: 'company_list',
        data: recs
      };
    }

    // 2. "Why am I not eligible?"
    if (q.includes('why') || q.includes('not eligible') || q.includes('accenture') || q.includes('google') || q.includes('amazon')) {
      let targetComp = COMPANIES_CACHE.find(c => q.includes(c.company_name.toLowerCase()));
      if (!targetComp) targetComp = COMPANIES_CACHE.find(c => c.company_name === 'Accenture') || COMPANIES_CACHE[0];

      const evalResult = this.checkCompanyEligibility(student, targetComp);
      return {
        text: `Here is your detailed criteria evaluation for ${targetComp.company_name} (${targetComp.role}):`,
        type: 'eligibility_breakdown',
        company: targetComp,
        evaluation: evalResult
      };
    }

    // 3. Skill Gaps
    if (q.includes('skill') || q.includes('missing') || q.includes('gap')) {
      const gaps = this.getSkillGaps(studentId, 'Full-Stack Developer');
      return {
        text: `Here is your skill gap analysis compared to recruiter expectations for 7th Semester ${student.department} students:`,
        type: 'skill_gap_analysis',
        gaps,
        readiness: student.readiness_status,
        probability: prob
      };
    }

    // 4. How ready am I?
    if (q.includes('ready') || q.includes('probability') || q.includes('how ready')) {
      return {
        text: `Here is your 360° Placement Readiness Summary:`,
        type: 'readiness_summary',
        student,
        probability: prob,
        readiness: student.readiness_status,
        eligibleCount: recs.bestMatches.length,
        nearEligibleCount: recs.nearEligible.length,
        applicationsCount: applications.length
      };
    }

    // 5. Recommend Courses
    if (q.includes('course') || q.includes('learn') || q.includes('improve first') || q.includes('recommend')) {
      const courses = this.getStudentCourseRecommendations(studentId);
      return {
        text: `Based on your ${student.department} branch and missing recruiter skills, here are your recommended learning modules:`,
        type: 'course_recommendations',
        courses
      };
    }

    // 6. Applications
    if (q.includes('application') || q.includes('applied')) {
      return {
        text: `You have ${applications.length} submitted interview applications:`,
        type: 'applications_list',
        applications
      };
    }

    // 7. Interview Prep
    if (q.includes('prepare') || q.includes('interview')) {
      return {
        text: `Let's prepare you for technical and HR interviews! Here is your tailored interview preparation plan:`,
        type: 'interview_prep',
        student,
        eligibleCompanies: recs.bestMatches
      };
    }

    // Default Fallback
    return {
      text: `Hello ${student.name.split(' ')[0]}! I am your AI Placement Assistant. I can guide you through eligible companies, explain missing criteria, process interview applications, recommend courses, or prepare you for technical interviews. What would you like to ask?`,
      type: 'company_list',
      data: recs
    };
  },

  getStudentPrediction(studentId) {
    const s = this.getStudent(studentId);
    if (!s) return null;
    const categories = [
      { category: 'Academic Performance', score: Math.round((s.cgpa / 10) * 100) },
      { category: 'Technical Skills', score: Math.round(((s.skill_python || 60) + (s.skill_javascript || 60) + (s.skill_sql || 60) + (s.skill_java || 60)) / 4) },
      { category: 'Projects', score: Math.round(Math.min((s.projects_count || 1) / 5, 1) * 100) },
      { category: 'Internships', score: Math.round(Math.min((s.internships_count || 0) / 3, 1) * 100) },
      { category: 'Aptitude', score: Math.round(s.aptitude_score || 60) },
      { category: 'Communication', score: Math.round(s.communication_score || 60) },
      { category: 'Certifications', score: Math.round(Math.min((s.certifications_count || 0) / 3, 1) * 100) },
    ];
    return {
      placement_probability: s.placement_probability,
      status: s.readiness_status,
      confidence: s.prediction_confidence || 85,
      categories,
      top_career_matches: Object.keys(CAREER_TRACKS).map(t => computeCareerMatch(s, t)).sort((a, b) => b.match_pct - a.match_pct),
    };
  },

  getExplanation(studentId) {
    const s = this.getStudent(studentId);
    if (!s) return [];
    return generateFactorContributions(s);
  },

  getCareerMatches(studentId) {
    const s = this.getStudent(studentId);
    if (!s) return [];
    return Object.keys(CAREER_TRACKS).map(t => computeCareerMatch(s, t)).sort((a, b) => b.match_pct - a.match_pct);
  },

  getSkillGaps(studentId, track) {
    const s = this.getStudent(studentId);
    if (!s) return [];
    return computeSkillGaps(s, track);
  },

  getRoadmap(studentId, track) {
    const s = this.getStudent(studentId);
    if (!s) return [];
    return generateRoadmap(s, track);
  },

  addStudent(studentInput) {
    const nextIndex = STUDENTS_CACHE.length + 1;
    const studentId = (studentInput.student_id || studentInput.studentId || `STU${String(1000 + nextIndex).padStart(4, '0')}`).trim().toUpperCase();
    
    const cgpa = parseFloat(studentInput.cgpa) || 7.0;
    const tenthPct = parseFloat(studentInput.tenth_pct || studentInput.tenthPct) || 75.0;
    const twelfthPct = parseFloat(studentInput.twelfth_pct || studentInput.twelfthPct) || 75.0;
    const backlogs = parseInt(studentInput.backlogs, 10) || 0;

    const codingScore = parseFloat(studentInput.coding_score || studentInput.codingScore) || 60;
    const aptitudeScore = parseFloat(studentInput.aptitude_score || studentInput.aptitudeScore) || 60;
    const communicationScore = parseFloat(studentInput.communication_score || studentInput.communicationScore) || 60;
    const presentationScore = parseFloat(studentInput.presentation_score || studentInput.presentationScore) || 60;

    const projectsCount = parseInt(studentInput.projects_count || studentInput.projectsCount, 10) || 2;
    const internshipsCount = parseInt(studentInput.internships_count || studentInput.internshipsCount, 10) || 0;
    const certCount = parseInt(studentInput.certifications_count || studentInput.certificationsCount, 10) || 1;
    const hackathonsCount = parseInt(studentInput.hackathons_count || studentInput.hackathonsCount, 10) || 0;

    const skillPython = parseFloat(studentInput.skill_python) || (codingScore > 70 ? 75 : 55);
    const skillJavascript = parseFloat(studentInput.skill_javascript) || (codingScore > 70 ? 70 : 50);
    const skillSql = parseFloat(studentInput.skill_sql) || (codingScore > 70 ? 75 : 55);
    const skillGit = parseFloat(studentInput.skill_git) || 65;
    const skillCloud = parseFloat(studentInput.skill_cloud) || 50;

    const calculatedProb = computePlacementProbability({
      cgpa, backlogs, tenthPct, twelfthPct,
      codingScore, aptitudeScore, communicationScore, presentationScore,
      internshipsCount, projectsCount, certCount, hackathonsCount,
      skillJavascript, skillReact: 50, skillSql, skillPython, skillGit, skillCloud
    });

    const prob = studentInput.placement_probability !== undefined && studentInput.placement_probability !== ''
      ? parseFloat(studentInput.placement_probability)
      : calculatedProb;

    const readiness = studentInput.readiness_status || (prob >= 75 ? 'Ready' : prob >= 60 ? 'Near-Ready' : 'Needs Training');
    const placementStatus = studentInput.placement_status || (prob >= 80 ? 'Selected' : prob >= 60 ? 'Eligible' : 'Training Required');

    const newStudent = {
      student_id: studentId,
      name: studentInput.name || 'New Student',
      email: studentInput.email || `${studentId.toLowerCase()}@sapthagiri.edu.in`,
      phone: studentInput.phone || '+91 9845000000',
      department: studentInput.department || 'CSE',
      semester: parseInt(studentInput.semester, 10) || 7,
      cgpa,
      tenth_pct: tenthPct,
      twelfth_pct: twelfthPct,
      backlogs,
      accountStatus: studentInput.accountStatus || 'active',
      account_status: studentInput.accountStatus || 'active',
      password: studentInput.password || 'student123',
      coding_score: codingScore,
      aptitude_score: aptitudeScore,
      communication_score: communicationScore,
      presentation_score: presentationScore,
      interview_score: parseFloat(studentInput.interview_score) || 65,
      projects_count: projectsCount,
      project_complexity: studentInput.project_complexity || 'Intermediate',
      internships_count: internshipsCount,
      open_source_contributions: parseInt(studentInput.open_source_contributions, 10) || 0,
      hackathons_count: hackathonsCount,
      leadership_flag: !!studentInput.leadership_flag,
      leadership_roles: parseInt(studentInput.leadership_roles, 10) || 0,
      clubs: Array.isArray(studentInput.clubs) ? studentInput.clubs : (studentInput.clubs ? [studentInput.clubs] : ['Coding Club']),
      certifications: studentInput.certifications || [],
      certifications_count: certCount,
      technical_skills: studentInput.technical_skills || [
        { skill: 'Python', level: skillPython },
        { skill: 'SQL', level: skillSql },
        { skill: 'Git', level: skillGit }
      ],
      languages_known: studentInput.languages_known || '["Python","Java"]',
      frameworks_known: studentInput.frameworks_known || '["React","Node.js"]',
      programming_skills: studentInput.programming_skills || 'Python, Java',
      frameworks: studentInput.frameworks || 'React, Express',
      skill_python: skillPython,
      skill_javascript: skillJavascript,
      skill_sql: skillSql,
      skill_git: skillGit,
      skill_cloud: skillCloud,
      skill_java: parseFloat(studentInput.skill_java) || 60,
      skill_react: parseFloat(studentInput.skill_react) || 50,
      skill_linux: parseFloat(studentInput.skill_linux) || 55,
      skill_testing: parseFloat(studentInput.skill_testing) || 50,
      skill_automation: parseFloat(studentInput.skill_automation) || 45,
      skill_scripting: parseFloat(studentInput.skill_scripting) || 50,
      skill_excel: parseFloat(studentInput.skill_excel) || 60,
      placement_probability: prob,
      readiness_status: readiness,
      placement_status: placementStatus,
      placed: placementStatus === 'Selected' ? 1 : 0,
      prediction_confidence: 85,
      companies_applied: parseInt(studentInput.companies_applied, 10) || 2,
      shortlisted_count: parseInt(studentInput.shortlisted_count, 10) || (placementStatus === 'Selected' ? 1 : 0),
      interviews_count: parseInt(studentInput.interviews_count, 10) || (placementStatus === 'Selected' ? 1 : 0),
      offers_count: parseInt(studentInput.offers_count, 10) || (placementStatus === 'Selected' ? 1 : 0),
    };

    const updated = [newStudent, ...STUDENTS_CACHE];
    saveStudentsToStorage(updated);
    return newStudent;
  },

  updateStudent(studentId, fields) {
    const target = String(studentId || '').trim().toUpperCase();
    const index = STUDENTS_CACHE.findIndex(s => s.student_id && s.student_id.toUpperCase() === target);
    if (index === -1) return null;

    const current = STUDENTS_CACHE[index];
    const updatedStudent = { ...current, ...fields };

    // Recompute probability if academic or skill metrics were modified
    if (
      fields.cgpa !== undefined ||
      fields.backlogs !== undefined ||
      fields.coding_score !== undefined ||
      fields.aptitude_score !== undefined ||
      fields.communication_score !== undefined ||
      fields.internships_count !== undefined ||
      fields.projects_count !== undefined
    ) {
      const recalculatedProb = computePlacementProbability({
        cgpa: updatedStudent.cgpa,
        backlogs: updatedStudent.backlogs,
        tenthPct: updatedStudent.tenth_pct,
        twelfthPct: updatedStudent.twelfth_pct,
        codingScore: updatedStudent.coding_score,
        aptitudeScore: updatedStudent.aptitude_score,
        communicationScore: updatedStudent.communication_score,
        presentationScore: updatedStudent.presentation_score,
        internshipsCount: updatedStudent.internships_count,
        projectsCount: updatedStudent.projects_count,
        certCount: updatedStudent.certifications_count,
        hackathonsCount: updatedStudent.hackathons_count,
        skillJavascript: updatedStudent.skill_javascript || 60,
        skillReact: updatedStudent.skill_react || 50,
        skillSql: updatedStudent.skill_sql || 60,
        skillPython: updatedStudent.skill_python || 60,
        skillGit: updatedStudent.skill_git || 60,
        skillCloud: updatedStudent.skill_cloud || 50
      });
      if (!fields.placement_probability) {
        updatedStudent.placement_probability = recalculatedProb;
        updatedStudent.readiness_status = recalculatedProb >= 75 ? 'Ready' : recalculatedProb >= 60 ? 'Near-Ready' : 'Needs Training';
      }
    }

    if (fields.accountStatus) {
      updatedStudent.account_status = fields.accountStatus;
    }

    const updated = [...STUDENTS_CACHE];
    updated[index] = updatedStudent;
    saveStudentsToStorage(updated);
    return updatedStudent;
  },

  setStudentStatus(studentId, status) {
    return this.updateStudent(studentId, {
      accountStatus: status,
      account_status: status
    });
  },

  deleteStudent(studentId) {
    const updated = STUDENTS_CACHE.filter(s => s.student_id !== studentId);
    saveStudentsToStorage(updated);
    return true;
  },

  resetData() {
    const initial = generateInitialStudents();
    saveStudentsToStorage(initial);
    return initial;
  },

  computePlacementProbability,

  getDashboardKPIs() {
    const total = STUDENTS_CACHE.length;
    const active = STUDENTS_CACHE.filter(s => s.accountStatus === 'active' || !s.accountStatus).length;
    const disabled = STUDENTS_CACHE.filter(s => s.accountStatus === 'disabled').length;
    const ready = STUDENTS_CACHE.filter(s => s.readiness_status === 'Ready').length;
    const near = STUDENTS_CACHE.filter(s => s.readiness_status === 'Near-Ready').length;
    const needs = STUDENTS_CACHE.filter(s => s.readiness_status === 'Needs Training').length;
    const placed = STUDENTS_CACHE.filter(s => s.placement_status === 'Selected').length;
    return {
      total_students: total,
      active_students: active,
      disabled_students: disabled,
      ready_pct: total ? Math.round(ready / total * 100) : 0,
      near_ready_pct: total ? Math.round(near / total * 100) : 0,
      needs_training_pct: total ? Math.round(needs / total * 100) : 0,
      placed_pct: total ? Math.round(placed / total * 100) : 0,
      companies: COMPANIES_CACHE.length,
      ready_count: ready,
      near_ready_count: near,
      needs_training_count: needs,
      placed_count: placed,
    };
  },

  getDeptSummary() {
    const depts = {};
    for (const s of STUDENTS_CACHE) {
      if (!depts[s.department]) depts[s.department] = { probs: [], ready: 0, near: 0, needs: 0 };
      depts[s.department].probs.push(s.placement_probability);
      if (s.readiness_status === 'Ready') depts[s.department].ready++;
      else if (s.readiness_status === 'Near-Ready') depts[s.department].near++;
      else depts[s.department].needs++;
    }
    return Object.entries(depts).map(([dept, d]) => ({
      department: dept,
      avg_probability: Math.round(d.probs.reduce((a, b) => a + b, 0) / d.probs.length),
      student_count: d.probs.length,
      ready_count: d.ready,
      near_ready_count: d.near,
      needs_training_count: d.needs,
    })).sort((a, b) => b.avg_probability - a.avg_probability);
  },

  getSkillHeatmap() {
    const skillCols = [
      'skill_sql', 'skill_python', 'skill_java', 'skill_javascript',
      'skill_cloud', 'communication_score', 'aptitude_score', 'coding_score',
      'skill_react', 'skill_git', 'skill_linux', 'skill_testing'
    ];
    const result = [];
    for (const dept of DEPARTMENTS) {
      const deptStudents = STUDENTS_CACHE.filter(s => s.department === dept);
      for (const col of skillCols) {
        const scores = deptStudents.map(s => s[col] || 0);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const below = scores.filter(sc => sc < 60).length;
        result.push({
          group: dept,
          skill: SKILL_DISPLAY[col] || col,
          avg_score: avg,
          pct_below_threshold: scores.length ? Math.round(below / scores.length * 100) : 0,
        });
      }
    }
    return result;
  },

  getAtRiskStudents(threshold = 60, department = null) {
    let filtered = STUDENTS_CACHE.filter(s => s.placement_probability < threshold);
    if (department) filtered = filtered.filter(s => s.department === department);
    return filtered.sort((a, b) => a.placement_probability - b.placement_probability);
  },

  getRecommendedStudents(companyId) {
    const company = COMPANIES_CACHE.find(c => c.company_id === companyId);
    if (!company) return [];
    const eligible = STUDENTS_CACHE.filter(s =>
      company.eligible_departments.includes(s.department) && s.cgpa >= company.min_cgpa
    );
    return eligible
      .map(s => {
        const reasons = [];
        if (s.cgpa >= company.min_cgpa) reasons.push(`CGPA ${s.cgpa} ≥ ${company.min_cgpa}`);
        if (s.coding_score >= 65) reasons.push('Strong coding skills');
        if (s.communication_score >= 60) reasons.push('Good communication');
        if (s.internships_count >= 1) reasons.push('Has internship experience');
        if (s.projects_count >= 3) reasons.push('Strong project portfolio');
        return { ...s, match_pct: Math.min(95, s.placement_probability + rand(-5, 10)), reasons };
      })
      .sort((a, b) => b.match_pct - a.match_pct)
      .slice(0, 20);
  },
};

export default mockData;
