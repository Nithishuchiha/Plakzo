import { useLayoutEffect, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getGalleryItem } from '../data/galleryItems'
import { cloudinaryUrl } from '../lib/cloudinary'
import ScrollFrameSequence from '../components/ScrollFrameSequence'
import GalleryPreloader from '../lib/galleryPreloader'

const fadeIn = (p, start, end) => {
  if (p < start) return 0
  if (p > end) return 0
  const half = (end - start) / 2
  const mid = start + half
  if (p < mid) return (p - start) / half
  return (end - p) / half
}

const fadeInHold = (p, start, end) => {
  if (p < start) return 0
  if (p > end) return 1
  const half = (end - start) / 2
  const mid = start + half
  if (p < mid) return (p - start) / half
  return 1
}

const ITEM_DATA = {
  'industrial-parts': {
    specs: [
      { label: 'Material', value: 'PLA / ABS / TPU' },
      { label: 'Technology', value: 'FDM Printing' },
      { label: 'Tolerance', value: '±0.1mm' },
      { label: 'Turnaround', value: '1–3 Days' },
    ],
    features: [
      { num: '01', text: 'High-resolution layer detail for precision fits' },
      { num: '02', text: 'Industrial-grade durability and strength' },
      { num: '03', text: 'Custom geometry — no tooling required' },
      { num: '04', text: 'Scalable from single units to batches' },
    ],
  },
  'photo-lamps': {
    specs: [
      { label: 'Material', value: 'Translucent PLA' },
      { label: 'Light Source', value: 'LED Base' },
      { label: 'Sizes', value: '15cm / 20cm / 25cm' },
      { label: 'Turnaround', value: '2–4 Days' },
    ],
    features: [
      { num: '01', text: 'Upload any photo for a one-of-a-kind lamp' },
      { num: '02', text: 'Warm LED glow with dimmable base' },
      { num: '03', text: 'Perfect for birthdays and anniversaries' },
      { num: '04', text: 'Plug-and-play USB powered' },
    ],
  },
  'lamp-frames-v2': {
    specs: [
      { label: 'Material', value: 'Translucent PLA' },
      { label: 'Light Source', value: 'LED Base' },
      { label: 'Sizes', value: '15cm / 20cm / 25cm' },
      { label: 'Turnaround', value: '2–4 Days' },
    ],
    features: [
      { num: '01', text: 'Clean geometric lines for modern spaces' },
      { num: '02', text: 'Matte finish with soft light diffusion' },
      { num: '03', text: 'Versatile design for any room' },
      { num: '04', text: 'Snap-fit assembly, ready in minutes' },
    ],
  },
  'keychains': {
    specs: [
      { label: 'Material', value: 'PLA / TPU' },
      { label: 'Size', value: '5–8cm' },
      { label: 'Detail', value: 'Sub-millimeter' },
      { label: 'Turnaround', value: '1–2 Days' },
    ],
    features: [
      { num: '01', text: 'Logo-accurate with fine text detail' },
      { num: '02', text: 'Flexible TPU option available' },
      { num: '03', text: 'Bulk orders for brands and events' },
      { num: '04', text: 'Keyring hardware included' },
    ],
  },
  'cad-design': {
    specs: [
      { label: 'Software', value: 'SolidWorks' },
      { label: 'Export', value: 'STEP / STL / OBJ' },
      { label: 'Iterations', value: 'Unlimited revisions' },
      { label: 'Turnaround', value: '3–5 Days' },
    ],
    features: [
      { num: '01', text: 'Parametric models ready for production' },
      { num: '02', text: 'Engineering drawings and tolerances' },
      { num: '03', text: 'File formats compatible with any slicer' },
      { num: '04', text: 'From concept sketch to 3D model' },
    ],
  },
  'bottle-caps': {
    specs: [
      { label: 'Material', value: 'PLA / Food-safe' },
      { label: 'Sizes', value: 'Standard / Custom' },
      { label: 'Design', value: 'Logo, text, shapes' },
      { label: 'Turnaround', value: '1–3 Days' },
    ],
    features: [
      { num: '01', text: 'Custom logos and branding on every cap' },
      { num: '02', text: 'Unique shapes beyond standard rounds' },
      { num: '03', text: 'Event favors and promotional runs' },
      { num: '04', text: 'Snug fit for standard bottle necks' },
    ],
  },
  'prototypes': {
    specs: [
      { label: 'Material', value: 'Multi-Material' },
      { label: 'Resolution', value: 'High-detail FDM' },
      { label: 'Iteration', value: 'Rapid cycle' },
      { label: 'Turnaround', value: '2–4 Days' },
    ],
    features: [
      { num: '01', text: 'Concept to physical model in days' },
      { num: '02', text: 'Test fit, form, and function early' },
      { num: '03', text: 'Iterate fast with low per-unit cost' },
      { num: '04', text: 'Multi-part assemblies supported' },
    ],
  },
}

