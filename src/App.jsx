import { useState, useMemo } from 'react'
import './App.css'

const F = 'Inter, system-ui, sans-serif'

const BASE = import.meta.env.BASE_URL

const PEOPLE = [
  { id: 'allefy',  name: 'Állefy',  avatar: `${BASE}Allefy.png`,  color: '#818cf8', colorDark: '#4f46e5', pronoun3: 'IL' },
  { id: 'hernane', name: 'Hernane', avatar: `${BASE}Hernane.png`, color: '#22d3ee', colorDark: '#0891b2', pronoun3: 'IL' },
  { id: 'sarah',   name: 'Sarah',   avatar: `${BASE}Sarah.png`,   color: '#e879f9', colorDark: '#c026d3', pronoun3: 'ELLE' },
]

const ROLE_COLORS = {
  speaker:   { label: 'QUI PARLE',    color: '#3b82f6', bg: '#1e3a5f' },
  listener:  { label: 'À QUI',        color: '#10b981', bg: '#064e3b' },
  reference: { label: 'DE QUI',       color: '#f59e0b', bg: '#78350f' },
}

const POSITIONS = [
  { x: 300, y: 80 },
  { x: 114, y: 370 },
  { x: 486, y: 370 },
]

const STEPS = [
  { key: 'speaker',   title: 'Qui parle ?',              subtitle: 'Choisis la personne qui parle', roleLabel: 'QUI PARLE' },
  { key: 'reference', title: 'De qui parle-t-on ?',      subtitle: 'Choisis de qui on parle',       roleLabel: 'DE QUI' },
  { key: 'listener',  title: 'À qui parle-t-on ?',       subtitle: 'Choisis à qui on parle',        roleLabel: 'À QUI' },
]

/* ─── Utility ─── */

function getArrowPath(from, to, offset = 62) {
  const dx = to.x - from.x, dy = to.y - from.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const nx = dx / dist, ny = dy / dist
  const sx = from.x + nx * offset, sy = from.y + ny * offset
  const ex = to.x - nx * offset,   ey = to.y - ny * offset
  return {
    path: `M ${sx} ${sy} L ${ex} ${ey}`,
    mid: { x: (sx + ex) / 2, y: (sy + ey) / 2 },
    angle: Math.atan2(dy, dx),
  }
}

/* ─── Step-by-step wizard ─── */

function PersonCard({ person, onClick, selected, roleColor, subtitle }) {
  const border = selected ? roleColor : 'rgba(148,163,184,0.15)'
  const bg = selected ? `${roleColor}18` : 'rgba(15,23,42,0.6)'
  return (
    <button onClick={() => onClick(person.id)} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '16px 20px', borderRadius: 16,
      border: `3px solid ${border}`, background: bg,
      cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: F,
      minWidth: 110, backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%', overflow: 'hidden',
        border: `3px solid ${selected ? roleColor : 'rgba(148,163,184,0.25)'}`,
        transition: 'border-color 0.3s',
      }}>
        <img src={person.avatar} alt={person.name} style={{
          width: '100%', height: '100%', objectFit: 'cover',
        }} />
      </div>
      <span style={{ fontSize: 16, fontWeight: 700, color: selected ? roleColor : '#e2e8f0' }}>
        {person.name}
      </span>
      {subtitle && (
        <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8',
          fontStyle: 'italic', textAlign: 'center', lineHeight: 1.3 }}>
          {subtitle}
        </span>
      )}
    </button>
  )
}

