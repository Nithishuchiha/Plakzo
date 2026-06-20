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
function DesktopNav({ navLinks, activeIdx }) {
  return (
    <div className="desktop-nav">
      <div className="desktop-nav-inner">
        <span className="desktop-nav-wordmark">PLAKZO</span>
        <ul className="desktop-nav-links">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`desktop-nav-link ${i === activeIdx ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                }}
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

  // Track active section via IntersectionObserver
  useEffect(() => {
    const SECTION_IDS = NAV_LINKS.map(l => l.href.slice(1))
    const indexMap = {}
    SECTION_IDS.forEach((id, i) => { indexMap[id] = i })

    const visible = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        })
        let best = null
        SECTION_IDS.forEach(id => {
          if (visible.has(id) && best === null) best = id
        })
        if (best !== null) setActiveIdx(indexMap[best])
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 }
    )

    const IO_SKIP = new Set(['home', 'services'])
    SECTION_IDS.forEach(id => {
      if (IO_SKIP.has(id)) return
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
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
        <span className="navbar-wordmark">PLAKZO</span>

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
      <DesktopNav navLinks={NAV_LINKS} activeIdx={activeIdx} />

      {/* Mobile gooey overlay */}
      <MobileNav open={open} onClose={close} />
    </nav>
  )
}
