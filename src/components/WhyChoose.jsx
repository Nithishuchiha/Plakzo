import ScrollStack, { ScrollStackItem } from './ScrollStack'

// ─── SVG icons (no emoji) ────────────────────────────────────────
const REASON_ICONS = [
  // 01 High Quality — badge/check
  <svg key="quality" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>,
  // 02 Custom Solutions — sliders
  <svg key="custom" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
    <circle cx="8" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="10" cy="18" r="2" />
  </svg>,
  // 03 Fast Turnaround — clock arrow
  <svg key="fast" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <circle cx="12" cy="12" r="9" /><polyline points="12,7 12,12 15,15" /><polyline points="19,3 21,5 19,7" />
  </svg>,
  // 04 Affordable — diamond
  <svg key="price" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
    <polygon points="12,2 22,9 18,22 6,22 2,9" />
    <line x1="2" y1="9" x2="22" y2="9" />
  </svg>,
  // 
                  color: 'var(--color-muted)',
                }}>
                  {REASON_ICONS[i]}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="text-display-sm" style={{
                    fontSize: '14px',
                    letterSpacing: '1.5px',
                    marginBottom: '6px',
                    color: 'var(--color-ink)',
                  }}>
                    {reason.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    color: 'var(--color-body)',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    maxWidth: '560px',
                  }}>
                    {reason.description}
                  </p>
                </div>
                <div style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <div style={{ width: '1px', height: '24px', background: 'var(--color-hairline-strong)' }} />
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    letterSpacing: '1px',
                    color: 'var(--color-muted-soft)',
                  }}>
                    {String(i + 1).padStart(2, '0')}/{REASONS.length}
                  </span>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  )
}
