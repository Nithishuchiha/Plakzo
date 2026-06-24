import { CLOUDINARY_BASE, CLOUDINARY_FOLDER } from './cloudinary'
import { GALLERY_ITEMS } from '../data/galleryItems'

const PAD = (n) => String(n).padStart(3, '0')

function buildFrameUrl(framePath, frameNum) {
  return `${CLOUDINARY_BASE}/f_auto,q_auto/${CLOUDINARY_FOLDER}/${framePath}${PAD(frameNum)}.png`
}

/**
 * GalleryPreloader — Singleton that manages preloading of gallery frame sequences.
 *
 * Usage:
 *   GalleryPreloader.preloadGallery('industrial-parts')
 *   GalleryPreloader.isGalleryReady('industrial-parts')
 *   GalleryPreloader.getProgress('industrial-parts')
 */
const GalleryPreloader = {
  _cache: new Map(), // slug -> { loaded: Set, total: number, ready: boolean }

  /**
   * Start preloading frames for a specific gallery.
   * @param {string} slug - Gallery slug (e.g., 'industrial-parts')
   */
  preloadGallery(slug) {
    const item = GALLERY_ITEMS.find(g => g.slug === slug)
    if (!item) return

    if (this._cache.has(slug)) return // Already preloading or done

    const loaded = new Set()
    const total = item.frameCount

    this._cache.set(slug, { loaded, total, ready: false })

    for (let i = 1; i <= total; i++) {
      const img = new Image()
      img.onload = () => {
        loaded.add(i)
        if (loaded.size >= total) {
          const entry = this._cache.get(slug)
          if (entry) entry.ready = true
        }
      }
      img.src = buildFrameUrl(item.frameDir, i)
    }
  },

  /**
   * Check if a gallery's frames are fully loaded.
   * @param {string} slug
   * @returns {boolean}
   */
  isGalleryReady(slug) {
    const entry = this._cache.get(slug)
    return entry?.ready ?? false
  },

  /**
   * Get loading progress for a gallery (0-100).
   * @param {string} slug
   * @returns {number}
   */
  getProgress(slug) {
    const entry = this._cache.get(slug)
    if (!entry) return 0
    return (entry.loaded.size / entry.total) * 100
  },

  /**
   * Preload all galleries in background.
   */
  preloadAll() {
    GALLERY_ITEMS.forEach(item => this.preloadGallery(item.slug))
  },
}

export default GalleryPreloader
