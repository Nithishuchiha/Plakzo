import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: 'FB' },
  { label: 'Instagram', href: '#', icon: 'IG' },
  { label: 'WhatsApp', href: '#', icon: 'WA' },
  { label: 'LinkedIn', href: '#', icon: 'LI' },
];

export default function Contact({ id = 'contact' }) {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(infoRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      );
      gsap.fromTo(formRef.current,
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const inputStyle = {
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--color-hairline-strong)',
    color: 'var(--color-ink)',
    padding: '16px 0',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '15px',
    transition: 'border-color 0.3s ease',
  };

  const labelStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: 'var(--color-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    display: 'block',
    marginBottom: '8px',
  };

  return (
    <section ref={sectionRef} id={id} style={{ padding: '100px 0', backgroundColor: 'var(--color-canvas)', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="contact-grid">
          
          {/* Left Panel: Info */}
          <div ref={infoRef} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '12px' }}>Get In Touch</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--color-ink)', margin: 0 }}>Contact Us</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { label: 'Email', value: 'plakzo3dprinting@gmail.com', icon: '✉' },
                { label: 'Phone', value: '+91 93856 48198', icon: '📞' },
                { label: 'Location', value: 'Coimbatore, Tamil Nadu, India', icon: '📍' }
              ].map(info => (
                <div key={info.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '18px', color: 'var(--color-muted)' }}>{info.icon}</span>
                  <div>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '4px' }}>{info.label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--color-ink)' }}>{info.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '24px' }}>
                {SOCIAL_LINKS.map(link => (
                  <a 
                    key={link.label} 
                    href={link.href} 
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px', color: 'var(--color-muted)', textDecoration: 'none', transition: 'color 0.2s ease' }}
                    onMouseEnter={e => e.target.style.color = 'var(--color-ink)'}
                    onMouseLeave={e => e.target.style.color = 'var(--color-muted)'}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Sleek Form */}
          <div ref={formRef}>
            <div style={{ background: 'var(--color-surface-soft)', border: '1px solid var(--color-hairline)', padding: '40px' }} className="contact-form-card">
              <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <label style={labelStyle} htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your Name"
                    value={formState.name}
                    onChange={e => setFormState(p => ({ ...p, name: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderBottomColor = 'var(--color-ink)'}
                    onBlur={e => e.target.style.borderBottomColor = 'var(--color-hairline-strong)'}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formState.email}
                    onChange={e => setFormState(p => ({ ...p, email: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderBottomColor = 'var(--color-ink)'}
                    onBlur={e => e.target.style.borderBottomColor = 'var(--color-hairline-strong)'}
                  />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Describe your project or requirement..."
                    value={formState.message}
                    onChange={e => setFormState(p => ({ ...p, message: e.target.value }))}
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => e.target.style.borderBottomColor = 'var(--color-ink)'}
                    onBlur={e => e.target.style.borderBottomColor = 'var(--color-hairline-strong)'}
                  />
                </div>
                <button type="submit" className="btn-brand" style={{ alignSelf: 'flex-start' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 50px !important; }
        }
        .contact-form-card {
          border-radius: 0px !important;
        }
        input::placeholder, textarea::placeholder { color: var(--color-muted-soft); font-style: italic; }
      `}</style>
    </section>
  );
}
