---
version: 1.0
name: PLAKZO Design System
description: Industrial 3D printing business website. Dark industrial aesthetic with scroll-linked frame animation, gamified journey section, and three responsive experiences (desktop gamified scroll, tablet Plasma background, mobile accordion layout).
---

# PLAKZO Design System

## 1. Brand Identity

### Philosophy
**"Industrial Precision meets Modern Craft"** — A dark, technical aesthetic that signals engineering quality. PLAKZO uses a dark canvas with clean white typography and subtle accent colors to highlight interactive elements. The design communicates precision, reliability, and modern manufacturing capability.

### Voice
- Technical but approachable
- Precise language — no fluff
- Uppercase display headlines for authority
- Sentence-case body for readability
- Mono-spaced labels for engineering precision

### Visual Language
- Pure black canvas as the foundation
- White typography for maximum contrast
- Subtle gradient accents for depth
- Frame-based animation as the primary interaction model
- Gamification to drive engagement through the journey section

---

## 2. Design Tokens

### Colors

**Source of truth:** CSS custom properties in `src/index.css`

```css
:root {
  /* Canvas */
  --color-canvas: #000000;        /* Page background — pure black */
  --color-ink: #ffffff;           /* Primary text, headlines — pure white */

  /* Body Text */
  --color-body: #cccccc;          /* Running text — slightly cooler than white */
  --color-body-strong: #e6e6e6;   /* Emphasized body / lead paragraphs */

  /* Muted */
  --color-muted: #999999;         /* Labels, captions, secondary text */
  --color-muted-soft: #666666;    /* Tertiary text, very secondary */

  /* Hairline */
  --color-hairline: #262626;      /* Dividers, borders — visible but quiet */
  --color-hairline-strong: #3a3a3a; /* Input underlines, heavier dividers */

  /* Surface */
  --color-surface-soft: #0d0d0d;  /* Barely-different-from-black tone */
  --color-surface-card: #141414;  /* Card backgrounds — nearly black */
  --color-surface-elevated: #1f1f1f; /* Elevated surfaces */

  /* Accent */
  --color-link: #c3d9f3;          /* Links, primary accent — desaturated ice-blue */
  --color-brand: #7c3aed;         /* Purple accent — rare, used sparingly */
}
```

**Tailwind mapping:** `tailwind.config.js` extends the same values as Tailwind utility classes. CSS custom properties remain canonical.

### Journey Step Colors

| Step | Color | Glow | Usage |
|---|---|---|---|
| Concept | `#c3d9f3` | `rgba(195,217,243,0.15)` | Ice-blue — vision, ideation |
| Design | `#a8edca` | `rgba(168,237,202,0.15)` | Green — engineering, precision |
| 3D Printing | `#f9c98e` | `rgba(249,201,142,0.15)` | Orange — material, creation |
| Deliver | `#e8a0cf` | `rgba(232,160,207,0.15)` | Pink — completion, delivery |

### Typography

**Font families** (loaded via Google Fonts in `index.html`):

| Family | Weights | Role |
|---|---|---|
| `Saira Condensed` | 300, 400, 600, **700** | Display headlines, section titles, wordmark |
| `DM Sans` | 300, 400, 500 | Body text, descriptions, paragraphs |
| `JetBrains Mono` | 400, 500 | Labels, captions, buttons, nav links |

**CSS custom properties:**

