import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#', icon: 'FB' },
  { label: 'Instagram', href: '#', icon: 'IG' },
  { label: 'WhatsApp', href: '#', icon: 'WA' },
  { label: 'LinkedIn', href: '#', icon: 'LI' },
];

const SERVICE_OPTIONS = [
  { value: 'industrial', label: 'Industrial Plastic Parts' },
  { value: 'lamps', label: 'Custom 3D Printed Photo Lamps' },
  { value: 'keychains', label: 'Custom 3D Printed Keychains' },
  { value: 'cad', label: 'CAD Design Services (SolidWorks)' },
  { value: 'caps', label: 'Customized Bottle Caps' },
  { value: 'other', label: 'Other Custom Request' },
];

// Coimbatore Coordinates Visual
const CoimbatoreCoordinatesVisual = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '180px',
      background: 'rgba(255,255,255,0.01)',
      border: '1px solid var(--color-hairline)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      overflow: 'hidden',
    }} className="contact-fade-up">
      {/* Abstract Grid background */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="coord-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#coord-grid)" />
      </svg>

      {/* Target/Radar animation */}
      <div style={{ position: 'relative', width: '60px', height: '60px', marginBottom: '16px' }}>
        {/* Pulsing rings */}
        <div className="radar-pulse" style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1.5px solid var(--color-ink)', opacity: 0.4,
          animation: 'radarPulse 3s infinite linear',
        }} />
        <div className="radar-pulse-delay" style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1.5px solid var(--color-ink)', opacity: 0.2,
          animation: 'radarPulse 3s infinite linear',
          animationDelay: '1.5s',
        }} />
        {/* Center coordinate dot */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', width: '8px', height: '8px',
          borderRadius: '50%', background: '#fff', transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 12px #fff',
        }} />
        {/* Coordinate crosshairs */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '0.5px', background: 'rgba(255,255,255,0.3)', transform: 'translateY(-50%)' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '0.5px', background: 'rgba(255,255,255,0.3)', transform: 'translateX(-50%)' }} />
      </div>

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '2.5px',
          color: 'var(--color-ink)',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}>
          Coimbatore Hub
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '1.5px',
          color: 'var(--color-muted)',
        }}>
          11.0168° N, 76.9558° E
        </span>
      </div>

      <style>{`
        @keyframes radarPulse {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

// Premium Floating Input Field
const InputField = ({ label, id, type = 'text', value, onChange, error, disabled, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || (value && value.length > 0);
  return (
    <div style={{ position: 'relative', marginBottom: '24px' }}>
      <label
        htmlFor={id}
        style={{
          position: 'absolute',
          left: 0,
          top: isFloating ? '-12px' : '10px',
          fontSize: isFloating ? '9px' : '13px',
          fontFamily: 'var(--font-mono)',
          color: isFocused ? 'var(--color-ink)' : 'var(--color-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
          pointerEvents: 'none',
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        style={{
          width: '100%',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: isFocused 
            ? '1px solid var(--color-ink)' 
            : error 
              ? '1px solid #ff6b6b' 
              : '1px solid var(--color-hairline-strong)',
          color: 'var(--color-ink)',
          padding: '12px 0 8px 0',
          outline: 'none',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.5 : 1,
        }}
        {...props}
      />
      {error && (
        <span style={{ 
          display: 'block', 
          color: '#ff6b6b', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '9px', 
          marginTop: '6px',
          letterSpacing: '0.5px' 
        }}>
          ✕ {error}
        </span>
      )}
    </div>
  );
};

// Custom Select Field
const SelectField = ({ label, options, value, onChange, error, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={containerRef} style={{ position: 'relative', marginBottom: '24px' }}>
      <label
        style={{
          position: 'absolute',
          left: 0,
          top: '-12px',
          fontSize: '9px',
          fontFamily: 'var(--font-mono)',
          color: isFocused ? 'var(--color-ink)' : 'var(--color-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          pointerEvents: 'none',
        }}
      >
        {label}
      </label>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => { if (!disabled) { setIsOpen(!isOpen); setIsFocused(true); } }}
        onFocus={() => { if (!disabled) setIsFocused(true); }}
        onBlur={() => { if (!isOpen) setIsFocused(false); }}
        style={{
          width: '100%',
          backgroundColor: 'transparent',
          borderBottom: isFocused 
            ? '1px solid var(--color-ink)' 
            : error 
              ? '1px solid #ff6b6b' 
              : '1px solid var(--color-hairline-strong)',
          color: value ? 'var(--color-ink)' : 'var(--color-muted-soft)',
          padding: '12px 0 8px 0',
          outline: 'none',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span>{selectedOption ? selectedOption.label : 'Select an option...'}</span>
        <span style={{ fontSize: '9px', transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(180deg)' : 'none', color: 'var(--color-muted)' }}>▼</span>
      </div>

      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--color-surface-card)',
          border: '1px solid var(--color-hairline-strong)',
          zIndex: 100,
          maxHeight: '200px',
          overflowY: 'auto',
          borderRadius: '0px',
          marginTop: '4px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); setIsFocused(false); }}
              style={{
                padding: '12px 16px',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: value === opt.value ? 'var(--color-ink)' : 'var(--color-body)',
                backgroundColor: value === opt.value ? 'rgba(255,255,255,0.06)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.target.style.backgroundColor = value === opt.value ? 'rgba(255,255,255,0.06)' : 'transparent'}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
      {error && (
        <span style={{ 
          display: 'block', 
          color: '#ff6b6b', 
          fontFamily: 'var(--font-mono)', 
          fontSize: '9px', 
          marginTop: '6px',
          letterSpacing: '0.5px' 
        }}>
          ✕ {error}
        </span>
      )}
    </div>
  );
};

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

  const validate = () => {
    let tempErrors = {};
    if (!formValues.name.trim()) tempErrors.name = 'Name is required';
    if (!formValues.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      tempErrors.email = 'Email address is invalid';
    }
    if (!formValues.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9\s-]{10,15}$/.test(formValues.phone.replace(/\s+/g, ''))) {
      tempErrors.phone = 'Phone number must be between 10-15 digits';
    }
    if (!formValues.service) tempErrors.service = 'Please select a service interest';
    if (!formValues.message.trim()) tempErrors.message = 'Project details are required';

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
    setFormValues({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    });
    setErrors({});
    setFormStatus('idle');
    setTicketId(null);
  };

  const gridStyle = isMobile
    ? { display: 'flex', flexDirection: 'column', gap: '40px' }
    : { display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '60px' };

  return (
    <div style={{ width: '100%' }}>
      {/* Header section (only rendered if not handled by ShowcaseScroll layout) */}
      {!isMobile && (
        <div style={{ marginBottom: '60px' }} className="contact-fade-up">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '16px' }}>Get In Touch</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 48px)', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--color-ink)' }}>Contact Us</h2>
        </div>
      )}

      <div style={gridStyle}>
        
        {/* Left Side: Info, Location, Coordinates */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Coordinates Radar Graphic */}
          <CoimbatoreCoordinatesVisual />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="contact-fade-up">
            {[
              { label: 'Email', value: 'plakzo3dprinting@gmail.com', icon: '✉' },
              { label: 'Instagram', value: '@plakzo', icon: '◈' },
              { label: 'Location', value: 'Coimbatore, Tamil Nadu, India', icon: '◎' },
            ].map(info => (
              <div 
                key={info.label} 
                style={{ 
                  display: 'flex', gap: '16px', alignItems: 'center', 
                  paddingBottom: '20px', borderBottom: '1px solid var(--color-hairline)' 
                }}
              >
                <span aria-hidden="true" style={{ 
                  fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--color-muted)', 
                  width: '24px', textAlign: 'center', flexShrink: 0
                }}>
                  {info.icon}
                </span>
                <div>
                  <span style={{ 
                    display: 'block', fontFamily: 'var(--font-mono)', fontSize: '8px', 
                    letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '2px' 
                  }}>
                    {info.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-ink)' }}>
                    {info.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '10px' }} className="contact-fade-up">
            {SOCIAL_LINKS.map(link => (
              <a 
                key={link.label} 
                href={link.href} 
                style={{ 
                  fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px', 
                  color: 'var(--color-muted)', textDecoration: 'none', transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                className="social-anchor-link"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side: Sleek Interactive Form or Success Receipt */}
        <div>
          {formStatus === 'success' ? (
            <div 
              role="alert"
              aria-live="polite"
              style={{
                padding: isMobile ? '30px 20px' : '40px 30px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--color-ink)',
                borderRadius: '0px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                animation: 'receiptReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="contact-fade-up"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div aria-hidden="true" style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  border: '1.5px solid var(--color-ink)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#fff',
                  fontSize: '20px', fontWeight: 'bold'
                }}>
                  ✓
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#fff', margin: 0 }}>
                    Request Received
                  </h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-muted)', letterSpacing: '1px' }}>
                    TICKET ID: {ticketId}
                  </span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-hairline)', borderBottom: '1px solid var(--color-hairline)', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                  <span style={{ color: 'var(--color-muted)' }}>CLIENT</span>
                  <span style={{ color: '#fff', textAlign: 'right' }}>{formValues.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                  <span style={{ color: 'var(--color-muted)' }}>EMAIL</span>
                  <span style={{ color: '#fff', textAlign: 'right' }}>{formValues.email}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                  <span style={{ color: 'var(--color-muted)' }}>SERVICE INTEREST</span>
                  <span style={{ color: '#fff', textAlign: 'right', textTransform: 'uppercase' }}>
                    {SERVICE_OPTIONS.find(s => s.value === formValues.service)?.label.split(' (')[0] || 'Not Specified'}
                  </span>
                </div>

              </div>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-body)', margin: 0, lineHeight: 1.6 }}>
                Thank you for sharing your project details. Our engineers will review your custom SolidWorks requirements or 3D printing parameters and get back to you with an official CAD analysis and quote within 2–4 hours.
              </p>

              <button 
                onClick={handleReset}
                className="btn-ghost"
                style={{ alignSelf: 'flex-start', background: 'transparent' }}
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form 
              onSubmit={handleSubmit}
              className="contact-fade-up" 
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              noValidate
            >
              <InputField 
                label="Name" 
                id="contact-name" 
                value={formValues.name}
                onChange={e => setFormValues(p => ({ ...p, name: e.target.value }))}
                error={errors.name}
                disabled={formStatus === 'submitting'}
                autoComplete="name"
              />

              <InputField 
                label="Email" 
                id="contact-email" 
                type="email"
                value={formValues.email}
                onChange={e => setFormValues(p => ({ ...p, email: e.target.value }))}
                error={errors.email}
                disabled={formStatus === 'submitting'}
                autoComplete="email"
                spellCheck={false}
              />

              <InputField 
                label="Phone" 
                id="contact-phone" 
                type="tel"
                value={formValues.phone}
                onChange={e => setFormValues(p => ({ ...p, phone: e.target.value }))}
                error={errors.phone}
                disabled={formStatus === 'submitting'}
                autoComplete="tel"
              />

              <SelectField 
                label="Service Interest"
                options={SERVICE_OPTIONS}
                value={formValues.service}
                onChange={val => setFormValues(p => ({ ...p, service: val }))}
                error={errors.service}
                disabled={formStatus === 'submitting'}
              />

              {/* Message Details */}
              <div style={{ position: 'relative', marginTop: '12px', marginBottom: '24px' }}>
                <label 
                  htmlFor="contact-message"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: (formValues.message && formValues.message.length > 0) ? '-12px' : '10px',
                    fontSize: (formValues.message && formValues.message.length > 0) ? '9px' : '13px',
                    fontFamily: 'var(--font-mono)',
                    color: errors.message ? '#ff6b6b' : 'var(--color-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    pointerEvents: 'none',
                  }}
                >
                  Project Details
                </label>
                <textarea 
                  id="contact-message"
                  value={formValues.message}
                  onChange={e => setFormValues(p => ({ ...p, message: e.target.value }))}
                  disabled={formStatus === 'submitting'}
                  rows={2}
                  style={{
                    width: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: errors.message 
                      ? '1px solid #ff6b6b' 
                      : '1px solid var(--color-hairline-strong)',
                    color: 'var(--color-ink)',
                    padding: '12px 0 8px 0',
                    outline: 'none',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    resize: 'none',
                    transition: 'all 0.3s ease',
                    opacity: formStatus === 'submitting' ? 0.5 : 1,
                  }}
                />
                {errors.message && (
                  <span style={{ 
                    display: 'block', 
                    color: '#ff6b6b', 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '9px', 
                    marginTop: '6px',
                    letterSpacing: '0.5px' 
                  }}>
                    ✕ {errors.message}
                  </span>
                )}
              </div>

              <button 
                type="submit"
                disabled={formStatus === 'submitting'}
                className="btn-brand" 
                style={{ 
                  alignSelf: 'flex-start',
                  minWidth: '160px',
                  height: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  opacity: formStatus === 'submitting' ? 0.7 : 1,
                  cursor: formStatus === 'submitting' ? 'not-allowed' : 'pointer'
                }}
              >
                {formStatus === 'submitting' ? (
                  <>
                    <span className="spinner" style={{
                      width: '14px', height: '14px',
                      border: '2px solid rgba(0,0,0,0.1)',
                      borderTop: '2px solid var(--color-canvas)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s infinite linear',
                    }} />
                    Sending Request…
                  </>
                ) : 'Send Message'}
              </button>
            </form>
          )}
        </div>

      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes receiptReveal {
          0% { opacity: 0; transform: translateY(15px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .social-anchor-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background-color: var(--color-ink);
          transition: width 0.3s ease;
        }
        .social-anchor-link:hover {
          color: var(--color-ink) !important;
        }
        .social-anchor-link:hover::after {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