function StepWizard({ step, choices, onChoose, onBack }) {
  const stepDef = STEPS[step]
  const rc = ROLE_COLORS[stepDef.key]
  const available = PEOPLE.filter(p => {
    if (step === 2) return p.id !== choices.speaker && p.id !== choices.reference
    return true
  })

  const getSubtitle = (person) => {
    if (step === 1) {
      return person.id === choices.speaker ? 'De moi-même' : `De ${person.name}`
    }
    return null
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 24, padding: 24,
      height: '100dvh', fontFamily: F,
    }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {STEPS.map((s, i) => (
          <div key={s.key} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i <= step ? rc.color : 'rgba(148,163,184,0.2)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Step number */}
      <div style={{
        fontSize: 13, fontWeight: 700, color: rc.color,
        background: rc.bg, padding: '4px 14px', borderRadius: 20,
        border: `1px solid ${rc.color}50`, letterSpacing: '0.05em',
      }}>
        ÉTAPE {step + 1} / 3 — {stepDef.roleLabel}
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0,
          letterSpacing: '-0.02em' }}>{stepDef.title}</h1>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6 }}>{stepDef.subtitle}</p>
      </div>

      {/* Already chosen summary */}
      {step > 0 && (
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center',
          background: 'rgba(15,23,42,0.7)', borderRadius: 12,
          padding: '8px 16px', border: '1px solid rgba(148,163,184,0.1)',
        }}>
          {choices.speaker && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <img src={PEOPLE.find(p => p.id === choices.speaker).avatar} alt=""
                style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover',
                  border: `2px solid ${ROLE_COLORS.speaker.color}` }} />
              <span style={{ fontSize: 12, color: ROLE_COLORS.speaker.color, fontWeight: 700 }}>
                {PEOPLE.find(p => p.id === choices.speaker).name}
              </span>
              <span style={{ fontSize: 10, color: '#64748b' }}>= JE</span>
            </div>
          )}
          {choices.reference && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#64748b', fontSize: 12 }}>→</span>
              <img src={PEOPLE.find(p => p.id === choices.reference).avatar} alt=""
                style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover',
                  border: `2px solid ${ROLE_COLORS.reference.color}` }} />
              <span style={{ fontSize: 12, color: ROLE_COLORS.reference.color, fontWeight: 700 }}>
                {PEOPLE.find(p => p.id === choices.reference).name}
              </span>
              <span style={{ fontSize: 10, color: '#64748b' }}>
                = {PEOPLE.find(p => p.id === choices.reference).pronoun3}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Person cards */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {available.map(p => (
          <PersonCard key={p.id} person={p} onClick={(id) => onChoose(id)}
            selected={false} roleColor={rc.color} subtitle={getSubtitle(p)} />
        ))}
      </div>

      {/* Back button */}
      {step > 0 && (
        <button onClick={onBack} style={{
          padding: '8px 20px', borderRadius: 10,
          border: '1px solid rgba(148,163,184,0.2)',
          background: 'rgba(15,23,42,0.5)', color: '#94a3b8',
          cursor: 'pointer', fontFamily: F, fontSize: 13, fontWeight: 600,
        }}>
          ← Retour
        </button>
      )}
    </div>
  )
}

/* ─── Triangle SVG components ─── */

function PersonNode({ person, position, role }) {
  const rc = ROLE_COLORS[role]
  return (
    <g className="person-node">
      {role === 'speaker' && (
        <circle cx={position.x} cy={position.y} r={58} fill="none"
          stroke={rc.color} strokeWidth={3} opacity={0.4} className="speaker-ring" />
      )}
      <circle cx={position.x} cy={position.y} r={52} fill="none"
        stroke={rc.color} strokeWidth={role === 'speaker' ? 4 : 2.5}
        opacity={role === 'speaker' ? 1 : 0.8} />
      <defs>
        <clipPath id={`clip-${person.id}`}>
          <circle cx={position.x} cy={position.y} r={46} />
        </clipPath>
      </defs>
      <circle cx={position.x} cy={position.y} r={46} fill={person.colorDark} />
      <image href={person.avatar} x={position.x - 46} y={position.y - 46}
        width={92} height={92} clipPath={`url(#clip-${person.id})`}
        preserveAspectRatio="xMidYMid slice" />
      <text x={position.x} y={position.y + 72} textAnchor="middle"
        fill="#f1f5f9" fontSize={15} fontWeight={700} fontFamily={F}>{person.name}</text>
      <rect x={position.x - 42} y={position.y + 80} width={84} height={22}
        rx={11} fill={rc.bg} stroke={rc.color} strokeWidth={1.5} />
      <text x={position.x} y={position.y + 95} textAnchor="middle"
        fill={rc.color} fontSize={10} fontWeight={700} letterSpacing="0.05em"
        fontFamily={F}>{rc.label}</text>
    </g>
  )
}

