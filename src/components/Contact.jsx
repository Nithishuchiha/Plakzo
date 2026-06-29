import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Dock from './Dock';

gsap.registerPlugin(ScrollTrigger);

const SERVICE_OPTIONS = [
  { value: 'industrial', label: 'Industrial Plastic Parts' },
  { value: 'lamps', label: 'Custom 3D Printed Photo Lamps' },
  { value: 'keychains', label: 'Custom 3D Printed Keychains' },
  { value: 'cad', label: 'CAD Design Services (SolidWorks)' },
  { value: 'caps', label: 'Customized Bottle Caps' },
  { value: 'other', label: 'Other Custom Request' },
];

/* ─── SVG Icon Components ─── */
const MailIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 7L2 7" />
  </svg>
);

const PhoneIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const InstagramIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill={color} stroke="none" />
  </svg>
);

const MapPinIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SendIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const GmailIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
  </svg>
);

const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const GitIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);




export default function Contact({ isMobile = false }) {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
  const [ticketId, setTicketId] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const containerRef = useRef(null);
  const animFiredRef = useRef(false);

  const playContactEntrance = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Left Panel Items
    timeline.fromTo('.contact-left-title',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0
    );
    timeline.fromTo('.contact-left-desc',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.1
    );
    timeline.fromTo('.contact-info-row-item',
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
      0.2
    );
    timeline.fromTo('.contact-social-dock',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      0.45
    );

    // Right Panel (Form) Items
    timeline.fromTo('.contact-form-title',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.15
    );
    timeline.fromTo('.contact-form-field',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
      0.25
    );
    timeline.fromTo('.contact-send-btn-wrap',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      0.55
    );
  };

  const resetContactState = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.killTweensOf([
      '.contact-left-title',
      '.contact-left-desc',
      '.contact-info-row-item',
      '.contact-social-dock',
      '.contact-form-title',
      '.contact-form-field',
      '.contact-send-btn-wrap'
    ]);

    gsap.set('.contact-left-title', { y: 30, opacity: 0 });
    gsap.set('.contact-left-desc', { y: 20, opacity: 0 });
    gsap.set('.contact-info-row-item', { x: -20, opacity: 0 });
    gsap.set('.contact-social-dock', { y: 20, opacity: 0 });
    gsap.set('.contact-form-title', { y: 30, opacity: 0 });
    gsap.set('.contact-form-field', { y: 25, opacity: 0 });
    gsap.set('.contact-send-btn-wrap', { y: 20, opacity: 0 });
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const isDesktopScroll = !isMobile && !window.matchMedia('(max-width: 1199px)').matches;

    if (isDesktopScroll) {
      // Desktop: watch absolute wrapper's opacity via MutationObserver
      const parent = containerRef.current?.parentElement?.parentElement;
      if (!parent) return;

      // Set initial values
      resetContactState();

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'style') {
            const opacity = parseFloat(parent.style.opacity || '0');
            if (opacity > 0.05 && !animFiredRef.current) {
              animFiredRef.current = true;
              playContactEntrance();
            } else if (opacity <= 0.05 && animFiredRef.current) {
              animFiredRef.current = false;
              resetContactState();
            }
          }
        });
      });

      observer.observe(parent, { attributes: true, attributeFilter: ['style'] });
      return () => observer.disconnect();
    } else {
      // Mobile / Tablet: standard ScrollTrigger
      resetContactState();
      
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 85%',
        onEnter: () => {
          if (!animFiredRef.current) {
            animFiredRef.current = true;
            playContactEntrance();
          }
        },
        onLeaveBack: () => {
          animFiredRef.current = false;
          resetContactState();
        }
      });

      return () => {
        trigger.kill();
      };
    }
  }, [isMobile]);

  const validate = () => {
    let tempErrors = {};
    if (!formValues.name.trim()) tempErrors.name = 'Name is required';
    if (!formValues.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      tempErrors.email = 'Email address is invalid';
    }
    if (!formValues.message.trim()) tempErrors.message = 'Please describe your project';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setFormStatus('submitting');
      setTimeout(() => {
        setTicketId(`PLK-${Math.floor(100000 + Math.random() * 900000)}`);
        setFormStatus('success');
      }, 1500);
    }
  };

  const handleReset = () => {
    setFormValues({ name: '', email: '', phone: '', service: '', message: '' });
    setErrors({});
    setFormStatus('idle');
    setTicketId(null);
  };

  const CONTACT_INFO = [
    {
      icon: <MailIcon size={20} color="var(--color-ink)" />,
      label: 'Email',
      value: 'plakzo3dprinting@gmail.com',
      href: 'mailto:plakzo3dprinting@gmail.com',
    },
    {
      icon: <PhoneIcon size={20} color="var(--color-ink)" />,
      label: 'Phone',
      value: '+91 93856 48198',
      href: 'tel:+919385648198',
    },
    {
      icon: <InstagramIcon size={20} color="var(--color-ink)" />,
      label: 'Instagram',
      value: '@plakzo3dprinting',
      href: 'https://instagram.com/plakzo3dprinting',
    },
    {
      icon: <MapPinIcon size={20} color="var(--color-ink)" />,
      label: 'Location',
      value: 'Coimbatore, Tamil Nadu, India',
      href: null,
    },
  ];

  const SOCIAL_LINKS = [
    { label: 'Gmail', href: 'mailto:plakzo3dprinting@gmail.com', icon: <GmailIcon /> },
    { label: 'Instagram', href: 'https://instagram.com/plakzo3dprinting', icon: <InstagramIcon size={18} /> },
    { label: 'WhatsApp', href: 'https://wa.me/919385648198', icon: <WhatsAppIcon /> },
    { label: 'GitHub', href: '#', icon: <GitIcon /> },
  ];

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {/* ═══════ CONTACT SECTION — Reference Image Layout ═══════ */}
      <div className="contact-fade-up" style={{
        display: isMobile ? 'flex' : 'grid',
        gridTemplateColumns: isMobile ? undefined : '1fr 1.05fr',
        flexDirection: isMobile ? 'column' : undefined,
        gap: '0',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '0px',
      }}>

        {/* ──── LEFT PANEL: GET IN TOUCH ──── */}
        <div style={{
          background: 'var(--color-canvas)',
          padding: isMobile ? '28px 24px' : '32px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          borderRight: isMobile ? 'none' : '1px solid var(--color-hairline)',
          borderBottom: isMobile ? '1px solid var(--color-hairline)' : 'none',
        }}>
          {/* Decorative grid */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(var(--color-hairline-strong) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Section Title */}
            <div className="contact-left-title" style={{ marginBottom: isMobile ? '20px' : '24px' }}>
              {/* <span style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '2.5px',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
                marginBottom: '12px',
              }}>
                // CONTACT
              </span> */}
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? '28px' : 'clamp(28px, 3vw, 40px)',
                fontWeight: 700,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: 'var(--color-ink)',
                margin: 0,
                lineHeight: 1.1,
              }}>
                Get In Touch
              </h2>
              <div style={{
                width: '48px',
                height: '2px',
                background: 'var(--color-ink)',
                marginTop: '16px',
              }} />
            </div>

            {/* Description */}
            <p className="contact-left-desc" style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--color-ink)',
              lineHeight: 1.6,
              maxWidth: '380px',
              marginBottom: isMobile ? '20px' : '24px',
            }}>
              We design custom plastic components using SolidWorks and manufacture them with precision 3D printing. Share your project — we'll get back within 2–4 hours.
            </p>

            {/* Contact Info Items */}
            <div className="contact-fade-up" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}>
              {CONTACT_INFO.map((info, i) => {
                const Wrapper = info.href ? 'a' : 'div';
                return (
                  <Wrapper
                    key={info.label}
                    href={info.href || undefined}
                    target={info.href && info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href && info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="contact-info-row contact-info-row-item"
                    style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: i < CONTACT_INFO.length - 1 ? '1px solid var(--color-hairline)' : 'none',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      cursor: info.href ? 'pointer' : 'default',
                    }}
                  >
                    {/* Icon container */}
                    <div style={{
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid var(--color-ink)',
                      borderRadius: '0px',
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                    }}>
                      {info.icon}
                    </div>

                    <div>
                      <span style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '8px',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        color: 'var(--color-ink)',
                        opacity: 0.5,
                        marginBottom: '2px',
                      }}>
                        {info.label}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: 'var(--color-ink)',
                        letterSpacing: '0.2px',
                        fontWeight: 500,
                      }}>
                        {info.value}
                      </span>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>

          {/* Social Links Dock */}
          <div className="contact-social-dock" style={{
            marginTop: isMobile ? '20px' : '24px',
            position: 'relative',
            zIndex: 10,
          }}>
            <Dock items={SOCIAL_LINKS} />
          </div>
        </div>

        {/* ──── RIGHT PANEL: SAY SOMETHING (Form Card) ──── */}
        <div style={{
          background: 'var(--color-canvas)',
          padding: isMobile ? '28px 24px' : '32px 40px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
          {/* Left accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '3px',
            background: 'var(--color-link)',
          }} />

          {formStatus === 'success' ? (
            /* ─── Success Receipt ─── */
            <div
              role="alert"
              aria-live="polite"
              className="contact-fade-up"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
                animation: 'receiptReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div aria-hidden="true" style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  border: '1.5px solid var(--color-ink)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink)',
                  fontSize: '20px', fontWeight: 'bold',
                }}>
                  ✓
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700,
                    letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-ink)', margin: 0,
                  }}>
                    Request Received
                  </h3>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '9px',
                    color: 'var(--color-muted)', letterSpacing: '1px',
                  }}>
                    TICKET ID: {ticketId}
                  </span>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid var(--color-hairline)',
                borderBottom: '1px solid var(--color-hairline)',
                padding: '20px 0',
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                {[
                  { k: 'CLIENT', v: formValues.name },
                  { k: 'EMAIL', v: formValues.email },
                  { k: 'SERVICE', v: SERVICE_OPTIONS.find(s => s.value === formValues.service)?.label.split(' (')[0] || 'Not Specified' },
                ].map(row => (
                  <div key={row.k} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)', fontSize: '10px',
                  }}>
                    <span style={{ color: 'var(--color-muted-soft)' }}>{row.k}</span>
                    <span style={{ color: 'var(--color-ink)', textAlign: 'right', textTransform: 'uppercase' }}>{row.v}</span>
                  </div>
                ))}
              </div>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '13px',
                color: 'var(--color-body)', margin: 0, lineHeight: 1.65,
              }}>
                Thank you for your project details. Our engineers will review your requirements and provide a CAD analysis and quote within 2–4 hours.
              </p>

              <button onClick={handleReset} style={{
                alignSelf: 'flex-start',
                background: 'transparent',
                border: '1px solid var(--color-muted)',
                color: 'var(--color-body)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '10px 24px',
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
                onMouseEnter={e => { e.target.style.background = 'var(--color-ink)'; e.target.style.color = 'var(--color-canvas)'; }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-body)'; }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            /* ─── Contact Form ─── */
            <form onSubmit={handleSubmit} noValidate style={{
              display: 'flex', flexDirection: 'column', gap: '0',
              flex: 1,
            }}>
              {/* Form Header */}
              <div className="contact-form-title" style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? '20px' : 'clamp(20px, 2vw, 26px)',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: 'var(--color-ink)',
                  margin: 0,
                }}>
                  Say Something
                </h3>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  color: 'var(--color-muted)',
                  marginTop: '6px',
                  display: 'block',
                }}>
                  ALL FIELDS ARE OPTIONAL EXCEPT STARRED *
                </span>
              </div>

              {/* Name Input */}
              <div className="contact-form-field" style={{ marginBottom: '20px' }}>
                <label htmlFor="contact-name" style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: focusedField === 'name' ? 'var(--color-ink)' : 'var(--color-muted)',
                  marginBottom: '6px',
                  transition: 'color 0.3s ease',
                }}>
                  Your Name <span style={{ color: 'var(--color-link)' }}>*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Enter your name"
                  value={formValues.name}
                  onChange={e => setFormValues(p => ({ ...p, name: e.target.value }))}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  disabled={formStatus === 'submitting'}
                  autoComplete="name"
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: errors.name
                      ? '1.5px solid #e53e3e'
                      : focusedField === 'name'
                        ? '1.5px solid var(--color-ink)'
                        : '1px solid var(--color-hairline-strong)',
                    color: 'var(--color-ink)',
                    padding: '10px 0',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    transition: 'border-color 0.3s ease',
                    opacity: formStatus === 'submitting' ? 0.5 : 1,
                  }}
                />
                {errors.name && (
                  <span style={{ display: 'block', color: '#e53e3e', fontFamily: 'var(--font-mono)', fontSize: '9px', marginTop: '6px', letterSpacing: '0.5px' }}>
                    ✕ {errors.name}
                  </span>
                )}
              </div>

              {/* Email Input */}
              <div className="contact-form-field" style={{ marginBottom: '20px' }}>
                <label htmlFor="contact-email" style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: focusedField === 'email' ? 'var(--color-ink)' : 'var(--color-muted)',
                  marginBottom: '6px',
                  transition: 'color 0.3s ease',
                }}>
                  Your Mail <span style={{ color: 'var(--color-link)' }}>*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formValues.email}
                  onChange={e => setFormValues(p => ({ ...p, email: e.target.value }))}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  disabled={formStatus === 'submitting'}
                  autoComplete="email"
                  spellCheck={false}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: errors.email
                      ? '1.5px solid #e53e3e'
                      : focusedField === 'email'
                        ? '1.5px solid var(--color-ink)'
                        : '1px solid var(--color-hairline-strong)',
                    color: 'var(--color-ink)',
                    padding: '10px 0',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    transition: 'border-color 0.3s ease',
                    opacity: formStatus === 'submitting' ? 0.5 : 1,
                  }}
                />
                {errors.email && (
                  <span style={{ display: 'block', color: '#e53e3e', fontFamily: 'var(--font-mono)', fontSize: '9px', marginTop: '6px', letterSpacing: '0.5px' }}>
                    ✕ {errors.email}
                  </span>
                )}
              </div>

              {/* Message Textarea */}
              <div className="contact-form-field" style={{ marginBottom: '24px' }}>
                <label htmlFor="contact-message" style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: focusedField === 'message' ? 'var(--color-ink)' : 'var(--color-muted)',
                  marginBottom: '6px',
                  transition: 'color 0.3s ease',
                }}>
                  Message <span style={{ color: 'var(--color-link)' }}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  placeholder="Describe your project requirements..."
                  value={formValues.message}
                  onChange={e => setFormValues(p => ({ ...p, message: e.target.value }))}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  disabled={formStatus === 'submitting'}
                  rows={4}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-surface-soft)',
                    border: errors.message
                      ? '1.5px solid #e53e3e'
                      : focusedField === 'message'
                        ? '1.5px solid var(--color-ink)'
                        : '1px solid var(--color-hairline-strong)',
                    borderRadius: '0px',
                    color: 'var(--color-ink)',
                    padding: '14px',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    resize: 'vertical',
                    minHeight: '100px',
                    transition: 'border-color 0.3s ease',
                    opacity: formStatus === 'submitting' ? 0.5 : 1,
                  }}
                />
                {errors.message && (
                  <span style={{ display: 'block', color: '#e53e3e', fontFamily: 'var(--font-mono)', fontSize: '9px', marginTop: '6px', letterSpacing: '0.5px' }}>
                    ✕ {errors.message}
                  </span>
                )}
              </div>

              {/* Submit Button — Black fill (replaces red from reference) */}
              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  minWidth: isMobile ? '100%' : '200px',
                  height: '48px',
                  background: 'var(--color-ink)',
                  color: 'var(--color-canvas)',
                  border: '1.5px solid var(--color-ink)',
                  borderRadius: '0px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '2.5px',
                  textTransform: 'uppercase',
                  cursor: formStatus === 'submitting' ? 'not-allowed' : 'pointer',
                  opacity: formStatus === 'submitting' ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                }}
                className="contact-send-btn contact-send-btn-wrap"
              >
                {formStatus === 'submitting' ? (
                  <>
                    <span style={{
                      width: '14px', height: '14px',
                      border: '2px solid rgba(255,255,255,0.15)',
                      borderTop: '2px solid var(--color-canvas)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s infinite linear',
                    }} />
                    Sending…
                  </>
                ) : (
                  <>
                    <SendIcon size={14} color="var(--color-canvas)" />
                    Send
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>



      {/* Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes receiptReveal {
          0% { opacity: 0; transform: translateY(15px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Left panel info row hover (dark bg) */
        .contact-info-row:hover > div:first-child {
          border-color: var(--color-ink) !important;
          background: rgba(255,255,255,0.04);
        }
        .contact-info-row:hover span:last-child {
          color: var(--color-ink) !important;
        }

        /* Social button hover (dark bg) */
        .contact-social-btn:hover {
          border-color: var(--color-ink) !important;
          color: var(--color-ink) !important;
          background: rgba(255,255,255,0.06);
        }

        /* Send button hover (dark bg — invert to transparent outline) */
        .contact-send-btn:not(:disabled):hover {
          background: transparent !important;
          color: var(--color-ink) !important;
          border-color: var(--color-ink) !important;
          box-shadow: none;
        }
        .contact-send-btn:not(:disabled):hover svg {
          stroke: var(--color-ink) !important;
        }

        /* Placeholder color for dark form inputs */
        #contact-name::placeholder,
        #contact-email::placeholder,
        #contact-message::placeholder {
          color: var(--color-muted-soft) !important;
          font-style: italic;
          opacity: 0.75;
        }

        /* Focus visible */
        .contact-send-btn:focus-visible {
          outline: 2px solid var(--color-ink);
          outline-offset: 4px;
        }
      `}</style>
    </div>
  );
}
