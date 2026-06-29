import { useEffect, useLayoutEffect, useRef, useCallback, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CLOUDINARY_BASE, CLOUDINARY_FOLDER } from '../lib/cloudinary'

gsap.registerPlugin(ScrollTrigger)

const PAD = (n) => String(n).padStart(3, '0')

function buildFrameUrl(framePath, frameNum, isLocal = false, localBase = '') {
  const pad = String(frameNum).padStart(3, '0')
  if (isLocal) {
    return `/${localBase}ezgif-frame-${pad}.png`
  }
  return `${CLOUDINARY_BASE}/f_auto,q_auto/${CLOUDINARY_FOLDER}/${framePath}${pad}.png`
}

/**
 * ScrollFrameSequence — Reusable scroll-linked frame animation.
 *
 * Props:
 *   frameStart      {number}  First frame number (1-based)
 *   frameEnd        {number}  Last frame number (1-based, inclusive)
 *   scrollTriggerId {string}  Unique ID for this section's ScrollTrigger
 *   scrollTrigger   {object}  ScrollTrigger config overrides (trigger, start, end, pin, etc.)
 *   spacerHeight    {string}  CSS height for the scroll spacer (default '200vh')
 *   children        {node|fn} Overlay content, or (progress) => node render prop
 *   onProgress      {fn}      Callback with normalized progress (0–1) per scroll tick
 *   onFrameChange   {fn}      Callback with current frame number on each frame swap
 *   className       {string}  Optional wrapper class
 *   style           {object}  Optional wrapper style overrides
 *   localFrames     {boolean} If true, load frames from local src path instead of Cloudinary
 *   localFramesBase {string}  Base path for local frames (e.g., 'product2_lamp_frames/')
 */
export default function ScrollFrameSequence({
  frameStart = 1,
  frameEnd = 40,
  framePath = 'main-scroll/ezgif-frame-',
  scrollTriggerId = 'frame-seq',
  scrollTrigger: stConfig = {},
  spacerHeight = '200vh',
  children,
  onProgress,
  onFrameChange,
  frameOverride = null,
  className,
  style,
  localFrames = false,
  localFramesBase = '',
}) {
  const wrapperRef  = useRef(null)
  const imgRef      = useRef(null)
  const stRef       = useRef(null)
  const rafRef      = useRef(null)
  const preloadCache = useRef(new Set())

  const totalFrames = frameEnd - frameStart + 1
  const [progress, setProgress] = useState(0)
  const [currentFrame, setCurrentFrame] = useState(frameStart)

  const preloadFrames = useCallback(() => {
    for (let i = frameStart; i <= frameEnd; i++) {
      if (preloadCache.current.has(i)) continue
      const img = new Image()
      img.src = buildFrameUrl(framePath, i, localFrames, localFramesBase)
      preloadCache.current.add(i)
    }
  }, [frameStart, frameEnd, framePath, localFrames, localFramesBase])

  const unloadFrames = useCallback(() => {
    preloadCache.current.clear()
  }, [])

  const setFrame = useCallback((frame) => {
    if (!imgRef.current) return
    const clamped = Math.max(frameStart, Math.min(frameEnd, frame))
    imgRef.current.src = buildFrameUrl(framePath, clamped, localFrames, localFramesBase)
    setCurrentFrame(clamped)
  }, [frameStart, frameEnd, framePath, localFrames, localFramesBase])

  // Throttled scroll handler
  const onScroll = useCallback(() => {
    if (!wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    const h = wrapperRef.current.offsetHeight - window.innerHeight
    const p = Math.min(Math.max(-rect.top / h, 0), 1)
    setProgress(p)
    onProgress?.(p)
  }, [onProgress])

  // Animation tick: map progress → frame
  const tick = useCallback(() => {
    const frame = Math.round(frameStart + progress * (totalFrames - 1))
    setFrame(frameOverride ?? frame)
    onFrameChange?.(frameOverride ?? frame)
  }, [progress, frameStart, totalFrames, setFrame, frameOverride, onFrameChange])

  // Force first frame immediately — before any scroll event fires or browser paints.
  // This prevents the glitch where a stale scroll position briefly renders the last frame.
  useLayoutEffect(() => {
    if (imgRef.current) {
      imgRef.current.src = buildFrameUrl(framePath, frameStart, localFrames, localFramesBase)
    }
  }, [frameStart, framePath, localFrames, localFramesBase])

  useEffect(() => {
    tick()
  }, [progress, frameOverride, tick])

  useEffect(() => {
    if (!wrapperRef.current) return

    preloadFrames()

    stRef.current = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onLeave: () => unloadFrames(),
      onLeaveBack: () => unloadFrames(),
      onEnter: () => preloadFrames(),
      onEnterBack: () => preloadFrames(),
      ...stConfig,
    })

    window.addEventListener('scroll', onScroll, { passive: true })
    tick()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      stRef.current?.kill()
      stRef.current = null
    }
  }, [frameStart, frameEnd, totalFrames, setFrame, preloadFrames, unloadFrames, onProgress, stConfig])

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: 'relative', background: '#000', ...style }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Frame image */}
        <img
          ref={imgRef}
          src={buildFrameUrl(framePath, currentFrame, localFrames, localFramesBase)}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />

        {/* Overlay content */}
        {typeof children === 'function'
          ? children(progress, currentFrame)
          : children}
      </div>

      {/* Scroll spacer */}
      <div style={{ height: spacerHeight }} />
    </div>
  )
}
