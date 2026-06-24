import { useEffect, useRef, useCallback, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/dist/ScrambleTextPlugin'
import { SplitText } from 'gsap/dist/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollFrameSequence from './ScrollFrameSequence'
import LoadingScreen from './LoadingScreen'
import ChromaGrid from './ChromaGrid'
import TargetCursor from './TargetCursor'
import Waves from './Waves'
import Navbar from './Navbar'
import Galaxy from './Galaxy'
import Plasma from './Plasma'
import PillNav from './PillNav'
import Contact from './Contact'
import { cloudinaryUrl } from '../lib/cloudinary'
import { GALLERY_ITEMS } from '../data/galleryItems'
import GalleryPreloader from '../lib/galleryPreloader'

gsap.registerPlugin(ScrambleTextPlugin, SplitText, ScrollTrigger)

// ─── Constants ───────────────────────────────────────────────────
const FRAME_START = 1
const FRAME_END   = 191
const SPACER_HEIGHT = '1100vh'    // extra scroll room for the gamification pin
const INITIAL_LOAD_COUNT = 134    // 70% of 191 frames — show loading until this many load

// Progress thresholds (0–1 over the full scroll height)
const HERO_HOLD_END       = 0.08
const HERO_FADE_OUT_END   = 0.13

const SVC_FADE_IN_START   = 0.11
const SVC_FADE_IN_END     = 0.17
const SVC_ANIM_TRIGGER    = 0.14
const SVC_FADE_OUT_START  = 0.21
const SVC_FADE_OUT_END    = 0.26

const MAT_FADE_IN_START   = 0.22
const MAT_FADE_IN_END     = 0.28
const MAT_FADE_OUT_START  = 0.32
const MAT_FADE_OUT_END    = 0.37

const WHY_FADE_IN_START   = 0.33
const WHY_FADE_IN_END     = 0.39
const WHY_FADE_OUT_START  = 0.43
const WHY_FADE_OUT_END    = 0.48

// Journey: fades in at 0.44, HOLDS visible through the entire gamification window (0.44 → 0.72)
const JNY_FADE_IN_START   = 0.44
const JNY_FADE_IN_END     = 0.49
const JNY_FADE_OUT_START  = 0.68
const JNY_FADE_OUT_END    = 0.73

// Gamification window — frame freezes here, progress maps to step activation
const JNY_GAME_START      = 0.49   // gamification begins (journey fully visible)
const JNY_GAME_END        = 0.68   // gamification ends → journey fades out

// Frame to freeze on during gamification
const JNY_FREEZE_FRAME    = 120

const GAL_FADE_IN_START   = 0.70
const GAL_FADE_IN_END     = 0.76
const GAL_FADE_OUT_START  = 0.83
const GAL_FADE_OUT_END    = 0.89

const CNT_FADE_IN_START   = 0.86
const CNT_FADE_IN_END     = 0.93

// ─── Data ────────────────────────────────────────────────────────
const SERVICES = [
  { number: '01', title: 'Industrial Plastic Parts',  description: 'Custom plastic components for industrial applications using precision 3D printing technology.',                                    tags: ['Industrial', 'Functional', 'PLA / ABS / TPU'] },
  { number: '02', title: 'Custom Photo Lamps',         description: 'Transform your favourite photos into personalized 3D printed lamps — perfect for gifts, home décor, birthdays, and anniversaries.', tags: ['Decorative', 'Personalized', 'Gift'] },
  { number: '03', title: 'Custom Keychains',           description: 'Personalized keychains with your name, logo, or custom design — manufactured using precision 3D printing.',                    tags: ['Personalized', 'Compact', 'Gift'] },
  { number: '04', title: 'CAD Design Services',        description: 'Custom 3D CAD modeling and product design using SolidWorks for industrial parts, prototypes, and product development.',         tags: ['SolidWorks', 'Prototyping', 'Design'] },
  { number: '05', title: 'Customized Bottle Caps',     description: 'Personalized 3D printed bottle caps with custom logos, text, or unique shapes — ideal for branding, events, or personalized gifts.', tags: ['Branding', 'Events', 'Custom'] },
]

const JOURNEY_STEPS = [
  { number: '01', title: 'Concept',     subtitle: 'Your Vision Starts Here',     description: 'Share your idea or requirement — we listen deeply and understand your exact needs before a single line is drawn.',  color: '#c3d9f3', glow: 'rgba(195,217,243,0.15)' },
  { number: '02', title: 'Design',      subtitle: 'Engineering Meets Precision',  description: 'We craft precise 3D CAD models using SolidWorks, iterating with you until every dimension is right.',             color: '#a8edca', glow: 'rgba(168,237,202,0.15)' },
  { number: '03', title: '3D Printing', subtitle: 'Material Meets Reality',       description: 'High-quality 3D printing using premium PLA, ABS and TPU with advanced equipment calibrated for industrial accuracy.', color: '#f9c98e', glow: 'rgba(249,201,142,0.15)' },
  { number: '04', title: 'Deliver',     subtitle: 'Doorstep Precision',           description: 'Every finished part goes through rigorous quality check before being securely packed and shipped to you.',           color: '#e8a0cf', glow: 'rgba(232,160,207,0.15)' },
]

const STEP_ICONS = {
  Concept: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <circle cx="24" cy="20" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M20 30v2a4 4 0 0 0 8 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 10V7M14.1 14.1l-2.1-2.1M10 20H7M14.1 25.9l-2.1 2.1M33.9 14.1l2.1-2.1M38 20h-3M33.9 25.9l2.1 2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Design: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <rect x="8" y="8" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 16h32M16 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 26l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '3D Printing': (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <path d="M24 6L40 15V33L24 42L8 33V15L24 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 6v36M8 15l16 9 16-9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  Deliver: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
      <path d="M6 24l8-8v5h16v6H14v5L6 24Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M24 12h12a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="38" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="33" cy="38" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
}

// ─── Helpers ─────────────────────────────────────────────────────
function phaseOpacity(p, inEnd, outStart, outEnd) {
  if (p < 0) return 0
  if (p < inEnd) return p / inEnd
  if (p < outStart) return 1
  if (p < outEnd) return 1 - (p - outStart) / (outEnd - outStart)
  return 0
}

function phaseIn(p, inStart, inEnd) {
  if (p <= inStart) return 0
  if (p < inEnd) return (p - inStart) / (inEnd - inStart)
  return 1
}

// ─── Journey Step Card ───────────────────────────────────────────
function JourneyCard({ step, isActive, isCurrent }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)
  const rafRef  = useRef(null)

  const onMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const rx = ((e.clientY - rect.top)  / rect.height - 0.5) * -10
    const ry = ((e.clientX - rect.left) / rect.width  - 0.5) * 10
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => setTilt({ x: rx, y: ry }))
  }
  const onMouseLeave = () => { setHovered(false); cancelAnimationFrame(rafRef.current); setTilt({ x: 0, y: 0 }) }
  const onMouseEnter = () => setHovered(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 0', minWidth: 0 }}>
      {/* Card */}
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{ width: '100%', perspective: '900px', cursor: 'default' }}
      >
        <div className="journey-card-inner" style={{
          position: 'relative',
          padding: 'clamp(16px, 1.8vw, 24px)',
          border: isActive ? `1px solid ${step.color}` : '1px solid var(--color-hairline)',
          background: isActive
            ? 'linear-gradient(135deg, var(--color-surface-card) 0%, var(--color-surface-elevated) 100%)'
            : 'var(--color-surface-card)',
          boxShadow: hovered
            ? `0 28px 56px rgba(0,0,0,0.6), 0 0 32px ${step.glow}`
            : isActive
              ? `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${step.glow}`
              : '0 4px 16px rgba(0,0,0,0.3)',
          transform: hovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(18px)`
            : 'rotateX(0) rotateY(0) translateZ(0)',
          transformStyle: 'preserve-3d',
          transition: hovered
            ? 'transform 0.1s ease-out, box-shadow 0.15s ease-out, border-color 0.2s ease'
            : 'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s ease, border-color 0.5s ease',
          willChange: 'transform',
        }}>
          {/* Radial hover glow */}
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(circle at ${50 + tilt.y * 5}% ${50 - tilt.x * 5}%, ${step.glow} 0%, transparent 70%)`,
              transition: 'background 0.1s ease',
            }} />
          )}

          {/* Ghost number */}
          <div style={{
            position: 'absolute', top: '-10px', right: '12px',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 5vw, 68px)',
            fontWeight: 700,
            color: isActive ? step.color : 'var(--color-hairline-strong)',
            lineHeight: 1, opacity: isActive ? 0.18 : 0.07,
            transition: 'color 0.5s ease, opacity 0.5s ease',
            userSelect: 'none', pointerEvents: 'none',
          }}>
            {step.number}
          </div>

          {/* Icon box */}
          <div style={{
            width: '48px', height: '48px',
            border: `1px solid ${isActive ? step.color : 'var(--color-hairline-strong)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '18px',
            color: isActive ? step.color : 'var(--color-muted)',
            background: isActive ? step.glow : 'transparent',
            transition: 'border-color 0.4s ease, color 0.4s ease, background 0.4s ease',
            position: 'relative', zIndex: 1,
          }}>
            {STEP_ICONS[step.title]}
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
              textTransform: 'uppercase',
              color: isActive ? step.color : 'var(--color-muted)',
              marginBottom: '6px', transition: 'color 0.4s ease',
            }}>
              {step.subtitle}
            </p>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(15px, 2vw, 22px)',
              fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--color-ink)', marginBottom: '12px', lineHeight: 1.1,
            }}>
              {step.title}
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              lineHeight: 1.7, color: 'var(--color-body)', marginBottom: '16px',
            }}>
              {step.description}
            </p>
          </div>
        </div>
      </div>

      {/* Connector pin below card */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <div style={{
          width: '1px',
          height: isActive ? '28px' : '18px',
          background: isActive ? `linear-gradient(to bottom, ${step.color}, transparent)` : 'var(--color-hairline)',
          transition: 'height 0.5s ease, background 0.5s ease',
        }} />
        <div style={{
          width: isActive ? '12px' : '8px', height: isActive ? '12px' : '8px',
          borderRadius: '50%',
          background: isActive ? step.color : 'var(--color-hairline-strong)',
          boxShadow: isActive ? `0 0 14px ${step.color}, 0 0 28px ${step.glow}` : 'none',
          border: `2px solid ${isActive ? step.color : 'var(--color-hairline-strong)'}`,
          transition: 'all 0.5s cubic-bezier(0.23,1,0.32,1)',
        }} />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────
export default function ShowcaseScroll() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const heroRef        = useRef(null)
  const servicesRef    = useRef(null)
  const materialsRef   = useRef(null)
  const whyChooseRef   = useRef(null)
  const journeyRef     = useRef(null)
  const galleryRef     = useRef(null)
  const contactRef     = useRef(null)
  const svcHeadingRef  = useRef(null)
  const svcRowsRef     = useRef([])
  const hintRef        = useRef(null)
  const svcAnimFired   = useRef(false)

  // Mobile detection state
  const [isMobile, setIsMobile] = useState(false)

  // Loading screen state
  const [isLoading, setIsLoading] = useState(true)
  const mainFrameProgress = useRef(0)
  const [displayProgress, setDisplayProgress] = useState(0)

  // Preload first 40 frames, then preload remaining in background
  const preloadFrames = useCallback((start, end, target, onProgress) => {
    const loaded = new Set()
    const effectiveTarget = Math.min(target, end - start + 1)

    for (let i = start; i < start + effectiveTarget; i++) {
      const img = new Image()
      img.onload = () => {
        loaded.add(i)
        const pct = (loaded.size / effectiveTarget) * 100
        onProgress(pct)
        // After target reached, preload remaining frames
        if (loaded.size >= effectiveTarget) {
          for (let j = start + effectiveTarget; j <= end; j++) {
            const remainingImg = new Image()
            remainingImg.src = `${import.meta.env.BASE_URL}images/Entire_website_scrollable_animation/ezgif-frame-${String(j).padStart(3, '0')}.png`
          }
        }
      }
      img.src = `${import.meta.env.BASE_URL}images/Entire_website_scrollable_animation/ezgif-frame-${String(i).padStart(3, '0')}.png`
    }
  }, [])

  // Start loading on mount
  useEffect(() => {
    if (isMobile) return

    // Build Cloudinary URLs for main scroll frames
    const buildUrl = (num) => `https://res.cloudinary.com/dafi2yzol/image/upload/f_auto,q_auto/plakzo/main-scroll/ezgif-frame-${String(num).padStart(3, '0')}.png`

    const loaded = new Set()
    const target = INITIAL_LOAD_COUNT
    const totalFrames = FRAME_END - FRAME_START + 1
    const effectiveTarget = Math.min(target, totalFrames)

    for (let i = FRAME_START; i < FRAME_START + effectiveTarget; i++) {
      const img = new Image()
      img.onload = () => {
        loaded.add(i)
        const pct = (loaded.size / effectiveTarget) * 100
        mainFrameProgress.current = pct
        setDisplayProgress(pct)

        if (loaded.size >= effectiveTarget) {
          // Target reached — start gallery preloading in background
          GalleryPreloader.preloadAll()
        }
      }
      img.src = buildUrl(i)
    }
  }, [isMobile])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Scroll to specific section if query param present
  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo')
    if (scrollTo === 'gallery') {
      // Progress = scrollY / (wrapper.offsetHeight - innerHeight)
      // wrapper = viewport (100vh) + spacer (1100vh) = 1200vh
      // h = 1200vh - 100vh = 1100vh = 11 * innerHeight
      // Gallery visible at progress 0.70–0.89, target 0.78 (midpoint)
      const h = 11 * window.innerHeight
      const scrollTarget = 0.78 * h
      setTimeout(() => {
        window.scrollTo({ top: scrollTarget, behavior: 'instant' })
      }, 50)
    }
  }, [searchParams])

  // Gamification state
  const [activeStep, setActiveStep] = useState(-1)
  const [gamePct,    setGamePct]    = useState(0)
  const lineProgressRef = useRef(null)

  // Frame override state — when set, ScrollFrameSequence will freeze on this frame
  const [frameOverride, setFrameOverride] = useState(null)
  const frameOverrideRef = useRef(null) // keep ref in sync for use inside callback

  const wwdTextRef  = useRef(null)
  const svcTitleRef = useRef(null)
  const textTlRef   = useRef(null)
  const splitRef    = useRef(null)

  function triggerServicesIn() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const heading = svcHeadingRef.current
    const rows = svcRowsRef.current.filter(Boolean)

    gsap.set(heading, { y: 28, opacity: 0 })
    gsap.set(rows, { y: 20, opacity: 0 })

    if (textTlRef.current) textTlRef.current.kill()
    textTlRef.current = gsap.timeline({ defaults: { ease: 'power3.out' } })

    textTlRef.current.to(heading, { y: 0, opacity: 1, duration: 0.5 }, 0)
    textTlRef.current.to(rows, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 }, 0.15)

    if (wwdTextRef.current) {
      gsap.set(wwdTextRef.current, { opacity: 1 })
      textTlRef.current.to(wwdTextRef.current, {
        duration: 0.9,
        scrambleText: { text: 'WHAT WE DO', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', revealDelay: 0.1, speed: 0.5 },
        ease: 'none',
      }, 0.05)
    }

    if (svcTitleRef.current) {
      if (splitRef.current) { splitRef.current.revert(); splitRef.current = null }
      gsap.set(svcTitleRef.current, { opacity: 1 })
      const split = new SplitText(svcTitleRef.current, { type: 'chars' })
      splitRef.current = split
      split.chars.forEach((char) => { char.style.display = 'inline-block'; char.style.overflow = 'hidden' })
      gsap.set(split.chars, { opacity: 0, y: '100%', rotationX: -40 })
      textTlRef.current.to(split.chars, { opacity: 1, y: '0%', rotationX: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, 0.3)
    }
  }

  function resetServicesOut() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const heading = svcHeadingRef.current
    const rows = svcRowsRef.current.filter(Boolean)
    gsap.killTweensOf([heading, ...rows])
    gsap.set(heading, { y: 28, opacity: 0 })
    gsap.set(rows, { y: 20, opacity: 0 })

    if (textTlRef.current) textTlRef.current.kill()
    if (wwdTextRef.current) { gsap.killTweensOf(wwdTextRef.current); gsap.set(wwdTextRef.current, { opacity: 0 }); wwdTextRef.current.textContent = 'WHAT WE DO' }
    if (splitRef.current) { gsap.killTweensOf(splitRef.current.chars); splitRef.current.revert(); splitRef.current = null }
    if (svcTitleRef.current) gsap.set(svcTitleRef.current, { opacity: 0 })
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) {
      if (svcHeadingRef.current) gsap.set(svcHeadingRef.current, { y: 28, opacity: 0 })
      svcRowsRef.current.filter(Boolean).forEach(row => gsap.set(row, { y: 20, opacity: 0 }))
      if (wwdTextRef.current) gsap.set(wwdTextRef.current, { opacity: 0 })
      if (svcTitleRef.current) gsap.set(svcTitleRef.current, { opacity: 0 })
    }
  }, [])

  const handleProgress = useCallback((progress) => {
    // ─── Hero ──────────────────────────────────────────────
    const heroOp = phaseOpacity(progress, 0, HERO_HOLD_END, HERO_FADE_OUT_END)
    if (heroRef.current) { heroRef.current.style.opacity = heroOp; heroRef.current.style.pointerEvents = heroOp > 0.05 ? 'auto' : 'none' }

    // ─── Services ──────────────────────────────────────────
    const svcFadeIn  = phaseIn(progress, SVC_FADE_IN_START, SVC_FADE_IN_END)
    const svcFadeOut = progress >= SVC_FADE_OUT_START ? 1 - Math.min(1, (progress - SVC_FADE_OUT_START) / (SVC_FADE_OUT_END - SVC_FADE_OUT_START)) : 1
    const svcOp = svcFadeIn * svcFadeOut
    if (servicesRef.current) { servicesRef.current.style.opacity = svcOp; servicesRef.current.style.pointerEvents = svcOp > 0.05 ? 'auto' : 'none' }

    // ─── Materials ─────────────────────────────────────────
    const matFadeIn  = phaseIn(progress, MAT_FADE_IN_START, MAT_FADE_IN_END)
    const matFadeOut = progress >= MAT_FADE_OUT_START ? 1 - Math.min(1, (progress - MAT_FADE_OUT_START) / (MAT_FADE_OUT_END - MAT_FADE_OUT_START)) : 1
    const matOp = matFadeIn * matFadeOut
    if (materialsRef.current) { materialsRef.current.style.opacity = matOp; materialsRef.current.style.pointerEvents = matOp > 0.05 ? 'auto' : 'none' }

    // ─── WhyChoose ─────────────────────────────────────────
    const whyFadeIn  = phaseIn(progress, WHY_FADE_IN_START, WHY_FADE_IN_END)
    const whyFadeOut = progress >= WHY_FADE_OUT_START ? 1 - Math.min(1, (progress - WHY_FADE_OUT_START) / (WHY_FADE_OUT_END - WHY_FADE_OUT_START)) : 1
    const whyOp = whyFadeIn * whyFadeOut
    if (whyChooseRef.current) { whyChooseRef.current.style.opacity = whyOp; whyChooseRef.current.style.pointerEvents = whyOp > 0.05 ? 'auto' : 'none' }

    // ─── Journey opacity (stays visible through gamification) ──
    const jnyFadeIn  = phaseIn(progress, JNY_FADE_IN_START, JNY_FADE_IN_END)
    const jnyFadeOut = progress >= JNY_FADE_OUT_START ? 1 - Math.min(1, (progress - JNY_FADE_OUT_START) / (JNY_FADE_OUT_END - JNY_FADE_OUT_START)) : 1
    const jnyOp = jnyFadeIn * jnyFadeOut
    if (journeyRef.current) { journeyRef.current.style.opacity = jnyOp; journeyRef.current.style.pointerEvents = jnyOp > 0.05 ? 'auto' : 'none' }

    // ─── Gamification: drive step activation ───────────────
    if (progress >= JNY_GAME_START && progress <= JNY_GAME_END) {
      const gameProgress = (progress - JNY_GAME_START) / (JNY_GAME_END - JNY_GAME_START)
      const pct = gameProgress * 100
      const stepIdx = Math.min(Math.floor(gameProgress * JOURNEY_STEPS.length), JOURNEY_STEPS.length - 1)
      setActiveStep(stepIdx)
      setGamePct(pct)
      if (lineProgressRef.current) lineProgressRef.current.style.width = `${pct}%`

      // Freeze frame during gamification
      if (frameOverrideRef.current !== JNY_FREEZE_FRAME) {
        frameOverrideRef.current = JNY_FREEZE_FRAME
        setFrameOverride(JNY_FREEZE_FRAME)
      }
    } else {
      // Outside gamification window — unfreeze
      if (frameOverrideRef.current !== null) {
        frameOverrideRef.current = null
        setFrameOverride(null)
      }
      // Reset gamification when scrolling back before journey
      if (progress < JNY_FADE_IN_START) {
        setActiveStep(-1)
        setGamePct(0)
        if (lineProgressRef.current) lineProgressRef.current.style.width = '0%'
      }
    }

    // ─── Gallery ───────────────────────────────────────────
    const galFadeIn  = phaseIn(progress, GAL_FADE_IN_START, GAL_FADE_IN_END)
    const galFadeOut = progress >= GAL_FADE_OUT_START ? 1 - Math.min(1, (progress - GAL_FADE_OUT_START) / (GAL_FADE_OUT_END - GAL_FADE_OUT_START)) : 1
    const galOp = galFadeIn * galFadeOut
    if (galleryRef.current) { galleryRef.current.style.opacity = galOp; galleryRef.current.style.pointerEvents = galOp > 0.05 ? 'auto' : 'none' }

    // ─── Contact ───────────────────────────────────────────
    const cntOp = phaseIn(progress, CNT_FADE_IN_START, CNT_FADE_IN_END)
    if (contactRef.current) { contactRef.current.style.opacity = cntOp; contactRef.current.style.pointerEvents = cntOp > 0.05 ? 'auto' : 'none' }

    // ─── Services animation ────────────────────────────────
    if (progress >= SVC_ANIM_TRIGGER && !svcAnimFired.current) { svcAnimFired.current = true; triggerServicesIn() }
    if (progress < SVC_FADE_IN_START && svcAnimFired.current) { svcAnimFired.current = false; resetServicesOut() }

    // ─── Scroll hint ───────────────────────────────────────
    if (hintRef.current) { hintRef.current.style.opacity = progress < 0.04 ? 1 : 0 }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (isMobile) {
    return <ShowcaseMobile />
  }

  return (
    <>
    <LoadingScreen progress={displayProgress} onComplete={() => setIsLoading(false)} />
    <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.4s ease' }}>
    <Navbar />
    <ScrollFrameSequence
      frameStart={FRAME_START}
      frameEnd={FRAME_END}
      scrollTriggerId="showcase"
      spacerHeight={SPACER_HEIGHT}
      onProgress={handleProgress}
      style={{ background: '#000' }}
    >
      {/* Left gradient */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, transparent 28%, rgba(0,0,0,0.6) 52%, rgba(0,0,0,0.82) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      {/* ═══════════════ HERO ═══════════════ */}
      <div ref={heroRef} style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '80px clamp(24px, 5vw, 80px) 0', opacity: 0, pointerEvents: 'none' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <div style={{ marginBottom: '28px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)' }}>DESIGN • PRINT • DELIVER</span>
            <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--color-ink)', marginTop: '10px' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4.2vw, 62px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-ink)', marginBottom: '24px' }}>
            Industrial Plastic<br /><span style={{ color: 'var(--color-muted)' }}>Parts &amp;</span> 3D Printing
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.2vw, 17px)', color: 'var(--color-body)', maxWidth: '400px', marginBottom: '40px', lineHeight: 1.65 }}>
            We design custom plastic components using SolidWorks and manufacture them with precision 3D printing — from concept to your doorstep.
          </p>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" className="btn-brand">Get a Quote</a>
            <button className="btn-ghost" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Our Services →</button>
          </div>
        </div>
      </div>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <div ref={servicesRef} style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 clamp(24px, 5vw, 80px)', opacity: 0, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'clamp(32px, 4vw, 64px)', width: '100%' }}>
          <div ref={svcHeadingRef} style={{ flexShrink: 0, width: 'clamp(140px, 22vw, 220px)', paddingTop: '4px' }}>
            <span ref={wwdTextRef} style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'clamp(11px, 1vw, 14px)', fontWeight: 400, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '14px', opacity: 0, minHeight: '1em', whiteSpace: 'nowrap', overflow: 'hidden' }}>WHAT WE DO</span>
            <h2 ref={svcTitleRef} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.8vw, 42px)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-ink)', lineHeight: 1.05, margin: 0, overflow: 'hidden', opacity: 1 }}>Our Service</h2>
          </div>
          <div style={{ width: 'clamp(280px, 42vw, 520px)', flexShrink: 0 }}>
            {SERVICES.map((service, i) => (
              <div key={service.number} ref={el => svcRowsRef.current[i] = el} style={{ borderTop: '1px solid var(--color-hairline)', padding: '16px 0', ...(i === SERVICES.length - 1 && { borderBottom: '1px solid var(--color-hairline)' }) }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '6px' }}>
                  <span className="text-caption" style={{ color: 'var(--color-muted-soft)', flexShrink: 0 }}>{service.number}</span>
                  <h3 className="text-display-sm" style={{ fontSize: '14px', letterSpacing: '1px', color: 'var(--color-ink)' }}>{service.title}</h3>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-body)', lineHeight: 1.6, marginLeft: '30px', marginBottom: '8px' }}>{service.description}</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginLeft: '30px' }}>
                  {service.tags.map(tag => <span key={tag} className="text-caption" style={{ fontSize: '9px', letterSpacing: '1.5px', color: 'var(--color-muted-soft)' }}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ MATERIALS ═══════════════ */}
      <div ref={materialsRef} style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(24px, 5vw, 80px)', opacity: 0, pointerEvents: 'none' }}>
        <div style={{ width: '100%', maxWidth: '900px', textAlign: 'center' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'clamp(10px, 1vw, 13px)', fontWeight: 400, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '20px' }}>MATERIALS</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--color-ink)', lineHeight: 1.05, marginBottom: '24px' }}>Built to Last</h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.1vw, 16px)', color: 'var(--color-body)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            We work with industrial-grade materials — PLA, ABS, and TPU — chosen for their strength, precision, and performance in real-world applications.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
            {['PLA', 'ABS', 'TPU'].map(mat => (
              <div key={mat} style={{ border: '1px solid var(--color-hairline-strong)', padding: '14px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, letterSpacing: '2px', color: 'var(--color-ink)' }}>{mat}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', color: 'var(--color-muted-soft)', textTransform: 'uppercase' }}>
                  {mat === 'PLA' ? 'Eco-Friendly' : mat === 'ABS' ? 'Industrial' : 'Flexible'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ WHY CHOOSE ═══════════════ */}
      <div ref={whyChooseRef} style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 clamp(24px, 5vw, 80px)', opacity: 0, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '580px', width: '50%' }}>
          <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'clamp(10px, 1vw, 13px)', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '10px' }}>
            Why PLAKZO
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 42px)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-ink)', lineHeight: 1.05, margin: '0 0 28px' }}>
            Why Choose Us
          </h2>
          <ChromaGrid columns={3} cardW={170} cardH={140} gap={8} radius={300} damping={0.4} fadeOut={0.5} />
        </div>
      </div>

      {/* ═══════════════ OUR JOURNEY (with gamification) ═══════════════ */}
      <div ref={journeyRef} style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(24px, 5vw, 80px)', opacity: 0, pointerEvents: 'none' }}>
        <div style={{ width: '100%', maxWidth: '1280px' }}>

          {/* Header row */}
          <div style={{ marginBottom: '36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'clamp(10px, 1vw, 13px)', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '12px' }}>How It Works</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-ink)', lineHeight: 1.05, margin: 0 }}>
                Our&nbsp;<span style={{ background: 'linear-gradient(135deg, var(--color-ink) 0%, var(--color-muted) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Journey</span>
              </h2>
            </div>
            {/* Live progress percentage */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                color: activeStep >= 0 ? JOURNEY_STEPS[Math.max(0, activeStep)].color : 'var(--color-muted)',
                fontWeight: 700, fontSize: '18px', transition: 'color 0.4s ease',
              }}>
                {Math.round(gamePct)}%
              </span>
              <span>Complete</span>
            </div>
          </div>

          {/* Gamification scroll hint — only visible when gamification hasn't started */}
          {activeStep < 0 && (
            <div style={{ textAlign: 'center', marginBottom: '24px', opacity: 0.6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                ↓ Scroll to unlock each step
              </span>
            </div>
          )}

          {/* 4 PinCards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(12px, 2vw, 24px)', width: '100%' }}>
            {JOURNEY_STEPS.map((step, i) => (
              <JourneyCard
                key={step.number}
                step={step}
                isActive={i <= activeStep}
                isCurrent={i === activeStep}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ position: 'relative', marginTop: '8px', height: '2px', background: 'var(--color-hairline)', overflow: 'hidden' }}>
            <div ref={lineProgressRef} style={{
              position: 'absolute', top: 0, left: 0, height: '100%', width: '0%',
              background: `linear-gradient(to right, #c3d9f3, #a8edca, #f9c98e, #e8a0cf)`,
              boxShadow: '0 0 10px rgba(195,217,243,0.5)',
              transition: 'width 0.06s linear',
            }} />
          </div>

          {/* Step label row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'clamp(12px, 2vw, 24px)', marginTop: '14px' }}>
            {JOURNEY_STEPS.map((step, i) => (
              <div key={`lbl-${step.number}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' }}>
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: i <= activeStep ? step.color : 'var(--color-hairline-strong)',
                  transition: 'background 0.4s ease', flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
                  color: i <= activeStep ? step.color : 'var(--color-muted-soft)',
                  transition: 'color 0.4s ease',
                }}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════ GALLERY ═══════════════ */}
      <div ref={galleryRef} style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(24px, 5vw, 80px)', opacity: 0, pointerEvents: 'none' }}>
        <TargetCursor containerRef={galleryRef} targetSelector=".cursor-target" />
        <div style={{ width: '100%', maxWidth: '1280px' }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ display: 'block', width: '32px', height: '1px', background: 'var(--color-muted)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Our Work</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-ink)' }}>Gallery</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '180px', gap: '6px' }}>
            {GALLERY_ITEMS.map((item, i) => {
              const size = i === 0 ? 'large' : (i % 2 === 0 ? 'small' : 'medium')
              return (
              <div key={item.slug} className="showcase-gallery-cell cursor-target" onClick={() => navigate(`/gallery/${item.slug}`)} style={{ position: 'relative', overflow: 'hidden', background: '#0a0a0a', gridRow: size === 'large' ? 'span 2' : 'span 1', boxShadow: `0 0 0 1px ${item.accent}22`, cursor: 'pointer' }}>
                <img src={item.image} alt={item.label} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', transform: 'scale(1.02)', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)' }} className="showcase-gallery-img" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.08) 100%)', zIndex: 1 }} />
                <svg style={{ position: 'absolute', top: 0, left: 0, zIndex: 3, pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 20 20"><line x1="0" y1="0" x2="12" y2="0" stroke={item.accent} strokeWidth="1.5" opacity="0.6" /><line x1="0" y1="0" x2="0" y2="12" stroke={item.accent} strokeWidth="1.5" opacity="0.6" /></svg>
                <svg style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 3, pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 20 20"><line x1="20" y1="20" x2="8" y2="20" stroke={item.accent} strokeWidth="1.5" opacity="0.6" /><line x1="20" y1="20" x2="20" y2="8" stroke={item.accent} strokeWidth="1.5" opacity="0.6" /></svg>
                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', color: item.accent, background: `${item.accent}18`, border: `1px solid ${item.accent}44`, padding: '2px 7px', borderRadius: '2px' }}>{item.tag}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 12px', zIndex: 4 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(11px, 1.2vw, 15px)', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff' }}>{item.label}</span>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <div ref={contactRef} style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(24px, 5vw, 80px)', opacity: 0, pointerEvents: 'none' }}>
        <div style={{ width: '100%', maxWidth: '1280px' }}>
          <Contact isMobile={false} />
        </div>
      </div>
    </ScrollFrameSequence>
    </div>
    </>
  )
}

