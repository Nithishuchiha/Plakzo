import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Plasma from './Plasma'
import LoadingScreen from './LoadingScreen'
import Navbar from './Navbar'
import ChromaGrid from './ChromaGrid'
import Contact from './Contact'
import { cloudinaryUrl } from '../lib/cloudinary'
import { GALLERY_ITEMS } from '../data/galleryItems'

gsap.registerPlugin(ScrollTrigger)

// ─── Constants (duplicated — zero touch to mobile/desktop) ─────────
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

// ─── ServiceCard (duplicated — zero touch to mobile) ──────────────
function TabletServiceCard({ service, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? 'rgba(255,255,255,0.04)' : 'var(--color-surface-card)',
        border: isActive ? '1.5px solid #ffffff' : '1.5px solid var(--color-hairline)',
        borderRadius: '0px',
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
        background: isActive
          ? 'linear-gradient(to right, #ffffff, transparent)'
          : 'linear-gradient(to right, var(--color-hairline-strong), transparent)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700,
            color: isActive ? '#ffffff' : 'var(--color-muted-soft)',
            transition: 'color 0.3s ease',
          }}>
            {service.number}
          </span>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700,
            letterSpacing: '1px', textTransform: 'uppercase',
            color: isActive ? '#ffffff' : 'var(--color-ink)', margin: 0,
            transition: 'color 0.3s ease',
          }}>
            {service.title}
          </h3>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '11px',
          color: isActive ? '#ffffff' : 'var(--color-muted)',
          transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease, color 0.3s ease',
        }}>
          +
        </span>
      </div>

      <div style={{
        maxHeight: isActive ? '200px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-body)',
          lineHeight: 1.6, margin: '12px 0',
        }}>
          {service.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {service.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
              textTransform: 'uppercase', color: 'var(--color-muted)',
              border: '1px solid var(--color-hairline)', padding: '4px 10px',
              borderRadius: '9999px',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Tablet Component ─────────────────────────────────────────
export default function ShowcaseTablet() {
  const navigate = useNavigate()
  const [loadProgress, setLoadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeService, setActiveService] = useState(-1)
  const [activeStep, setActiveStep] = useState(-1)

  const containerRef = useRef(null)
  const sectionsRef = useRef([])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Timer-driven loading progress (branded splash)
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(interval)
  }, [])

  // GSAP scroll animations
  useEffect(() => {
    if (isLoading) return
    if (!containerRef.current) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Hero stagger entrance
      gsap.fromTo('.tablet-hero-fade',
        { opacity: 0, y: prefersReduced ? 0 : 30 },
        {
          opacity: 1, y: 0,
          duration: prefersReduced ? 0.01 : 0.8,
          stagger: prefersReduced ? 0 : 0.15,
          ease: 'power3.out',
          delay: 0.25,
        }
      )

      // Section headers
      gsap.utils.toArray('.tablet-section-header').forEach(header => {
        gsap.fromTo(header,
          { opacity: 0, y: prefersReduced ? 0 : 15 },
          {
            opacity: 1, y: 0,
            duration: prefersReduced ? 0.01 : 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 85%',
              toggleActions: 'play none none none',
            }
          }
        )
      })

      // Services staggered entry
      gsap.fromTo('.tablet-service-card',
        { opacity: 0, y: prefersReduced ? 0 : 25 },
        {
          opacity: 1, y: 0,
          duration: prefersReduced ? 0.01 : 0.5,
          stagger: prefersReduced ? 0 : 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#tablet-services-grid',
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )

      // Materials progress bars
      gsap.utils.toArray('.tablet-material-bar').forEach(bar => {
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

      // Gallery cards
      gsap.fromTo('.tablet-gallery-card',
        { opacity: 0, scale: prefersReduced ? 1 : 0.95, y: prefersReduced ? 0 : 20 },
        {
          opacity: 1, scale: 1, y: 0,
          duration: prefersReduced ? 0.01 : 0.6,
          stagger: prefersReduced ? 0 : 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#tablet-gallery-grid',
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      )

      // Contact fade up
      gsap.fromTo('.tablet-contact-fade',
        { opacity: 0, y: prefersReduced ? 0 : 20 },
        {
          opacity: 1, y: 0,
          duration: prefersReduced ? 0.01 : 0.6,
          stagger: prefersReduced ? 0 : 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '#tablet-contact',
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      )

      // Hero image parallax
      if (!prefersReduced) {
        gsap.utils.toArray('.tablet-hero-parallax').forEach(img => {
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
  }, [isLoading])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <LoadingScreen progress={loadProgress} onComplete={() => setIsLoading(false)} />

      <div
        ref={containerRef}
        style={{
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.4s ease',
          background: '#000',
          color: 'var(--color-body)',
          minHeight: '100vh',
          overflowX: 'hidden',
          paddingBottom: '80px',
          position: 'relative',
        }}
      >
        {/* Plasma Background */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Plasma
            color="#ffffff"
            speed={0.4}
            direction="pingpong"
            scale={0.6}
            opacity={0.3}
            mouseInteractive={false}
          />
        </div>

        {/* Desktop Navbar (shows at 768px+ via CSS) */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Navbar />
        </div>

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section
          id="home-tablet"
          ref={el => sectionsRef.current[0] = el}
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '90px 40px 60px',
            minHeight: '80vh',
            background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.03) 0%, transparent 60%)',
            zIndex: 1,
          }}
        >
          {/* Grid pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(var(--color-hairline-strong) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px' }}>
            <div className="tablet-hero-fade" style={{ marginBottom: '24px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 400,
                letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-ink)',
              }}>
                DESIGN • PRINT • DELIVER
              </span>
              <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--color-ink)', marginTop: '10px' }} />
            </div>

            <h1 className="tablet-hero-fade text-wrap-balance" style={{
              fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 700,
              lineHeight: 1.1, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff',
              marginBottom: '20px',
            }}>
              Industrial Plastic<br />
              <span style={{ color: 'var(--color-muted)' }}>Parts &amp;</span> 3D Printing
            </h1>

            <p className="tablet-hero-fade text-wrap-pretty" style={{
              fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-body)',
              maxWidth: '600px', marginBottom: '32px', lineHeight: 1.6,
            }}>
              We design custom plastic components using SolidWorks and manufacture them with precision 3D printing — from concept to your doorstep.
            </p>

            {/* 3-col bento collage */}
            <div className="tablet-hero-fade" style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gridTemplateRows: 'repeat(2, 120px)',
              gap: '10px',
              marginBottom: '36px',
              width: '100%',
            }}>
              {/* Main image — spans 2 rows */}
              <div style={{
                gridRow: '1 / span 2',
                position: 'relative', overflow: 'hidden',
                border: '1px solid var(--color-hairline)', borderRadius: '0px',
              }}>
                <img
                  src={cloudinaryUrl('thumbnails/gallery_cad_design.png')}
                  alt="3D CAD component design process in SolidWorks"
                  width="200" height="240" fetchPriority="high"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="tablet-hero-parallax"
                />
                <div style={{
                  position: 'absolute', bottom: '8px', left: '8px', zIndex: 2,
                  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
                  color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '3px 8px',
                  textTransform: 'uppercase',
                }}>
                  01 • DESIGN
                </div>
              </div>

              {/* Top right */}
              <div style={{
                position: 'relative', overflow: 'hidden',
                border: '1px solid var(--color-hairline)', borderRadius: '0px',
              }}>
                <img
                  src={cloudinaryUrl('thumbnails/gallery_industrial_parts.png')}
                  alt="Finished 3D printed industrial plastic part"
                  width="200" height="120" fetchPriority="high"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="tablet-hero-parallax"
                />
                <div style={{
                  position: 'absolute', bottom: '8px', left: '8px', zIndex: 2,
                  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
                  color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '3px 8px',
                  textTransform: 'uppercase',
                }}>
                  02 • PRINT
                </div>
              </div>

              {/* Bottom right */}
              <div style={{
                position: 'relative', overflow: 'hidden',
                border: '1px solid var(--color-hairline)', borderRadius: '0px',
              }}>
                <img
                  src={cloudinaryUrl('thumbnails/gallery_photo_lamp.png')}
                  alt="Finished personalized 3D printed photo lamp"
                  width="200" height="120" fetchPriority="high"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  className="tablet-hero-parallax"
                />
                <div style={{
                  position: 'absolute', bottom: '8px', left: '8px', zIndex: 2,
                  fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
                  color: '#fff', background: 'rgba(0,0,0,0.7)', padding: '3px 8px',
                  textTransform: 'uppercase',
                }}>
                  03 • DELIVER
                </div>
              </div>
            </div>

            <div className="tablet-hero-fade" style={{ display: 'flex', gap: '16px' }}>
              <a
                href="#tablet-contact"
                onClick={(e) => { e.preventDefault(); scrollToSection('tablet-contact'); }}
                className="btn-brand"
                style={{ padding: '14px 32px', fontSize: '14px' }}
              >
                Get a Quote
              </a>
              <a
                href="#tablet-services"
                onClick={(e) => { e.preventDefault(); scrollToSection('tablet-services'); }}
                className="btn-ghost"
                style={{ padding: '14px 32px', fontSize: '14px', color: '#fff' }}
              >
                Our Services ↓
              </a>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 40px', opacity: 0.6, position: 'relative', zIndex: 1 }} />

        {/* ═══════════════ SERVICES SECTION ═══════════════ */}
        <section
          id="tablet-services"
          ref={el => sectionsRef.current[1] = el}
          style={{
            padding: '70px 40px',
            background: 'radial-gradient(circle at 10% 80%, rgba(255,255,255,0.02) 0%, transparent 60%)',
            position: 'relative', zIndex: 1,
          }}
        >
          <div className="tablet-section-header" style={{ marginBottom: '36px' }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px',
            }}>
              WHAT WE DO
            </span>
            <h2 className="text-wrap-balance" style={{
              fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 600,
              letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
            }}>
              Our Services
            </h2>
          </div>

          <div id="tablet-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {SERVICES.map((service, i) => (
              <div key={service.number} className="tablet-service-card">
                <TabletServiceCard
                  service={service}
                  isActive={activeService === i}
                  onClick={() => setActiveService(activeService === i ? -1 : i)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 40px', opacity: 0.6, position: 'relative', zIndex: 1 }} />

        {/* ═══════════════ MATERIALS SECTION ═══════════════ */}
        <section
          id="tablet-materials"
          ref={el => sectionsRef.current[2] = el}
          style={{
            padding: '70px 40px',
            background: 'radial-gradient(circle at 90% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)',
            position: 'relative', zIndex: 1,
          }}
        >
          <div className="tablet-section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px',
            }}>
              MATERIALS
            </span>
            <h2 className="text-wrap-balance" style={{
              fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', marginBottom: '16px',
            }}>
              Built to Last
            </h2>
            <p className="text-wrap-pretty" style={{
              fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-body)',
              lineHeight: 1.6, margin: '0 auto', maxWidth: '600px',
            }}>
              We work with industrial-grade materials chosen for their strength, precision, and performance in real-world applications.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '700px', margin: '0 auto' }}>
            {materialsData.map(mat => (
              <div
                key={mat.name}
                style={{
                  background: 'var(--color-surface-card)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: '0px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(to right, #ffffff, transparent)',
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700,
                      letterSpacing: '1px', color: '#fff', margin: 0,
                    }}>
                      {mat.name}
                    </h3>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px',
                      textTransform: 'uppercase', color: 'var(--color-body)',
                    }}>
                      {mat.label}
                    </span>
                  </div>
                </div>

                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-body)',
                  lineHeight: 1.6, marginBottom: '24px',
                }}>
                  {mat.desc}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-hairline)', paddingTop: '20px' }}>
                  {[
                    { key: 'STRENGTH', value: mat.properties.strength },
                    { key: 'FLEXIBILITY', value: mat.properties.flex },
                    { key: 'DURABILITY', value: mat.properties.durability }
                  ].map(prop => (
                    <div key={prop.key} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{
                        width: '95px', fontSize: '10px', fontFamily: 'var(--font-mono)',
                        color: 'var(--color-muted-soft)', letterSpacing: '1px',
                      }}>
                        {prop.key}
                      </span>
                      <div style={{ flex: 1, height: '5px', background: 'var(--color-hairline-strong)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div
                          className="tablet-material-bar"
                          data-target={prop.value}
                          style={{ width: '0%', height: '100%', background: '#ffffff', borderRadius: '2px' }}
                        />
                      </div>
                      <span style={{
                        width: '32px', fontSize: '11px', fontFamily: 'var(--font-mono)',
                        color: '#fff', textAlign: 'right',
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
        <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 40px', opacity: 0.6, position: 'relative', zIndex: 1 }} />

        {/* ═══════════════ WHY CHOOSE SECTION ═══════════════ */}
        <section
          id="tablet-why-choose"
          ref={el => sectionsRef.current[3] = el}
          style={{
            padding: '70px 40px',
            background: 'radial-gradient(circle at 10% 30%, rgba(255,255,255,0.02) 0%, transparent 60%)',
            position: 'relative', zIndex: 1,
          }}
        >
          <div className="tablet-section-header" style={{ marginBottom: '36px' }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px',
            }}>
              WHY PLAKZO
            </span>
            <h2 className="text-wrap-balance" style={{
              fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700,
              letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
            }}>
              Why Choose Us
            </h2>
          </div>

          <ChromaGrid columns={3} cardW={200} cardH={150} gap={10} radius={300} damping={0.4} fadeOut={0.5} />
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 40px', opacity: 0.6, position: 'relative', zIndex: 1 }} />

        {/* ═══════════════ JOURNEY SECTION ═══════════════ */}
        <section
          id="tablet-journey"
          ref={el => sectionsRef.current[4] = el}
          style={{
            padding: '70px 40px',
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)',
            position: 'relative', zIndex: 1,
          }}
        >
          <div className="tablet-section-header" style={{ marginBottom: '40px' }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px',
            }}>
              HOW IT WORKS
            </span>
            <h2 className="text-wrap-balance" style={{
              fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', margin: 0,
            }}>
              Our Journey
            </h2>
          </div>

          {/* 2-col alternating timeline */}
          <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
            {/* Center vertical line */}
            <div style={{
              position: 'absolute', left: '50%', top: '20px', bottom: '20px',
              width: '2px', background: 'var(--color-hairline)',
              transform: 'translateX(-50%)',
            }} />
            {/* Animated progress line */}
            <div style={{
              position: 'absolute', left: '50%', top: '20px', bottom: '20px',
              width: '2px', transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, #ffffff, #666666)',
              transformOrigin: 'top center',
              boxShadow: '0 0 8px rgba(255,255,255,0.15)',
            }} />

            {JOURNEY_STEPS.map((step, i) => {
              const isLeft = i % 2 === 0
              const isCompleted = i <= activeStep

              return (
                <div
                  key={step.number}
                  style={{
                    display: 'flex',
                    justifyContent: isLeft ? 'flex-end' : 'flex-start',
                    paddingLeft: isLeft ? 0 : 'calc(50% + 24px)',
                    paddingRight: isLeft ? 'calc(50% + 24px)' : 0,
                    marginBottom: i === JOURNEY_STEPS.length - 1 ? 0 : '40px',
                    position: 'relative',
                  }}
                >
                  {/* Center dot */}
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '20px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: isCompleted ? step.color : 'var(--color-hairline-strong)',
                    border: `2px solid ${isCompleted ? step.color : 'var(--color-hairline)'}`,
                    boxShadow: isCompleted ? `0 0 10px ${step.color}` : 'none',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    transition: 'all 0.4s ease',
                  }} />

                  {/* Card */}
                  <div
                    onClick={() => setActiveStep(isActive => isActive === i ? -1 : i)}
                    style={{
                      background: 'var(--color-surface-card)',
                      border: isCompleted ? `1px solid ${step.color}` : '1px solid var(--color-hairline)',
                      borderRadius: '0px',
                      padding: '24px',
                      width: '100%',
                      cursor: 'pointer',
                      boxShadow: isCompleted ? `0 4px 16px rgba(0,0,0,0.3), 0 0 12px ${step.glow}` : 'none',
                      transition: 'all 0.4s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1px',
                        textTransform: 'uppercase', color: isCompleted ? step.color : 'var(--color-muted)',
                      }}>
                        {step.subtitle}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700,
                        color: isCompleted ? step.color : 'var(--color-muted-soft)',
                      }}>
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-wrap-balance" style={{
                      fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700,
                      letterSpacing: '1px', textTransform: 'uppercase', color: '#fff',
                      marginBottom: '10px',
                    }}>
                      {step.title}
                    </h3>

                    <p style={{
                      fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-body)',
                      lineHeight: 1.6, margin: 0,
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
        <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 40px', opacity: 0.6, position: 'relative', zIndex: 1 }} />

        {/* ═══════════════ GALLERY SECTION ═══════════════ */}
        <section
          id="tablet-gallery"
          ref={el => sectionsRef.current[5] = el}
          style={{
            padding: '70px 40px',
            background: 'radial-gradient(circle at 90% 10%, rgba(255,255,255,0.02) 0%, transparent 60%)',
            position: 'relative', zIndex: 1,
          }}
        >
          <div className="tablet-section-header" style={{ marginBottom: '36px' }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px',
              letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '8px',
            }}>
              OUR WORK
            </span>
            <h2 className="text-wrap-balance" style={{
              fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700,
              letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
            }}>
              Gallery
            </h2>
          </div>

          <div id="tablet-gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '180px', gap: '8px' }}>
            {GALLERY_ITEMS.filter(item => !item.isSubProduct).map((item, i) => {
              const size = i === 0 ? 'large' : (i % 2 === 0 ? 'small' : 'medium')
              return (
                <div
                  key={item.slug}
                  className="tablet-gallery-card"
                  onClick={() => navigate(`/gallery/${item.slug}`)}
                  style={{
                    position: 'relative', overflow: 'hidden', background: '#0a0a0a',
                    gridRow: size === 'large' ? 'span 2' : 'span 1',
                    border: '1px solid var(--color-hairline)', borderRadius: '0px',
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    loading="lazy"
                    style={{
                      position: 'absolute', inset: 0, width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center', display: 'block',
                      transform: 'scale(1.02)', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 70%)',
                    zIndex: 1,
                  }} />

                  <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2 }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px',
                      textTransform: 'uppercase', color: '#ffffff',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      padding: '3px 8px', borderRadius: '9999px',
                    }}>
                      {item.tag}
                    </span>
                  </div>

                  <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', zIndex: 2 }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600,
                      letterSpacing: '1px', textTransform: 'uppercase', color: '#fff',
                    }}>
                      {item.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--color-hairline)', margin: '0 40px', opacity: 0.6, position: 'relative', zIndex: 1 }} />

        {/* ═══════════════ CONTACT SECTION ═══════════════ */}
        <section
          id="tablet-contact"
          className="section-anchor"
          ref={el => sectionsRef.current[6] = el}
          style={{
            padding: '70px 40px',
            background: 'radial-gradient(circle at 10% 90%, rgba(255,255,255,0.02) 0%, transparent 60%)',
            position: 'relative', zIndex: 1,
          }}
        >
          <div className="tablet-section-header tablet-contact-fade" style={{ marginBottom: '36px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px',
              textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '8px',
            }}>
              GET IN TOUCH
            </span>
            <h2 className="text-wrap-balance" style={{
              fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 700,
              letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0,
            }}>
              Contact Us
            </h2>
          </div>

          <div className="tablet-contact-fade">
            <Contact isMobile={false} />
          </div>
        </section>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer style={{
          padding: '60px 40px 30px',
          borderTop: '1px solid var(--color-hairline)',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '48px',
            marginBottom: '48px',
            paddingBottom: '48px',
            borderBottom: '1px solid var(--color-hairline)',
          }}>
            {/* Brand */}
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700,
                letterSpacing: '6px', textTransform: 'uppercase', color: '#fff', marginBottom: '16px',
              }}>
                PLAKZO
              </div>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'italic',
                color: 'var(--color-muted)', lineHeight: 1.65, maxWidth: '260px',
              }}>
                Industrial Plastic Parts Design &amp; 3D Printing. From concept to your doorstep.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px',
                textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '20px',
              }}>
                Quick Links
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Home', 'Services', 'Materials', 'Gallery', 'About', 'Contact'].map(link => (
                  <a key={link} href={`#${link.toLowerCase()}`} style={{
                    fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-muted)',
                    textDecoration: 'none', fontStyle: 'italic', transition: 'color 0.2s ease',
                  }}
                    onMouseEnter={e => e.target.style.color = 'var(--color-ink)'}
                    onMouseLeave={e => e.target.style.color = 'var(--color-muted)'}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px',
                textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '20px',
              }}>
                Contact
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="tel:+919385648198" style={{
                  fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-muted)',
                  textDecoration: 'none', fontStyle: 'italic', transition: 'color 0.2s ease',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--color-ink)'}
                  onMouseLeave={e => e.target.style.color = 'var(--color-muted)'}
                >
                  +91 93856 48198
                </a>
                <a href="mailto:plakzo3dprinting@gmail.com" style={{
                  fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-muted)',
                  textDecoration: 'none', fontStyle: 'italic', transition: 'color 0.2s ease',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--color-ink)'}
                  onMouseLeave={e => e.target.style.color = 'var(--color-muted)'}
                >
                  plakzo3dprinting@gmail.com
                </a>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                  Coimbatore, Tamil Nadu, India
                </span>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-muted-soft)', fontStyle: 'italic' }}>
              © 2026 PLAKZO 3D Printing. All Rights Reserved.
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', color: 'var(--color-muted-soft)' }}>
              DESIGN • PRINT • DELIVER
            </span>
          </div>
        </footer>
      </div>
    </>
  )
}
