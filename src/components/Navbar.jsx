import { Link, useLocation, useParams } from 'react-router-dom'
import { useState } from 'react'
import {
  Brain, LayoutDashboard, Users, BarChart3,
  Lightbulb, Map, Sliders, AlertTriangle,
  Flame, ChevronDown, GraduationCap
} from 'lucide-react'

const studentLinks = (id) => [
  { to: `/student/${id}/profile`, label: 'Profile', icon: <Users size={15} /> },
  { to: `/student/${id}/predict`, label: 'Prediction', icon: <Brain size={15} /> },
  { to: `/student/${id}/skill-gap`, label: 'Skill Gap', icon: <BarChart3 size={15} /> },
  { to: `/student/${id}/roadmap`, label: 'Roadmap', icon: <Map size={15} /> },
  { to: `/student/${id}/what-if`, label: 'What-If', icon: <Sliders size={15} /> },
]

const tpoLinks = [
  { to: '/tpo/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { to: '/tpo/at-risk', label: 'At-Risk', icon: <AlertTriangle size={15} /> },
  { to: '/tpo/heatmap', label: 'Skill Heatmap', icon: <Flame size={15} /> },
  { to: '/tpo/interventions', label: 'Interventions', icon: <Lightbulb size={15} /> },
]

export default function Navbar() {
  const location = useLocation()
  const params = useParams()
  const isTPO = location.pathname.startsWith('/tpo')

  // Extract student ID from URL if present
  const idMatch = location.pathname.match(/\/student\/([^/]+)/)
  const studentId = idMatch ? idMatch[1] : null

  const links = isTPO ? tpoLinks : (studentId ? studentLinks(studentId) : [])

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10"
         style={{ background: 'rgba(30,27,75,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/select" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-brand-600
                            flex items-center justify-center shadow-lg shadow-violet-500/30
                            group-hover:shadow-violet-500/50 transition-all duration-300">
              <GraduationCap size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-white leading-none">CareerIQ</div>
              <div className="text-[10px] text-violet-400 leading-none mt-0.5">Intelligence Platform</div>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.icon}
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Role Toggle */}
          <div className="flex items-center gap-2">
            <Link
              to="/select"
              className={`btn-secondary text-xs py-1.5 px-3 ${!isTPO ? 'bg-violet-600/30 border-violet-500/50 text-white' : ''}`}
            >
              <GraduationCap size={13} /> Student
            </Link>
            <Link
              to="/tpo/dashboard"
              className={`btn-secondary text-xs py-1.5 px-3 ${isTPO ? 'bg-violet-600/30 border-violet-500/50 text-white' : ''}`}
            >
              <LayoutDashboard size={13} /> TPO
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