// ─── Mobile Navbar with Hamburger Menu ────────────────────────────
function MobileNavbar({ scrollToSection }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const navItems = [
    { label: 'Home', href: '#home-mobile' },
    { label: 'Services', href: '#services-mobile' },
    { label: 'Materials', href: '#materials-mobile' },
    { label: 'Journey', href: '#journey-mobile' },
    { label: 'Gallery', href: '#gallery-mobile' },
    { label: 'Contact', href: '#contact-mobile' }
  ]

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = (href) => {
    setIsOpen(false)
    scrollToSection(href.slice(1))
  }

  return (
    <nav ref={menuRef} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200 }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'transparent',
        backdropFilter: 'none', WebkitBackdropFilter: 'none',
        borderBottom: isOpen ? 'none' : '1px solid var(--color-hairline)'
      }}>
        <img src={cloudinaryUrl('logos/plakzo_logo_new.jpeg')} alt="PLAKZO" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
        
        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', display: 'flex', flexDirection: 'column',
            gap: '5px', zIndex: 300
          }}
        >
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: '#ffffff', borderRadius: '1px',
            transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            transition: 'transform 0.3s ease'
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: '#ffffff', borderRadius: '1px',
            opacity: isOpen ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: '#ffffff', borderRadius: '1px',
            transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            transition: 'transform 0.3s ease'
          }} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(0, 0, 0, 0.95)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--color-hairline)',
          padding: '8px 16px'
        }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
              style={{
                display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px',
                fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--color-ink)', textDecoration: 'none', padding: '14px 12px',
                borderBottom: '1px solid var(--color-hairline)', transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── Mobile Service Card Accordion Component ──────────────────────
function ServiceCard({ service, isActive, onClick }) {
  const contentRef = useRef(null)

  useEffect(() => {
    if (!contentRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isActive) {
      gsap.killTweensOf(contentRef.current)
      gsap.fromTo(contentRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: prefersReduced ? 0.01 : 0.35, ease: 'power2.out' }
      )
    } else {
      gsap.killTweensOf(contentRef.current)
      gsap.to(contentRef.current, { height: 0, opacity: 0, duration: prefersReduced ? 0.01 : 0.25, ease: 'power2.in' })
    }
  }, [isActive])

  return (
    <div 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-controls={`service-desc-${service.number}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      style={{
        border: isActive ? '1px solid var(--color-ink)' : '1px solid var(--color-hairline)',
        borderRadius: '0px', // Cards: 0px border-radius
        padding: '20px',
        background: isActive ? 'rgba(255, 255, 255, 0.03)' : 'var(--color-surface-card)',
        boxShadow: isActive ? '0 8px 24px rgba(255, 255, 255, 0.04)' : 'none',
        transition: 'border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ 
          fontFamily: 'var(--font-mono)', fontSize: '11px', 
          color: isActive ? 'var(--color-ink)' : 'var(--color-muted-soft)', 
          fontWeight: 600,
          letterSpacing: '1px'
        }}>
          {service.number}
        </span>
        <h3 className="text-wrap-balance" style={{ 
          fontFamily: 'var(--font-display)', fontSize: '18px', 
          letterSpacing: '1.5px', textTransform: 'uppercase', 
          color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
          margin: 0,
          transition: 'color 0.3s ease'
        }}>
          {service.title}
        </h3>
      </div>
      
      <div 
        ref={contentRef} 
        id={`service-desc-${service.number}`}
        style={{ height: 0, opacity: 0, overflow: 'hidden' }}
      >
        <p style={{ 
          fontFamily: 'var(--font-body)', fontSize: '13px', 
          color: 'var(--color-body)', 
          lineHeight: 1.6, marginTop: '12px', marginBottom: '12px' 
        }}>
          {service.description}
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {service.tags.map(tag => (
            <span 
              key={tag}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
                textTransform: 'uppercase', color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
                background: isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                padding: '3px 8px', borderRadius: '9999px',
                border: isActive ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--color-hairline)'
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Mobile Version of Showcase ──────────────────────────────────
function ShowcaseMobile() {
  const [activeService, setActiveService] = useState(-1)
  const [activeChoose, setActiveChoose] = useState(-1)
  const [activeStep, setActiveStep] = useState(-1)
  const [activeSectionId, setActiveSectionId] = useState('home-mobile')

  // Scroll to top on mount to ensure we start at home page
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const sectionIds = [
      'home-mobile',
      'services-mobile',
      'materials-mobile',
      'why-choose-mobile',
      'journey-mobile',
      'gallery-mobile',
      'contact-mobile'
    ]
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0.1
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const getActiveNavItem = (sectionId) => {
    if (sectionId === 'why-choose-mobile') return 'materials-mobile'
    return sectionId
  }

  const containerRef = useRef(null)
  const timelineRef = useRef(null)
  const lineRef = useRef(null)
  const pinsRef = useRef([])
  const sectionsRef = useRef([])

  useEffect(() => {
    if (!containerRef.current) return
    const timeline = timelineRef.current
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Global scroll progress indicator animation
      gsap.to('.mobile-global-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      })

      // Hero stagger entrance (above fold)
      gsap.fromTo('.hero-fade-up',
        { opacity: 0, y: prefersReduced ? 0 : 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: prefersReduced ? 0.01 : 0.8, 
          stagger: prefersReduced ? 0 : 0.15, 
          ease: 'power3.out', 
          delay: 0.25 
        }
      )

      // Services section staggered card entrance
      gsap.fromTo('.service-card-entry',
        { opacity: 0, y: prefersReduced ? 0 : 25 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReduced ? 0.01 : 0.5,
          stagger: prefersReduced ? 0 : 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#services-mobile-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )

      // Materials section ScrollTrigger-driven progress bars
      gsap.utils.toArray('.material-bar-fill').forEach(bar => {
        const target = bar.getAttribute('data-target')
        gsap.to(bar, {
          width: `${target}%`,
          duration: prefersReduced ? 0.01 : 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 95%',
            toggleActions: 'play none none none',
          }
        })
      })

      // Why Choose section cards staggered entry
      gsap.fromTo('.why-choose-card',
        { opacity: 0, y: prefersReduced ? 0 : 30 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReduced ? 0.01 : 0.6,
          stagger: prefersReduced ? 0 : 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.why-choose-grid',
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      )

      // Journey: progress line animation
      gsap.fromTo(lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timeline,
            start: 'top 45%',
            end: 'bottom 55%',
            scrub: true,
          }
        }
      )

      // Journey: animate pin indicators and steps activation
      JOURNEY_STEPS.forEach((step, i) => {
        const pin = pinsRef.current[i]
        if (!pin) return

        gsap.to(pin, {
          scrollTrigger: {
            trigger: pin,
            start: 'top 50%',
            end: 'top 40%',
            toggleActions: 'play reverse play reverse',
            onEnter: () => setActiveStep(i),
            onEnterBack: () => setActiveStep(i),
            onLeaveBack: () => i === 0 ? setActiveStep(-1) : setActiveStep(i - 1),
          }
        })
      })

      // Gallery grid staggered zoom/fade entry
      gsap.fromTo('.gallery-card',
        { opacity: 0, scale: prefersReduced ? 1 : 0.95, y: prefersReduced ? 0 : 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: prefersReduced ? 0.01 : 0.6,
          stagger: prefersReduced ? 0 : 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      )

      // Contact form slide-up entry
      gsap.fromTo('.contact-fade-up',
        { opacity: 0, y: prefersReduced ? 0 : 20 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReduced ? 0.01 : 0.6,
          stagger: prefersReduced ? 0 : 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#contact-mobile',
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )

      // Animate section headers fade-ins
      const sections = sectionsRef.current.filter(Boolean)
      sections.forEach(sec => {
        // Skip animating the full section wrapper because we animate children,
        // but animate the inner section titles specifically
        const header = sec.querySelector('.section-header')
        if (header) {
          gsap.fromTo(header,
            { opacity: 0, y: prefersReduced ? 0 : 15 },
            {
              opacity: 1,
              y: 0,
              duration: prefersReduced ? 0.01 : 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none',
              }
            }
          )
        }
      })

      // Hero image parallax scrub on scroll
      if (!prefersReduced) {
        gsap.utils.toArray('.hero-parallax-img').forEach(img => {
          gsap.to(img, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          })
        })
      }
    }, containerRef.current)

    ScrollTrigger.refresh()

    return () => ctx.revert()
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const whyChooseItems = [
    { title: 'High Quality', subtitle: 'Rigorous checks at every stage', glow: 'rgba(255,255,255,0.06)' },
    { title: 'Custom Solutions', subtitle: 'Tailored to your exact needs', glow: 'rgba(255,255,255,0.06)' },
    { title: 'Fast Turnaround', subtitle: 'On-time, every time', glow: 'rgba(255,255,255,0.06)' },
    { title: 'Affordable Pricing', subtitle: 'Value without compromise', glow: 'rgba(255,255,255,0.06)' },
    { title: 'Wide Range', subtitle: 'PLA, ABS, TPU & more', glow: 'rgba(255,255,255,0.06)' },
    { title: 'Customer Satisfaction', subtitle: 'We don’t stop until you’re happy', glow: 'rgba(255,255,255,0.06)' }
  ]

  const materialsData = [
    {
      name: 'PLA',
      desc: 'Eco-friendly, easy to print, and offers excellent dimensional accuracy. Best suited for prototypes, decorative models, and low-stress parts.',
      properties: { strength: 60, flex: 20, durability: 50 },
      label: 'Eco-Friendly'
    },
    {
      name: 'ABS',
      desc: 'High strength, impact resistance, and moderate heat resistance. Ideal for functional prototypes, enclosures, and moderate-load mechanical parts.',
      properties: { strength: 85, flex: 40, durability: 80 },
      label: 'Industrial Strength'
    },
    {
      name: 'TPU',
      desc: 'Highly flexible, elastic, and rubber-like material with exceptional wear and impact resistance. Perfect for gaskets, phone cases, and flexible joints.',
      properties: { strength: 70, flex: 100, durability: 95 },
      label: 'Flexible & Elastic'
    }
  ]

  return (
    <div ref={containerRef} style={{ background: '#000', color: 'var(--color-body)', minHeight: '100vh', overflowX: 'hidden', paddingBottom: '100px', position: 'relative' }}>
      
      {/* Plasma Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Plasma
          color="#ffffff"
          speed={0.4}
          direction="pingpong"
          scale={1.2}
          opacity={0.35}
          mouseInteractive={false}
        />
      </div>

      {/* Mobile Navbar */}
      <MobileNavbar scrollToSection={scrollToSection} />

      {/* Global Scroll Progress Bar */}
      <div 
        className="mobile-global-progress" 
        style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, height: '2.5px', 
          backgroundColor: '#ffffff', transform: 'scaleX(0)', transformOrigin: 'left center', 
          zIndex: 1000, boxShadow: '0 1px 8px rgba(255, 255, 255, 0.3)' 
        }} 
      />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section id="home-mobile" ref={el => sectionsRef.current[0] = el} style={{
        position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '70px 20px 60px', minHeight: '80vh',
        background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.03) 0%, transparent 60%)'
      }}>
        {/* Subtle grid pattern background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(var(--color-hairline-strong) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-fade-up" style={{ marginBottom: '24px' }}>
            <span style={{ 
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 400, letterSpacing: '3px', 
              textTransform: 'uppercase', color: 'var(--color-ink)' 
            }}>
              DESIGN • PRINT • DELIVER
            </span>
            <div style={{ width: '32px', height: '2px', backgroundColor: 'var(--color-ink)', marginTop: '8px' }} />
          </div>

          <h1 className="hero-fade-up text-wrap-balance" style={{ 
            fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 700, 
            lineHeight: 1.1, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', 
            marginBottom: '16px' 
          }}>
            Industrial Plastic<br />
            <span style={{ color: 'var(--color-muted)' }}>Parts &amp;</span> 3D Printing
          </h1>

          <p className="hero-fade-up text-wrap-pretty" style={{ 
            fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-body)', 
            maxWidth: '100%', marginBottom: '24px', lineHeight: 1.6 
          }}>
            We design custom plastic components using SolidWorks and manufacture them with precision 3D printing — from concept to your doorstep.
          </p>

          {/* Hero Bento Image Showcase Collage ($10,000 Premium Editorial Layout) */}
          <div className="hero-fade-up" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1.2fr 1fr', 
            gridTemplateRows: 'repeat(2, 100px)', 
            gap: '8px', 
            marginBottom: '32px', 
            width: '100%', 
            position: 'relative'
          }}>
            {/* 01 • DESIGN — Large Tall Card */}
            <div style={{ 
              gridRow: '1 / span 2', 
              position: 'relative', 
              height: '208px', 
              overflow: 'hidden', 
              border: '1px solid var(--color-hairline)', 
              borderRadius: '0px' 
            }}>
              <img 
                src={cloudinaryUrl('thumbnails/gallery_cad_design.png')} 
                alt="3D CAD component design process in SolidWorks" 
                width="160"
                height="208"
                fetchPriority="high"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                className="hero-parallax-img"
              />
              <div style={{
                position: 'absolute', bottom: '6px', left: '6px', zIndex: 2,
                fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px',
                color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '2px 5px',
                textTransform: 'uppercase'
              }}>
                01 • DESIGN
              </div>
            </div>

            {/* 02 • PRINT — Small Top Right Card */}
            <div style={{ 
              gridColumn: '2', 
              gridRow: '1', 
              position: 'relative', 
              height: '100px', 
              overflow: 'hidden', 
              border: '1px solid var(--color-hairline)', 
              borderRadius: '0px' 
            }}>
              <img 
                src={cloudinaryUrl('thumbnails/gallery_industrial_parts.png')} 
                alt="Finished 3D printed industrial plastic part" 
                width="160"
                height="100"
                fetchPriority="high"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                className="hero-parallax-img"
              />
              <div style={{
                position: 'absolute', bottom: '6px', left: '6px', zIndex: 2,
                fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px',
                color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '2px 5px',
                textTransform: 'uppercase'
              }}>
                02 • PRINT
              </div>
            </div>

            {/* 03 • DELIVER — Small Bottom Right Card */}
            <div style={{ 
              gridColumn: '2', 
              gridRow: '2', 
              position: 'relative', 
              height: '100px', 
              overflow: 'hidden', 
              border: '1px solid var(--color-hairline)', 
              borderRadius: '0px' 
            }}>
              <img 
                src={cloudinaryUrl('thumbnails/gallery_photo_lamp.png')} 
                alt="Finished personalized 3D printed photo lamp" 
                width="160"
                height="100"
                fetchPriority="high"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                className="hero-parallax-img"
              />
              <div style={{
                position: 'absolute', bottom: '6px', left: '6px', zIndex: 2,
                fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px',
                color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '2px 5px',
                textTransform: 'uppercase'
              }}>
                03 • DELIVER
              </div>
            </div>
          </div>

          <div className="hero-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            <a 
              href="#contact-mobile"
              onClick={(e) => { e.preventDefault(); scrollToSection('contact-mobile'); }}
              className="btn-brand" 
              style={{ width: '100%', textAlign: 'center' }}
            >
              Get a Quote
            </a>
            <a 
              href="#services-mobile"
              onClick={(e) => { e.preventDefault(); scrollToSection('services-mobile'); }}
              className="btn-ghost" 
              style={{ width: '100%', textAlign: 'center', color: '#fff' }}
            >
              Our Services ↓
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 20px', opacity: 0.6 }} />

      {/* ═══════════════ SERVICES SECTION ═══════════════ */}
      <section id="services-mobile" className="section-anchor" ref={el => sectionsRef.current[1] = el} style={{
        padding: '60px 20px', 
        background: 'radial-gradient(circle at 10% 80%, rgba(255,255,255,0.02) 0%, transparent 60%)'
      }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <span style={{ 
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', 
            letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px' 
          }}>
            WHAT WE DO
          </span>
          <h2 className="text-wrap-balance" style={{ 
            fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600, 
            letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0 
          }}>
            Our Services
          </h2>
        </div>

        <div id="services-mobile-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SERVICES.map((service, i) => {
            const isActive = activeService === i
            return (
              <div key={service.number} className="service-card-entry">
                <ServiceCard 
                  service={service}
                  isActive={isActive}
                  onClick={() => setActiveService(isActive ? -1 : i)}
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 20px', opacity: 0.6 }} />

      {/* ═══════════════ MATERIALS SECTION ═══════════════ */}
      <section id="materials-mobile" ref={el => sectionsRef.current[2] = el} style={{
        padding: '60px 20px',
        background: 'radial-gradient(circle at 90% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)'
      }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ 
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', 
            letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px' 
          }}>
            MATERIALS
          </span>
          <h2 className="text-wrap-balance" style={{ 
            fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, 
            letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginBottom: '16px' 
          }}>
            Built to Last
          </h2>
          <p className="text-wrap-pretty" style={{ 
            fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-body)', 
            lineHeight: 1.6, margin: '0 auto', maxWidth: '100%' 
          }}>
            We work with industrial-grade materials chosen for their strength, precision, and performance in real-world applications.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {materialsData.map(mat => (
            <div 
              key={mat.name}
              style={{
                background: 'var(--color-surface-card)',
                border: '1px solid var(--color-hairline)',
                borderRadius: '0px', // Cards: 0px border-radius
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Clean White Top Accent Line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: `linear-gradient(to right, #ffffff, transparent)`
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ 
                    fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 700, 
                    letterSpacing: '1px', color: '#fff', margin: 0 
                  }}>
                    {mat.name}
                  </h3>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
                    textTransform: 'uppercase', color: 'var(--color-body)' 
                  }}>
                    {mat.label}
                  </span>
                </div>
              </div>

              <p style={{ 
                fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-body)', 
                lineHeight: 1.6, marginBottom: '20px' 
              }}>
                {mat.desc}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--color-hairline)', paddingTop: '16px' }}>
                {[
                  { key: 'STRENGTH', value: mat.properties.strength },
                  { key: 'FLEXIBILITY', value: mat.properties.flex },
                  { key: 'DURABILITY', value: mat.properties.durability }
                ].map(prop => (
                  <div key={prop.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      width: '85px', fontSize: '10px', fontFamily: 'var(--font-mono)', 
                      color: 'var(--color-muted-soft)', letterSpacing: '1px' 
                    }}>
                      {prop.key}
                    </span>
                    <div style={{ flex: 1, height: '4px', background: 'var(--color-hairline-strong)', borderRadius: '2px', overflow: 'hidden' }}>
                      {/* Animate on scroll progress fill */}
                      <div 
                        className="material-bar-fill"
                        data-target={prop.value}
                        style={{ width: '0%', height: '100%', background: '#ffffff', borderRadius: '2px' }} 
                      />
                    </div>
                    <span style={{ 
                      width: '28px', fontSize: '10px', fontFamily: 'var(--font-mono)', 
                      color: '#fff', textAlign: 'right' 
                    }}>
                      {prop.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 20px', opacity: 0.6 }} />

      {/* ═══════════════ WHY CHOOSE SECTION ═══════════════ */}
      <section id="why-choose-mobile" ref={el => sectionsRef.current[3] = el} style={{
        padding: '60px 20px',
        background: 'radial-gradient(circle at 10% 30%, rgba(255,255,255,0.02) 0%, transparent 60%)'
      }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <span style={{ 
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', 
            letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px' 
          }}>
            WHY PLAKZO
          </span>
          <h2 className="text-wrap-balance" style={{ 
            fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, 
            letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0 
          }}>
            Why Choose Us
          </h2>
        </div>

        <div className="why-choose-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {whyChooseItems.map((item, i) => {
            const isActive = activeChoose === i
            return (
              <div 
                key={item.title}
                className="why-choose-card"
                onClick={() => setActiveChoose(isActive ? -1 : i)}
                style={{
                  border: isActive ? `1.5px solid #ffffff` : '1.5px solid var(--color-hairline)',
                  borderRadius: '0px', // Cards: 0px border-radius
                  padding: '16px',
                  background: isActive ? 'rgba(255,255,255,0.03)' : 'var(--color-surface-card)',
                  boxShadow: isActive ? `0 8px 24px rgba(255,255,255,0.05)` : 'none',
                  transition: 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '28px', height: '28px',
                  border: `1.5px solid ${isActive ? '#ffffff' : 'var(--color-hairline-strong)'}`,
                  borderRadius: '9999px', // Small indicator elements are circles
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '12px',
                  color: isActive ? '#ffffff' : 'var(--color-muted)',
                  fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 600,
                  transition: 'border-color 0.3s ease, color 0.3s ease'
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-wrap-balance" style={{ 
                  fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, 
                  letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', 
                  marginBottom: '4px', lineHeight: 1.2
                }}>
                  {item.title}
                </h3>
                <p style={{ 
                  fontFamily: 'var(--font-body)', fontSize: '10px', 
                  color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4
                }}>
                  {item.subtitle}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 20px', opacity: 0.6 }} />

      {/* ═══════════════ JOURNEY SECTION ═══════════════ */}
      <section id="journey-mobile" ref={el => sectionsRef.current[4] = el} style={{
        padding: '60px 20px',
        background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)'
      }}>
        <div className="section-header" style={{ marginBottom: '36px' }}>
          <span style={{ 
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', 
            letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px' 
          }}>
            HOW IT WORKS
          </span>
          <h2 className="text-wrap-balance" style={{ 
            fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, 
            letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', margin: 0 
          }}>
            Our Journey
          </h2>
        </div>

        <div ref={timelineRef} style={{ position: 'relative', paddingLeft: '32px' }}>
          <div style={{
            position: 'absolute', left: '10px', top: '10px', bottom: '10px',
            width: '2px', background: 'var(--color-hairline)'
          }} />

          {/* Clean Monochrome Line */}
          <div ref={lineRef} style={{
            position: 'absolute', left: '10px', top: '10px', bottom: '10px',
            width: '2px', 
            background: 'linear-gradient(to bottom, #ffffff, #666666)',
            transformOrigin: 'top center',
            boxShadow: '0 0 8px rgba(255,255,255,0.15)',
          }} />

          {JOURNEY_STEPS.map((step, i) => {
            const isCompleted = i <= activeStep
            const isActivePin = i === activeStep
            return (
              <div 
                key={step.number}
                style={{
                  position: 'relative',
                  marginBottom: i === JOURNEY_STEPS.length - 1 ? 0 : '32px',
                  transition: 'opacity 0.4s ease',
                  opacity: isCompleted ? 1 : 0.45
                }}
              >
                <div 
                  ref={el => pinsRef.current[i] = el}
                  style={{
                    position: 'absolute', left: '-31px', top: '8px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: isCompleted ? '#ffffff' : 'var(--color-hairline-strong)',
                    border: `2px solid ${isCompleted ? '#ffffff' : 'var(--color-hairline)'}`,
                    boxShadow: isCompleted ? `0 0 10px rgba(255,255,255,0.4)` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10,
                    transform: isActivePin ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease'
                  }}
                >
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: isCompleted ? '#000' : 'transparent',
                    transition: 'background-color 0.4s ease'
                  }} />
                </div>

                <div style={{
                  background: 'var(--color-surface-card)',
                  border: isCompleted ? `1px solid #ffffff` : '1px solid var(--color-hairline)',
                  borderRadius: '0px', // Cards: 0px border-radius
                  padding: '20px',
                  boxShadow: isCompleted ? `0 4px 16px rgba(0,0,0,0.3), 0 0 12px rgba(255,255,255,0.04)` : 'none',
                  transition: 'border-color 0.4s ease, box-shadow 0.4s ease, background-color 0.4s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px',
                      textTransform: 'uppercase', color: isCompleted ? '#ffffff' : 'var(--color-muted)'
                    }}>
                      {step.subtitle}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700,
                      color: isCompleted ? '#ffffff' : 'var(--color-muted-soft)'
                    }}>
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-wrap-balance" style={{
                    fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700,
                    letterSpacing: '1px', textTransform: 'uppercase', color: '#fff',
                    marginBottom: '10px'
                  }}>
                    {step.title}
                  </h3>

                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--color-body)',
                    lineHeight: 1.6, margin: 0
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 20px', opacity: 0.6 }} />

      {/* ═══════════════ GALLERY SECTION ═══════════════ */}
      <section id="gallery-mobile" ref={el => sectionsRef.current[5] = el} style={{
        padding: '60px 20px',
        background: 'radial-gradient(circle at 90% 10%, rgba(255,255,255,0.02) 0%, transparent 60%)'
      }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <span style={{ 
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', 
            letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px' 
          }}>
            OUR WORK
          </span>
          <h2 className="text-wrap-balance" style={{ 
            fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, 
            letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0 
          }}>
            Gallery
          </h2>
        </div>

        <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {GALLERY_ITEMS.map((item) => (
            <div 
              key={item.slug} 
              className="gallery-card"
              onClick={() => navigate(`/gallery/${item.slug}`)}
              style={{ 
                position: 'relative', overflow: 'hidden', background: '#0a0a0a', 
                height: '140px', border: '1px solid var(--color-hairline)', borderRadius: '0px',
                cursor: 'pointer'
              }}
            >
              <img 
                src={item.image} 
                alt={item.label} 
                loading="lazy" 
                width="160" // Explicit dimensions to prevent CLS
                height="140"
                style={{ 
                  position: 'absolute', inset: 0, width: '100%', height: '100%', 
                  objectFit: 'cover', objectPosition: 'center', display: 'block'
                }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 70%)', zIndex: 1 }} />
              
              <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 2 }}>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', fontSize: '7px', letterSpacing: '1px', 
                  textTransform: 'uppercase', color: '#ffffff', background: 'rgba(255,255,255,0.08)', 
                  border: `1px solid rgba(255,255,255,0.15)`, padding: '2px 5px', borderRadius: '9999px' // small badge pill
                }}>
                  {item.tag}
                </span>
              </div>
              
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', zIndex: 2 }}>
                <span style={{ 
                  fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 600, 
                  letterSpacing: '1px', textTransform: 'uppercase', color: '#fff' 
                }}>
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 20px', opacity: 0.6 }} />

      {/* ═══════════════ CONTACT SECTION ═══════════════ */}
      <section id="contact-mobile" className="section-anchor" ref={el => sectionsRef.current[6] = el} style={{
        padding: '60px 20px',
        background: 'radial-gradient(circle at 10% 90%, rgba(255,255,255,0.02) 0%, transparent 60%)'
      }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <span style={{ 
            fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', 
            textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '8px' 
          }}>
            GET IN TOUCH
          </span>
          <h2 className="text-wrap-balance" style={{ 
            fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, 
            letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0 
          }}>
            Contact Us
          </h2>
        </div>

        <Contact isMobile={true} />
      </section>

      <footer style={{ padding: '40px 20px 20px', textAlign: 'center', borderTop: '1px solid var(--color-hairline)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--color-muted-soft)', margin: 0 }}>
          © 2026 PLAKZO 3D Printing. All Rights Reserved.
        </p>
      </footer>
    </div>
  )
}
