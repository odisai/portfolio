# Taylor Allen Portfolio: Hero Section PRD
## "The Assembly" — First Principles Hero Animation

**Version:** 1.0  
**Date:** December 31, 2025  
**Author:** Design & Engineering Team  
**Status:** Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Context](#2-product-context)
3. [Technical Architecture](#3-technical-architecture)
4. [Component Specifications](#4-component-specifications)
5. [Visual Design System](#5-visual-design-system)
6. [Animation Specifications](#6-animation-specifications)
7. [Interaction Design](#7-interaction-design)
8. [Responsive Behavior](#8-responsive-behavior)
9. [Performance Requirements](#9-performance-requirements)
10. [Accessibility](#10-accessibility)
11. [Implementation Phases](#11-implementation-phases)
12. [Acceptance Criteria](#12-acceptance-criteria)
13. [File Structure](#13-file-structure)
14. [Code Templates](#14-code-templates)

---

## 1. Executive Summary

### 1.1 What We're Building

A signature hero section featuring a 3D shader-based animation where geometric fragments assemble into "TAYLOR ALLEN". This serves as the portfolio's opening statement — demonstrating technical craft while establishing the "First Principles" brand philosophy.

### 1.2 The Signature Moment

On page load, visitors see floating geometric fragments rendered as real-time 3D objects with custom shaders. Over 2.5 seconds, these fragments drift toward alignment, rotate, adjust, and *click* into position forming the name "TAYLOR ALLEN". The shader materials transition from a cool, searching state to a warm, resolved state.

### 1.3 Success Metrics

- **Performance:** 60fps during assembly animation on desktop, 60fps on mobile with SVG fallback
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.0s
- **Animation Duration:** 2.5s desktop, 2.0s mobile
- **Memory Footprint:** < 50MB GPU memory during animation

---

## 2. Product Context

### 2.1 User Profile

| Attribute | Description |
|-----------|-------------|
| **Primary Audience** | Investors, recruiters, potential co-founders, design-forward tech professionals |
| **Device Split** | 60% mobile, 40% desktop (anticipate design-conscious desktop users) |
| **Context** | Arriving from LinkedIn, Twitter, email signatures, investor intro decks |
| **Expectations** | Premium, distinctive, technically impressive |

### 2.2 Brand Positioning

**Taylor Allen = "Builder. Architect. Founder."**

The hero must communicate:
- **Technical Depth** — This person understands graphics programming, not just templates
- **Systems Thinking** — Fragments → Structure mirrors the founder mindset
- **Confident Patience** — Unhurried, deliberate animation pace
- **Premium Quality** — Awwwards-caliber execution

### 2.3 Inspiration References

| Site | Key Element to Adapt |
|------|---------------------|
| **art-yakushev.com** | 3D logo mark with character-level animation, dark canvas, red accent |
| **latchezarboyadjiev.com** | Word rotation in hero ("Fluidity, Light, Emotion"), typographic confidence |
| **chdartmaker.com** | Cinematic reveal timing, "Conception → Réalisation" transformation concept |

---

## 3. Technical Architecture

### 3.1 Technology Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 15 (App Router)                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   THREE.JS      │  │     GSAP        │  │     LENIS       │  │
│  │   + R3F         │  │   ScrollTrigger │  │  Smooth Scroll  │  │
│  │   + Drei        │  │   Timeline      │  │                 │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  TAILWIND CSS   │  │  CUSTOM GLSL    │  │   FRAMER        │  │
│  │  v4 + Custom    │  │  SHADERS        │  │   MOTION        │  │
│  │  Properties     │  │  (fallback SVG) │  │   (UI anims)    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.170.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.114.0",
    "gsap": "^3.12.0",
    "lenis": "^1.1.0",
    "framer-motion": "^11.0.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@types/three": "^0.170.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0"
  }
}
```

### 3.3 Rendering Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVICE DETECTION FLOW                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Check WebGL2   │
                    │    Support      │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │   SUPPORTED     │          │  NOT SUPPORTED  │
     │   (Desktop+)    │          │    (Mobile)     │
     └────────┬────────┘          └────────┬────────┘
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │  Three.js +     │          │   SVG + CSS     │
     │  Custom GLSL    │          │   Transforms    │
     │  Shaders        │          │   + GSAP        │
     └────────┬────────┘          └────────┬────────┘
              │                             │
              ▼                             ▼
     ┌─────────────────┐          ┌─────────────────┐
     │  60fps @ 2.5s   │          │  60fps @ 2.0s   │
     │  Full Effects   │          │  Simplified     │
     └─────────────────┘          └─────────────────┘
```

### 3.4 Progressive Enhancement Layers

| Layer | Capability | Experience |
|-------|-----------|------------|
| **0** | No JavaScript | Static name, all content visible, no animation |
| **1** | JS, no WebGL | SVG assembly animation with GSAP |
| **2** | JS + WebGL | Full 3D shader experience |
| **3** | JS + WebGL + High-End | Post-processing effects (bloom, DOF) |

---

## 4. Component Specifications

### 4.1 Component Tree

```
<HeroSection>
├── <AssemblyCanvas>                 // Three.js or SVG container
│   ├── <Scene>                      // R3F Canvas wrapper
│   │   ├── <Camera>                 // Perspective camera with parallax
│   │   ├── <Lighting>               // Ambient + Directional
│   │   ├── <FragmentGroup>          // Container for all fragments
│   │   │   └── <Fragment>[]         // Individual 3D mesh + shader
│   │   ├── <PostProcessing>         // Bloom, DOF (conditional)
│   │   └── <Environment>            // Background particles
│   └── <SVGFallback>                // 2D assembly for mobile
│       └── <SVGFragment>[]          // Individual SVG shapes
├── <HeroContent>                    // Text content layer
│   ├── <WordRotation>               // "Builder. Architect. Founder."
│   ├── <NameReveal>                 // "TAYLOR ALLEN" text backup
│   ├── <Tagline>                    // "Creating technology that matters"
│   └── <ScrollIndicator>            // Animated scroll prompt
├── <HeroMetadata>                   // Corner information
│   ├── <Location>                   // "Bay Area, CA"
│   └── <Timestamp>                  // Live clock (optional)
└── <Navigation>                     // Slides in after assembly
    ├── <Logo>                       // "TA" monogram
    └── <NavLinks>                   // Work, About, Contact
```

### 4.2 HeroSection Component

**File:** `src/components/sections/Hero.tsx`

```typescript
interface HeroSectionProps {
  className?: string;
}

// State management
interface HeroState {
  assemblyProgress: number;      // 0 to 1
  assemblyComplete: boolean;     // triggers content reveal
  mousePosition: { x: number; y: number };
  isInteractive: boolean;        // enables hover effects after assembly
}
```

**Responsibilities:**
- Orchestrate assembly animation timeline
- Manage scroll-triggered transitions
- Coordinate content reveals
- Handle reduced motion preferences

### 4.3 Fragment Component

**File:** `src/components/three/Fragment.tsx`

```typescript
interface FragmentProps {
  // Geometry
  geometry: 'box' | 'triangle' | 'circle' | 'polyhedron';
  scale: [number, number, number];
  
  // Positions
  initialPosition: [number, number, number];
  targetPosition: [number, number, number];
  
  // Animation
  initialRotation: [number, number, number];
  targetRotation: [number, number, number];
  delay: number;                 // stagger offset in ms
  
  // Shader uniforms
  resolved: number;              // 0 = searching, 1 = resolved
  time: number;                  // for shader animation
}
```

**Behavior:**
- Spring-based physics for organic movement
- Damping factor: 0.8
- Near-miss trajectory adjustments
- Magnetic snap in final 10% of journey

### 4.4 WordRotation Component

**File:** `src/components/ui/WordRotation.tsx`

```typescript
interface WordRotationProps {
  words: string[];               // ["Builder", "Architect", "Founder"]
  interval: number;              // ms between rotations (3000)
  className?: string;
}
```

**Behavior:**
- Cycles through words with fade + slide animation
- Pauses rotation when assembly completes
- Settles on final word or all three visible

---

## 5. Visual Design System

### 5.1 Color Tokens

```css
:root {
  /* ═══════ Core Canvas ═══════ */
  --color-space: #0A0A0B;
  --color-space-50: #0F0F10;
  --color-space-100: #141415;
  --color-space-200: #1A1A1C;
  
  /* ═══════ Text Hierarchy ═══════ */
  --color-white: #FAFAFA;
  --color-white-muted: #A1A1AA;
  --color-white-dim: #71717A;
  
  /* ═══════ Accent: Architect Blue ═══════ */
  --color-architect: #2563EB;
  --color-architect-glow: rgba(37, 99, 235, 0.4);
  
  /* ═══════ Fragment Shader States ═══════ */
  --color-fragment-searching: #1A1A1F;
  --color-fragment-resolved: #F5F5F7;
  --color-fragment-iridescent-blue: #3B82F6;
  --color-fragment-iridescent-purple: #8B5CF6;
}
```

### 5.2 Typography System

```css
:root {
  /* ═══════ Font Families ═══════ */
  --font-display: 'Satoshi', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* ═══════ Font Sizes ═══════ */
  --text-hero: clamp(3rem, 12vw, 10rem);
  --text-descriptor: clamp(0.875rem, 1.5vw, 1.125rem);
  --text-tagline: clamp(1rem, 2vw, 1.5rem);
  --text-detail: 0.875rem;
  --text-micro: 0.75rem;
  
  /* ═══════ Letter Spacing ═══════ */
  --tracking-name: 0.15em;
  --tracking-descriptor: 0.08em;
  --tracking-tight: -0.02em;
}
```

### 5.3 Spacing Scale

```css
:root {
  /* ═══════ Layout Spacing ═══════ */
  --space-xs: 0.5rem;      /* 8px */
  --space-sm: 1rem;        /* 16px */
  --space-md: 1.5rem;      /* 24px */
  --space-lg: 2rem;        /* 32px */
  --space-xl: 3rem;        /* 48px */
  --space-2xl: 4rem;       /* 64px */
  --space-section: clamp(80px, 15vh, 200px);
}
```

### 5.4 Z-Index Scale

```css
:root {
  --z-canvas: -1;          /* Three.js background */
  --z-content: 10;         /* Hero text content */
  --z-nav: 100;            /* Navigation overlay */
  --z-modal: 200;          /* Future modals */
}
```

---

## 6. Animation Specifications

### 6.1 Master Timeline

```
TIME (ms)    EVENT
─────────────────────────────────────────────────────────────────
0            Page load
0-500        Canvas initializes, fragments spawn at random positions
500-3000     ASSEMBLY ANIMATION
  │
  ├─ 500-2500    Fragments travel toward target positions
  │               - Spring physics: stiffness=0.1, damping=0.8
  │               - Each fragment has unique delay (0-300ms)
  │               - Rotation dampens as fragments approach target
  │
  ├─ 2500-3000   Magnetic snap phase (final 10%)
  │               - Acceleration toward exact position
  │               - Shader transitions: searching → resolved
  │               - Subtle "lock" micro-animation
  │
3000         ASSEMBLY COMPLETE
3000-3500    Content reveals
  │
  ├─ 3000-3200   Word rotation settles
  ├─ 3100-3400   Tagline fades in
  ├─ 3200-3500   Corner metadata appears
  ├─ 3300-3600   Navigation slides down
  │
3500+        IDLE STATE
             - Subtle camera drift (0.5° / 10s)
             - Cursor parallax enabled (±2° rotation)
             - Hover interactions active on fragments
```

### 6.2 Assembly Physics

```typescript
// Spring configuration
const SPRING_CONFIG = {
  stiffness: 0.1,
  damping: 0.8,
  mass: 1,
  velocity: 0,
};

// Magnetic snap threshold (last 10% of journey)
const MAGNETIC_THRESHOLD = 0.1;

// Animation easing
const EASING = {
  assembly: 'cubic-bezier(0.16, 1, 0.3, 1)',     // ease-out-expo
  magnetic: 'cubic-bezier(0.87, 0, 0.13, 1)',   // ease-in-out-expo
  reveal: 'cubic-bezier(0.22, 1, 0.36, 1)',     // ease-out-quint
};
```

### 6.3 Fragment Animation Details

| Property | Initial | Target | Duration | Easing |
|----------|---------|--------|----------|--------|
| Position X | random(-10, 10) | calculated | 2000ms | spring |
| Position Y | random(-5, 5) | calculated | 2000ms | spring |
| Position Z | random(-5, 2) | 0 | 2000ms | spring |
| Rotation X | random(-π, π) | 0 | 2000ms | spring |
| Rotation Y | random(-π, π) | 0 | 2000ms | spring |
| Rotation Z | random(-π, π) | 0 | 2000ms | spring |
| Shader resolved | 0 | 1 | 500ms | linear |
| Scale | 1 | 1 | — | — |

### 6.4 Shader Transition

```glsl
// Searching state (resolved = 0)
vec3 searchingColor = baseColor + iridescence * 0.3;
// Cool blue-gray with subtle color shift

// Resolved state (resolved = 1)  
vec3 resolvedColor = vec3(0.96, 0.96, 0.98);
// Warm white, clean, settled

// Transition
vec3 finalColor = mix(searchingColor, resolvedColor, uResolved);
```

### 6.5 GSAP Timeline Structure

```typescript
const masterTimeline = gsap.timeline({
  onComplete: () => setAssemblyComplete(true),
});

// Phase 1: Fragment assembly
masterTimeline.to(fragmentRefs, {
  duration: 2,
  ease: 'expo.out',
  stagger: {
    each: 0.05,
    from: 'random',
  },
  // ...position and rotation animations
}, 0);

// Phase 2: Shader transition
masterTimeline.to(shaderUniforms.uResolved, {
  value: 1,
  duration: 0.5,
  ease: 'none',
}, 2.0);

// Phase 3: Content reveals
masterTimeline.to('.word-rotation', {
  opacity: 1,
  y: 0,
  duration: 0.6,
  ease: 'quint.out',
}, 2.5);

masterTimeline.to('.tagline', {
  opacity: 1,
  y: 0,
  duration: 0.6,
  ease: 'quint.out',
}, 2.6);

masterTimeline.to('.navigation', {
  y: 0,
  opacity: 1,
  duration: 0.6,
  ease: 'quint.out',
}, 2.8);
```

---

## 7. Interaction Design

### 7.1 Mouse/Touch Parallax

**Trigger:** Mouse movement (desktop) or device orientation (mobile)  
**Effect:** Camera rotates ±2° based on cursor position  
**Timing:** 150ms lerp for smooth follow  
**Active:** Only after assembly completes

```typescript
// Camera parallax calculation
const targetRotationX = (mouseY - 0.5) * 0.035;  // ±2°
const targetRotationY = (mouseX - 0.5) * 0.035;  // ±2°

// Lerp for smooth movement
camera.rotation.x = lerp(camera.rotation.x, targetRotationX, 0.1);
camera.rotation.y = lerp(camera.rotation.y, targetRotationY, 0.1);
```

### 7.2 Fragment Hover (Post-Assembly)

**Trigger:** Hover over any letter fragment  
**Effect:** "Ripple" through fragment physics — wobble, recall scattered state  
**Visual:** Brief return of iridescence in hovered fragment  
**Purpose:** Remind visitor of the assembly, add playfulness

```typescript
const handleFragmentHover = (fragmentIndex: number) => {
  // Apply impulse to nearby fragments
  fragments.forEach((fragment, i) => {
    const distance = getDistance(fragmentIndex, i);
    if (distance < 3) {
      applyImpulse(fragment, {
        x: random(-0.1, 0.1),
        y: random(-0.1, 0.1),
        z: random(-0.05, 0.05),
      });
    }
  });
};
```

### 7.3 Scroll Behavior

**Initial State:** Hero is sticky/fixed, fills viewport  
**On Scroll:** After 100vh scroll, hero begins to compress

```typescript
// Scroll-triggered compression
ScrollTrigger.create({
  trigger: '.hero-section',
  start: 'top top',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => {
    // Compress 3D canvas in Z-space
    const progress = self.progress;
    fragmentGroup.position.z = lerp(0, -5, progress);
    
    // Scale down name and pin to corner
    nameElement.style.transform = `
      scale(${lerp(1, 0.2, progress)})
      translate(${lerp(0, -40, progress)}vw, ${lerp(0, -40, progress)}vh)
    `;
  },
});
```

### 7.4 Idle Camera Drift

**Active:** When no user input for 5 seconds  
**Effect:** Subtle 0.5° rotation over 10 seconds, seamless loop  
**Purpose:** Keep scene alive, suggest depth

```typescript
// Idle drift animation
const idleDrift = gsap.to(camera.rotation, {
  y: '+=0.00873', // ~0.5 degrees in radians
  duration: 10,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true,
  paused: true,
});

// Start/stop based on user activity
let idleTimeout: NodeJS.Timeout;
const resetIdle = () => {
  idleDrift.pause();
  clearTimeout(idleTimeout);
  idleTimeout = setTimeout(() => idleDrift.play(), 5000);
};
```

---

## 8. Responsive Behavior

### 8.1 Breakpoint Strategy

| Breakpoint | Width | Experience |
|------------|-------|------------|
| **Mobile S** | 320-375px | SVG fallback, stacked layout |
| **Mobile L** | 376-480px | SVG fallback, optimized spacing |
| **Tablet** | 481-768px | SVG or WebGL (device-dependent), hybrid layout |
| **Desktop** | 769-1024px | Full WebGL, standard hero |
| **Desktop L** | 1025-1440px | Full effects, generous spacing |
| **Desktop XL** | 1441px+ | Full effects, max container width |

### 8.2 Mobile Layout (< 768px)

```
┌─────────────────────────────────┐
│                                 │
│  Builder. Architect. Founder.   │  ← Word rotation (top)
│                                 │
├─────────────────────────────────┤
│                                 │
│                                 │
│         TAYLOR                  │  ← Name (SVG animated)
│         ALLEN                   │     Two lines, centered
│                                 │
│                                 │
├─────────────────────────────────┤
│  Creating technology            │
│  that matters                   │  ← Tagline
│                                 │
│  Bay Area, CA                   │  ← Location
│                                 │
│         ↓                       │  ← Scroll indicator
└─────────────────────────────────┘
```

### 8.3 Desktop Layout (≥ 768px)

```
┌───────────────────────────────────────────────────────────────┐
│ TA                                          Work About Contact │ ← Nav
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Builder.                                                     │
│  Architect.                                                   │
│  Founder.                                                     │ ← Word rotation (left)
│                                                               │
│                    ╔═══════════════════════╗                  │
│                    ║   T A Y L O R         ║                  │
│                    ║   A L L E N           ║                  │ ← 3D Canvas (center)
│                    ╚═══════════════════════╝                  │
│                                                               │
│  Creating technology that matters                             │ ← Tagline (bottom-left)
│                                                               │
│ Bay Area, CA                                    │ (scroll) ↓ │ ← Metadata (corners)
└───────────────────────────────────────────────────────────────┘
```

### 8.4 SVG Fallback Specifications

**When to use:** 
- Mobile devices (< 768px)
- WebGL not supported
- `prefers-reduced-motion: reduce`
- Low battery mode detected

**SVG Fragment Structure:**
```svg
<svg viewBox="0 0 800 200" class="assembly-svg">
  <g class="fragment" data-target-x="100" data-target-y="50">
    <rect x="0" y="0" width="40" height="60" fill="currentColor"/>
  </g>
  <!-- More fragments... -->
</svg>
```

**Animation (GSAP):**
```typescript
gsap.to('.fragment', {
  duration: 2,
  ease: 'expo.out',
  stagger: 0.03,
  attr: {
    transform: (i, el) => {
      const tx = el.dataset.targetX;
      const ty = el.dataset.targetY;
      return `translate(${tx}, ${ty})`;
    },
  },
});
```

---

## 9. Performance Requirements

### 9.1 Performance Budget

| Metric | Target | Maximum |
|--------|--------|---------|
| **First Contentful Paint** | < 1.0s | 1.5s |
| **Largest Contentful Paint** | < 2.0s | 2.5s |
| **Time to Interactive** | < 2.5s | 3.5s |
| **Total Blocking Time** | < 150ms | 300ms |
| **Cumulative Layout Shift** | < 0.05 | 0.1 |
| **JS Bundle (hero)** | < 100KB | 150KB |
| **GPU Memory** | < 50MB | 100MB |
| **Frame Rate** | 60fps | 30fps (minimum) |

### 9.2 Loading Strategy

```
TIMELINE: Page Load → Hero Ready
──────────────────────────────────────────────────────────────

0ms        HTML arrives
           ├── Critical CSS inlined
           ├── Font preload hints
           └── Hero skeleton visible

100ms      Fonts begin loading
           └── Display font prioritized (Satoshi)

200ms      JS bundle starts parsing
           └── Code-split: hero components only

400ms      Three.js initializes (if WebGL)
           └── OR SVG fallback renders

500ms      Fragment geometry generated
           └── Shaders compiled

600ms      ASSEMBLY ANIMATION BEGINS
           └── All assets ready, animation plays

3100ms     Assembly complete
           └── Full interactivity
```

### 9.3 Optimization Techniques

**Code Splitting:**
```typescript
// Only load Three.js on capable devices
const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});
```

**Texture/Geometry Optimization:**
- Use `BufferGeometry` for all meshes
- Merge static geometries where possible
- Dispose of textures after hero scrolls away

**GPU Memory Management:**
```typescript
// Release WebGL context when hero is out of view
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        renderer.dispose();
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        });
      }
    },
    { threshold: 0 }
  );
  
  observer.observe(heroRef.current);
  return () => observer.disconnect();
}, []);
```

### 9.4 Font Loading Strategy

```typescript
// next/font with display: swap
const satoshi = localFont({
  src: [
    { path: './Satoshi-Variable.woff2', style: 'normal' },
  ],
  display: 'swap',
  preload: true,
  variable: '--font-display',
});
```

---

## 10. Accessibility

### 10.1 Reduced Motion Support

**Detection:**
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
```

**Behavior when enabled:**
- Skip assembly animation entirely
- Show assembled name immediately
- Disable parallax camera movement
- Disable idle camera drift
- Content reveals happen instantly

### 10.2 Screen Reader Support

**ARIA Labels:**
```html
<section 
  role="banner" 
  aria-label="Taylor Allen - Builder, Architect, Founder"
>
  <canvas aria-hidden="true">
    <!-- Three.js canvas, decorative -->
  </canvas>
  
  <h1 class="sr-only">Taylor Allen</h1>
  <p class="sr-only">Builder. Architect. Founder.</p>
  <p class="sr-only">Creating technology that matters</p>
</section>
```

### 10.3 Keyboard Navigation

- Tab order: Skip link → Navigation links → First interactive element
- No keyboard traps in Three.js canvas
- Focus indicators visible on all interactive elements

### 10.4 Color Contrast

| Element | Foreground | Background | Ratio |
|---------|-----------|------------|-------|
| Body text | #FAFAFA | #0A0A0B | 19.6:1 ✓ |
| Muted text | #A1A1AA | #0A0A0B | 7.3:1 ✓ |
| Dim text | #71717A | #0A0A0B | 4.5:1 ✓ |
| Accent link | #2563EB | #0A0A0B | 4.9:1 ✓ |

---

## 11. Implementation Phases

### Phase 1: Foundation (Day 1-2)

**Goal:** Project setup, design tokens, basic structure

**Tasks:**
- [ ] Initialize Next.js 15 project with TypeScript
- [ ] Configure Tailwind CSS with custom tokens
- [ ] Set up font loading (Satoshi, Inter, JetBrains Mono)
- [ ] Create base layout component
- [ ] Implement Lenis smooth scroll
- [ ] Create HeroSection skeleton with proper HTML structure
- [ ] Add CSS custom properties for all design tokens

**Deliverable:** Blank dark hero section with fonts loading, smooth scroll working

### Phase 2: 3D Scene Setup (Day 2-3)

**Goal:** Three.js canvas rendering with basic fragments

**Tasks:**
- [ ] Set up React Three Fiber canvas
- [ ] Create Fragment component with basic geometry
- [ ] Implement camera with perspective
- [ ] Add ambient + directional lighting
- [ ] Generate fragment positions for "TAYLOR ALLEN"
- [ ] Create device capability detection (WebGL support)
- [ ] Implement SVG fallback structure

**Deliverable:** Static fragments in 3D space forming the name (no animation yet)

### Phase 3: Custom Shaders (Day 3-4)

**Goal:** Iridescent material with searching/resolved states

**Tasks:**
- [ ] Write vertex shader (basic transform)
- [ ] Write fragment shader with:
  - Fresnel rim lighting
  - Iridescent color shift
  - Searching → Resolved transition
- [ ] Create ShaderMaterial component
- [ ] Test uniform updates (uTime, uResolved)
- [ ] Optimize for mobile (simplified shader fallback)

**Deliverable:** Fragments with beautiful, animated shader materials

### Phase 4: Assembly Animation (Day 4-5)

**Goal:** Spring physics assembly with GSAP orchestration

**Tasks:**
- [ ] Implement spring physics for fragment movement
- [ ] Create master GSAP timeline
- [ ] Add staggered fragment animation
- [ ] Implement magnetic snap phase
- [ ] Coordinate shader transition timing
- [ ] Test and tune animation curves
- [ ] Add SVG fallback animation

**Deliverable:** Full assembly animation playing on page load

### Phase 5: Content & Interactions (Day 5-6)

**Goal:** Word rotation, reveals, and post-assembly interactions

**Tasks:**
- [ ] Build WordRotation component
- [ ] Implement content reveal animations
- [ ] Add mouse parallax (camera follow)
- [ ] Implement idle camera drift
- [ ] Add fragment hover ripple effect
- [ ] Build scroll-triggered hero compression
- [ ] Create Navigation component with slide-in

**Deliverable:** Complete hero with all interactions working

### Phase 6: Polish & Optimization (Day 6-7)

**Goal:** Performance, accessibility, and edge cases

**Tasks:**
- [ ] Profile and optimize render performance
- [ ] Implement GPU memory cleanup
- [ ] Add reduced motion support
- [ ] Test and fix all breakpoints
- [ ] Add ARIA labels and screen reader support
- [ ] Test on real devices (iOS Safari, Android Chrome)
- [ ] Add loading states and skeleton
- [ ] Final animation timing polish

**Deliverable:** Production-ready hero section

---

## 12. Acceptance Criteria

### 12.1 Must Have (P0)

- [ ] Assembly animation plays on page load (2.5s desktop, 2.0s mobile)
- [ ] Fragments form readable "TAYLOR ALLEN" text
- [ ] Works on Chrome, Safari, Firefox, Edge (latest versions)
- [ ] SVG fallback works on mobile devices
- [ ] Reduced motion preference respected
- [ ] 60fps during animation on mid-tier devices
- [ ] Content is accessible to screen readers
- [ ] Page loads in under 3 seconds on 4G

### 12.2 Should Have (P1)

- [ ] Custom GLSL shaders with iridescence effect
- [ ] Post-assembly hover interactions on fragments
- [ ] Mouse parallax camera movement
- [ ] Smooth scroll integration
- [ ] Navigation reveals after assembly
- [ ] Word rotation animation
- [ ] Scroll-triggered hero compression

### 12.3 Nice to Have (P2)

- [ ] Idle camera drift animation
- [ ] Post-processing effects (bloom)
- [ ] Device orientation parallax on mobile
- [ ] Sound design (optional ambient audio)
- [ ] WebGL context recovery on loss
- [ ] Replay assembly on scroll up

---

## 13. File Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with fonts
│   ├── page.tsx                   # Home page, imports Hero
│   └── globals.css                # Global styles, CSS variables
│
├── components/
│   ├── sections/
│   │   └── Hero/
│   │       ├── index.tsx          # Main HeroSection component
│   │       ├── HeroContent.tsx    # Text content layer
│   │       ├── HeroMetadata.tsx   # Corner info (location, time)
│   │       └── Hero.module.css    # Section-specific styles
│   │
│   ├── three/
│   │   ├── Scene.tsx              # R3F Canvas wrapper
│   │   ├── Fragment.tsx           # Individual 3D fragment mesh
│   │   ├── FragmentAssembly.tsx   # Assembly orchestration
│   │   ├── Lighting.tsx           # Scene lighting setup
│   │   ├── Camera.tsx             # Perspective camera + controls
│   │   ├── PostProcessing.tsx     # Bloom, DOF effects
│   │   └── shaders/
│   │       ├── fragment.vert      # Vertex shader
│   │       ├── fragment.frag      # Fragment shader
│   │       └── index.ts           # Shader exports
│   │
│   ├── svg/
│   │   ├── SVGAssembly.tsx        # SVG fallback container
│   │   └── SVGFragment.tsx        # Individual SVG shape
│   │
│   ├── ui/
│   │   ├── WordRotation.tsx       # Animated word cycler
│   │   ├── ScrollIndicator.tsx    # Scroll prompt
│   │   └── Button.tsx             # Base button component
│   │
│   └── layout/
│       ├── Navigation.tsx         # Site nav
│       ├── SmoothScroll.tsx       # Lenis provider
│       └── Footer.tsx             # Site footer
│
├── hooks/
│   ├── useReducedMotion.ts        # prefers-reduced-motion
│   ├── useDeviceCapabilities.ts   # WebGL detection
│   ├── useMousePosition.ts        # Normalized mouse coords
│   ├── useScrollProgress.ts       # Scroll percentage
│   └── useAssemblyAnimation.ts    # Assembly GSAP timeline
│
├── lib/
│   ├── utils.ts                   # cn(), lerp, clamp, etc.
│   ├── constants.ts               # Animation timing, colors
│   └── fragments.ts               # Fragment position data
│
└── types/
    └── index.ts                   # TypeScript interfaces
```

---

## 14. Code Templates

### 14.1 Fragment Shader (GLSL)

```glsl
// src/components/three/shaders/fragment.frag

precision highp float;

uniform float uTime;
uniform float uResolved;
uniform vec3 uColorSearching;
uniform vec3 uColorResolved;
uniform vec3 uIridescentBlue;
uniform vec3 uIridescentPurple;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() {
  // ═══════ Fresnel Rim Lighting ═══════
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
  
  // ═══════ Iridescent Color Shift ═══════
  float iridescencePhase = fresnel + sin(uTime * 0.5 + vUv.x * 3.14159) * 0.15;
  vec3 iridescence = mix(uIridescentBlue, uIridescentPurple, iridescencePhase);
  
  // ═══════ Searching State ═══════
  // Cool gray with subtle iridescent shimmer
  vec3 searchingColor = uColorSearching + iridescence * 0.25 * (1.0 - uResolved);
  
  // ═══════ Resolved State ═══════
  // Warm white, clean, settled
  vec3 resolvedColor = uColorResolved;
  
  // ═══════ State Transition ═══════
  vec3 baseColor = mix(searchingColor, resolvedColor, uResolved);
  
  // ═══════ Rim Glow on Resolved ═══════
  float rimGlow = fresnel * uResolved * 0.15;
  baseColor += vec3(rimGlow);
  
  // ═══════ Subtle Noise ═══════
  float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
  baseColor += (noise - 0.5) * 0.02;
  
  gl_FragColor = vec4(baseColor, 1.0);
}
```

### 14.2 Vertex Shader (GLSL)

```glsl
// src/components/three/shaders/fragment.vert

precision highp float;

uniform float uTime;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  
  gl_Position = projectionMatrix * mvPosition;
}
```

### 14.3 Fragment Component (React)

```tsx
// src/components/three/Fragment.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { ShaderMaterial, Vector3, Euler } from 'three';
import { useSpring, animated } from '@react-spring/three';

import vertexShader from './shaders/fragment.vert?raw';
import fragmentShader from './shaders/fragment.frag?raw';
import { SHADER } from '@/lib/constants';

interface FragmentProps {
  geometry: 'box' | 'triangle' | 'octahedron';
  scale: [number, number, number];
  initialPosition: [number, number, number];
  targetPosition: [number, number, number];
  initialRotation: [number, number, number];
  delay: number;
  isAssembling: boolean;
  resolved: number;
}

export function Fragment({
  geometry,
  scale,
  initialPosition,
  targetPosition,
  initialRotation,
  delay,
  isAssembling,
  resolved,
}: FragmentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  
  // ═══════ Shader Uniforms ═══════
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolved: { value: 0 },
    uColorSearching: { value: new Vector3(...SHADER.COLORS.SEARCHING) },
    uColorResolved: { value: new Vector3(...SHADER.COLORS.RESOLVED) },
    uIridescentBlue: { value: new Vector3(...SHADER.COLORS.IRIDESCENT_BLUE) },
    uIridescentPurple: { value: new Vector3(...SHADER.COLORS.IRIDESCENT_PURPLE) },
  }), []);
  
  // ═══════ Spring Animation ═══════
  const { position, rotation } = useSpring({
    position: isAssembling ? targetPosition : initialPosition,
    rotation: isAssembling ? [0, 0, 0] : initialRotation,
    config: {
      mass: 1,
      tension: 120,
      friction: 14,
    },
    delay,
  });
  
  // ═══════ Frame Loop ═══════
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uResolved.value = resolved;
    }
  });
  
  // ═══════ Geometry Selection ═══════
  const GeometryComponent = useMemo(() => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'triangle':
        return <tetrahedronGeometry args={[1, 0]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [geometry]);
  
  return (
    <animated.mesh
      ref={meshRef}
      position={position as any}
      rotation={rotation as any}
      scale={scale}
    >
      {GeometryComponent}
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </animated.mesh>
  );
}
```

### 14.4 Hero Section Component

```tsx
// src/components/sections/Hero/index.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { HeroContent } from './HeroContent';
import { HeroMetadata } from './HeroMetadata';
import { CONTENT, ANIMATION } from '@/lib/constants';

// ═══════ Dynamic Imports ═══════
const Scene = dynamic(() => import('@/components/three/Scene'), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

const SVGAssembly = dynamic(() => import('@/components/svg/SVGAssembly'), {
  ssr: false,
});

function HeroSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-hero-name text-white/10 animate-pulse">
        {CONTENT.NAME}
      </div>
    </div>
  );
}

export function Hero() {
  // ═══════ State ═══════
  const [assemblyProgress, setAssemblyProgress] = useState(0);
  const [assemblyComplete, setAssemblyComplete] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  
  // ═══════ Hooks ═══════
  const reducedMotion = useReducedMotion();
  const { supportsWebGL, isMobile } = useDeviceCapabilities();
  
  // ═══════ Determine Render Mode ═══════
  const useWebGL = supportsWebGL && !isMobile && !reducedMotion;
  
  // ═══════ Mouse Tracking ═══════
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!assemblyComplete) return;
    setMousePosition({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  }, [assemblyComplete]);
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);
  
  // ═══════ Reduced Motion: Skip Animation ═══════
  useEffect(() => {
    if (reducedMotion) {
      setAssemblyProgress(1);
      setAssemblyComplete(true);
    }
  }, [reducedMotion]);
  
  // ═══════ Assembly Complete Handler ═══════
  const handleAssemblyComplete = useCallback(() => {
    setAssemblyComplete(true);
  }, []);
  
  return (
    <section
      className="relative min-h-screen min-h-dvh overflow-hidden bg-space"
      role="banner"
      aria-label={`${CONTENT.NAME} - ${CONTENT.DESCRIPTORS.join(', ')}`}
    >
      {/* ═══════ 3D Canvas / SVG Fallback ═══════ */}
      <div className="absolute inset-0 z-0">
        {useWebGL ? (
          <Scene
            mousePosition={mousePosition}
            onAssemblyProgress={setAssemblyProgress}
            onAssemblyComplete={handleAssemblyComplete}
          />
        ) : (
          <SVGAssembly
            onAssemblyComplete={handleAssemblyComplete}
            reducedMotion={reducedMotion}
          />
        )}
      </div>
      
      {/* ═══════ Content Layer ═══════ */}
      <HeroContent
        assemblyComplete={assemblyComplete}
        assemblyProgress={assemblyProgress}
      />
      
      {/* ═══════ Metadata ═══════ */}
      <HeroMetadata
        assemblyComplete={assemblyComplete}
        location={CONTENT.LOCATION}
      />
      
      {/* ═══════ Screen Reader Content ═══════ */}
      <h1 className="sr-only">{CONTENT.NAME}</h1>
      <p className="sr-only">{CONTENT.DESCRIPTORS.join('. ')}.</p>
      <p className="sr-only">{CONTENT.TAGLINE}</p>
    </section>
  );
}
```

### 14.5 Fragment Position Data

```typescript
// src/lib/fragments.ts

export interface FragmentData {
  id: string;
  geometry: 'box' | 'triangle' | 'octahedron';
  scale: [number, number, number];
  targetPosition: [number, number, number];
  letter: string;
}

// Fragment positions to spell "TAYLOR ALLEN"
// Coordinates are relative to center (0,0,0)
// Adjust based on font metrics and desired spacing

export const TAYLOR_FRAGMENTS: FragmentData[] = [
  // T
  { id: 't-top', geometry: 'box', scale: [0.8, 0.15, 0.15], targetPosition: [-6, 0.5, 0], letter: 'T' },
  { id: 't-stem', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [-6, 0, 0], letter: 'T' },
  
  // A
  { id: 'a1-left', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [-4.8, 0, 0], letter: 'A' },
  { id: 'a1-right', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [-4.2, 0, 0], letter: 'A' },
  { id: 'a1-top', geometry: 'triangle', scale: [0.4, 0.2, 0.15], targetPosition: [-4.5, 0.5, 0], letter: 'A' },
  { id: 'a1-mid', geometry: 'box', scale: [0.4, 0.1, 0.15], targetPosition: [-4.5, 0, 0], letter: 'A' },
  
  // Y
  { id: 'y-left', geometry: 'box', scale: [0.15, 0.4, 0.15], targetPosition: [-3.3, 0.3, 0], letter: 'Y' },
  { id: 'y-right', geometry: 'box', scale: [0.15, 0.4, 0.15], targetPosition: [-2.7, 0.3, 0], letter: 'Y' },
  { id: 'y-stem', geometry: 'box', scale: [0.15, 0.5, 0.15], targetPosition: [-3, -0.2, 0], letter: 'Y' },
  
  // L
  { id: 'l1-stem', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [-1.8, 0, 0], letter: 'L' },
  { id: 'l1-base', geometry: 'box', scale: [0.5, 0.15, 0.15], targetPosition: [-1.55, -0.4, 0], letter: 'L' },
  
  // O
  { id: 'o1', geometry: 'octahedron', scale: [0.5, 0.5, 0.15], targetPosition: [-0.5, 0, 0], letter: 'O' },
  
  // R
  { id: 'r-stem', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [0.7, 0, 0], letter: 'R' },
  { id: 'r-top', geometry: 'box', scale: [0.4, 0.15, 0.15], targetPosition: [0.9, 0.4, 0], letter: 'R' },
  { id: 'r-mid', geometry: 'box', scale: [0.4, 0.15, 0.15], targetPosition: [0.9, 0, 0], letter: 'R' },
  { id: 'r-leg', geometry: 'box', scale: [0.15, 0.4, 0.15], targetPosition: [1.1, -0.2, 0], letter: 'R' },
  
  // Second row: ALLEN
  // A
  { id: 'a2-left', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [-4, -1.2, 0], letter: 'A' },
  { id: 'a2-right', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [-3.4, -1.2, 0], letter: 'A' },
  { id: 'a2-top', geometry: 'triangle', scale: [0.4, 0.2, 0.15], targetPosition: [-3.7, -0.7, 0], letter: 'A' },
  { id: 'a2-mid', geometry: 'box', scale: [0.4, 0.1, 0.15], targetPosition: [-3.7, -1.2, 0], letter: 'A' },
  
  // L
  { id: 'l2-stem', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [-2.4, -1.2, 0], letter: 'L' },
  { id: 'l2-base', geometry: 'box', scale: [0.5, 0.15, 0.15], targetPosition: [-2.15, -1.6, 0], letter: 'L' },
  
  // L
  { id: 'l3-stem', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [-1.2, -1.2, 0], letter: 'L' },
  { id: 'l3-base', geometry: 'box', scale: [0.5, 0.15, 0.15], targetPosition: [-0.95, -1.6, 0], letter: 'L' },
  
  // E
  { id: 'e-stem', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [0, -1.2, 0], letter: 'E' },
  { id: 'e-top', geometry: 'box', scale: [0.5, 0.15, 0.15], targetPosition: [0.25, -0.8, 0], letter: 'E' },
  { id: 'e-mid', geometry: 'box', scale: [0.4, 0.15, 0.15], targetPosition: [0.2, -1.2, 0], letter: 'E' },
  { id: 'e-bot', geometry: 'box', scale: [0.5, 0.15, 0.15], targetPosition: [0.25, -1.6, 0], letter: 'E' },
  
  // N
  { id: 'n-left', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [1.2, -1.2, 0], letter: 'N' },
  { id: 'n-right', geometry: 'box', scale: [0.15, 0.8, 0.15], targetPosition: [1.8, -1.2, 0], letter: 'N' },
  { id: 'n-diag', geometry: 'box', scale: [0.15, 0.9, 0.15], targetPosition: [1.5, -1.2, 0], letter: 'N' },
];

// Generate random initial positions
export function generateInitialPosition(): [number, number, number] {
  return [
    (Math.random() - 0.5) * 20,  // X: -10 to 10
    (Math.random() - 0.5) * 10,  // Y: -5 to 5
    (Math.random() - 0.5) * 10 - 5,  // Z: -10 to 0 (behind camera)
  ];
}

// Generate random initial rotation
export function generateInitialRotation(): [number, number, number] {
  return [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
  ];
}
```

### 14.6 useDeviceCapabilities Hook

```typescript
// src/hooks/useDeviceCapabilities.ts
'use client';

import { useState, useEffect } from 'react';

interface DeviceCapabilities {
  supportsWebGL: boolean;
  supportsWebGL2: boolean;
  isMobile: boolean;
  isLowEndDevice: boolean;
  gpuTier: 'low' | 'mid' | 'high';
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    supportsWebGL: true,
    supportsWebGL2: true,
    isMobile: false,
    isLowEndDevice: false,
    gpuTier: 'high',
  });

  useEffect(() => {
    const checkCapabilities = () => {
      // ═══════ WebGL Support ═══════
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      const gl2 = canvas.getContext('webgl2');
      
      const supportsWebGL = !!gl;
      const supportsWebGL2 = !!gl2;
      
      // ═══════ Mobile Detection ═══════
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      
      // ═══════ Low-End Device Detection ═══════
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = (navigator as any).deviceMemory || 8;
      const isLowEndDevice = hardwareConcurrency <= 2 || deviceMemory <= 2;
      
      // ═══════ GPU Tier Estimation ═══════
      let gpuTier: 'low' | 'mid' | 'high' = 'high';
      if (isLowEndDevice || !supportsWebGL2) {
        gpuTier = 'low';
      } else if (isMobile) {
        gpuTier = 'mid';
      }
      
      setCapabilities({
        supportsWebGL,
        supportsWebGL2,
        isMobile,
        isLowEndDevice,
        gpuTier,
      });
    };
    
    checkCapabilities();
  }, []);

  return capabilities;
}
```

---

## Appendix A: Animation Timing Reference

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ASSEMBLY ANIMATION TIMELINE                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  0ms                 500ms               2000ms    2500ms   3000ms      │
│  │                   │                   │         │        │          │
│  │   ┌───────────────┴───────────────────┴─────────┴────────┤          │
│  │   │          FRAGMENT TRAVEL (spring physics)            │          │
│  │   └──────────────────────────────────────────────────────┘          │
│  │                                                 │                    │
│  │                                       ┌─────────┴─────────┐         │
│  │                                       │ MAGNETIC SNAP (10%)│         │
│  │                                       └───────────────────┘         │
│  │                                                                      │
│  │                                           ┌───────────────┐         │
│  │                                           │SHADER RESOLVE │         │
│  │                                           └───────────────┘         │
│  │                                                    │                 │
│  │                                                    ├─ Word rotation  │
│  │                                                    │  fade in        │
│  │                                                    │                 │
│  │                                                    ├─ Tagline        │
│  │                                                    │  fade in        │
│  │                                                    │                 │
│  │                                                    ├─ Navigation     │
│  │                                                    │  slide down     │
│  │                                                    │                 │
│  │                                                    └─ COMPLETE       │
│  │                                                                      │
└──┴──────────────────────────────────────────────────────────────────────┘
```

---

## Appendix B: Shader Color Reference

| State | RGB | Hex | Description |
|-------|-----|-----|-------------|
| Searching Base | (0.1, 0.1, 0.12) | #1A1A1F | Cool dark gray |
| Resolved | (0.96, 0.96, 0.98) | #F5F5F7 | Warm white |
| Iridescent Blue | (0.23, 0.51, 0.97) | #3B82F6 | Primary iridescence |
| Iridescent Purple | (0.55, 0.36, 0.97) | #8B5CF6 | Secondary iridescence |

---

## Appendix C: Browser Support Matrix

| Browser | WebGL | WebGL2 | CSS Custom Props | Experience |
|---------|-------|--------|------------------|------------|
| Chrome 100+ | ✓ | ✓ | ✓ | Full 3D |
| Safari 15.4+ | ✓ | ✓ | ✓ | Full 3D |
| Firefox 100+ | ✓ | ✓ | ✓ | Full 3D |
| Edge 100+ | ✓ | ✓ | ✓ | Full 3D |
| iOS Safari 15.4+ | ✓ | ✓ | ✓ | SVG Fallback |
| Chrome Android | ✓ | ✓ | ✓ | SVG Fallback |
| Samsung Internet | ✓ | ✓ | ✓ | SVG Fallback |

---

*Document Version: 1.0 | Last Updated: December 31, 2025*