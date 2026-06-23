import { useLayoutEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getGalleryItem } from '../data/galleryItems'
import ScrollFrameSequence from '../components/ScrollFrameSequence'

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
      { num: '01', text: 'Photo-to-3D conversion from any image' },
      { num: '02', text: 'Warm LED glow with dimmable base' },
      { num: '03', text: 'Perfect for birthdays and anniversaries' },
      { num: '04', text: 'Plug-and-play USB powered' },
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
  const item = getGalleryItem(slug)

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  if (!item) return <NotFound />

  const itemData = ITEM_DATA[item.slug] || ITEM_DATA['industrial-parts']

  return (
    <ScrollFrameSequence
      framePath={item.frameDir}
      frameEnd={item.frameCount}
      spacerHeight="400vh"
      style={{ background: '#000' }}
    >
      {(progress) => {
        const titleOp   = Math.max(0, 1 - progress * 3.5)
        const specsOp   = fadeIn(progress, 0.12, 0.55)
        const featOp    = fadeInHold(progress, 0.38, 0.58)
        const counterOp = Math.max(0, 1 - progress * 2.5)

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
              position: 'absolute', bottom: '48px', left: '98px', zIndex: 10,
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
                {item.label}
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
              position: 'absolute', bottom: '48px', left: '98px', zIndex: 10,
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

            {/* Frame counter — bottom center */}
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
          </>
        )
      }}
    </ScrollFrameSequence>
  )
}
