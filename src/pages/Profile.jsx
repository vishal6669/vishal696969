import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProfile } from '../api/client'
import { LoadingSpinner, ErrorState, PageHeader, StatCard } from '../components/UI'
import { Brain, BarChart3, Map, User, Code2, Award } from 'lucide-react'

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-slate-200">{value}</span>
    </div>
  )
}

function SkillPill({ skill, score }) {
  const color = score >= 75 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : score >= 50 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
  return (
    <div className={`flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs ${color}`}>
      <span>{skill}</span>
      <span className="font-bold ml-2">{score?.toFixed(0)}</span>
    </div>
  )
}

export default function Profile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProfile(id)
      .then(r => setProfile(r.data))
      .catch(() => setError('Student not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner text="Loading profile…" />
  if (error) return <ErrorState message={error} />

  const langs = JSON.parse(profile.languages_known || '[]')
  const fws = JSON.parse(profile.frameworks_known || '[]')

  const skills = [
    ['JavaScript', profile.skill_javascript],
    ['Python', profile.skill_python],
    ['React', profile.skill_react],
    ['SQL', profile.skill_sql],
    ['Git', profile.skill_git],
    ['Cloud', profile.skill_cloud],
    ['Java', profile.skill_java],
    ['Linux', profile.skill_linux],
    ['Testing', profile.skill_testing],
    ['Automation', profile.skill_automation],
    ['Scripting', profile.skill_scripting],
    ['Excel', profile.skill_excel],
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={profile.name}
        subtitle={`${profile.student_id} · ${profile.department} · Semester ${profile.semester}`}
      >
        <div className="flex gap-3 mt-4">
          <Link to={`/student/${id}/predict`} className="btn-primary">
            <Brain size={15} /> View Prediction
          </Link>
          <Link to={`/student/${id}/skill-gap`} className="btn-secondary">
            <BarChart3 size={15} /> Skill Gap
          </Link>
        </div>
      </PageHeader>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="CGPA" value={profile.cgpa?.toFixed(2)} color={profile.cgpa >= 8 ? 'text-emerald-400' : profile.cgpa >= 6 ? 'text-amber-400' : 'text-rose-400'} />
        <StatCard label="Coding Score" value={`${profile.coding_score?.toFixed(0)}/100`} />
        <StatCard label="Aptitude" value={`${profile.aptitude_score?.toFixed(0)}/100`} />
        <StatCard label="Communication" value={`${profile.communication_score?.toFixed(0)}/100`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic & Experience */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-violet-400" />
            <h2 className="font-semibold text-white">Academic & Experience</h2>
          </div>
          <InfoRow label="10th Grade" value={`${profile.tenth_pct?.toFixed(1)}%`} />
          <InfoRow label="12th Grade" value={`${profile.twelfth_pct?.toFixed(1)}%`} />
          <InfoRow label="Backlogs" value={profile.backlogs === 0 ? '✓ None' : profile.backlogs} />
          <InfoRow label="Internships" value={profile.internships_count} />
          <InfoRow label="Projects" value={profile.projects_count} />
          <InfoRow label="Certifications" value={profile.certifications_count} />
          <InfoRow label="Hackathons" value={profile.hackathons_count} />
          <InfoRow label="Open Source" value={profile.open_source_contributions} />
          <InfoRow label="Leadership" value={profile.leadership_roles ? '✓ Yes' : 'No'} />
        </div>

        {/* Tech Stack */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code2 size={16} className="text-violet-400" />
            <h2 className="font-semibold text-white">Tech Stack</h2>
          </div>
          {langs.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-slate-500 mb-2">Languages</div>
              <div className="flex flex-wrap gap-2">
                {langs.map(l => (
                  <span key={l} className="px-2 py-1 text-xs rounded-md bg-brand-800/60 text-brand-300 border border-brand-700/40">{l}</span>
                ))}
              </div>
            </div>
          )}
          {fws.length > 0 && (
            <div>
              <div className="text-xs text-slate-500 mb-2">Frameworks</div>
              <div className="flex flex-wrap gap-2">
                {fws.map(f => (
                  <span key={f} className="px-2 py-1 text-xs rounded-md bg-violet-900/40 text-violet-300 border border-violet-700/30">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skill Scores */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-violet-400" />
            <h2 className="font-semibold text-white">Skill Scores</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {skills.map(([name, score]) => (
              <SkillPill key={name} skill={name} score={score} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