function DirectionalArrow({ from, to, color, pronoun, bgColor, sublabel }) {
  const markerId = `arrow-${Math.round(from.x)}-${Math.round(to.x)}`
  const { path, mid: midPt, angle } = getArrowPath(from, to)
  const pw = pronoun.length * 10 + 28
  const perpX = -Math.sin(angle), perpY = Math.cos(angle)
  const badgeOff = 22, subOff = -18
  return (
    <g>
      <defs>
        <marker id={markerId} markerWidth={14} markerHeight={14} refX={11} refY={7}
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M 0 1 L 12 7 L 0 13 Z" fill={color} />
        </marker>
      </defs>
      <path d={path} fill="none" stroke={color} strokeWidth={8} opacity={0.1} strokeLinecap="round" />
      <path d={path} fill="none" stroke={color} strokeWidth={3}
        strokeLinecap="round" markerEnd={`url(#${markerId})`} className="triangle-line" />
      <g className="pronoun-badge">
        <rect x={midPt.x + perpX * badgeOff - pw / 2} y={midPt.y + perpY * badgeOff - 13}
          width={pw} height={26} rx={13} fill={bgColor} stroke={color} strokeWidth={2} />
        <text x={midPt.x + perpX * badgeOff} y={midPt.y + perpY * badgeOff + 4}
          textAnchor="middle" fill={color} fontSize={13} fontWeight={800} fontFamily={F}>
          {pronoun}
        </text>
      </g>
      <text x={midPt.x + perpX * subOff} y={midPt.y + perpY * subOff + 4}
        textAnchor="middle" fill={color} fontSize={10} fontWeight={600}
        opacity={0.7} fontFamily={F} letterSpacing="0.04em">{sublabel}</text>
    </g>
  )
}

/* ─── Linear sentence strip ─── */

function LinearSentenceView({ speaker, listener, reference }) {
  const rc = ROLE_COLORS
  const avatarSize = 48

  const isSelfRef = speaker.id === reference.id

  const PersonChip = ({ person, role }) => {
    let pronoun
    if (role === 'speaker') pronoun = 'JE'
    else if (role === 'listener') pronoun = 'TOI'
    else pronoun = isSelfRef ? 'MOI' : person.pronoun3
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 72,
      }}>
        <div style={{
          width: avatarSize, height: avatarSize, borderRadius: '50%',
          border: `3px solid ${rc[role].color}`, overflow: 'hidden', flexShrink: 0,
        }}>
          <img src={person.avatar} alt={person.name} style={{
            width: '100%', height: '100%', objectFit: 'cover',
          }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', fontFamily: F }}>
          {person.name}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 800, color: rc[role].color,
          background: rc[role].bg, padding: '2px 10px', borderRadius: 10,
          border: `1px solid ${rc[role].color}50`, fontFamily: F,
        }}>{pronoun}</span>
      </div>
    )
  }

  const Arrow = ({ label, color }) => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0 4px',
    }}>
      <span style={{
        fontSize: 9, fontWeight: 700, color, textTransform: 'uppercase',
        letterSpacing: '0.06em', fontFamily: F, whiteSpace: 'nowrap',
      }}>{label}</span>
      <svg width="48" height="16" viewBox="0 0 48 16">
        <line x1="2" y1="8" x2="38" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <polygon points="36,3 46,8 36,13" fill={color} />
      </svg>
    </div>
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(148,163,184,0.12)', borderRadius: 16,
      padding: '14px 20px', gap: 6, flexWrap: 'nowrap',
      width: '100%', maxWidth: 540,
    }}>
      <PersonChip person={speaker} role="speaker" />
      <Arrow label="parle de" color={rc.reference.color} />
      {isSelfRef ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 72,
        }}>
          <div style={{
            width: avatarSize, height: avatarSize, borderRadius: '50%',
            border: `3px solid ${rc.reference.color}`, overflow: 'hidden',
            position: 'relative',
          }}>
            <img src={speaker.avatar} alt={speaker.name} style={{
              width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7,
            }} />
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: 'rgba(0,0,0,0.3)',
              fontSize: 20,
            }}>↩</div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', fontFamily: F }}>
            {speaker.name}
          </span>
          <span style={{
            fontSize: 11, fontWeight: 800, color: rc.reference.color,
            background: rc.reference.bg, padding: '2px 10px', borderRadius: 10,
            border: `1px solid ${rc.reference.color}50`, fontFamily: F,
          }}>MOI</span>
          <span style={{ fontSize: 9, color: '#94a3b8', fontStyle: 'italic' }}>moi-même</span>
        </div>
      ) : (
        <PersonChip person={reference} role="reference" />
      )}
      <Arrow label="à" color={rc.listener.color} />
      <PersonChip person={listener} role="listener" />
    </div>
  )
}

