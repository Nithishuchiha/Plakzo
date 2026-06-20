export default function Footer() {
  const QUICK_LINKS = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Materials', href: '#materials' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  const handleScroll = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer style={{
      backgroundColor: 'var(--color-canvas)',
      borderTop: '1px solid var(--color-hairline)',
      padding: '64px 0 32px',
    }}>
      <div className="container">
        {/* Top row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '64px',
          marginBottom: '64px',
          paddingBottom: '64px',
          borderBottom: '1px solid var(--color-hairline)',
        }} className="footer-grid">

          {/* Brand */}
          <div>
            <div className="text-wordmark" style={{ marginBottom: '16px' }}>PLAKZO</div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              fontStyle: 'italic',
              color: 'var(--color-muted)',
              lineHeight: 1.65,
              maxWidth: '260px',
            }}>
              Industrial Plastic Parts Design &amp; 3D Printing. From concept to y
                onMouseEnter={e => e.target.style.color = 'var(--color-ink)'}
                onMouseLeave={e => e.target.style.color = 'var(--color-muted)'}
              >
                +91 93856 48198
              </a>
              <a
                href="mailto:plakzo3dprinting@gmail.com"
                style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-muted)', textDecoration: 'none', fontStyle: 'italic', transition: 'color 0.2s ease' }}
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
            © 2024 PLAKZO 3D Printing Plastic Parts. All Rights Reserved.
          </span>
          <span className="text-caption" style={{ fontSize: '9px', color: 'var(--color-muted-soft)' }}>
            DESIGN • PRINT • DELIVER
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </footer>
  )
}
