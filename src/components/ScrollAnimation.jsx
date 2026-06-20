import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/dist/ScrambleTextPlugin'
import { SplitText } from 'gsap/dist/SplitText'
import ScrollFrameSequence from './ScrollFrameSequence'

gsap.registerPlugin(ScrambleTextPlugin, SplitText)

// ─── Constants ───────────────────────────────────────────────────
const FRAME_START = 1
const FRAME_END = 141
const SPACER_HEIGHT = '650vh'

// Progress thresholds (0–1) — 140 total steps (frames 1–141)
// Hero:       frames  1–45  → progress 0.00 – 0.31
const HERO_HOLD_END       = 0.10
const HERO_FADE_OUT_END   = 0.20
// Services:  frames 45–90  → progress 0.31 – 0.63
const SVC_FADE_IN_START   = 0.20
const SVC_FADE_IN_END     = 0.27
const SVC_ANIM_TRIGGER    = 0.23
const SVC_FADE_OUT_START  = 0.55
const SVC_FADE_OUT_END    = 0.62
// Materials: frames 46–90  → visible 0.32 – 0.63
const MAT_FADE_IN_START   = 0.32
const MAT_FADE_IN_END     = 0.39
const MAT_FADE_OUT_START  = 0.59
const MAT_FADE_OUT_END    = 0.65
// WhyChoose: frames 91–129 → progress 0.64 – 0.91
// (removed — WhyChoose is now a standalone component)

const SERVICES = [
  {
    number: '01',
    title: 'Industrial Plastic Parts',
    description:
      'Custom plastic components for industrial applications using precision 3D printing technology
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  color: 'var(--color-muted-soft)',
                  textTransform: 'uppercase',
                }}>
                  {mat === 'PLA' ? 'Eco-Friendly' : mat === 'ABS' ? 'Industrial' : 'Flexible'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '36px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 3,
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--color-muted)',
        }}>
          Scroll
        </span>
        <div style={{
          width: '1px',
          height: '44px',
          background: 'linear-gradient(to bottom, var(--color-muted), transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.2); }
        }
      `}</style>
    </ScrollFrameSequence>
  )
}