// Labels shown inside each variant card in the switcher
const VARIANT_LABELS = {
  'photo-lamps':    { short: 'LumiPhoto', sub: 'Photo-Custom' },
  'lamp-frames-v2': { short: 'Classic',   sub: 'Timeless Design'  },
}

const linkStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: 'var(--color-muted)',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid var(--color-hairline)',
  backdropFilter: 'blur(12px)',
  transition: 'color 0.25s ease, border-color 0.25s ease',
}

function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: 'var(--color-canvas)', gap: '24px',
    }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--color-ink)', letterSpacing: '4px' }}>404</h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-muted)' }}>Gallery item not found.</p>
      <Link to="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-link)', textDecoration: 'none', padding: '12px 24px', border: '1px solid var(--color-hairline)' }}>
        Back to Home
      </Link>
    </div>
  )
}

export default function GalleryPage() {
  const { slug } = useParams()

  // The root item for the current URL
  const baseItem = getGalleryItem(slug)

  const [isLoading, setIsLoading] = useState(true)
  const [selectedVariantSlug, setSelectedVariantSlug] = useState(slug)

  // Variant switching: available when the root item defines lampVariants
  const hasVariants = !!(baseItem?.lampVariants && baseItem.lampVariants.length > 1)
  const variantSlugs = hasVariants ? baseItem.lampVariants : null

  // The item whose frame animation is currently displayed
  const activeItem = hasVariants
    ? (getGalleryItem(selectedVariantSlug) || baseItem)
    : baseItem
  const item = activeItem || baseItem

  // Reset scroll and variant selection when the URL changes
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setSelectedVariantSlug(slug)
  }, [slug])

  // Show loading screen whenever the active variant changes
  useEffect(() => {
    setIsLoading(true)
  }, [selectedVariantSlug])

  // Preload frames for the active item; clear loading state when ready
  useEffect(() => {
    if (!item) return

    // Show the page immediately — ScrollFrameSequence handles its own
    // progressive preloading.  A short delay lets the first frame render
    // before we fade in, avoiding a white flash.
    const timer = setTimeout(() => setIsLoading(false), 300)

    GalleryPreloader.preloadGallery(item.slug)

    return () => clearTimeout(timer)
  }, [item])

  const handleVariantSwitch = (variantSlug) => {
    if (variantSlug === selectedVariantSlug) return
    // Reset scroll so the new animation starts from frame 1
    window.scrollTo({ top: 0, behavior: 'instant' })
    setSelectedVariantSlug(variantSlug)
  }

  if (!item) return <NotFound />

  const itemData = ITEM_DATA[item.slug] || ITEM_DATA['photo-lamps'] || ITEM_DATA['industrial-parts']

  // Offset bottom UI (no longer needs variant switcher offset as it is right-centered)
  const VARIANT_PANEL_HEIGHT = '48px'

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .lamp-variant-thumb { transition: transform 0.4s cubic-bezier(0.23,1,0.32,1); }
        .lamp-variant-card:hover .lamp-variant-thumb { transform: scale(1.07); }
      `}</style>

      {/* ─── Loading overlay ─── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0a',
        opacity: isLoading ? 1 : 0,
        pointerEvents: isLoading ? 'auto' : 'none',
        transition: 'opacity 0.45s ease',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 48px)',
          fontWeight: 700, letterSpacing: '8px', textTransform: 'uppercase',
          color: '#fff', marginBottom: '32px',
        }}>
          PLAKZO
        </div>
        <div style={{
          width: '32px', height: '32px',
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#f9c98e', borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        {hasVariants && (
          <div style={{
            marginTop: '20px', fontFamily: 'var(--font-mono)',
            fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
          }}>
            {item.label}
          </div>
        )}
      </div>

      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.4s ease' }}>
        <ScrollFrameSequence
          key={`${slug}-${selectedVariantSlug}`}
          framePath={item.frameDir}
          frameEnd={item.frameCount}
          spacerHeight="400vh"
          style={{ background: '#000' }}
          localFrames={false}
          localFramesBase=""
        >
          {(progress) => {
            const titleOp   = Math.max(0, 1 - progress * 3.5)
            const specsOp   = fadeIn(progress, 0.12, 0.55)
            const featOp    = fadeInHold(progress, 0.38, 0.58)
            const counterOp = Math.max(0, 1 - progress * 2.5)

            const switcherOp = progress < 0.12
              ? Math.max(0, 1 - (progress / 0.12))
              : progress > 0.88
                ? Math.max(0, (progress - 0.88) / 0.12)
                : 0

            const switcherPtEvents = switcherOp > 0.05 ? 'auto' : 'none'

            return (
              <>
                {/* Back to Gallery — top left */}
                <Link
                  to="/?scrollTo=gallery"
                  style={{ ...linkStyle, position: 'absolute', top: '32px', left: '32px', zIndex: 10 }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-ink)'; e.currentTarget.style.borderColor = 'var(--color-muted)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.borderColor = 'var(--color-hairline)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Gallery
                </Link>

                {/* PLAKZO wordmark — top right */}
                <div style={{
                  position: 'absolute', top: '32px', right: '32px', zIndex: 10,
                  fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
                  letterSpacing: '6px', textTransform: 'uppercase', color: 'var(--color-muted-soft)',
                }}>
                  PLAKZO
                </div>

                {/* ─── Title + Description — bottom left ─── */}
                <div style={{
                  position: 'absolute', bottom: VARIANT_PANEL_HEIGHT, left: '98px', zIndex: 10,
                  opacity: titleOp, transform: `translateY(${(1 - titleOp) * 30}px)`,
                  transition: 'opacity 0.08s linear, transform 0.08s linear',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px',
                    textTransform: 'uppercase', display: 'inline-block', padding: '4px 10px',
                    border: '1px solid', color: item.accent, borderColor: item.accent + '44',
                    background: item.accent + '10', marginBottom: '16px',
                  }}>
                    {item.tag}
                  </span>
                  <h1 style={{
                    fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 6vw, 72px)',
                    fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase',
                    color: 'var(--color-ink)', lineHeight: 1.1, marginBottom: '16px',
                  }}>
                    {/* Show variant-specific name inside the gallery page */}
                    {hasVariants ? (VARIANT_LABELS[item.slug]?.short || item.label) : item.label}
                  </h1>
                  <p style={{
                    fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.5vw, 18px)',
                    color: 'var(--color-muted)', maxWidth: '480px', lineHeight: 1.6,
                  }}>
                    {item.description}
                  </p>
                </div>

                {/* ─── Specs Panel — top right ─── */}
                <div style={{
                  position: 'absolute', top: '100px', right: '48px', zIndex: 10,
                  opacity: specsOp, transform: `translateX(${(1 - specsOp) * 25}px)`,
                  transition: 'opacity 0.08s linear, transform 0.08s linear',
                  width: 'clamp(180px, 16vw, 220px)',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: item.accent, marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid ' + item.accent + '33' }}>
                    Specifications
                  </div>
                  {itemData.specs.map(spec => (
                    <div key={spec.label} style={{ marginBottom: '14px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-muted-soft)', marginBottom: '3px' }}>
                        {spec.label}
                      </div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-ink)' }}>
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ─── Features Panel — bottom left ─── */}
                <div style={{
                  position: 'absolute', bottom: VARIANT_PANEL_HEIGHT, left: '98px', zIndex: 10,
                  opacity: featOp, transform: `translateX(${(1 - featOp) * -20}px)`,
                  transition: 'opacity 0.08s linear, transform 0.08s linear',
                  width: 'clamp(180px, 16vw, 220px)',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: item.accent, marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid ' + item.accent + '33' }}>
                    Key Features
                  </div>
                  {itemData.features.map(feat => (
                    <div key={feat.num} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: item.accent, flexShrink: 0, marginTop: '2px' }}>
                        {feat.num}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--color-body)', lineHeight: 1.5 }}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Frame counter — bottom center (only for non-variant pages) */}
                {!hasVariants && (
                  <div style={{
                    position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 10, opacity: counterOp,
                    transition: 'opacity 0.08s linear',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px',
                      color: 'var(--color-muted-soft)',
                    }}>
                      {Math.round(progress * (item.frameCount - 1)) + 1} / {item.frameCount}
                    </span>
                    <div style={{
                      width: '40px', height: '2px', background: 'var(--color-hairline)',
                      borderRadius: '1px', overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', width: (progress * 100) + '%',
                        background: item.accent, borderRadius: '1px',
                        transition: 'width 0.06s linear',
                      }} />
                    </div>
                  </div>
                )}
                {/* ─── Variant Switcher — fixed right center, visible only for lamp pages ─── */}
                {hasVariants && (
                  <div style={{
                    position: 'fixed',
                    top: '50%',
                    right: '32px',
                    bottom: 'auto',
                    left: 'auto',
                    transform: `translate(${(1 - switcherOp) * 20}px, -50%)`,
                    opacity: switcherOp,
                    pointerEvents: switcherPtEvents,
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}>
                    {/* "Select Model" label */}
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
                    }}>
                      Select Model
                    </div>

                    {/* Card tray */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      padding: '14px 12px',
                      background: 'rgba(8,8,8,0.90)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '16px',
                      boxShadow: '0 12px 48px rgba(0,0,0,0.75), inset 0 0 0 0.5px rgba(255,255,255,0.04)',
                    }}>
                      {variantSlugs.map((variantSlug) => {
                        const variant = getGalleryItem(variantSlug)
                        if (!variant) return null
                        const isActive = selectedVariantSlug === variantSlug
                        const lbl = VARIANT_LABELS[variantSlug] || { short: variant.label, sub: '' }

                        return (
                          <div
                            key={variantSlug}
                            className="lamp-variant-card"
                            onClick={() => handleVariantSwitch(variantSlug)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              padding: '10px',
                              borderRadius: '10px',
                              width: '116px',
                              cursor: 'pointer',
                              border: isActive
                                ? `1px solid ${item.accent}99`
                                : '1px solid rgba(255,255,255,0.06)',
                              background: isActive
                                ? `linear-gradient(135deg, ${item.accent}14 0%, ${item.accent}06 100%)`
                                : 'rgba(255,255,255,0.025)',
                              boxShadow: isActive
                                ? `0 0 24px ${item.accent}20, 0 4px 16px rgba(0,0,0,0.4)`
                                : '0 2px 8px rgba(0,0,0,0.25)',
                              opacity: isActive ? 1 : 0.6,
                              transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
                            }}
                          >
                            {/* Thumbnail */}
                            <div style={{
                              width: '100%', height: '68px',
                              borderRadius: '6px', overflow: 'hidden',
                              position: 'relative', background: '#111',
                            }}>
                              <img
                                className="lamp-variant-thumb"
                                src={variantSlug === 'photo-lamps'
                                  ? cloudinaryUrl('frames/photo-lamps/ezgif-frame-001.png')
                                  : variant.image}
                                alt={variant.label}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                              {/* Active glow dot */}
                              {isActive && (
                                <div style={{
                                  position: 'absolute', top: '6px', right: '6px',
                                  width: '7px', height: '7px', borderRadius: '50%',
                                  background: item.accent,
                                  boxShadow: `0 0 8px ${item.accent}cc`,
                                }} />
                              )}
                            </div>

                            {/* Label */}
                            <div>
                              <div style={{
                                fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700,
                                letterSpacing: '1px', textTransform: 'uppercase',
                                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                                marginBottom: '2px',
                                transition: 'color 0.3s ease',
                              }}>
                                {lbl.short}
                              </div>
                              <div style={{
                                fontFamily: 'var(--font-mono)', fontSize: '8px',
                                letterSpacing: '1px', textTransform: 'uppercase',
                                color: isActive ? item.accent : 'rgba(255,255,255,0.22)',
                                transition: 'color 0.3s ease',
                              }}>
                                {lbl.sub}
                              </div>
                            </div>


                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )
          }}
        </ScrollFrameSequence>
      </div>
    </>
  )
}
