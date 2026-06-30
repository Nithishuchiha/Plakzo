# Graph Report - Plakzo  (2026-06-30)

## Corpus Check
- 46 files · ~43,403 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 409 nodes · 497 edges · 26 communities (25 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `77ca9250`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_UI Components & Navbar Navigation|UI Components & Navbar Navigation]]
- [[_COMMUNITY_Project Development & DevDependencies|Project Development & DevDependencies]]
- [[_COMMUNITY_Core Animation & UI Styling Libraries|Core Animation & UI Styling Libraries]]
- [[_COMMUNITY_React Bits Components Registry|React Bits Components Registry]]
- [[_COMMUNITY_Asset Preloader & Media Cloudinary Integration|Asset Preloader & Media Cloudinary Integration]]
- [[_COMMUNITY_Package Core Dependencies|Package Core Dependencies]]
- [[_COMMUNITY_Contact Section & Social Icons|Contact Section & Social Icons]]
- [[_COMMUNITY_Gallery Showcase Page Routing|Gallery Showcase Page Routing]]
- [[_COMMUNITY_Perlin Noise Wave Animation Math|Perlin Noise Wave Animation Math]]
- [[_COMMUNITY_Brand Assets, CAD Design & 3D Materials|Brand Assets, CAD Design & 3D Materials]]
- [[_COMMUNITY_JSConfig Path Resolving|JSConfig Path Resolving]]
- [[_COMMUNITY_Cloudinary Assets Automation Script|Cloudinary Assets Automation Script]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]

## God Nodes (most connected - your core abstractions)
1. `GSAP Core` - 16 edges
2. `GSAP ScrollTrigger` - 15 edges
3. `Mobile App UI/UX Design Skill` - 13 edges
4. `cloudinaryUrl()` - 11 edges
5. `GSAP Timeline` - 11 edges
6. `PLAKZO Design System` - 11 edges
7. `6. Component Reference` - 11 edges
8. `PLAKZO — Project Details` - 11 edges
9. `Industry-Specific Design Languages` - 10 edges
10. `PLAKZO — Agent Instructions` - 10 edges

## Surprising Connections (you probably didn't know these)
- `DesktopNav()` --calls--> `cloudinaryUrl()`  [EXTRACTED]
  src/components/Navbar.jsx → src/lib/cloudinary.js
- `MobileNavbar()` --calls--> `cloudinaryUrl()`  [EXTRACTED]
  src/components/ShowcaseScroll.jsx → src/lib/cloudinary.js
- `ShowcaseMobile()` --calls--> `cloudinaryUrl()`  [EXTRACTED]
  src/components/ShowcaseScroll.jsx → src/lib/cloudinary.js
- `Navbar()` --calls--> `cloudinaryUrl()`  [EXTRACTED]
  src/components/Navbar.jsx → src/lib/cloudinary.js
- `ShowcaseTablet()` --calls--> `cloudinaryUrl()`  [EXTRACTED]
  src/components/ShowcaseTablet.jsx → src/lib/cloudinary.js

## Import Cycles
- None detected.

## Communities (26 total, 1 thin omitted)

### Community 0 - "UI Components & Navbar Navigation"
Cohesion: 0.06
Nodes (31): ChromaGrid(), Galaxy(), LoadingScreen(), DesktopNav(), NAV_LINKS, Navbar(), PillNav(), Plasma() (+23 more)

### Community 1 - "Project Development & DevDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, autoprefixer, eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, gh-pages, postcss (+4 more)

### Community 2 - "Core Animation & UI Styling Libraries"
Cohesion: 0.12
Nodes (15): GSAP Animations, React + Vite Stack, Tailwind CSS, Three.js Showcase, DEFAULT_ITEMS, Materials, STEP_ICONS, buildFrameUrl() (+7 more)

### Community 3 - "React Bits Components Registry"
Cohesion: 0.12
Nodes (16): aliases, components, utils, iconLibrary, registries, @react-bits, rsc, $schema (+8 more)

### Community 4 - "Asset Preloader & Media Cloudinary Integration"
Cohesion: 0.04
Nodes (47): 1. Brand Identity, 2. Design Tokens, 3. Animation Rules, 4. Scroll Architecture (Desktop), 5. Responsive Strategy, 6. Component Reference, 8. Performance Patterns, 9. Do's and Don'ts (+39 more)

