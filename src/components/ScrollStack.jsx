import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';

/* ─── Card wrapper ─────────────────────────────────────────────────── */
export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden',
      backgroundColor: '#0a0a0a',
      border: '1px solid var(--color-hairline)',
      borderRadius: 'var(--radius-none)',
      // Compact height — no minHeight forces natural content height
      padding: '24px 40px',
    }}
  >
    {children}
  </div>
);

/* ─── ScrollStack ──────────────────────────────────────────────────── */
const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  useWindowScroll = false,
  onStackComplete,
}) => {
  // containerRef always points at the wrapper div for scoped DOM queries
  const containerRef = useRef(null);
  // scrollerRef only used in container-scroll mode
  const scrollerRef = useRef(null);

  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  // KEY FIX: store each card's natural document offset, measured ONCE before
  // any transforms are applied. getBoundingClientRect() is transform-aware so
  // calling it per-frame creates a feedback loop → jitter.
  const cardOffsetsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  /* scrollTop + viewport height depending on scroll mode */
  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return { scrollTop: window.scrollY, containerHeight: window.innerHeight };
    }
    const scroller = scrollerRef.current;
    return {
      scrollTop: scroller ? scroller.scrollTop : 0,
      containerHeight: scroller ? scroller.clientHeight : 0,
    };
  }, [useWindowScroll]);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  /* ── Core transform loop ─────────────────────────────────────────── */
  const updateCardTransforms = useCallback(() => {
    const cards = cardsRef.current;
    const offsets = cardOffsetsRef.current;
    if (!cards.length || !offsets.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    // Scope end-sentinel to our container
    const endElement = containerRef.current?.querySelector('.scroll-stack-end') ?? null;
    // End offset also cached as static — use offsetTop relative to document
    const endElementTop = endElement
      ? endElement.getBoundingClientRect().top + window.scrollY
      : 0;

    cards.forEach((card, i) => {
      if (!card) return;

      // Use the pre-cached static offset — never re-measure with getBoundingClientRect
      const cardTop = offsets[i];

      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd   = cardTop - scaleEndPositionPx;
      const pinStart     = triggerStart;
      const pinEnd       = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale   = baseScale + i * itemScale;
      const scale         = 1 - scaleProgress * (1 - targetScale);

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      // Round to avoid sub-pixel thrashing while keeping smoothness
      const ty = Math.round(translateY * 10) / 10;
      const sc = Math.round(scale * 10000) / 10000;

      const last = lastTransformsRef.current.get(i);
      const changed =
        !last ||
        Math.abs(last.ty - ty) > 0.05 ||
        Math.abs(last.sc - sc) > 0.0005;

      if (changed) {
        card.style.transform = `translate3d(0, ${ty}px, 0) scale(${sc})`;
        lastTransformsRef.current.set(i, { ty, sc });
      }

      if (i === cards.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  /* ── Lenis smooth-scroll setup ──────────────────────────────────── */
  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075,
      });
      lenis.on('scroll', handleScroll);
      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
      return lenis;
    }

    const scroller = scrollerRef.current;
    if (!scroller) return;
    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector('.scroll-stack-inner'),
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      wheelMultiplier: 1,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
    });
    lenis.on('scroll', handleScroll);
    const raf = time => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;
    return lenis;
  }, [handleScroll, useWindowScroll]);

  /* ── Mount: cache offsets BEFORE any transforms run ─────────────── */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scoped query — never touches sibling sections
    const cards = Array.from(container.querySelectorAll('.scroll-stack-card'));
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    // Apply baseline styles before measuring
    cards.forEach((card, i) => {
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      // Reset transform so getBoundingClientRect reflects the natural position
      card.style.transform = 'none';
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
    });

    // KEY: measure natural document offset NOW, before any transforms are set.
    // getBoundingClientRect() + scrollY = stable absolute-document position
    // that won't change as we move cards around.
    cardOffsetsRef.current = cards.map(card => {
      const rect = card.getBoundingClientRect();
      return rect.top + window.scrollY;
    });

    // Set container height to accommodate full scroll animation
    if (useWindowScroll && cards.length > 0) {
      const firstCardTop = cardOffsetsRef.current[0];
      const lastCard = cards[cards.length - 1];
      const lastCardRect = lastCard.getBoundingClientRect();
      const lastCardBottom = lastCardRect.bottom + window.scrollY;
      // Total content span + extra space for stacking animation to complete
      const contentSpan = lastCardBottom - firstCardTop;
      const animationBuffer = cards.length * itemStackDistance + 300;
      container.style.minHeight = `${contentSpan + animationBuffer}px`;
    }

    setupLenis();
    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
      stackCompletedRef.current = false;
      cardsRef.current = [];
      cardOffsetsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    useWindowScroll,
    setupLenis,
    updateCardTransforms,
  ]);

  /* ── Render ──────────────────────────────────────────────────────── */
  if (useWindowScroll) {
    // Window-scroll: outer div is the scoped container for queries
    return (
      <div
        ref={containerRef}
        className={`relative w-full ${className}`.trim()}
        style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}
      >
        <div
          className="scroll-stack-inner"
          style={{
            paddingTop: '0',
            paddingLeft: 'var(--space-xl)',
            paddingRight: 'var(--space-xl)',
            paddingBottom: '8rem',
          }}
        >
          {children}
          <div className="scroll-stack-end w-full h-px" />
        </div>
      </div>
    );
  }

  // Container-scroll: scrollerRef drives Lenis; containerRef scopes queries
  return (
    <div
      ref={el => { containerRef.current = el; scrollerRef.current = el; }}
      className={`relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim()}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollBehavior: 'smooth',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        willChange: 'scroll-position',
      }}
    >
      <div
        className="scroll-stack-inner min-h-screen"
        style={{
          paddingTop: '0',
          paddingLeft: 'var(--space-xl)',
          paddingRight: 'var(--space-xl)',
          paddingBottom: '16rem',
        }}
      >
        {children}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
