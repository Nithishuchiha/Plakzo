# Graph Report - .  (2026-06-29)

## Corpus Check
- Large corpus: 271 files ╖ ~3,996,690 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 196 nodes · 291 edges · 17 communities (16 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 12,500 input · 2,800 output

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

## God Nodes (most connected - your core abstractions)
1. `cloudinaryUrl()` - 10 edges
2. `scripts` - 7 edges
3. `tailwind` - 6 edges
4. `ScrollFrameSequence()` - 6 edges
5. `Noise` - 6 edges
6. `Navbar()` - 4 edges
7. `GALLERY_ITEMS` - 4 edges
8. `CLOUDINARY_FOLDER` - 4 edges
9. `aliases` - 3 edges
10. `compilerOptions` - 3 edges

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

## Communities (17 total, 1 thin omitted)

### Community 0 - "UI Components & Navbar Navigation"
Cohesion: 0.09
Nodes (19): ChromaGrid(), Galaxy(), LoadingScreen(), DesktopNav(), NAV_LINKS, Navbar(), PillNav(), Plasma() (+11 more)

### Community 1 - "Project Development & DevDependencies"
Cohesion: 0.08
Nodes (23): devDependencies, autoprefixer, eslint, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-react-refresh, gh-pages, postcss (+15 more)

### Community 2 - "Core Animation & UI Styling Libraries"
Cohesion: 0.14
Nodes (13): GSAP Animations, React + Vite Stack, Tailwind CSS, Three.js Showcase, DEFAULT_ITEMS, Materials, buildFrameUrl(), ScrollFrameSequence() (+5 more)

### Community 3 - "React Bits Components Registry"
Cohesion: 0.12
Nodes (16): aliases, components, utils, iconLibrary, registries, @react-bits, rsc, $schema (+8 more)

### Community 4 - "Asset Preloader & Media Cloudinary Integration"
Cohesion: 0.18
Nodes (9): STEP_ICONS, GALLERY_ITEMS, buildFrameUrl(), PAD(), CLOUDINARY_FOLDER, cloudinaryFrameUrl(), buildFrameUrl(), GalleryPreloader (+1 more)

### Community 5 - "Package Core Dependencies"
Cohesion: 0.12
Nodes (16): dependencies, class-variance-authority, cloudinary, clsx, gsap, lenis, meshline, ogl (+8 more)

### Community 6 - "Contact Section & Social Icons"
Cohesion: 0.17
Nodes (3): Contact(), SERVICE_OPTIONS, Dock()

### Community 7 - "Gallery Showcase Page Routing"
Cohesion: 0.19
Nodes (7): ShowcaseScroll(), getGalleryItem(), GalleryPage(), ITEM_DATA, linkStyle, VARIANT_LABELS, App()

### Community 8 - "Perlin Noise Wave Animation Math"
Cohesion: 0.25
Nodes (3): Grad, Noise, Waves()

### Community 9 - "Brand Assets, CAD Design & 3D Materials"
Cohesion: 0.33
Nodes (10): ABS, Customized Bottle Caps, CAD Design Services, Industrial Plastic Parts, Custom Keychains, PLA, PLAKZO, Custom Photo Lamps (+2 more)

### Community 10 - "JSConfig Path Resolving"
Cohesion: 0.40
Nodes (4): compilerOptions, baseUrl, paths, @/*

## Knowledge Gaps
- **68 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+63 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Package Core Dependencies` to `Project Development & DevDependencies`, `Core Animation & UI Styling Libraries`?**
  _High betweenness centrality (0.272) - this node is a cross-community bridge._
- **Why does `react` connect `Core Animation & UI Styling Libraries` to `Package Core Dependencies`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _68 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Navbar Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.08534850640113797 - nodes in this community are weakly interconnected._
- **Should `Project Development & DevDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Core Animation & UI Styling Libraries` be split into smaller, more focused modules?**
  _Cohesion score 0.13852813852813853 - nodes in this community are weakly interconnected._
- **Should `React Bits Components Registry` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._