import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CLOUDINARY_BASE, CLOUDINARY_FOLDER } from '../lib/cloudinary'

gsap.registerPlugin(ScrollTrigger)

const FRAME_START = 181
const FRAME_END = 185
const FRAME_PATH = `${CLOUDINARY_BASE}/f_auto,q_auto/${CLOUDINARY_FOLDER}/main-scroll/ezgif-frame-`
const PAD = (n) => String(n).padStart(3, '0')

/* ─── Icons per step ─── */
const STEP_ICONS = {
  Concept: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <circle cx="24" cy="20" r="10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 30v2a4 4 0 0 0 8 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 10V7M14.1 14.1l-2.1-2.1M10 20H7M14.1 25.9l-2.1 2.1M33.9 14.1l2.1-2.1M38 20h-3M33.9 25.9l2.1 2.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Design: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <rect x="8" y="8" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 16h32M16 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 26l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '3D Printing': (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
      <path 
                boxShadow: '0 0 10px rgba(195,217,243,0.5)',
                transition: 'width 0.05s linear',
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              marginTop: '16px',
            }}
          >
            {STEPS.map((step, i) => (
              <div
                key={`label-${step.number}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  paddingLeft: '4px',
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: i <= activeStep ? step.color : 'var(--color-hairline-strong)',
                    transition: 'background 0.4s ease',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: i <= activeStep ? step.color : 'var(--color-muted-soft)',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
