import { useRef, useEffect, useState, useCallback } from 'react'
import { gsap } from 'gsap'

/* ─── Nav items ──────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',      href: '#home' },
  { label: 'Services',  href: '#services' },
  { label: 'Materials', href: '#materials' },
  { label: 'Journey',   href: '#process' },
  { label: 'Gallery',   href: '#gallery' },
  { label: 'Contact',   href: '#contact' },
]

/* ─── Hamburger Icon ─────────────────────────────────────────────── */
function HamburgerIcon({ open }) {
  return (
    <div className="hamburger-icon" aria-hidden="true">
      <span className={`hamburger-line ${open ? 'open' : ''}`} />
      <span className={`hamburger-line ${open ? 'open' : ''}`} />
      <span className={`hamburger-line ${open ? 'open' : ''}`} />
    </div>
  )
}

/* ─── Gooey Mobile Nav ──────────────────────────────────────────── */
function MobileNav({ open, onClose }) {
  const overlayRef = useRef(null)
  const itemsRef = useRef([])
  const blobRefs = useRef([])
  const tlRef = useRef(null)

  const setItemRef = useCallback((el, i) => { itemsRef.current[i] = el }, [])
  const setBlobRef = useCallback((el, i) => { blobRefs.current[i] = el }, [])

  useEffect(() => {
    if (!overlayRef.current) return

    if (open) {
      document.body.style.overflow = 'hidden'

      if (tlRef.current) tlRef.current.kill()

      const tl = gsap.timeline()
      tlRef.current = tl

      // overlay fade in
      tl.fromTo(overlayRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }
      )

      // gooey blobs expand from center
      tl.fromTo(blobRefs.current.filter(Boolean),
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.6)',
          stagger: 0.06,
        },
        '-=0.15'
      )

      // nav items stagger in
      tl.fromTo(itemsRef.current.filter(Boolean),
        { y: 30, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
          stagger: 0.07,
        },
        '-=0.35'
      )
    } else {
      document.body.style.overflow = ''

      if (tlRef.current) {
        tlRef.current.reverse()
      }
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
    onClose()
  }, [onClose])

  return (
    <div
      ref={overlayRef}
      className="mobile-nav-overlay"
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      {/* SVG Gooey Filter */}
      <svg className="gooey-svg-filter" aria-hidden="true">
        <defs>
          <filter id="gooey-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Nav links container with gooey filter applied */}
      <div className="mobile-nav-content" style={{ filter: 'url(#gooey-filter)' }}>
        <ul className="mobile-nav-list">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href} className="mobile-nav-item" ref={(el) => setItemRef(el, i)}>
              <a
                href={link.href}
                className="mobile-nav-link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                <span
                  className="mobile-nav-blob"
                  ref={(el) => setBlobRef(el, i)}
                />
                <span className="mobile-nav-label">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Close hint */}
      <div className="mobile-nav-footer" ref={(el) => {
        if (el && open) gsap.fromTo(el, { opacity: 0 }, { opacity: 1, delay: 0.5, duration: 0.3 })
      }}>
        <button onClick={onClose} className="mobile-nav-close-text">
          Close
        </button>
      </div>
    </div>
  )
}

/* ─── Desktop Nav ────────────────────────────────────────────────── */
function DesktopNav({ navLinks, activeIdx, onLinkClick }) {
  return (
    <div className="desktop-nav">
      <div className="desktop-nav-inner" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 40px' }}>
        <a href="#home" onClick={(e) => onLinkClick(e, 0)} style={{ position: 'absolute', left: '40px', display: 'flex', alignItems: 'center' }}>
          <img
            src={`${import.meta.env.BASE_URL}images/plakzo_logo_new.jpeg`}
            alt="PLAKZO"
            style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
          />
        </a>
        <ul className="desktop-nav-links">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`desktop-nav-link ${i === activeIdx ? 'active' : ''}`}
                onClick={(e) => onLinkClick(e, i)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ─── Main Navbar ────────────────────────────────────────────────── */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const navRef = useRef(null)

  const toggle = useCallback(() => setOpen(prev => !prev), [])
  const close = useCallback(() => setOpen(false), [])

  // Track active section via window scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const h = 11 * window.innerHeight // total scroll range (1100vh)
      const scrollY = window.scrollY
      const progress = Math.min(Math.max(scrollY / h, 0), 1)

      // Map progress to active index:
      let idx = 0
      if (progress >= 0.86) idx = 5 // Contact
      else if (progress >= 0.68) idx = 4 // Gallery
      else if (progress >= 0.33) idx = 3 // Journey
      else if (progress >= 0.22) idx = 2 // Materials
      else if (progress >= 0.11) idx = 1 // Services
      else idx = 0 // Home

      setActiveIdx(idx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle desktop nav click by scrolling to the exact progress target of the section
  const handleDesktopNavClick = useCallback((e, index) => {
    e.preventDefault()
    const targetProgress = [
      0,      // Home
      0.18,   // Services
      0.30,   // Materials
      0.58,   // Journey
      0.78,   // Gallery
      0.95,   // Contact
    ]
    const h = 11 * window.innerHeight
    window.scrollTo({
      top: targetProgress[index] * h,
      behavior: 'smooth'
    })
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return (
    <nav ref={navRef} id="navbar" className="navbar">
      {/* Top bar — always visible */}
      <div className="navbar-topbar">
        <a href="#home" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="navbar-logo-link" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`${import.meta.env.BASE_URL}images/plakzo_logo_new.jpeg`}
            alt="PLAKZO"
            style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
          />
        </a>

        {/* Hamburger — mobile only via CSS */}
        <button
          className="navbar-hamburger"
          onClick={toggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <HamburgerIcon open={open} />
        </button>
      </div>

      {/* Desktop nav */}
      <DesktopNav navLinks={NAV_LINKS} activeIdx={activeIdx} onLinkClick={handleDesktopNavClick} />

      {/* Mobile gooey overlay */}
      <MobileNav open={open} onClose={close} />
    </nav>
  )
}