```css
:root {
  --font-display: 'Saira Condensed', sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

**Usage rules:**

| Element | Font | Weight | Size | Letter Spacing | Transform |
|---|---|---|---|---|---|
| Hero h1 | Saira Condensed | 700 | `clamp(30px, 4.2vw, 62px)` | 4px | uppercase |
| Section title | Saira Condensed | 600–700 | `clamp(24px, 3.5vw, 48px)` | 2–3px | uppercase |
| Card title | Saira Condensed | 600–700 | `clamp(15px, 2vw, 22px)` | 1.5–2px | uppercase |
| Body text | DM Sans | 400 | 13–16px | 0 | sentence-case |
| Button label | JetBrains Mono | 500 | 12–14px | 2–2.5px | uppercase |
| Nav link | JetBrains Mono | 400 | 12px | 2px | uppercase |
| Caption/tag | JetBrains Mono | 400 | 8–11px | 1.5–2px | uppercase |

**Bold weight is allowed.** Headlines use weight 700 for emphasis. This is a core part of PLAKZO's visual language — not a violation.

### Spacing

```css
:root {
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
  --space-xxl: 64px;
  --space-section: 120px;  /* Between major sections */
}
```

### Border Radius

```css
:root {
  --radius-none: 10px;   /* Cards, inputs, containers */
  --radius-pill: 9999px; /* Buttons only */
}
```

**Rule:** Cards use `10px` border-radius. Buttons use pill shape (`9999px`). No values in between.

### Shadows & Elevation

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Body, nav, footer |
| Hairline | 1px `--color-hairline` border | Section dividers, cards |
| Card | `--color-surface-card` bg + subtle shadow | Active cards, elevated surfaces |
| Glow | Colored `box-shadow` with step accent | Journey cards (active/hovered) |

---

## 3. Animation Rules

### Timing Standards

| Property | Value | Use |
|---|---|---|
| Duration | 0.3–0.6s | All transitions and reveals |
| Easing | `power2.out`, `power3.out` | Most animations |
| Stagger | 0.05–0.15s | Sequential element reveals |
| Scroll-linked | `linear` interpolation | Frame playback, progress bars |

### GSAP Plugin Registry

```javascript
gsap.registerPlugin(ScrambleTextPlugin, SplitText, ScrollTrigger)
```

| Plugin | Use |
|---|---|
| `ScrollTrigger` | Scroll-linked animations, section reveals |
| `SplitText` | Character-by-character text reveals |
| `ScrambleTextPlugin` | "WHAT WE DO" scramble effect on Services heading |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
}
```

**All GSAP animations check `prefers-reduced-motion` before executing.** If reduced motion is preferred, animations are skipped or reduced to 0.01ms.

### Scroll-Linked Animation Patterns

**Pattern 1: Progress-based opacity**
```javascript
function phaseOpacity(p, inEnd, outStart, outEnd) {
  if (p < 0) return 0
  if (p < inEnd) return p / inEnd       // Fade in
  if (p < outStart) return 1            // Hold
  if (p < outEnd) return 1 - (p - outStart) / (outEnd - outStart) // Fade out
  return 0
}
```

**Pattern 2: Phase-in (no fade out)**
```javascript
function phaseIn(p, inStart, inEnd) {
  if (p <= inStart) return 0
  if (p < inEnd) return (p - inStart) / (inEnd - inStart)
  return 1
}
```

---

## 4. Scroll Architecture (Desktop)

### ScrollFrameSequence Overview

The desktop experience is a single sticky viewport with a scroll-linked frame animation. The user scrolls through a `1100vh` spacer while 191 pre-rendered frames play in sync. Content sections are overlaid on top of the frame sequence and fade in/out at specific scroll progress thresholds.

**Key files:**
- `src/components/ScrollFrameSequence.jsx` — Reusable scroll-linked frame player
- `src/components/ShowcaseScroll.jsx` — Main desktop experience

**Frame sequence:**
- Frame range: 1–191
- Source: Cloudinary (`plakzo/main-scroll/ezgif-frame-*.png`)
- Spacer height: `1100vh` (11× viewport height)
- Total scroll range: `1200vh` (viewport + spacer)

### Progress-to-Section Mapping

| Progress Range | Section | Behavior |
|---|---|---|
| 0.00–0.08 | Hero | Hold visible |
| 0.08–0.13 | Hero | Fade out |
| 0.11–0.17 | Services | Fade in |
| 0.14 | Services | Animation trigger (scramble + SplitText) |
| 0.21–0.26 | Services | Fade out |
| 0.22–0.28 | Materials | Fade in |
| 0.32–0.37 | Materials | Fade out |
| 0.33–0.39 | Why Choose | Fade in |
| 0.43–0.48 | Why Choose | Fade out |
| 0.44–0.49 | Journey | Fade in |
| 0.49–0.68 | Journey | **Gamification window** (frame frozen at 120) |
| 0.68–0.73 | Journey | Fade out |
| 0.70–0.76 | Gallery | Fade in |
| 0.83–0.89 | Gallery | Fade out |
| 0.86–0.93 | Contact | Fade in (stays visible) |

