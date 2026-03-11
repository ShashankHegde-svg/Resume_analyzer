import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import MatchScoreRing from './MatchScoreRing'

const CHART_COLORS = ['#8b5cf6', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#fb923c', '#a78bfa', '#67e8f9', '#fcd34d']

const resourceIcon = (type) => {
  if (type === 'video') return '🎬'
  if (type === 'course') return '🎓'
  return '📄'
}

function RoadmapCard({ item, index }) {
  const [open, setOpen] = useState(index === 0)

  return (
    <div className="roadmap-card" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="roadmap-card-header" onClick={() => setOpen(o => !o)}>
        <div className="roadmap-card-header-left">
          <div>
            <div className="roadmap-skill-name">{item.skill}</div>
            <div className="roadmap-meta">⏱ ~{item.estimated_hours}h total</div>
          </div>
          <span className={`tier-badge ${item.tier?.replace(' ', '-') || 'Optional'}`}>
            {item.tier}
          </span>
        </div>
        <span className={`chevron ${open ? 'open' : ''}`}>▾</span>
      </div>

      {open && (
        <div className="roadmap-body">
          {item.weeks?.map((w, wi) => (
            <div key={wi} className="week-block">
              <div className="week-title">Week {w.week}</div>
              <div className="week-focus">{w.focus}</div>
              <div className="resource-list">
                {w.resources?.map((r, ri) => (
                  <a key={ri} href={r.url} target="_blank" rel="noreferrer" className="resource-link">
                    <span className="resource-icon">{resourceIcon(r.type)}</span>
                    {r.title}
                  </a>
                ))}
              </div>
              <div className="mini-project">
                <strong>🛠 Mini Project: </strong>{w.mini_project}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard({ data, onReset }) {
  const { analysis, roadmaps } = data
  const {
    match_score, matched_skills, missing_skills, extra_skills,
    resume_skill_count, jd_skill_count, category_breakdown
  } = analysis

  // Bar chart data
  const barData = Object.entries(category_breakdown || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([cat, count]) => ({ name: cat.split(' ')[0], count }))

  // Radar chart data
  const radarData = Object.entries(category_breakdown || {}).slice(0, 6).map(([cat]) => ({
    skill: cat.split(' ')[0],
    resume: (category_breakdown[cat] || 0),
    required: Math.ceil((category_breakdown[cat] || 0) * 1.5),
  }))

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-logo">✦ CareerLens AI</div>
        <button className="new-btn" onClick={onReset}>← New Analysis</button>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card score-card">
          <div className="stat-label">Match Score</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <MatchScoreRing score={match_score} />
          </div>
          <div className="stat-sub">
            {match_score >= 70 ? '🟢 Strong match!' : match_score >= 40 ? '🟡 Good potential' : '🔴 Significant gaps'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Skills Found</div>
          <div className="stat-big" style={{ color: '#8b5cf6' }}>{resume_skill_count}</div>
          <div className="stat-sub">in your resume</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Skills to Learn</div>
          <div className="stat-big" style={{ color: '#f43f5e' }}>{missing_skills?.length}</div>
          <div className="stat-sub">of {jd_skill_count} required</div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="skills-grid">
        <div className="skills-col">
          <div className="col-title matched">✅ Matched ({matched_skills?.length})</div>
          <div className="skill-tags">
            {matched_skills?.length
              ? matched_skills.map((s, i) => (
                  <span key={i} className="skill-tag matched" style={{ animationDelay: `${i * 0.04}s` }}>
                    {s}
                  </span>
                ))
              : <div className="empty-state">No matched skills</div>
            }
          </div>
        </div>

        <div className="skills-col">
          <div className="col-title missing">❌ Missing ({missing_skills?.length})</div>
          <div className="skill-tags">
            {missing_skills?.length
              ? missing_skills.map((item, i) => (
                  <span key={i} className="skill-tag missing" style={{ animationDelay: `${i * 0.04}s` }}>
                    {item.skill}
                    <span className={`tier-badge ${item.tier?.replace(' ', '-')}`}>{item.tier}</span>
                  </span>
                ))
              : <div className="empty-state">🎉 No skill gaps!</div>
            }
          </div>
        </div>

        <div className="skills-col">
          <div className="col-title extra">➕ Bonus ({extra_skills?.length})</div>
          <div className="skill-tags">
            {extra_skills?.length
              ? extra_skills.map((s, i) => (
                  <span key={i} className="skill-tag extra" style={{ animationDelay: `${i * 0.04}s` }}>
                    {s}
                  </span>
                ))
              : <div className="empty-state">No extra skills detected</div>
            }
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-title">Skills by Category</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0c0c1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13 }}
                labelStyle={{ color: '#a78bfa' }}
                cursor={{ fill: 'rgba(139,92,246,0.08)' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]}>
                {barData.map((_, i) => (
                  <rect key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-title">Skill Coverage Radar</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar name="Your Skills" dataKey="resume" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
              <Radar name="Required" dataKey="required" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.1} strokeDasharray="4 2" />
              <Tooltip
                contentStyle={{ background: '#0c0c1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Roadmap */}
      <div className="roadmap-section">
        <div className="section-title">
          🗺️ Your 30-Day Learning Roadmap
          <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-dim)', fontFamily: 'var(--font-body)' }}>
            — {roadmaps?.length} skills, prioritized by importance
          </span>
        </div>
        <div className="roadmap-cards">
          {roadmaps?.length
            ? roadmaps.map((item, i) => <RoadmapCard key={i} item={item} index={i} />)
            : <div className="empty-state glass-card">🎉 No learning roadmap needed — you match all required skills!</div>
          }
        </div>
      </div>
    </div>
  )
}