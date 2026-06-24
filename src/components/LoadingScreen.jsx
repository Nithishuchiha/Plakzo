import { useState, useEffect } from 'react'

export default function LoadingScreen({ progress = 0, onComplete }) {
  const [visible, setVisible] = useState(true)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    if (progress >= 100) {
      // Start fade out
      setOpacity(0)
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 400) // Match crossfade duration
      return () => clearTimeout(timer)
    }
  }, [progress, onComplete])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        opacity,
        transition: 'opacity 0.4s ease',
        pointerEvents: progress >= 100 ? 'none' : 'auto',
      }}
    >
      {/* PLAKZO Logo */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(24px, 4vw, 48px)',
        fontWeight: 700,
        letterSpacing: '8px',
        textTransform: 'uppercase',
        color: '#fff',
        marginBottom: '48px',
      }}>
        PLAKZO
      </div>

      {/* Progress container */}
      <div style={{
        width: 'clamp(200px, 40vw, 320px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>
        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '2px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '1px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(to right, #c3d9f3, #b9a0ef)',
            borderRadius: '1px',
            transition: 'width 0.1s linear',
          }} />
        </div>

        {/* Progress text */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '2px',
          color: 'rgba(255,255,255,0.4)',
        }}>
          {Math.round(Math.min(progress, 100))}%
        </div>
      </div>
    </div>
  )
}