### Gamification Mechanics

During progress 0.49–0.68, the Journey section enters "gamification mode":

1. **Frame freeze:** ScrollFrameSequence locks on frame 120
2. **Step activation:** Each of 4 Journey cards unlocks as progress advances
3. **Progress bar:** Fills with gradient matching step colors
4. **3D tilt cards:** Cards respond to mouse with perspective tilt
5. **Glow effects:** Active cards emit colored glow matching step accent

**Step unlock mapping:**
```javascript
const stepIdx = Math.min(Math.floor(gameProgress * JOURNEY_STEPS.length), JOURNEY_STEPS.length - 1)
```

- 0–25%: Concept active
- 25–50%: Design active
- 50–75%: 3D Printing active
- 75–100%: Deliver active

### Frame Freeze Behavior

When gamification starts (progress 0.49):
```javascript
setFrameOverride(JNY_FREEZE_FRAME) // Freeze on frame 120
```

When gamification ends (progress 0.68):
```javascript
setFrameOverride(null) // Resume normal scroll playback
```

---

## 5. Responsive Strategy

### Three Separate Experiences

The site renders three distinct experiences based on viewport width. These are not degraded versions — they're intentionally different interaction models.

| Mode | Breakpoint | Component | Scroll Model | Background |
|---|---|---|---|---|
| Desktop | `> 1200px` | `ShowcaseScroll` | Scroll-linked frame animation | Frame sequence |
| Tablet | `768–1200px` | `ShowcaseTablet` | Traditional scroll + ScrollTrigger | Plasma (animated gradient) |
| Mobile | `< 768px` | `ShowcaseMobile` | Traditional scroll | Static |

### Desktop Experience (`ShowcaseScroll`)

- Single sticky viewport with overlaid sections
- 191 frames played via scroll position
- Sections fade in/out at progress thresholds
- Gamification in Journey section
- TargetCursor on gallery items
- Gooey mobile nav (hamburger → overlay)

### Tablet Experience (`ShowcaseTablet`)

- Traditional scroll with GSAP ScrollTrigger reveals
- Plasma animated gradient background
- Journey section uses timeline layout (alternating left/right cards) instead of gamification
- Services use 2-column accordion grid
- Materials show progress bars for properties (strength, flexibility, durability)
- Hero uses bento collage layout with parallax images

### Mobile Experience (`ShowcaseMobile`)

- Simplified scroll with accordion-based services
- Hamburger nav with gooey overlay
- Journey cards stack vertically
- Gallery uses simplified grid
- Contact form with mobile-optimized inputs

### Breakpoint Definitions

| Name | Width | Key Changes |
|---|---|---|
| Mobile | `< 768px` | Hamburger nav, accordion cards, stacked layout |
| Tablet | `768–1200px` | Desktop nav, Plasma background, timeline journey |
| Desktop | `> 1200px` | Full scroll-linked experience, gamification |

---

## 6. Component Reference

### Navigation (`Navbar.jsx`)

**Desktop nav:** Fixed top bar with centered nav links. Logo left, links centered. Links use JetBrains Mono 12px, uppercase, 2px tracking. Active link has white underline.

**Mobile nav:** Hamburger icon → fullscreen gooey overlay. SVG filter creates blob effect on nav items. Items stagger in with elastic easing. Close button at bottom.

**Active section tracking:** Scroll progress maps to nav index:
```javascript
if (progress >= 0.86) idx = 5      // Contact
else if (progress >= 0.68) idx = 4 // Gallery
else if (progress >= 0.33) idx = 3 // Journey
else if (progress >= 0.22) idx = 2 // Materials
else if (progress >= 0.11) idx = 1 // Services
else idx = 0                       // Home
```

### Hero Section