/* ─── Result view (triangle + line + reset) ─── */

function SelfReferenceLoop({ position, color, bgColor }) {
  const cx = position.x, cy = position.y
  const r = 52
  // Loop goes LEFT of the avatar
  const startX = cx - r - 4, startY = cy - 14
  const endX = cx - r - 4, endY = cy + 14
  const leftX = cx - r - 80
  const path = `M ${startX} ${startY} C ${leftX} ${startY - 40}, ${leftX} ${endY + 40}, ${endX} ${endY}`
  const markerId = 'self-arrow'
  const badgeCx = leftX + 10
  return (
    <g>
      <defs>
        <marker id={markerId} markerWidth={12} markerHeight={12} refX={10} refY={6}
          orient="auto" markerUnits="userSpaceOnUse">
          <path d="M 0 0 L 12 6 L 0 12 Z" fill={color} />
        </marker>
      </defs>
      <path d={path} fill="none" stroke={color} strokeWidth={8} opacity={0.1} strokeLinecap="round" />
      <path d={path} fill="none" stroke={color} strokeWidth={3}
        strokeLinecap="round" markerEnd={`url(#${markerId})`} />
      <g className="pronoun-badge">
        <rect x={badgeCx - 28} y={cy - 14} width={56} height={28} rx={14}
          fill={bgColor} stroke={color} strokeWidth={2} />
        <text x={badgeCx} y={cy + 4}
          textAnchor="middle" fill={color} fontSize={14} fontWeight={800} fontFamily={F}>
          MOI
        </text>
      </g>
      <text x={badgeCx} y={cy + 24}
        textAnchor="middle" fill={color} fontSize={10} fontWeight={600}
        opacity={0.7} fontFamily={F}>de moi-même</text>
    </g>
  )
}

