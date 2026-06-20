import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollFrameSequence from './ScrollFrameSequence'

gsap.registerPlugin(ScrollTrigger)

const MATERIALS = [
  // {
  //   name: 'PLA',
  //   fullName: 'Polylactic Acid',
  //   properties: [
  //     { label: 'Eco-Friendly', value: 'Bio-based material' },
  //     { label: 'Print Quality', value: 'Excellent surface finish' },
  //     { label: 'Best For', value: 'Prototypes & Decorative Parts' },
  //     { label: 'Temperature', value: 'Up to 60°C' },
  //   ],
  //   tag: 'Most Common',
  // },
  // {
  //   name: 'ABS',
  //   fullName: 'Acrylonitrile Butadiene Styrene',
  //   properties: [
  //     { label: 'Strength', value: 'High impact resistance' },
  //     { label: 'Heat Resistance', value: 'Up to 100°C' },
  //     { label: 'Best For', value: 'Functional & Industrial Parts' },
  //     { label: 'Finish', value: 'Smooth, machineable' },
  //   ],
  //   tag: 'Industrial',
  // },
  // {
  //   name: 'TPU',
  //   fullName: 'Thermoplastic Polyurethane',
  //   properties: [
  //     { label: 'Flexibility', value: 'Rubber-like elasticity' },
  //     { label: 'Impact', value: 'Highly resistant' },
  //     { label: 'Best For', value: 'Flexible Applications' },
  //     { label: 'Feel', value: 'Soft-touch surface' },
  //   ],
  //   tag: 'Flexible',
  // },
]

export default function Materials() {
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <ScrollFrameSequence
      frameStart={97}
      frameEnd={141}
      scrollTriggerId="materials"
      spacerHeight="200vh"
      id="materials"
    >
      {/* Dark overlay for text readability */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Section content overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(24px, 5vw, 80px)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1280px' }}>

          {/* Materials grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1px',
            border: '1px solid var(--color-hairline)',
          }}>
            {MATERIALS.map((mat, i) => (
              <div
                key={mat.name}
                ref={el => cardsRef.current[i] = el}
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  padding: '48px 36px',
                  borderRight: '1px solid var(--color-hairline)',
                }}
              >
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="text-display-xl" style={{ fontSize: 'clamp(48px, 8vw, 72px)', color: 'var(--color-ink)', opacity: 0.08, letterSpacing: '6px', lineHeight: 1 }}>
                    {mat.name}
                  </h3>
                </div>
                <div style={{ marginBottom: '32px' }}>
                  <span className="text-display-sm" style={{ fontSize: '22px' }}>{mat.name}</span>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-muted)', fontStyle: 'italic', marginTop: '4px' }}>
                    {mat.fullName}
                  </p>
                  <span className="text-caption" style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    fontSize: '9px',
                    padding: '4px 10px',
                    border: '1px solid var(--color-hairline-strong)',
                    color: 'var(--color-muted-soft)',
                  }}>
                    {mat.tag}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {mat.properties.map((prop) => (
                    <div key={prop.label} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      padding: '16px 0',
                      borderTop: '1px solid var(--color-hairline)',
                      gap: '16px',
                    }}>
                      <span className="text-caption" style={{ fontSize: '10px', color: 'var(--color-muted-soft)', flexShrink: 0 }}>
                        {prop.label}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        color: 'var(--color-body)',
                        textAlign: 'right',
                        fontStyle: 'italic',
                      }}>
                        {prop.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </ScrollFrameSequence>
  )
}