**Desktop:** Left-aligned text over frame animation. Badge ("DESIGN • PRINT • DELIVER"), headline, description, CTA buttons. Scroll hint fades out at progress 0.04.

**Tablet:** Center-aligned with bento collage (3 images: CAD design, industrial parts, photo lamps). Parallax on images.

**Mobile:** Stacked layout with simplified hero text.

### Services Section

**Desktop:** Left heading ("WHAT WE DO" scramble + "Our Service" SplitText reveal) with right-aligned service list. 5 services with number, title, description, tags. Hairline dividers between rows.

**Tablet:** 2-column accordion grid. Click to expand/collapse. Active card has white border and glow.

**Mobile:** Vertical accordion cards with expand/collapse animation.

**Services data:**
| # | Title | Tags |
|---|---|---|
| 01 | Industrial Plastic Parts | Industrial, Functional, PLA/ABS/TPU |
| 02 | Custom Photo Lamps | Decorative, Personalized, Gift |
| 03 | Custom Keychains | Personalized, Compact, Gift |
| 04 | CAD Design Services | SolidWorks, Prototyping, Design |
| 05 | Customized Bottle Caps | Branding, Events, Custom |

### Materials Section

**Desktop:** Center-aligned. 3 material cards (PLA, ABS, TPU) with border, accent label, and material name.

**Tablet:** Detailed cards with property bars (strength, flexibility, durability) that animate on scroll.

| Material | Strength | Flexibility | Durability | Label |
|---|---|---|---|---|
| PLA | 60% | 20% | 50% | Eco-Friendly |
| ABS | 85% | 40% | 80% | Industrial Strength |
| TPU | 70% | 100% | 95% | Flexible & Elastic |

### Why Choose Section

**Desktop:** Right-aligned with ChromaGrid component. 6 cards with spotlight effect on mouse hover.

**Cards:**
1. High Quality — Rigorous checks at every stage
2. Custom Solutions — Tailored to your exact needs
3. Fast Turnaround — On-time, every time
4. Affordable Pricing — Value without compromise
5. Wide Range — PLA, ABS, TPU & more
6. Customer Satisfaction — We don't stop until you're happy

### Journey Section

**Desktop:** Gamified 4-card layout with progress bar. Cards unlock as user scrolls (progress 0.49–0.68). 3D tilt on hover, glow effects, step connector pins.

**Tablet:** Alternating timeline layout with center vertical line. Cards clickable to expand. Active cards have colored border and glow.

**Journey steps:**
| # | Title | Subtitle | Color |
|---|---|---|---|
| 01 | Concept | Your Vision Starts Here | `#c3d9f3` |
| 02 | Design | Engineering Meets Precision | `#a8edca` |
| 03 | 3D Printing | Material Meets Reality | `#f9c98e` |
| 04 | Deliver | Doorstep Precision | `#e8a0cf` |

### Gallery Section

**Desktop:** Center-aligned grid. 6 items with frame-based scroll experience. Each item has:
- Thumbnail image
- Tag badge (top-left)
- Label (bottom)
- Accent corner marks (top-left, bottom-right SVG lines)
- Click navigates to `/gallery/:slug`

**Gallery items:**
| Slug | Label | Tag | Accent | Frames |
|---|---|---|---|---|
| `industrial-parts` | Industrial Parts | Industrial | `#c3d9f3` | 138 |
| `photo-lamps` | Photo Lamps | Gift | `#f9c98e` | 158 |
| `keychains` | Keychains | Gift | `#a8edca` | 155 |
| `cad-design` | CAD Design | CAD | `#b9a0ef` | 139 |
| `bottle-caps` | Bottle Caps | Industrial | `#e8a0cf` | 152 |
| `prototypes` | Prototypes | Prototype | `#a0d8ef` | 110 |

**Hover effect:** Image scales to 1.02× with cubic-bezier transition.

### Contact Section

**Desktop:** 2-column grid (info left, form right).

**Left column:**
- CoimbatoreCoordinatesVisual (animated radar/pulse SVG)
- Contact info (email, Instagram, location)
- Social links (Facebook, Instagram, WhatsApp, LinkedIn)