### Community 5 - "Package Core Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, class-variance-authority, cloudinary, clsx, gsap, lenis, meshline, ogl (+19 more)

### Community 6 - "Contact Section & Social Icons"
Cohesion: 0.17
Nodes (3): Contact(), SERVICE_OPTIONS, Dock()

### Community 7 - "Gallery Showcase Page Routing"
Cohesion: 0.09
Nodes (22): AI / Tech Products, Applying Peak-End to Mobile Apps, Crypto / Web3, Design Process for Client/Product Work, E-commerce / Food, Education / Learning, Emotional Design Principles, Emotional Feedback Loops (+14 more)

### Community 8 - "Perlin Noise Wave Animation Math"
Cohesion: 0.25
Nodes (3): Grad, Noise, Waves()

### Community 9 - "Brand Assets, CAD Design & 3D Materials"
Cohesion: 0.33
Nodes (10): ABS, Customized Bottle Caps, CAD Design Services, Industrial Plastic Parts, Custom Keychains, PLA, PLAKZO, Custom Photo Lamps (+2 more)

### Community 10 - "JSConfig Path Resolving"
Cohesion: 0.40
Nodes (4): compilerOptions, baseUrl, paths, @/*

### Community 11 - "Cloudinary Assets Automation Script"
Cohesion: 0.09
Nodes (21): Contributing, Core Philosophy, Credits, Design Principles, Direct Download, Examples, Features, File Structure (+13 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (21): Anti-Patterns to Avoid, Category Screens, Color System (60/30/10 Rule), Core Philosophy, Design Process, Implementation Notes, Mobile App UI/UX Design Skill, Order/Status Tracking (+13 more)

### Community 18 - "Community 18"
Cohesion: 0.10
Nodes (20): Accessibility and responsive (gsap.matchMedia()), Common vars, Core Tween Methods, Custom: use CustomEase (plugin), Defaults, Do Not, Easing, Function-based values (+12 more)

### Community 19 - "Community 19"
Cohesion: 0.11
Nodes (17): 1. Industrial Plastic Parts, 2. Custom 3D Printed Photo Lamps, 3. Custom 3D Printed Keychains, 4. CAD Design Services, 5. Customized Bottle Caps, Brand Overview, Footer, Future Scope (+9 more)

### Community 20 - "Community 20"
Cohesion: 0.12
Nodes (14): Basic Trigger, Do Not, GSAP ScrollTrigger, Horizontal scroll (containerAnimation), Key config options, Learn More, Markers (Development), Official GSAP best practices (+6 more)

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (15): Codebase Index, Core Design Framework, Design Laws Applied, Design Principles Summary:, File Structure, Implementation Tech Stack, Key Insights:, Key Sections: (+7 more)

### Community 22 - "Community 22"
Cohesion: 0.17
Nodes (11): Controlling Playback, Creating a Timeline, Do Not, GSAP Timeline, Labels, Nesting Timelines, Official GSAP Best practices, Position Parameter (+3 more)

### Community 23 - "Community 23"
Cohesion: 0.18
Nodes (10): Animation Rules, Architecture, Design Rules, Dev Commands, Don'ts, File Structure (planned), PLAKZO — Agent Instructions, Project (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (7): 7. Custom Components, ChromaGrid (`ChromaGrid.jsx`), Galaxy (`Galaxy.jsx`), Plasma (`Plasma.jsx`), ScrollFrameSequence (`ScrollFrameSequence.jsx`), TargetCursor (`TargetCursor.jsx`), Waves (`Waves.jsx`)

## Knowledge Gaps
- **234 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+229 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Package Core Dependencies` to `Core Animation & UI Styling Libraries`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Why does `react` connect `Core Animation & UI Styling Libraries` to `Package Core Dependencies`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Project Development & DevDependencies` to `Package Core Dependencies`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _234 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Navbar Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.061367621274108705 - nodes in this community are weakly interconnected._
- **Should `Core Animation & UI Styling Libraries` be split into smaller, more focused modules?**
  _Cohesion score 0.11692307692307692 - nodes in this community are weakly interconnected._
- **Should `React Bits Components Registry` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._