import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TargetCursor from './TargetCursor'

gsap.registerPlugin(ScrollTrigger)

const BG_FRAME = '/images/Entire_website_scrollable_animation/ezgif-frame-188.png'

/* ── Gallery data — now with real images ──────────────────── */
const GALLERY_ITEMS = [
  {
    id: 1,
    label: 'Industrial Parts',
    caption: 'Custom mechanical components',
    category: 'industrial',
    tag: 'Industrial',
    image: '/images/gallery_industrial_parts.png',
    desc: 'Precision-engineered plastic components for industrial applications, manufactured using high-resolution FDM printing.',
    size: 'large',
    accent: '#c3d9f3',
  },
  {
    id: 2,
    label: 'Photo Lamps',
    caption: 'Personalized lighting gifts',
    category: 'gifts',
    tag: 'Gift',
    image: '/images/gallery_photo_lamp.png',
    desc: 'Transform photographs into glowing 3D-printed light sculptures. Ideal for birthdays, anniversaries, and home décor.',
    size: 'medium',
    accent: '#f9c98e',
  },
  {
    id: 3,
    label: 'Keychains',
    caption: 'Custom logo keychains',
    category: 'gifts',
    tag: 'Gift',
    image: '/images/gallery_keychains.png',
    desc: 'Logo-accurate keychains in PLA or TPU with sub-millimeter detail, printed at scale for branding or personal use.',
    size: 
              color: 'var(--color-muted-soft)',
              whiteSpace: 'nowrap',
            }}>
              PLAKZO — Precision 3D Printing
            </span>
            <span style={{ flex: 1, height: '1px', background: 'var(--color-hairline)' }} />
          </div>

        </div>
      </div>

      {/* Gallery CSS */}
      <style>{`
        /* ── Bento grid layout ── */
        .gallery-bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: 260px;
          gap: 8px;
        }

        .gallery-cell { min-height: 0; }
        .gallery-cell[data-size="large"]  { grid-row: span 2; }
        .gallery-cell[data-size="medium"] { grid-row: span 1; }
        .gallery-cell[data-size="small"]  { grid-row: span 1; }
        .gallery-cell > div { width: 100%; height: 100%; }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .bento-card img { transition: none !important; }
          .bento-card { transition: none !important; }
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .gallery-bento {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 220px;
            gap: 6px;
          }
        }

        @media (max-width: 560px) {
          .gallery-bento {
            grid-template-columns: 1fr;
            grid-auto-rows: 260px;
            gap: 6px;
          }
          .gallery-cell[data-size="large"],
          .gallery-cell[data-size="medium"],
          .gallery-cell[data-size="small"] { grid-row: span 1; }
        }
      `}</style>

    </section>
  )
}