**Right column:**
- Floating label form (name, email, phone, service interest, project details)
- Custom select dropdown (not native)
- Form validation with inline errors
- Simulated submission with ticket ID (`PLK-#####`)
- Success receipt with animated reveal

**Form system rules:**
- Floating labels animate up on focus/filled
- Inputs use transparent background with hairline bottom border
- Focus state: white bottom border
- Error state: red bottom border + error message
- Submit button: pill shape, white background, black text

### Footer

**Tablet/Mobile:** 3-column grid (Brand, Quick Links, Contact). Bottom row with copyright and tagline.

**Footer links:** Home, Services, Materials, Gallery, About, Contact

**Contact info:**
- Phone: +91 93856 48198
- Email: plakzo3dprinting@gmail.com
- Location: Coimbatore, Tamil Nadu, India

### Loading Screen

**Desktop:** Full-screen overlay with PLAKZO logo, progress bar, and percentage. Progress synced to frame preload count (70% = 134 of 191 frames). Fades out when complete.

**Tablet/Mobile:** Timer-driven progress (increments by 2 every 30ms).

---

## 7. Custom Components

### TargetCursor (`TargetCursor.jsx`)

Custom cursor with spinning corners that lock onto gallery items.

- **Behavior:** White dot + 4 corner brackets spinning at 2s interval
- **On hover:** Spinning stops, corners animate to target element bounds
- **Parallax:** Corners track mouse position with lerp for depth effect
- **Scope:** Only active within gallery section (`containerRef`)
- **Mobile:** Disabled on touch devices

### ChromaGrid (`ChromaGrid.jsx`)

Spotlight-follow grid with grayscale mask.

- **Behavior:** Grid of cards with per-card spotlight on mouse hover
- **Grayscale mask:** `backdrop-filter: grayscale(1) brightness(0.68)` with CSS `mask-image` radial gradient
- **Mouse tracking:** GSAP `quickSetter` for smooth `--x`, `--y` CSS variable updates
- **Fade overlay:** Covers grid when cursor leaves, fades out with configurable duration
- **Props:** `columns`, `cardW`, `cardH`, `gap`, `radius`, `damping`, `fadeOut`

### Galaxy (`Galaxy.jsx`)

WebGL star field using OGL (not Three.js).

- **Renderer:** OGL `Renderer` with alpha blending
- **Shader:** Fragment shader with star layers, mouse repulsion, auto-rotation, twinkle
- **Props:** `focal`, `rotation`, `starSpeed`, `density`, `hueShift`, `mouseRepulsion`, `rotationSpeed`
- **Mouse interaction:** Optional repulsion or offset based on cursor position

### Waves (`Waves.jsx`)

Canvas-based perlin noise wave mesh.

- **Renderer:** 2D Canvas with perlin noise displacement
- **Mouse reactive:** Points displace toward cursor with friction/tension physics
- **Props:** `lineColor`, `waveSpeedX`, `waveSpeedY`, `waveAmpX`, `waveAmpY`, `friction`, `tension`

### Plasma (`Plasma.jsx`)

Fixed background gradient blob with animated movement.

- **Use case:** Tablet layout background
- **Props:** `color`, `speed`, `direction`, `scale`, `opacity`, `mouseInteractive`

### ScrollFrameSequence (`ScrollFrameSequence.jsx`)

Reusable scroll-linked frame animation component.

- **Props:** `frameStart`, `frameEnd`, `framePath`, `scrollTriggerId`, `spacerHeight`, `children`, `onProgress`, `onFrameChange`, `frameOverride`
- **Behavior:** Sticky viewport + scroll spacer. Maps scroll position to frame number. Supports frame override for gamification.
- **Preloading:** Loads all frames into `Image()` cache on mount

---

## 8. Performance Patterns

### Preloading Strategy

**Main scroll frames:**
1. On mount, preload first 134 frames (70% of 191)
2. Show loading screen until target reached
3. After target reached, preload remaining 57 frames in background
4. Simultaneously start `GalleryPreloader.preloadAll()` for gallery frames

