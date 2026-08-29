import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Terminal, FolderOpen, BarChart3, GitBranch, User, Mail,
  MessageSquare, FileText, BookOpen, Music, Search, Sun, Moon,
  Zap, ExternalLink, X, Minus, Maximize2, ChevronRight,
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Plus, Trash2, Send, Download, GitFork, Link2, Cpu,
  Database, Shield, Server, Layers, Globe, PhoneCall,
  Settings, Activity, Clock, MapPin, Code2, Wifi
} from 'lucide-react'

// Alias brand icons to available Lucide icons
const Github = GitFork
const Linkedin = Link2

// ─── API Helper ───────────────────────────────────────────────
const api = {
  get: async (path) => {
    const res = await fetch(`/api${path}`)
    if (!res.ok) throw new Error(`API error ${res.status}`)
    return res.json()
  },
  post: async (path, body) => {
    const res = await fetch(`/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return res.json()
  }
}

// ─── App Icon Config ──────────────────────────────────────────
const APP_CONFIGS = [
  { id: 'projects',   label: 'Projects',    icon: FolderOpen,  color: '#00d4ff', gradient: 'linear-gradient(135deg,#00d4ff22,#0ea5e922)', desc: 'Main Drive' },
  { id: 'results',    label: 'Results',     icon: BarChart3,   color: '#10b981', gradient: 'linear-gradient(135deg,#10b98122,#059a6022)', desc: 'Proof Vault' },
  { id: 'systems',    label: 'Systems',     icon: Cpu,         color: '#7c3aed', gradient: 'linear-gradient(135deg,#7c3aed22,#6d28d922)', desc: 'Architecture' },
  { id: 'journey',    label: 'Journey',     icon: GitBranch,   color: '#f59e0b', gradient: 'linear-gradient(135deg,#f59e0b22,#d9700022)', desc: 'Timeline' },
  { id: 'casefiles',  label: 'Case Files',  icon: Database,    color: '#06b6d4', gradient: 'linear-gradient(135deg,#06b6d422,#0891b222)', desc: 'Finder' },
  { id: 'fieldnotes', label: 'Field Notes', icon: BookOpen,    color: '#8b5cf6', gradient: 'linear-gradient(135deg,#8b5cf622,#7c3aed22)', desc: 'AI Articles' },
  { id: 'whiteboard', label: 'Whiteboard',  icon: Layers,      color: '#ec4899', gradient: 'linear-gradient(135deg,#ec489922,#db277722)', desc: 'Sticky Notes' },
  { id: 'terminal',   label: 'Terminal',    icon: Terminal,    color: '#a5f3fc', gradient: 'linear-gradient(135deg,#0f172a,#0c1a2e)',     desc: 'Autonomous CLI' },
  { id: 'foundertxt', label: 'Founder.txt', icon: FileText,    color: '#fcd34d', gradient: 'linear-gradient(135deg,#fcd34d15,#fbbf2415)', desc: 'Philosophy' },
  { id: 'contact',    label: 'Contact',     icon: Mail,        color: '#f87171', gradient: 'linear-gradient(135deg,#f8717122,#ef444422)', desc: 'Quick Connect' },
  { id: 'socials',    label: 'Socials',     icon: Globe,       color: '#34d399', gradient: 'linear-gradient(135deg,#34d39922,#10b98122)', desc: 'Networks' },
  { id: 'music',      label: 'Player',      icon: Music,       color: '#c084fc', gradient: 'linear-gradient(135deg,#c084fc22,#a855f722)', desc: 'Focus Audio' },
]

// ─── Z-Index Manager ──────────────────────────────────────────
let zCounter = 1000
const nextZ = () => ++zCounter

// ─── Boot Screen ─────────────────────────────────────────────
function BootScreen({ onDone }) {
  const [fading, setFading] = useState(false)
  const done = useCallback(() => {
    setFading(true)
    setTimeout(onDone, 600)
  }, [onDone])

  useEffect(() => {
    const t = setTimeout(done, 3000)
    return () => clearTimeout(t)
  }, [done])

  return (
    <div className={`boot-screen ${fading ? 'fade-out' : ''}`}>
      <div className="boot-logo">∞</div>
      <div className="boot-title">Autonomous OS</div>
      <div className="boot-subtitle">Loading Swaroop Lendi's Platform Engineering Portfolio</div>
      <div className="boot-progress"><div className="boot-progress-fill" /></div>
      <div className="boot-items">
        <div className="boot-item">[ ✓ ] Mounting 65+ PB data lake...</div>
        <div className="boot-item">[ ✓ ] Initializing MCP infrastructure...</div>
        <div className="boot-item">[ ✓ ] Streaming vehicle telemetry...</div>
        <div className="boot-item">[ ✓ ] Autonomous OS ready</div>
      </div>
      <div className="boot-version">v4.2.0-prod • Swaroop Lendi • Qualcomm</div>
      <button className="boot-skip-btn" onClick={done}>Skip Boot ⌘↩</button>
    </div>
  )
}

// ─── Command Palette ─────────────────────────────────────────
function CommandPalette({ apps, onOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef()

  const allItems = [
    ...apps.map(a => ({ ...a, type: 'app', action: () => onOpen(a.id) })),
    { id: 'email', label: 'Send Email', icon: Mail, color: '#f87171', type: 'action', action: () => window.open('mailto:lendiswaroop@gmail.com'), desc: 'Contact' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: '#25d366', type: 'action', action: () => window.open('https://wa.me/919738141464'), desc: 'Quick Connect' },
    { id: 'github', label: 'GitHub', icon: Github, color: '#e2e8f0', type: 'action', action: () => window.open('https://github.com/swarooplendi', '_blank', 'noopener'), desc: 'Code' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0a66c2', type: 'action', action: () => window.open('https://linkedin.com/in/swarooplendi', '_blank', 'noopener'), desc: 'Profile' },
  ]

  const filtered = query
    ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()) || (i.desc || '').toLowerCase().includes(query.toLowerCase()))
    : allItems

  useEffect(() => {
    inputRef.current?.focus()
    setSelected(0)
  }, [])

  useEffect(() => { setSelected(0) }, [query])

  const handleKey = (e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && filtered[selected]) { filtered[selected].action(); onClose() }
  }

  return (
    <div className="cmd-palette-overlay" onClick={onClose}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <Search size={16} color="var(--text-tertiary)" />
          <input ref={inputRef} className="cmd-input" placeholder="Search apps, commands, links..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={handleKey} />
          <span className="kbd">ESC</span>
        </div>
        <div className="cmd-results">
          {filtered.length === 0
            ? <div className="cmd-no-results">No results for "{query}"</div>
            : filtered.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={item.id} className={`cmd-result-item ${i === selected ? 'is-selected' : ''}`}
                    onClick={() => { item.action(); onClose() }}
                    onMouseEnter={() => setSelected(i)}>
                    <div className="cmd-result-icon" style={{ background: item.gradient || `${item.color}15` }}>
                      <Icon size={16} color={item.color} />
                    </div>
                    <div className="cmd-result-text">
                      <div className="cmd-result-name">{item.label}</div>
                      <div className="cmd-result-type">{item.type} {item.desc ? `• ${item.desc}` : ''}</div>
                    </div>
                    <ChevronRight size={14} color="var(--text-tertiary)" />
                  </div>
                )
              })
          }
        </div>
      </div>
    </div>
  )
}

// ─── Window Component ─────────────────────────────────────────
function OsWindow({ id, title, icon: Icon, iconColor, children, onClose, initialPos, initialSize, zIndex, onFocus }) {
  const [pos, setPos] = useState(initialPos || { x: 80 + Math.random() * 120, y: 60 + Math.random() * 80 })
  const [size] = useState(initialSize || { w: Math.min(800, window.innerWidth - 40), h: Math.min(560, window.innerHeight - 160) })
  const [maximized, setMaximized] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const dragging = useRef(false)
  const offset   = useRef({ x: 0, y: 0 })
  const winRef   = useRef()

  const isMobile = window.innerWidth < 768

  const startDrag = (e) => {
    if (maximized || isMobile) return
    onFocus()
    dragging.current = true
    const rect = winRef.current.getBoundingClientRect()
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    e.preventDefault()
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      const nx = e.clientX - offset.current.x
      const ny = e.clientY - offset.current.y
      setPos({
        x: Math.max(0, Math.min(nx, window.innerWidth - size.w)),
        y: Math.max(48, Math.min(ny, window.innerHeight - 200))
      })
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [size.w])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 200)
  }

  const style = isMobile ? {} : maximized ? {} : {
    left: pos.x, top: pos.y, width: size.w, height: size.h
  }

  return (
    <div
      ref={winRef}
      className={`window ${isOpen ? 'is-animating-open' : ''} ${maximized ? 'is-maximized' : ''}`}
      style={{ ...style, zIndex }}
      onClick={onFocus}
      role="dialog"
      aria-label={title}
      aria-modal="true"
    >
      <div className="window-titlebar" onMouseDown={startDrag}>
        <div className="window-controls">
          <button className="window-btn close"    onClick={handleClose}          aria-label="Close window" />
          <button className="window-btn minimize" onClick={handleClose}          aria-label="Minimize window" />
          <button className="window-btn maximize" onClick={() => setMaximized(m => !m)} aria-label="Toggle maximize" />
        </div>
        <span className="window-title">
          {Icon && <Icon size={12} color={iconColor || 'var(--color-primary)'} style={{ display: 'inline', marginRight: 6 }} />}
          {title}
        </span>
      </div>
      <div className="window-body">
        {children}
      </div>
    </div>
  )
}

// ─── Projects App ─────────────────────────────────────────────
function ProjectsApp() {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => { api.get('/projects').then(setProjects).catch(() => {}) }, [])

  const colorMap = { 'qualcomm-adas-telemetry': '#00d4ff', 'qualcomm-mcp-ai-infra': '#7c3aed', 'excelfore-zero-trust-vehicles': '#10b981', 'excelfore-ota-cdn': '#f59e0b' }
  const badgeClass = (i) => ['badge-primary', 'badge-purple', 'badge-green', 'badge-amber'][i % 4]

  if (selected) {
    const p = selected
    return (
      <div>
        <button onClick={() => setSelected(null)} className="btn-secondary" style={{ marginBottom: 16, fontSize: 12 }}>← Back to Projects</button>
        <div style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>{p.org} • {p.dates}</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{p.title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{p.tagline}</p>
        <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Challenge</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.challenge}</p>
        </div>
        <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-green)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Outcome</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.outcome}</p>
        </div>
        <div className="project-metrics-row" style={{ marginTop: 0 }}>
          {p.metrics?.map((m, i) => (
            <div key={i} className="project-metric-item" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 14px' }}>
              <span className="project-metric-value">{m.value}</span>
              <span className="project-metric-label">{m.label}</span>
            </div>
          ))}
        </div>
        <div className="badge-list" style={{ marginTop: 16 }}>
          {p.stack?.map((s, i) => <span key={i} className={`badge ${badgeClass(i)}`}>{s}</span>)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="app-section-header">
        <span className="section-tag">MAIN DRIVE</span>
        <span className="section-title">Flagship Systems</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)' }}>{projects.length} projects</span>
      </div>
      {projects.map(p => (
        <div key={p.id} className="project-card" style={{ '--project-color': colorMap[p.id] || '#00d4ff' }} onClick={() => setSelected(p)}>
          <div className="project-card-header">
            <div>
              <div className="project-card-org">{p.org} • {p.role}</div>
              <div className="project-card-title">{p.title}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-green)', background: 'var(--color-green-dim)', padding: '3px 8px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.25)', whiteSpace: 'nowrap' }}>{p.status}</span>
          </div>
          <p className="project-card-tagline">{p.tagline}</p>
          <div className="badge-list">
            {p.badges?.map((b, i) => <span key={i} className={`badge ${badgeClass(i)}`}>{b}</span>)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Results App ──────────────────────────────────────────────
function ResultsApp() {
  const [metrics, setMetrics] = useState([])
  useEffect(() => { api.get('/profile').then(d => setMetrics(d.metrics || [])).catch(() => {}) }, [])

  const colors = ['var(--color-primary)', '#7c3aed', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#34d399', '#a78bfa']

  return (
    <div>
      <div className="app-section-header">
        <span className="section-tag">PROOF VAULT</span>
        <span className="section-title">Verified Platform Metrics</span>
      </div>
      <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
        <Activity size={12} color="var(--color-primary)" style={{ display: 'inline', marginRight: 6 }} />
        All metrics reflect verified production operations and platform measurements across Qualcomm and Excelfore engineering scopes.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, borderLeft: `3px solid ${colors[i % colors.length]}` }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 700, color: colors[i % colors.length], marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 8, lineHeight: 1.4 }}>{m.detail}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-green)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-green)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Systems App ──────────────────────────────────────────────
function SystemsApp() {
  const steps = [
    { num: '01', title: 'Find the Ingestion Bottleneck', icon: Search, color: '#00d4ff', owner: 'Swaroop audits the full data path — from edge device to cloud sink — identifying queue saturation, backpressure misconfigs, and network chokepoints.', artifact: 'Architecture diagram + bottleneck report', gate: 'Throughput baseline established with P99 latency targets defined.' },
    { num: '02', title: 'Lock Zero-Trust & SLAs', icon: Shield, color: '#10b981', owner: 'Design mTLS/PKI device identity, RBAC policies, and explicit SLO definitions before writing a single line of infra code.', artifact: 'Security model + SLO document', gate: 'All blast-radius scenarios scoped. Zero-trust boundaries reviewed.' },
    { num: '03', title: 'Build Scalable Event Streams', icon: Activity, color: '#7c3aed', owner: 'Implement the event-driven pipeline (SQS, Kinesis, Step Functions) with dynamic scaling, dead-letter handling, and idempotent consumers.', artifact: 'Deployed streaming pipeline', gate: 'End-to-end load test passes target throughput with zero message loss.' },
    { num: '04', title: 'Automate with MCP & Agents', icon: Cpu, color: '#f59e0b', owner: 'Expose platform schemas and telemetry feeds through Model Context Protocol servers. Build context pruning to minimize token waste.', artifact: 'MCP server endpoints + token optimization engine', gate: '≥30% reduction in manual repetitive infrastructure tasks.' },
    { num: '05', title: 'Continuous FinOps & SRE', icon: BarChart3, color: '#ec4899', owner: 'Implement automated cost governance (S3 lifecycle, right-sizing), proactive anomaly detection, and documented runbooks.', artifact: 'Cost reduction report + SRE runbook', gate: 'Monthly cloud spend trend decreasing. MTTR targets met.' },
  ]
  return (
    <div>
      <div className="app-section-header">
        <span className="section-tag">ARCHITECTURE</span>
        <span className="section-title">Platform Engineering Operating Loop</span>
      </div>
      {steps.map((step, i) => {
        const Icon = step.icon
        return (
          <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${step.color}18`, border: `1px solid ${step.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={step.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: step.color, letterSpacing: '0.08em', marginBottom: 4 }}>STEP {step.num}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{step.owner}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)', borderRadius: 20, padding: '2px 8px' }}>📄 {step.artifact}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-green)', background: 'var(--color-green-dim)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '2px 8px' }}>✓ {step.gate}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Journey App ──────────────────────────────────────────────
function JourneyApp() {
  const [journey, setJourney] = useState([])
  useEffect(() => { api.get('/journey').then(setJourney).catch(() => {}) }, [])

  return (
    <div>
      <div className="app-section-header">
        <span className="section-tag">TIMELINE</span>
        <span className="section-title">Engineering Journey</span>
      </div>
      <div className="timeline">
        {journey.map((item, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-title">{item.title}</div>
            <div className="timeline-story">{item.story}</div>
            <div className="timeline-skill">⚡ {item.skill}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Field Notes App ──────────────────────────────────────────
function FieldNotesApp() {
  const [articles, setArticles] = useState([])
  useEffect(() => { api.get('/articles').then(setArticles).catch(() => {}) }, [])

  return (
    <div>
      <div className="app-section-header">
        <span className="section-tag">AI FIELD NOTES</span>
        <span className="section-title">Technical Articles</span>
      </div>
      {articles.map((a, i) => (
        <div key={i} style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 6 }}>{a.date} • {a.readTime} read</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{a.title}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{a.summary}</div>
          <div className="badge-list">
            {a.tags?.map((t, j) => <span key={j} className="badge badge-primary">{t}</span>)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Whiteboard App ───────────────────────────────────────────
const NOTE_COLORS = ['#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3', '#ede9fe']

function WhiteboardApp() {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('autonomous-os-whiteboard-v1') || '[]') } catch { return [] }
  })
  const [newText, setNewText] = useState('')
  const boardRef = useRef()
  const dragging = useRef(null)
  const offset   = useRef({ x: 0, y: 0 })

  const save = (next) => {
    setNotes(next)
    localStorage.setItem('autonomous-os-whiteboard-v1', JSON.stringify(next))
  }

  const addNote = () => {
    if (!newText.trim()) return
    save([...notes, { id: Date.now(), text: newText.trim(), x: 20 + Math.random() * 200, y: 20 + Math.random() * 120, color: NOTE_COLORS[notes.length % NOTE_COLORS.length] }])
    setNewText('')
  }

  const deleteNote = (id) => save(notes.filter(n => n.id !== id))
  const updateText = (id, text) => save(notes.map(n => n.id === id ? { ...n, text } : n))

  const startDrag = (e, id) => {
    dragging.current = id
    const note = notes.find(n => n.id === id)
    offset.current = { x: e.clientX - note.x, y: e.clientY - note.y }
    e.stopPropagation()
  }

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current) return
      const board = boardRef.current?.getBoundingClientRect()
      if (!board) return
      const nx = Math.max(0, Math.min(e.clientX - offset.current.x, board.width - 170))
      const ny = Math.max(0, Math.min(e.clientY - offset.current.y, board.height - 110))
      setNotes(prev => prev.map(n => n.id === dragging.current ? { ...n, x: nx, y: ny } : n))
    }
    const up = () => {
      if (dragging.current) {
        localStorage.setItem('autonomous-os-whiteboard-v1', JSON.stringify(notes))
        dragging.current = null
      }
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, [notes])

  return (
    <div>
      <div className="app-section-header">
        <span className="section-tag">WHITEBOARD</span>
        <span className="section-title">Sticky Notes</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={newText} onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNote()}
          placeholder="Add a sticky note..." className="form-input" style={{ flex: 1, userSelect: 'text' }}
          aria-label="New sticky note content"
        />
        <button onClick={addNote} className="btn-primary" style={{ padding: '10px 14px', flexShrink: 0 }} aria-label="Add sticky note">
          <Plus size={16} />
        </button>
        <button onClick={() => save([])} className="btn-secondary" style={{ padding: '10px 14px', flexShrink: 0 }} aria-label="Clear all notes" title="Clear all notes">
          <Trash2 size={16} />
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 12, fontFamily: 'var(--font-mono)' }}>Notes saved to your browser only (localStorage). Not sent anywhere.</p>
      <div ref={boardRef} className="whiteboard-canvas" style={{ minHeight: 300 }}>
        {notes.map(note => (
          <div key={note.id} className="sticky-note" style={{ left: note.x, top: note.y, background: note.color, color: '#1e293b' }} onMouseDown={e => startDrag(e, note.id)}>
            <button className="sticky-delete" onClick={() => deleteNote(note.id)} aria-label="Delete note">×</button>
            <textarea value={note.text} onChange={e => updateText(note.id, e.target.value)} onClick={e => e.stopPropagation()} aria-label="Sticky note content" />
          </div>
        ))}
        {notes.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
            No sticky notes yet. Add one above ↑
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Terminal App ─────────────────────────────────────────────
function TerminalApp() {
  const [history, setHistory] = useState([{ type: 'output', text: 'Autonomous OS Terminal — v4.2.0-prod\nType "help" for available commands.\n' }])
  const [cmd, setCmd] = useState('')
  const bodyRef = useRef()
  const inputRef = useRef()

  useEffect(() => { bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight) }, [history])

  const run = async () => {
    const trimmed = cmd.trim()
    if (!trimmed) return
    setHistory(h => [...h, { type: 'input', text: trimmed }])
    setCmd('')
    try {
      const data = await api.post('/terminal', { command: trimmed })
      if (data.output === '__CLEAR__') { setHistory([]); return }
      setHistory(h => [...h, { type: 'output', text: data.output }])
    } catch {
      setHistory(h => [...h, { type: 'error', text: 'Connection error. Is the Flask server running?' }])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div className="app-section-header">
        <span className="section-tag">AUTONOMOUS CLI</span>
        <span className="section-title">System Terminal</span>
      </div>
      <div ref={bodyRef} className="terminal-body">
        {history.map((line, i) => (
          <div key={i} className={`terminal-line ${line.type === 'input' ? '' : line.type === 'error' ? 'terminal-error' : 'terminal-output'}`}>
            {line.type === 'input'
              ? <><span className="terminal-prompt">swaroop@autonomous-os:~$ </span>{line.text}</>
              : line.text.split('\n').map((l, j) => <div key={j}>{l}</div>)
            }
          </div>
        ))}
      </div>
      <div className="terminal-input-row">
        <span className="terminal-prompt" style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', flexShrink: 0 }}>$ </span>
        <input ref={inputRef} className="terminal-input" value={cmd} onChange={e => setCmd(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') run() }}
          placeholder="type a command..." aria-label="Terminal command input" />
      </div>
    </div>
  )
}

// ─── Founder.txt App ──────────────────────────────────────────
function FounderTxtApp() {
  return (
    <div>
      <div className="app-section-header">
        <span className="section-tag">PHILOSOPHY</span>
        <span className="section-title">Founder.txt — Engineering Principles</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.9, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
        {`> WHO I AM
Swaroop Lendi. Distributed systems engineer, SRE, platform architect.
Currently at Qualcomm, building ADAS telemetry infrastructure at the edge of what's measurable.

> WHAT I BUILD
High-throughput data platforms that move terabytes before breakfast.
Zero-trust security systems that protect vehicles people's lives depend on.
AI-assisted infrastructure that makes developer agents actually useful.

> WHY I CARE
Bad infrastructure is a tax on every engineer who builds on top of it.
I build platforms so others don't have to solve the same problems twice.

> HOW I WORK
Measure first. Design from data, not intuition.
Automate ruthlessly — but only after you understand what you're automating.
SLOs are promises. I don't make promises I can't keep.
FinOps isn't optional when you're managing petabytes.

> WHAT I'M EXPLORING
Model Context Protocol as the infrastructure interface for AI agents.
How to build self-healing platforms that diagnose themselves.
The intersection of zero-trust security and autonomous vehicle safety.

> WHO I WANT TO WORK WITH
Teams building things that operate at real scale.
Organizations where platform reliability is a first-class concern.
Leaders who understand that observability is not a nice-to-have.

> WHAT I REFUSE TO COMPROMISE ON
Security by design — never security by retrofit.
Data integrity — every byte matters when you're operating at petabyte scale.
Honest metrics — a 99% SLA means exactly that. Not 98.5%.

> CONTACT
lendiswaroop@gmail.com
+91-9738141464
linkedin.com/in/swarooplendi`}
      </div>
    </div>
  )
}

// ─── Contact App ──────────────────────────────────────────────
function ContactApp() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', website: '' })
  const [status, setStatus] = useState('idle')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await api.post('/contact', form)
      if (res.success) { setStatus('success'); setForm({ name: '', email: '', subject: '', message: '', website: '' }) }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  return (
    <div>
      <div className="app-section-header">
        <span className="section-tag">QUICK CONNECT</span>
        <span className="section-title">Reach Swaroop</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { icon: Mail, label: 'Email', value: 'lendiswaroop@gmail.com', href: 'mailto:lendiswaroop@gmail.com', color: '#f87171' },
          { icon: MessageSquare, label: 'WhatsApp', value: '+91-9738141464', href: 'https://wa.me/919738141464', color: '#25d366' },
          { icon: Linkedin, label: 'LinkedIn', value: 'swarooplendi', href: 'https://linkedin.com/in/swarooplendi', color: '#0a66c2' },
          { icon: Github, label: 'GitHub', value: 'swarooplendi', href: 'https://github.com/swarooplendi', color: '#e2e8f0' },
        ].map(({ icon: Icon, label, value, href, color }, i) => (
          <a key={i} href={href} target="_blank" rel="noreferrer noopener"
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = color}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}>
            <Icon size={18} color={color} />
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</div>
            </div>
            <ExternalLink size={12} color="var(--text-tertiary)" style={{ marginLeft: 'auto' }} />
          </a>
        ))}
      </div>
      {status === 'success'
        ? <div style={{ background: 'var(--color-green-dim)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 10, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-green)' }}>Message received!</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Swaroop will respond within 24 hours.</div>
          </div>
        : <form onSubmit={submit} className="contact-form">
            <input name="website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} style={{ display: 'none' }} tabIndex={-1} aria-hidden="true" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group"><label className="form-label" htmlFor="c-name">Name</label><input id="c-name" className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" /></div>
              <div className="form-group"><label className="form-label" htmlFor="c-email">Email</label><input id="c-email" type="email" className="form-input" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@domain.com" /></div>
            </div>
            <div className="form-group"><label className="form-label" htmlFor="c-subject">Subject</label><input id="c-subject" className="form-input" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Platform Engineering / Advisory / Role" /></div>
            <div className="form-group"><label className="form-label" htmlFor="c-msg">Message</label><textarea id="c-msg" className="form-textarea" required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell me what you're building..." style={{ userSelect: 'text' }} /></div>
            <button type="submit" className="btn-primary" disabled={status === 'loading'} style={{ alignSelf: 'flex-start', gap: 8 }}>
              <Send size={14} />
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
            {status === 'error' && <div style={{ color: 'var(--color-red)', fontSize: 12 }}>Failed to send. Email lendiswaroop@gmail.com directly.</div>}
          </form>
      }
    </div>
  )
}

// ─── Socials App ──────────────────────────────────────────────
function SocialsApp() {
  const socials = [
    { icon: Linkedin, label: 'LinkedIn', handle: 'swarooplendi', url: 'https://linkedin.com/in/swarooplendi', purpose: 'Professional updates, engineering insights', status: 'Active', color: '#0a66c2' },
    { icon: Github, label: 'GitHub', handle: 'swarooplendi', url: 'https://github.com/swarooplendi', purpose: 'Open source, configurations, tooling', status: 'Active', color: '#e2e8f0' },
    { icon: Mail, label: 'Email', handle: 'lendiswaroop@gmail.com', url: 'mailto:lendiswaroop@gmail.com', purpose: 'Direct professional inquiries', status: 'Active', color: '#f87171' },
    { icon: MessageSquare, label: 'WhatsApp', handle: '+91-9738141464', url: 'https://wa.me/919738141464', purpose: 'Rapid response for urgent business inquiries', status: 'Active', color: '#25d366' },
  ]
  return (
    <div>
      <div className="app-section-header">
        <span className="section-tag">NETWORKS</span>
        <span className="section-title">Public Profiles</span>
      </div>
      {socials.map((s, i) => {
        const Icon = s.icon
        return (
          <a key={i} href={s.url} target={s.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener"
            style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 12, background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', textDecoration: 'none', marginBottom: 10, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = 'translateX(4px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'none' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} color={s.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>{s.handle}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.purpose}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--color-green)', background: 'var(--color-green-dim)', padding: '2px 6px', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)' }}>{s.status}</span>
              <ExternalLink size={12} color="var(--text-tertiary)" />
            </div>
          </a>
        )
      })}
    </div>
  )
}

// ─── Case Files App ───────────────────────────────────────────
function CaseFilesApp() {
  const tree = [
    { name: '01_Autonomous_Driving_ADAS', type: 'dir', children: [
      { name: '65PB_Data_Lake_Architecture.arch', type: 'file', size: '4.8 MB', content: 'ADAS Telemetry Data Lake architecture blueprint — 65+ PB at 1 PB/day ingestion, Step Functions + Lambda + SQS orchestration, S3 lifecycle tiering.' },
      { name: 'Backpressure_Tuning_Config.yaml', type: 'file', size: '24 KB', content: 'Production configuration for dynamic queue concurrency and network backpressure during global fleet ingestion bursts.' },
    ]},
    { name: '02_AI_Assisted_Infrastructure', type: 'dir', children: [
      { name: 'Model_Context_Protocol_Server.case', type: 'file', size: '1.2 MB', content: 'Case study: Custom MCP servers exposing platform schemas and live telemetry to AI coding agents. 40% IaC velocity boost.' },
      { name: 'Context_Token_Pruner.py', type: 'file', size: '82 KB', content: 'Python engine that prunes, chunks, and structures raw infrastructure logs before LLM agent dispatch. 35% token reduction.' },
    ]},
    { name: '03_Connected_Vehicle_SRE', type: 'dir', children: [
      { name: 'Zero_Trust_1M_Vehicles.arch', type: 'file', size: '3.5 MB', content: 'Excelfore platform: mTLS PKI device identity, MQTT security, AWS IoT Core FleetWise, 1M+ vehicles at 99.95% uptime.' },
    ]},
    { name: '04_Platform_Manifests', type: 'dir', children: [
      { name: 'SRE_Reliability_SLA.md', type: 'file', size: '18 KB', content: 'Verified platform metrics: 65+ PB, 1 PB/day, 1M+ vehicles, 99.95% uptime, 30% MTTR reduction, 22% FinOps savings.' },
    ]},
  ]

  const [expanded, setExpanded] = useState({ '01_Autonomous_Driving_ADAS': true })
  const [selected, setSelected] = useState(null)

  const extColor = { arch: '#00d4ff', yaml: '#f59e0b', case: '#10b981', py: '#a78bfa', md: '#e2e8f0' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: '100%' }}>
      <div>
        <div className="app-section-header" style={{ marginBottom: 12 }}>
          <span className="section-tag">FINDER</span>
          <span className="section-title">Case Files</span>
        </div>
        {tree.map(dir => (
          <div key={dir.name} style={{ marginBottom: 4 }}>
            <div onClick={() => setExpanded(e => ({ ...e, [dir.name]: !e[dir.name] }))}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, cursor: 'pointer', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', marginBottom: 4, transition: 'all 0.15s' }}>
              <ChevronRight size={12} color="var(--text-tertiary)" style={{ transform: expanded[dir.name] ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
              <FolderOpen size={14} color="#f59e0b" />
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dir.name}</span>
            </div>
            {expanded[dir.name] && dir.children?.map(file => {
              const ext = file.name.split('.').pop()
              return (
                <div key={file.name} onClick={() => setSelected(file)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px 6px 28px', borderRadius: 6, cursor: 'pointer', marginBottom: 2, background: selected?.name === file.name ? 'var(--color-primary-dim)' : 'transparent', border: `1px solid ${selected?.name === file.name ? 'var(--color-border-active)' : 'transparent'}`, transition: 'all 0.15s' }}>
                  <FileText size={12} color={extColor[ext] || 'var(--text-tertiary)'} />
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', flexShrink: 0 }}>{file.size}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 12, padding: 16 }}>
        {selected ? (
          <>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{selected.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>{selected.content}</div>
          </>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 13, fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
            Select a file to preview →
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Music Player State ───────────────────────────────────────
const TRACKS = [
  { title: 'Telemetry Drift', artist: 'Focus Session — 40Hz Binaural', duration: '∞' },
  { title: 'Async / Await', artist: 'Deep Work — Brown Noise', duration: '∞' },
  { title: 'Zero Trust', artist: 'Synthwave Focus — Ambient', duration: '∞' },
  { title: 'Edge Protocol', artist: 'Lo-Fi Infrastructure', duration: '∞' },
]

function useMusicPlayer() {
  const [track, setTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(() => parseFloat(localStorage.getItem('autonomous-os-volume-v1') || '0.6'))
  const [progress, setProgress] = useState(0)
  const [muted, setMuted] = useState(false)
  const audioCtx = useRef(null)
  const gainNode = useRef(null)
  const oscNodes = useRef([])
  const timer = useRef(null)

  const stopAll = useCallback(() => {
    oscNodes.current.forEach(n => { try { n.stop(); n.disconnect() } catch {} })
    oscNodes.current = []
    clearInterval(timer.current)
  }, [])

  const startAudio = useCallback((vol) => {
    if (!audioCtx.current || audioCtx.current.state === 'closed') {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtx.current.state === 'suspended') audioCtx.current.resume()

    gainNode.current = audioCtx.current.createGain()
    gainNode.current.gain.value = muted ? 0 : vol
    gainNode.current.connect(audioCtx.current.destination)

    const freqs = [[40, 0.05], [80, 0.04], [120, 0.03], [200, 0.02]]
    freqs.forEach(([freq, amp]) => {
      const o = audioCtx.current.createOscillator()
      o.type = 'sine'
      o.frequency.value = freq + track * 10
      const g = audioCtx.current.createGain()
      g.gain.value = amp
      o.connect(g)
      g.connect(gainNode.current)
      o.start()
      oscNodes.current.push(o)
    })

    timer.current = setInterval(() => setProgress(p => (p + 0.1) % 100), 1000)
  }, [track, muted])

  const togglePlay = useCallback(() => {
    if (playing) { stopAll(); setPlaying(false) }
    else { startAudio(volume); setPlaying(true) }
  }, [playing, stopAll, startAudio, volume])

  const changeTrack = useCallback((dir) => {
    stopAll()
    setTrack(t => (t + dir + TRACKS.length) % TRACKS.length)
    setPlaying(false)
    setProgress(0)
  }, [stopAll])

  const changeVolume = useCallback((v) => {
    setVolume(v)
    localStorage.setItem('autonomous-os-volume-v1', v)
    if (gainNode.current) gainNode.current.gain.value = muted ? 0 : v
  }, [muted])

  const toggleMute = useCallback(() => {
    setMuted(m => {
      if (gainNode.current) gainNode.current.gain.value = !m ? 0 : volume
      return !m
    })
  }, [volume])

  useEffect(() => () => stopAll(), [stopAll])

  return { track: TRACKS[track], trackIdx: track, playing, volume, progress, muted, togglePlay, changeTrack, changeVolume, toggleMute }
}

// ─── Lendi-Bot Companion ──────────────────────────────────────
function LendiBot({ state }) {
  const colors = { idle: '#00d4ff', happy: '#10b981', alert: '#f59e0b', sleeping: '#64748b' }
  const c = colors[state] || colors.idle
  const eyeY = state === 'sleeping' ? '55%' : '45%'
  const eyeH = state === 'sleeping' ? 2 : state === 'alert' ? 5 : 4

  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="lendi-bot-body" aria-label={`Lendi-Bot companion — ${state} state`}>
      {/* Body */}
      <ellipse cx="30" cy="34" rx="14" ry="10" fill={`${c}22`} stroke={c} strokeWidth="1.5" />
      {/* Head */}
      <rect x="18" y="12" width="24" height="20" rx="8" fill="#0d1117" stroke={c} strokeWidth="1.5" />
      {/* Eyes */}
      <ellipse cx="25" cy={eyeY} rx="3" ry={eyeH} fill={c} style={{ cy: eyeY }} />
      <ellipse cx="35" cy={eyeY} rx="3" ry={eyeH} fill={c} />
      {/* Antenna */}
      <line x1="30" y1="12" x2="30" y2="6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="30" cy="5" r="2.5" fill={c} />
      {/* Glow */}
      <ellipse cx="30" cy="5" rx="4" ry="4" fill={c} opacity="0.2" />
      {/* Legs */}
      <line x1="22" y1="43" x2="20" y2="52" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="43" x2="40" y2="52" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      {/* Feet */}
      <ellipse cx="20" cy="53" rx="3" ry="1.5" fill={c} />
      <ellipse cx="40" cy="53" rx="3" ry="1.5" fill={c} />
      {/* Status light */}
      <circle cx="46" cy="22" r="2.5" fill={state === 'alert' ? '#f59e0b' : state === 'sleeping' ? '#64748b' : '#10b981'}>
        {state !== 'sleeping' && <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />}
      </circle>
    </svg>
  )
}

// ─── Main App ─────────────────────────────────────────────────
export default function App() {
  const [booted, setBooted] = useState(() => sessionStorage.getItem('autonomous-os-booted') === '1')
  const [theme, setTheme] = useState(() => localStorage.getItem('autonomous-os-theme-v1') || 'dark')
  const [openWindows, setOpenWindows] = useState([])
  const [focused, setFocused] = useState(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [showPing, setShowPing] = useState(false)
  const [botState, setBotState] = useState('idle')
  const [botPos, setBotPos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('autonomous-os-bot-pos-v1') || 'null') } catch { return null }
  })
  const [time, setTime] = useState(new Date())
  const botDragging = useRef(false)
  const botOffset   = useRef({ x: 0, y: 0 })
  const music = useMusicPlayer()

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('autonomous-os-theme-v1', theme)
  }, [theme])

  // Boot
  const handleBooted = useCallback(() => {
    setBooted(true)
    sessionStorage.setItem('autonomous-os-booted', '1')
    // Show ping after 5s
    setTimeout(() => { setShowPing(true); setBotState('alert') }, 5000)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setPaletteOpen(p => !p) }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Bot dragging
  const startBotDrag = (e) => {
    botDragging.current = true
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    botOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    e.preventDefault()
  }

  useEffect(() => {
    const move = (e) => {
      if (!botDragging.current) return
      const x = Math.max(8, Math.min(e.clientX - botOffset.current.x, window.innerWidth - 68))
      const y = Math.max(60, Math.min(e.clientY - botOffset.current.y, window.innerHeight - 140))
      setBotPos({ x, y })
    }
    const up = () => {
      if (botDragging.current) {
        botDragging.current = false
        localStorage.setItem('autonomous-os-bot-pos-v1', JSON.stringify(botPos))
      }
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
  }, [botPos])

  const openApp = useCallback((id) => {
    const existing = openWindows.find(w => w.id === id)
    if (existing) { setFocused(id); return }
    const cfg = APP_CONFIGS.find(a => a.id === id)
    const z = nextZ()
    setOpenWindows(ws => [...ws, { id, z }])
    setFocused(id)
    setBotState('happy')
    setTimeout(() => setBotState('idle'), 2000)
  }, [openWindows])

  const closeApp = useCallback((id) => {
    setOpenWindows(ws => ws.filter(w => w.id !== id))
    if (focused === id) setFocused(null)
  }, [focused])

  const focusApp = useCallback((id) => {
    setFocused(id)
    setOpenWindows(ws => ws.map(w => w.id === id ? { ...w, z: nextZ() } : w))
  }, [])

  const cycleTheme = () => setTheme(t => t === 'dark' ? 'day' : t === 'day' ? 'midnight' : 'dark')

  const themeIcon = theme === 'dark' ? Moon : theme === 'day' ? Sun : Zap

  const APP_WINDOWS = {
    projects:   <ProjectsApp />,
    results:    <ResultsApp />,
    systems:    <SystemsApp />,
    journey:    <JourneyApp />,
    casefiles:  <CaseFilesApp />,
    fieldnotes: <FieldNotesApp />,
    whiteboard: <WhiteboardApp />,
    terminal:   <TerminalApp />,
    foundertxt: <FounderTxtApp />,
    contact:    <ContactApp />,
    socials:    <SocialsApp />,
    music:      null,
  }

  const APP_TITLES = {
    projects: 'Projects — Main Drive', results: 'Results — Proof Vault', systems: 'Systems — Architecture',
    journey: 'Journey — Timeline', casefiles: 'Case Files — Finder', fieldnotes: 'AI Field Notes',
    whiteboard: 'Whiteboard', terminal: 'Autonomous CLI', foundertxt: 'Founder.txt',
    contact: 'Contact', socials: 'Socials', music: 'Focus Player',
  }

  const descriptors = ['DISTRIBUTED SYSTEMS ENGINEER', 'PLATFORM ARCHITECT', 'SRE SPECIALIST', 'AI INFRA BUILDER', 'ADAS TELEMETRY ENGINEER']
  const [descIdx, setDescIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setDescIdx(i => (i + 1) % descriptors.length), 2800)
    return () => clearInterval(t)
  }, [])

  const dailyMessages = [
    "Measure everything. Optimize what matters. Automate the rest.",
    "Bad infrastructure is a tax on every engineer who builds on top of it.",
    "SLOs are promises. Don't make promises you can't keep.",
    "Data at petabyte scale is just data. Design for the boundaries, not the happy path.",
    "The best platform disappears — teams build on it without thinking about it.",
  ]
  const [msgIdx] = useState(() => new Date().getDate() % dailyMessages.length)

  if (!booted) return <BootScreen onDone={handleBooted} />

  const ThemeIcon = themeIcon

  return (
    <div className="os-shell">
      {/* Wallpaper */}
      <div className="os-wallpaper" aria-hidden="true" />

      {/* System Nav */}
      <nav className="os-nav" role="banner" aria-label="Autonomous OS system bar">
        <div className="nav-brand">
          <div className="nav-logo" aria-hidden="true">∞</div>
          <span className="nav-os-name">Autonomous OS</span>
        </div>
        <div className="nav-divider" aria-hidden="true" />
        <div className="nav-links" role="navigation">
          {['projects', 'results', 'systems', 'journey'].map(id => (
            <button key={id} className="nav-link" onClick={() => openApp(id)}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <div className="nav-status-dot" aria-label="System online" title="System online — Open to opportunities" />
          <button className="nav-search-btn" onClick={() => setPaletteOpen(true)} aria-label="Open command palette (Ctrl+K)">
            <Search size={12} /> Search <span className="kbd">⌘K</span>
          </button>
          <button className="nav-theme-btn" onClick={cycleTheme} aria-label={`Switch theme (current: ${theme})`}>
            <ThemeIcon size={14} />
          </button>
          <div className="nav-time" aria-live="polite" aria-label={`Current time: ${time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST`}>
            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
          </div>
        </div>
      </nav>

      {/* Desktop */}
      <main className="os-desktop" role="main" aria-label="Desktop">
        {/* Identity Block */}
        <div className="desktop-identity" role="region" aria-label="Owner identity">
          <div className="identity-eyebrow">
            <MapPin size={10} /> Bangalore, India • Qualcomm
          </div>
          <h1 className="identity-name">Swaroop Lendi</h1>
          <div className="identity-descriptor" aria-live="polite" aria-label={descriptors[descIdx]}>
            {descriptors[descIdx]}
          </div>
          <p className="identity-tagline">
            Architecting 65+ PB ADAS data lakes, zero-trust connected vehicle fleets, and AI-assisted MCP infrastructure at global scale.
          </p>
          <div className="identity-ctas">
            <button className="btn-primary" onClick={() => openApp('projects')} aria-label="Enter Portfolio">
              <FolderOpen size={14} /> Enter Portfolio
            </button>
            <a href="mailto:lendiswaroop@gmail.com" className="btn-secondary" aria-label="Contact Swaroop">
              <Mail size={14} /> Contact
            </a>
            <a href="https://wa.me/919738141464" target="_blank" rel="noreferrer noopener" className="btn-secondary" aria-label="WhatsApp Swaroop">
              <MessageSquare size={14} /> WhatsApp
            </a>
          </div>
        </div>

        {/* App Grid */}
        <div className="desktop-apps" role="list" aria-label="Desktop applications">
          {APP_CONFIGS.map(app => {
            const Icon = app.icon
            const isOpen = openWindows.some(w => w.id === app.id)
            return (
              <button key={app.id} className={`app-icon ${isOpen ? 'is-open' : ''}`}
                onClick={() => openApp(app.id)}
                role="listitem"
                aria-label={`Open ${app.label} — ${app.desc}`}
                aria-pressed={isOpen}>
                <div className="app-icon-bg" style={{ background: app.gradient }}>
                  <Icon size={24} color={app.color} />
                </div>
                <span className="app-label">{app.label}</span>
                <div className="app-open-dot" aria-hidden="true" />
              </button>
            )
          })}
        </div>

        {/* Metrics Strip */}
        <div className="desktop-metrics" role="region" aria-label="Key metrics">
          {[
            { v: '65+ PB', l: 'Data Lake' },
            { v: '1 PB/day', l: 'Throughput' },
            { v: '1M+ Vehicles', l: 'Fleet Scale' },
            { v: '40%', l: 'IaC Boost' },
          ].map(({ v, l }, i) => (
            <div key={i} className="metric-chip">
              <span className="metric-value">{v}</span>
              <span className="metric-label">{l}</span>
            </div>
          ))}
        </div>

        {/* Daily Transmission */}
        <div className="daily-transmission" role="complementary" aria-label="Daily Transmission widget">
          <div className="dt-header">
            <span className="dt-label">Daily Transmission</span>
            <div className="dt-status" aria-hidden="true" />
          </div>
          <div className="dt-date">
            {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <p className="dt-message">{dailyMessages[msgIdx]}</p>
          <button className="dt-sticky-btn" onClick={() => openApp('whiteboard')} aria-label="Open Whiteboard to add a sticky note">
            <Plus size={10} /> Add a Quick Sticky
          </button>
        </div>
      </main>

      {/* Windows */}
      {openWindows.map(({ id, z }) => {
        const cfg = APP_CONFIGS.find(a => a.id === id)
        const content = APP_WINDOWS[id]
        if (!content) return null
        return (
          <OsWindow key={id} id={id} title={APP_TITLES[id] || id} icon={cfg?.icon} iconColor={cfg?.color}
            zIndex={z} onClose={() => closeApp(id)} onFocus={() => focusApp(id)}
            initialPos={{ x: 60 + openWindows.indexOf(openWindows.find(w => w.id === id)) * 30, y: 70 + openWindows.indexOf(openWindows.find(w => w.id === id)) * 20 }}>
            {content}
          </OsWindow>
        )
      })}

      {/* Dock */}
      <nav className="os-dock" role="toolbar" aria-label="Application dock">
        {APP_CONFIGS.slice(0, 8).map(app => {
          const Icon = app.icon
          const isOpen = openWindows.some(w => w.id === app.id)
          return (
            <div key={app.id} className={`dock-item ${isOpen ? 'is-open' : ''}`} role="button" tabIndex={0}
              onClick={() => openApp(app.id)} onKeyDown={e => e.key === 'Enter' && openApp(app.id)}
              aria-label={app.label} title={app.label}>
              <div className="dock-icon" style={{ background: app.gradient }}>
                <Icon size={22} color={app.color} />
              </div>
              <div className="dock-dot" aria-hidden="true" />
              <div className="dock-tooltip">{app.label}</div>
            </div>
          )
        })}
        <div className="dock-separator" aria-hidden="true" />
        <div className="dock-item" role="button" tabIndex={0} onClick={() => setPaletteOpen(true)} aria-label="Search (Ctrl+K)" title="Search">
          <div className="dock-icon" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)' }}>
            <Search size={18} color="var(--text-secondary)" />
          </div>
          <div className="dock-tooltip">Search</div>
        </div>
      </nav>

      {/* Music Player */}
      <div className="music-player" role="region" aria-label="Focus audio player">
        <div className="player-track-info">
          <div className="player-track-name">{music.track.title}</div>
          <div className="player-track-sub">{music.track.artist}</div>
        </div>
        <div className="player-controls">
          <button className="player-btn" onClick={() => music.changeTrack(-1)} aria-label="Previous track"><SkipBack size={14} /></button>
          <button className="player-btn is-playing" onClick={music.togglePlay} aria-label={music.playing ? 'Pause' : 'Play'}>
            {music.playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="player-btn" onClick={() => music.changeTrack(1)} aria-label="Next track"><SkipForward size={14} /></button>
        </div>
        <div className="player-progress">
          <span className="progress-time">0:00</span>
          <div className="progress-bar" role="progressbar" aria-valuenow={music.progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${music.progress}%` }} />
          </div>
          <span className="progress-time">∞</span>
        </div>
        <div className="player-volume">
          <button className="player-btn" onClick={music.toggleMute} aria-label={music.muted ? 'Unmute' : 'Mute'}>
            {music.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input type="range" className="volume-slider" min={0} max={1} step={0.05} value={music.muted ? 0 : music.volume}
            onChange={e => music.changeVolume(parseFloat(e.target.value))}
            aria-label="Volume control" />
        </div>
      </div>

      {/* Lendi-Bot */}
      <div className="lendi-bot"
        style={botPos ? { left: botPos.x, bottom: 'auto', top: botPos.y } : {}}
        onMouseDown={startBotDrag}
        onClick={() => { if (!botDragging.current) { setBotState(s => s === 'idle' ? 'happy' : s === 'happy' ? 'sleeping' : 'idle') } }}
        role="img" aria-label="Lendi-Bot — interactive AI companion"
        title="Click to change state • Drag to reposition">
        <LendiBot state={botState} />
      </div>

      {/* Booking Ping */}
      {showPing && (
        <div className="booking-ping" role="status">
          <button className="ping-dismiss" onClick={() => { setShowPing(false); setBotState('idle') }} aria-label="Dismiss notification">×</button>
          <div className="ping-text">
            System Alert: Telemetry connection active. Swaroop Lendi is open for Staff/Lead Platform roles & Architecture advisory.
          </div>
          <div className="ping-label">DEMO MODE • click to connect</div>
        </div>
      )}

      {/* Folded Corner */}
      <div className="folded-corner" aria-label="Book a call with Swaroop">
        <div className="folded-corner-content" />
        <div className="folded-corner-inner" onClick={() => openApp('contact')}>
          <div className="folded-corner-text">
            <span className="fc-line1">Build this</span>
            <span className="fc-line2">for yourself →</span>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      {paletteOpen && (
        <CommandPalette apps={APP_CONFIGS} onOpen={(id) => { openApp(id); setPaletteOpen(false) }} onClose={() => setPaletteOpen(false)} />
      )}
    </div>
  )
}
