import React, { useRef, useState } from 'react';

export default function Dock({ items }) {
  const containerRef = useRef(null);
  const [scales, setScales] = useState(items.map(() => 1));

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const children = Array.from(containerRef.current.children);
    const rects = children.map(child => child.getBoundingClientRect());
    const mouseX = e.clientX;

    const newScales = rects.map(rect => {
      const centerX = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - centerX);
      const maxDist = 100; // range of influence
      if (dist < maxDist) {
        const factor = 1 - dist / maxDist; // 0 to 1
        // Smooth scaling profile
        return 1 + (Math.sin(factor * Math.PI / 2) * 0.4); 
      }
      return 1;
    });
    setScales(newScales);
  };

  const handleMouseLeave = () => {
    setScales(items.map(() => 1));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '12px',
        height: '52px', 
        padding: '0 4px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {items.map((item, i) => (
        <a
          key={i}
          href={item.href}
          target={item.href.startsWith('http') || item.href.startsWith('mailto') ? '_blank' : undefined}
          rel="noopener noreferrer"
          aria-label={item.label}
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-ink)',
            borderRadius: '9999px', 
            color: 'var(--color-ink)',
            textDecoration: 'none',
            transform: `scale(${scales[i] || 1})`,
            transformOrigin: 'bottom center',
            transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s',
            background: 'transparent',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