function ResultView({ speaker, listener, reference, onReset }) {
  const isSelfRef = speaker.id === reference.id

  const POS_SELF = [
    { x: 300, y: 200 },
    { x: 520, y: 200 },
  ]

  const sp = isSelfRef ? POS_SELF[0] : POSITIONS[0]
  const lp = isSelfRef ? POS_SELF[1] : POSITIONS[1]
  const rp = isSelfRef ? POS_SELF[0] : POSITIONS[2]

  const listenerPronoun = 'TOI'
  const refPronoun = isSelfRef ? 'MOI' : reference.pronoun3

  const subtitleText = isSelfRef
    ? <><span style={{ color: ROLE_COLORS.speaker.color, fontWeight: 700 }}>{speaker.name}</span>
        {' parle de '}
        <span style={{ color: ROLE_COLORS.reference.color, fontWeight: 700 }}>soi-même</span>
        {' à '}
        <span style={{ color: ROLE_COLORS.listener.color, fontWeight: 700 }}>{listener.name}</span>
      </>
    : <><span style={{ color: ROLE_COLORS.speaker.color, fontWeight: 700 }}>{speaker.name}</span>
        {' parle de '}
        <span style={{ color: ROLE_COLORS.reference.color, fontWeight: 700 }}>{reference.name}</span>
        {' à '}
        <span style={{ color: ROLE_COLORS.listener.color, fontWeight: 700 }}>{listener.name}</span>
      </>

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      height: '100dvh', padding: '12px 16px', gap: 10, overflow: 'auto', fontFamily: F,
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: 0,
          letterSpacing: '-0.02em' }}>
          Triangle de Référence
        </h1>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{subtitleText}</p>
      </div>

      {/* SVG */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 520,
        flexShrink: 1, flexGrow: 1, minHeight: 0 }}>
        <svg viewBox={isSelfRef ? '0 0 640 380' : '0 0 600 460'} width="100%" height="100%"
          style={{ overflow: 'visible' }} preserveAspectRatio="xMidYMid meet">

          {!isSelfRef && (
            <polygon
              points={`${POSITIONS[0].x},${POSITIONS[0].y} ${POSITIONS[1].x},${POSITIONS[1].y} ${POSITIONS[2].x},${POSITIONS[2].y}`}
              fill="rgba(148,163,184,0.03)" stroke="rgba(148,163,184,0.06)" strokeWidth={1} />
          )}

          {/* JE badge above speaker */}
          <rect x={sp.x - 20} y={sp.y - 34} width={40} height={20} rx={10}
            fill={ROLE_COLORS.speaker.bg} stroke={ROLE_COLORS.speaker.color} strokeWidth={1.5} />
          <text x={sp.x} y={sp.y - 20} textAnchor="middle" fill={ROLE_COLORS.speaker.color}
            fontSize={12} fontWeight={800} fontFamily={F}>JE</text>

          {/* Arrow: Speaker → Listener (TOI) */}
          <DirectionalArrow from={sp} to={lp}
            color={ROLE_COLORS.listener.color} pronoun={listenerPronoun}
            bgColor={ROLE_COLORS.listener.bg} sublabel="à qui je parle" />

          {/* Self-ref loop OR arrow to reference */}
          {isSelfRef ? (
            <SelfReferenceLoop position={sp}
              color={ROLE_COLORS.reference.color} bgColor={ROLE_COLORS.reference.bg} />
          ) : (
            <>
              <DirectionalArrow from={sp} to={rp}
                color={ROLE_COLORS.reference.color} pronoun={refPronoun}
                bgColor={ROLE_COLORS.reference.bg} sublabel="de qui je parle" />
              <line x1={lp.x + 52} y1={lp.y} x2={rp.x - 52} y2={rp.y}
                stroke="rgba(148,163,184,0.1)" strokeWidth={1} strokeDasharray="4 4" />
            </>
          )}

          {/* Person nodes */}
          {isSelfRef ? (
            <>
              <PersonNode person={speaker} position={sp} role="speaker" />
              <PersonNode person={listener} position={lp} role="listener" />
            </>
          ) : (
            [
              { person: speaker, role: 'speaker', pos: sp },
              { person: listener, role: 'listener', pos: lp },
              { person: reference, role: 'reference', pos: rp },
            ].map(({ person, role, pos }) => (
              <PersonNode key={person.id} person={person} position={pos} role={role} />
            ))
          )}
        </svg>
      </div>

      {/* Linear sentence strip */}
      <LinearSentenceView speaker={speaker} listener={listener} reference={reference} />

      {/* Reset button */}
      <button onClick={onReset} style={{
        padding: '12px 32px', borderRadius: 14, fontFamily: F,
        border: '2px solid rgba(148,163,184,0.25)',
        background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)',
        color: '#e2e8f0', fontSize: 15, fontWeight: 700,
        cursor: 'pointer', transition: 'all 0.3s ease',
        flexShrink: 0, marginBottom: 8,
      }}>
        ↻ Recommencer
      </button>
    </div>
  )
}

/* ─── Main App ─── */

function App() {
  const [step, setStep] = useState(0)
  const [choices, setChoices] = useState({ speaker: null, reference: null, listener: null })

  const handleChoose = (personId) => {
    const key = STEPS[step].key
    const next = { ...choices, [key]: personId }
    setChoices(next)
    if (step < 2) {
      setStep(step + 1)
    } else {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step === 2) setChoices({ ...choices, reference: null })
    if (step === 1) setChoices({ ...choices, speaker: null })
    setStep(Math.max(0, step - 1))
  }

  const handleReset = () => {
    setStep(0)
    setChoices({ speaker: null, reference: null, listener: null })
  }

  const resolved = useMemo(() => {
    if (step < 3) return null
    return {
      speaker: PEOPLE.find(p => p.id === choices.speaker),
      listener: PEOPLE.find(p => p.id === choices.listener),
      reference: PEOPLE.find(p => p.id === choices.reference),
    }
  }, [step, choices])

  if (step < 3) {
    return (
      <StepWizard step={step} choices={choices}
        onChoose={handleChoose} onBack={handleBack} />
    )
  }

  return (
    <ResultView
      speaker={resolved.speaker}
      listener={resolved.listener}
      reference={resolved.reference}
      onReset={handleReset}
    />
  )
}

export default App
