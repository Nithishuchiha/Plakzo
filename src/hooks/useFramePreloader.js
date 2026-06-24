import { useState, useEffect, useRef, useCallback } from 'react'
import { CLOUDINARY_BASE, CLOUDINARY_FOLDER } from '../lib/cloudinary'

const PAD = (n) => String(n).padStart(3, '0')

function buildFrameUrl(framePath, frameNum) {
  return `${CLOUDINARY_BASE}/f_auto,q_auto/${CLOUDINARY_FOLDER}/${framePath}${PAD(frameNum)}.png`
}

/**
 * useFramePreloader — Preloads frame images and reports progress.
 *
 * @param {string} framePath - Base path for frames (e.g., 'main-scroll/ezgif-frame-')
 * @param {number} frameStart - First frame number (1-based)
 * @param {number} frameEnd - Last frame number (1-based, inclusive)
 * @param {number} targetCount - How many frames to preload before isReady=true (default: all)
 * @returns {{ progress: number, isReady: boolean, preloadAll: () => void }}
 */
export default function useFramePreloader(framePath, frameStart, frameEnd, targetCount = null) {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const loadedRef = useRef(new Set())
  const allPreloadedRef = useRef(false)
  const target = targetCount ?? (frameEnd - frameStart + 1)

  const preloadRange = useCallback((start, end, onEach) => {
    for (let i = start; i <= end; i++) {
      if (loadedRef.current.has(i)) continue
      const img = new Image()
      img.onload = () => {
        loadedRef.current.add(i)
        onEach?.(loadedRef.current.size)
      }
      img.src = buildFrameUrl(framePath, i)
    }
  }, [framePath])

  // Preload target frames on mount
  useEffect(() => {
    const totalFrames = frameEnd - frameStart + 1
    const effectiveTarget = Math.min(target, totalFrames)

    preloadRange(frameStart, frameStart + effectiveTarget - 1, (loaded) => {
      const pct = (loaded / effectiveTarget) * 100
      setProgress(pct)
      if (loaded >= effectiveTarget) {
        setIsReady(true)
      }
    })
  }, [frameStart, frameEnd, target, preloadRange])

  // Preload remaining frames in background
  const preloadAll = useCallback(() => {
    if (allPreloadedRef.current) return
    allPreloadedRef.current = true

    const totalFrames = frameEnd - frameStart + 1
    const effectiveTarget = Math.min(target, totalFrames)

    preloadRange(frameStart + effectiveTarget, frameEnd, () => {
      // Remaining frames loading — no progress update needed
    })
  }, [frameStart, frameEnd, target, preloadRange])

  return { progress, isReady, preloadAll }
}
