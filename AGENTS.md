# PLAKZO — Agent Instructions

## Project

Industrial 3D printing business website. Single-page React app with anchor navigation.

- **Content source:** `details.md` — all brand info, services, materials, contact
- **Design system:** `DESIGN.md` — colors, typography, spacing, components
- **Reference mockup:** `ChatGPT Image May 31, 2026, 06_20_46 AM.png`

## Tech Stack

- React 18+ with Vite
- JavaScript (not TypeScript)
- GSAP — scroll animations, page transitions, reveal effects
- Three.js — 3D product showcase on Product section
- Tailwind CSS — utility styling (use design tokens, not arbitrary values)

## Architecture

Single-page app with 4 anchor sections:

| Route Anchor | Section | Key Features |
|---|---|---|
| #home | Hero | Badge, headline, feature icons, CTA |
| #about | About | Company info, process steps |
| #product | Product | 3D interactive showcase (Three.js) |
| #contact | Contact | Form (UI only), social links |

## Design Rules

1. **Read `DESIGN.md` before writing any UI.** It defines colors, typography, spacing, components.
2. Light theme — white canvas, dark blue primary, purple accent.
3. 3-font system: Display (headlines), Body (paragraphs), Mono (buttons/nav).
4. Never inline hex values — always use design tokens.
5. Cards: 0px border-radius. Buttons: pill (9999px). No rounded corners in between.

> **Note:** Current DESIGN.md contains a Bugatti-themed analysis. Replace it with PLAKZO design tokens before building UI.

## Animation Rules

1. GSAP for scroll-triggered reveals, section fade-ins, parallax.
2. Three.js only in Product section — interactive 3D model viewer.
3. Keep animations subtle — 0.3-0.6s duration, ease-out curves.
4. Respect `prefers-reduced-motion` — disable animations for accessibility.

## Skills

Use these skills when working on UI tasks:
- `web-design-guidelines` — accessibility, responsive design, UX patterns
- `ui-ux-pro-max` — component design, design tokens, layout

## Dev Commands

After scaffolding (commands will be added once package.json exists):
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — lint check

## File Structure (planned)

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Product.jsx      (Three.js integration)
│   ├── Contact.jsx
│   └── Footer.jsx
├── assets/
├── styles/
├── App.jsx
└── main.jsx
public/
├── models/              (3D model files for Three.js)
└── images/
```

## Don'ts

- Don't use TypeScript — this project uses plain JavaScript.
- Don't add new dependencies without checking if an existing one covers it.
- Don't hardcode colors — always reference DESIGN.md tokens.
- Don't skip the Product section's Three.js integration — it's a core feature.
- Don't add backend logic — contact form is UI-only for now.