**Gallery frames:**
- `GalleryPreloader` preloads all 6 gallery item frame sequences in background
- Triggered after main scroll reaches 70%
- Each gallery has 110–158 frames

### Cloudinary Asset Structure

```
plakzo/
├── main-scroll/
│   ├── ezgif-frame-001.png
│   ├── ezgif-frame-002.png
│   └── ... (191 frames)
├── frames/
│   ├── industrial-parts/
│   │   └── ezgif-frame-*.png (138 frames)
│   ├── photo-lamps/
│   │   └── ezgif-frame-*.png (158 frames)
│   ├── keychains/
│   │   └── ezgif-frame-*.png (155 frames)
│   ├── cad-design/
│   │   └── ezgif-frame-*.png (139 frames)
│   ├── bottle-caps/
│   │   └── ezgif-frame-*.png (152 frames)
│   └── prototypes/
│       └── ezgif-frame-*.png (110 frames)
├── thumbnails/
│   ├── gallery_industrial_parts.png
│   ├── gallery_photo_lamp.png
│   └── ... (6 thumbnails)
└── logos/
    └── plakzo_logo_new.jpeg
```

**URL pattern:** `https://res.cloudinary.com/dafi2yzol/image/upload/f_auto,q_auto/plakzo/{path}`

### Frame Count Management

- Main scroll: 191 frames
- Gallery items: 110–158 frames each
- Total frames: ~1,000+ across all experiences
- All frames served from Cloudinary with auto-format (`f_auto`) and auto-quality (`q_auto`)

---

## 9. Do's and Don'ts

### Do

- Use dark canvas (`#000000`) as the default background
- Use Saira Condensed 700 for headlines — bold is part of the brand
- Use JetBrains Mono for all labels, captions, and buttons
- Use CSS custom properties for all design tokens — never inline hex
- Check `prefers-reduced-motion` before running GSAP animations
- Use `ScrollFrameSequence` for any scroll-linked frame animation
- Document progress thresholds when adding new sections to desktop scroll
- Use pill shape (`9999px`) for all buttons
- Use `10px` border-radius for cards and containers

### Don't

- Don't use Bugatti fonts or Bugatti design principles — PLAKZO has its own identity
- Don't skip the loading screen — frames must preload before experience starts
- Don't add sections to desktop scroll without updating progress thresholds
- Don't use native `<select>` — use custom `SelectField` component
- Don't add backend logic to contact form — it's UI-only
- Don't mix font families across roles (e.g., don't use Saira Condensed in body text)
- Don't compress whitespace between sections — the spacing is intentional
- Don't add rounded corners outside buttons — cards stay at `10px`
- Don't use animation durations outside 0.3–0.6s range
- Don't ignore mobile — three experiences must be maintained equally

---

## Appendix: File Reference

| File | Purpose |
|---|---|
| `src/index.css` | Design tokens, button classes, reduced-motion, scrollbar, selection |
| `src/components/ShowcaseScroll.jsx` | Desktop scroll experience, progress thresholds, gamification |
| `src/components/ShowcaseTablet.jsx` | Tablet experience, Plasma background, timeline journey |
| `src/components/ScrollFrameSequence.jsx` | Reusable scroll-linked frame player |
| `src/components/Navbar.jsx` | Desktop nav, gooey mobile nav |
| `src/components/Contact.jsx` | Contact form, floating labels, receipt |
| `src/components/ChromaGrid.jsx` | Spotlight grid for "Why Choose" |
| `src/components/TargetCursor.jsx` | Custom cursor for gallery |
| `src/components/Galaxy.jsx` | WebGL star field |
| `src/components/Waves.jsx` | Canvas perlin noise waves |
| `src/components/Plasma.jsx` | Animated gradient background |
| `src/components/LoadingScreen.jsx` | Loading progress screen |
| `src/data/galleryItems.js` | Gallery item data and Cloudinary URLs |
| `src/lib/cloudinary.js` | Cloudinary URL builders |
| `src/lib/galleryPreloader.js` | Background frame preloading |
| `tailwind.config.js` | Tailwind token mapping |
| `index.html` | Font loading, meta tags |
