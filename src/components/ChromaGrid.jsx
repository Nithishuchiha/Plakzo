import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * ChromaGrid — ReactBits component adapted for PLAKZO
 * JS port, inline styles only (no Tailwind).
 *
 * Props:
 *  items     — array of { title, subtitle, borderColor, gradient, url }
 *  columns   — number of grid columns (default 3)
 *  cardW     — card width  in px (default 170)
 *  cardH     — card height in px (default 140)
 *  gap       — gap between cards in px (default 10)
 *  radius    — spotlight radius in px (default 300)
 *  damping   — GSAP tween duration for mouse follow (default 0.45)
 *  fadeOut   — fade-out duration on mouse leave (default 0.6)
 *  ease      — GSAP ease string (default 'power3.out')
 */
export default function ChromaGrid({
  items,
  columns = 3,
  cardW   = 170,
  cardH   = 140,
  gap     = 10,
  radius  = 300,
  damping = 0.45,
  fadeOut = 0.6,
  ease    = 'power3.out',
}) {
  const rootRef = useRef(null)
  const fadeRef = useRef(null)
  const setX    = useRef(null)
  const setY    = useRef(null)
  const pos     = useRef({ x: 0, y: 0 })

  // PLAKZO-themed default items (6 "Why Choose" cards)
  const demo = [
    {
      title: 'High Quality',
      subtitle: 'Rigorous checks at every stage',
      borderColor: '#c3d9f3',
      gradient: 'linear-gradient(145deg,#1a2a3a,#0a0a0a)',
    },
    {
      title: 'Custom Solutions',
      subtitle: 'Tailored to your exact needs',
      borderColor: '#a8edca',
      gradient: 'linear-gradient(210deg,#0e2a1e,#0a0a0a)',
    },
    {
      title: 'Fast Turnaround',
      subtitle: 'On-time, every time',
      borderColor: '#f9c98e',
      gradient: 'linear-gradient(165deg,#2a1a0a,#0a0a0a)',
    },
    {
      title: 'Affordable Pricing',
      subtitle: 'Value without compromise',
      borderColor: '#e8a0cf',
      gradient: 'linear-gradient(195deg,#2a0a1a,#0a0a0a)',
    },
    {
      title: 'Wide Range',
      subtitle: 'PLA, ABS, TPU & more',
      borderColor: '#b9a0ef',
      gradient: 'linear-gradient(225deg,#1a0a2a,#0a0a0a)',
    },
    {
      title: 'Customer Satisfaction',
      subtitle: "We don't stop until you're happy",
      borderColor: '#a0d8ef',
      gradient: 'linear-gradient(135deg,#0a1a2a,#0a0a0a)',
    },
  ]

  const data = items?.length ? items : demo

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    setX.current = gsap.quickSetter(el, '--x', 'px')
    setY.current = gsap.quickSetter(el, '--y', 'px')
    const { width, height } = el.getBoundingClientRect()
    pos.current = { x: width / 2, y: height / 2 }
    setX.current(pos.current.x)
    setY.current(pos.current.y)
  }, [])

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x, y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x)
        setY.current?.(pos.current.y)
      },
      overwrite: true,
    })
  }

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect()
    moveTo(e.clientX - r.left, e.clientY - r.top)
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true })
  }

  const handleLeave = () => {
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true })
  }

  const handleCardMove = (e) => {
    const c = e.currentTarget
    const rect = c.getBoundingClientRect()
    c.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    c.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const handleCardClick = (url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, ${cardW}px)`,
        gridAutoRows: `${cardH}px`,
        gap: `${gap}px`,
        '--r': `${radius}px`,
        '--x': '50%',
        '--y': '50%',
      }}
    >
      {data.map((c, i) => (
        <article
          key={i}
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: `${cardW}px`,
            height: `${cardH}px`,
            borderRadius: '12px',
            overflow: 'hidden',
            border: `1.5px solid ${c.borderColor || 'transparent'}`,
            background: c.gradient || 'linear-gradient(145deg,#1a1a2a,#0a0a0a)',
            cursor: c.url ? 'pointer' : 'default',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '--spotlight-color': 'rgba(255,255,255,0.22)',
            flexShrink: 0,
          }}
        >
          {/* Per-card spotlight */}
          <div
            className="chroma-spotlight"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 20,
              opacity: 0,
              background: 'radial-gradient(circle at var(--mouse-x,50%) var(--mouse-y,50%), var(--spotlight-color), transparent 70%)',
              transition: 'opacity 0.4s ease',
            }}
          />

          {/* Card body */}
          <div style={{ position: 'relative', zIndex: 10, flex: 1, padding: '20px 18px 10px', display: 'flex', flexDirection: 'column' }}>
            {/* Number badge */}
            <div style={{
              width: '36px',
              height: '36px',
              border: `1px solid ${c.borderColor || '#444'}`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              flexShrink: 0,
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 600,
                color: c.borderColor || '#aaa',
                letterSpacing: '1px',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: '0 0 6px',
              lineHeight: 1.2,
            }}>
              {c.title}
            </h3>

            {/* Subtitle */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.62)',
              margin: 0,
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              {c.subtitle}
            </p>
          </div>

          {/* Bottom accent line */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(to right, ${c.borderColor || 'transparent'}, transparent)`,
            zIndex: 10,
          }} />
        </article>
      ))}

      {/* ── Chroma grayscale mask (spotlight punches through) ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          pointerEvents: 'none', zIndex: 30,
          backdropFilter: 'grayscale(1) brightness(0.68)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.68)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22) 45%,rgba(0,0,0,0.35) 60%,rgba(0,0,0,0.50) 75%,rgba(0,0,0,0.68) 88%,white 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22) 45%,rgba(0,0,0,0.35) 60%,rgba(0,0,0,0.50) 75%,rgba(0,0,0,0.68) 88%,white 100%)',
        }}
      />

      {/* ── Fade overlay (covers everything when cursor is away) ── */}
      <div
        ref={fadeRef}
        style={{
          position: 'absolute', inset: 0,
          pointerEvents: 'none', zIndex: 40,
          backdropFilter: 'grayscale(1) brightness(0.68)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.68)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90) 30%,rgba(255,255,255,0.78) 45%,rgba(255,255,255,0.65) 60%,rgba(255,255,255,0.50) 75%,rgba(255,255,255,0.32) 88%,transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90) 30%,rgba(255,255,255,0.78) 45%,rgba(255,255,255,0.65) 60%,rgba(255,255,255,0.50) 75%,rgba(255,255,255,0.32) 88%,transparent 100%)',
          opacity: 1,
          transition: 'opacity 250ms',
        }}
      />

      <style>{`
        article:hover .chroma-spotlight { opacity: 1 !important; }
        article:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
      `}</style>
    </div>
  )
}
