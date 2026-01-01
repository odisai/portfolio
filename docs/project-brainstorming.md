---

# Taylor Allen Portfolio: Design Brainstorm

## PART 1: CONCEPT STATEMENT

**"First Principles."**

Taylor Allen's portfolio visualizes the founder's mind: breaking complex problems down to fundamental elements, then building them back up into elegant systems. The site itself embodies this philosophy—starting from scattered geometric fragments rendered as real-time 3D shader objects that assemble into structure, mirroring the 0→1 journey that defines Taylor's work.

This isn't a portfolio. It's a spatial demonstration of how a systems architect thinks.

---

## PART 2: THE "NEVER SEEN BEFORE" ELEMENT

### The Signature Moment: "Assembly" — Now with Shaders

**What happens:**

On page load, visitors see a dark canvas populated with floating geometric fragments—triangles, rectangles, circles, abstract polyhedra—rendered as **real-time 3D objects with custom shaders**. These fragments have material presence: subtle reflections, soft shadows, and a gentle iridescent sheen that shifts as they rotate.

They're not flat. They exist in space.

Over 2.5 seconds, these fragments begin to recognize each other. They drift toward alignment. They rotate, adjust, and finally *click* into position, forming "TAYLOR ALLEN." The shader materials transition as they lock—shifting from a cool, searching state (subtle blue-gray iridescence) to a warm, resolved state (confident white with soft glow).

**The shader details:**

- **Fragment material:** Custom GLSL shader with fresnel rim lighting, subtle noise displacement, and animated gradient that responds to position
- **Depth of field:** Fragments further from camera have subtle blur, creating cinematic depth
- **Ambient particles:** Tiny dust-like particles drift in the background, also shader-driven, creating atmosphere
- **Light response:** Fragments catch a single directional light source, creating consistent but dynamic shadows
- **Post-processing:** Subtle bloom on bright edges, chromatic aberration at screen edges (very subtle, 1-2px)

**The assembly physics:**

- Fragments use spring physics (not linear easing) for organic feel
- Each fragment has slight rotation momentum that dampens as it settles
- Near-miss moments: fragments almost collide, adjust trajectory—feels alive
- Final snap has subtle "magnetic" pull in last 10% of journey

**Why this elevates the concept:**

- **Demonstrates technical depth** — This isn't CSS animations; this is real graphics programming
- **Creates material presence** — Fragments feel like objects, not graphics
- **Adds replay value** — Subtle shader variations make each visit slightly different
- **Establishes premium tone** — This is the craft level of a top creative studio

**Technical execution:**

- Three.js for scene management and fragment geometry
- Custom GLSL shaders for materials (vertex + fragment shaders)
- Post-processing via Three.js EffectComposer (bloom, subtle DOF)
- GSAP for timing orchestration on top of physics simulation
- Web Audio API for spatial sound design (optional but impactful)

### Mobile Adaptation: Elegant Simplification

On mobile, we honor the concept while respecting performance and battery:

**What changes:**

- Fragments rendered as **2D SVG elements** with CSS transforms
- No WebGL overhead
- Same assembly animation logic, executed with GSAP
- Fragments have subtle CSS drop-shadows and gradient fills to suggest depth
- Animation duration shortened slightly (2.0s vs 2.5s)

**What stays:**

- The assembly narrative remains identical
- Fragment shapes match desktop
- Timing and easing feel consistent
- The "revelation" moment is preserved

**Why this works:**

- 60fps achievable on mid-tier devices
- No battery drain from GPU
- Still feels crafted, not compromised
- Users who later visit on desktop get the "full experience"

---

## PART 3: FULL SITE NARRATIVE

### Section 1: THE ASSEMBLY (0-100vh)

**Emotional beat:** Intrigue → Revelation → Recognition

**Contains:**

- The signature 3D shader fragment-to-name animation
- Subtle descriptor text that fades in after name settles: *"Founder. Architect. Builder."*
- Floating in corners: "Bay Area, CA" (left) and a live timestamp (right)
- Minimal scroll indicator: a thin vertical line that fills as you approach scroll

**3D environment details:**

- Camera positioned slightly off-center, creating asymmetric composition
- Fragments occupy a 3D volume roughly 2000x1000x500 units
- Subtle camera drift (0.5° rotation over 10 seconds) keeps scene alive during idle
- Mouse/touch parallax: Camera responds subtly to cursor position (±2° rotation)

**Presentation:**
Full dark canvas (#0A0A0B). The 3D canvas IS the background. No navigation visible initially—it slides in from top after assembly completes.

**Transition to next:**
As user begins scrolling, the assembled name *holds its position* while the 3D canvas compresses in z-space (fragments flatten). New content emerges from below. The name gradually scales down and pins to the top-left corner as a persistent logo—now as simple SVG, releasing GPU resources.

**Micro-interactions:**

- Hovering over any letter during idle state sends a "ripple" through the fragment physics—they wobble, remember their scattered origins
- Cursor tracked in 3D space affects lighting angle subtly

---

### Section 2: THE CURRENT BUILD (100-250vh)

**Emotional beat:** Focus → Understanding → Respect

**Contains:**

- OdisAI as hero project—massive, featured
- The value prop: *"The AI data intelligence layer for veterinary medicine"*
- Key proof points: UC Davis PLASMA, NSF I-Corps, NECX
- A video or animated product demo (small, tasteful, expandable)

**Presentation:**
The OdisAI section feels like entering a distinct space. Background subtly shifts to a warm charcoal with hints of OdisAI's brand color. Typography scales dramatically.

**The Problem→Solution Slider:**
Two states controlled by horizontal drag:

- LEFT: "The Problem" — abstract visualization of fragmented data, paperwork chaos
- RIGHT: "The Solution" — clean data flows, unified intelligence

**Transition to next:**
Section compresses, revealing the builder's archive below.

---

### Section 3: THE ARCHIVE (250-450vh)

**Emotional beat:** Breadth → Pattern → Credibility

**Contains:**

- **Poppin** — Featured prominently as the signature past build
- Sprift — Secondary card
- Stanford Health Care architecture work — Tertiary but prestigious
- Other ventures as smaller mentions

**Hierarchy (Left to Right in horizontal scroll):**

1. **OdisAI residue** (partially visible, largest) — continuity from previous section
2. **Poppin** (hero past project) — Full card treatment with Build Log interaction
3. **Stanford Health Care** (enterprise credibility) — Architecture/systems focus
4. **Sprift** (startup breadth) — Compact card
5. **Earlier work** (optional) — Minimal treatment or omit

**Poppin Feature Card:**

- Large visual presence (matches OdisAI card size from previous section)
- Headline: *"Poppin"* + subtitle: *"Social Commerce Platform"*
- Role: CTO & Co-Founder
- Impact: "Led development team from concept to shipped MVP"
- Duration: "May 2021 — Feb 2022"
- The Build Log hover animation plays here: wireframe → architecture → code → product

**Stanford Health Care Card:**

- Distinct treatment: More refined, institutional feel
- Headline: *"Stanford Health Care"*
- Role: *"Solutions Architecture"*
- Description: "Enterprise architecture for one of the nation's leading health systems"
- Duration: "May 2024 — May 2025"
- Visual: Abstract system diagram or clean architectural lines (not a product screenshot)
- This card signals: "I operate at enterprise scale, not just startup scrappy"

**Presentation:**
Horizontal scroll gallery. Each project card has subtle 3D tilt on hover (CSS perspective transform, not full WebGL). Cards cast soft shadows suggesting depth.

**The "Build Log" interaction (Poppin focus):**
On hover/focus:

1. Wireframe sketch (200ms)
2. Architecture diagram (200ms)
3. Code snippet (200ms)
4. Final product UI (holds)

For Stanford, the hover shows: Requirements → System Design → Implementation → Integration

**Transition to next:**
Scroll resumes vertical. Typography bridge: *"Building is a practice."*

---

### Section 4: THE METHOD (450-550vh)

**Emotional beat:** Philosophy → Alignment → Connection

**Contains:**

- Taylor's building philosophy
- Technical credentials woven naturally
- Architecture mindset emphasized

**Presentation:**
Full-width typographic treatment. Large, scroll-triggered text reveals. No images—pure language with the Assembly DNA: key words have subtle fragment-wobble on reveal.

**Content emphasis:**

- Systems thinking
- 0→1 expertise
- Team leadership
- Architecture at scale (Stanford callback)
- Ship velocity

**Key statement examples:**

> "I architect systems that let teams move faster."
> 

> "From startup MVPs to enterprise health systems—the principles are the same. Break it down. Build it right. Ship it."
> 

**Transition to next:**
Text compresses, revealing credentials.

---

### Section 5: THE CREDENTIALS (550-650vh)

**Emotional beat:** Proof → Trust → Readiness

**Contains:**

- Timeline: 2018→2025
- **Stanford Health Care** — Featured institutional credential
- UC San Diego, UC Berkeley — Education
- Tech stack as subtle typography treatment

**Stanford Healthcare emphasis:**
A distinct callout within this section:

> "Solutions Architecture — Stanford Health Care"
"Enterprise systems serving one of America's top-ranked hospitals"
> 

**What's removed:**

- ~~Best in Show — CodeDay~~
- ~~Best Student Team — Expedition Hacks~~
- ~~HackerRank certifications~~

These early achievements, while meaningful, don't serve the narrative of a mature technical founder.

**Tech stack treatment:**
Not a logo grid. Instead, integrated into prose:

> "I think in TypeScript, architect in Python, and prototype in Swift. Fluent in SQL and NoSQL, comfortable anywhere from mobile to infrastructure."
> 

**Transition to next:**
Grid cells begin to scatter (reverse assembly), revealing final CTA.

---

### Section 6: THE OPEN CHANNEL (650-700vh)

**Emotional beat:** Invitation → Action → Anticipation

**Contains:**

- Contact CTA: *"Let's build something."*
- Email, LinkedIn, GitHub
- Bay Area, CA + availability indicator

**Presentation:**
Scattered fragments from transition hover in constellation around CTA. Not fully reassembled—story continues with the visitor.

Single email input: "Get in touch" — minimal friction.

**Footer:**
Name as slow marquee, copyright, built-with credit.

---

## PART 4: VISUAL DIRECTION

### Color Philosophy

**Primary: Deep Space (#0A0A0B)**

- Allows 3D fragments to "pop" with their shader materials
- Creates infinite canvas feeling

**Text: Bright White (#FAFAFA)**

- Maximum contrast against dark canvas
- Clean, technical, confident

**Accent: Architect Blue (#2563EB)**

- Blueprint aesthetics
- Stanford connection (subtle)
- Used sparingly: links, active states

**Secondary Accent: Warm Signal (#F59E0B)**

- Status indicators only
- Suggests life and activity

**3D Fragment Shader Colors:**

- Base: Cool gray (#1A1A1F) with subtle blue-shift in shadows
- Highlights: White (#FFFFFF) on edges catching light
- Iridescent accent: Shifts from blue to purple based on view angle
- "Resolved" state: Warmer, settled tone

---

## PART 5: MOTION SCRIPT

### Motion Personality: "Confident Patience"

### Key Animation Definitions

**1. Assembly (hero animation) — 3D Shader Version**

- Duration: 2500ms total
- Physics: Spring-based with damping factor 0.8
- Fragment rotation: Each fragment rotates on all three axes during travel
- Shader transition: Material shifts from "searching" to "resolved" in final 500ms
- Stagger: Procedural, based on distance from final position
- Final snap: Magnetic easing in last 10%
- Post-settle: Fragments have micro-drift (±0.5px) to feel alive

**2. Mobile Assembly (2D SVG Version)**

- Duration: 2000ms
- Easing: Custom cubic-bezier (0.22, 1, 0.36, 1)
- Fragments slide from randomized edge positions
- Subtle rotation: Max 45° during travel
- Drop shadow animates with position for depth illusion

**3. 3D Canvas Interactions**

- Mouse parallax: ±2° camera rotation, 150ms lerp
- Idle drift: 0.5° rotation over 10 seconds, seamless loop
- Scroll compression: Z-depth flattens as user scrolls (fragments approach z=0)

**4. Build Log hover (Poppin)**

- Total: 2000ms
- Image crossfade: 200ms each state
- Scale: Card lifts 4px (translateZ on hover)
- Shadow: Expands and softens on hover

---

## PART 6: TECHNICAL NOTES

### Recommended Stack

**Framework:** Next.js 15 (App Router)

**3D & Shaders:**

- Three.js for scene, camera, geometry management
- Custom GLSL shaders (vertex + fragment) for fragment materials
- @react-three/fiber for React integration (optional, could go vanilla)
- @react-three/drei for helpers (OrbitControls disabled, but useful utilities)
- Post-processing: UnrealBloomPass, subtle BokehPass

**Animation:**

- GSAP for timeline orchestration
- Lenis for smooth scroll
- Custom spring physics for fragment assembly (or use cannon-es for full physics)

**Mobile Detection:**

- Use `navigator.gpu` or `renderer.capabilities` to detect WebGL2 support
- Fallback to SVG assembly if low-end device detected
- `prefers-reduced-motion` triggers instant assembly, no animation

### Shader Architecture

```glsl
// Fragment shader concept (simplified)
uniform float uTime;
uniform float uResolved; // 0 = searching, 1 = resolved
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  // Fresnel rim lighting
  float fresnel = pow(1.0 - dot(vNormal, normalize(vViewPosition)), 2.0);

  // Iridescent shift based on view angle
  vec3 iridescence = mix(
    vec3(0.2, 0.4, 0.8), // blue
    vec3(0.6, 0.2, 0.8), // purple
    fresnel
  );

  // Transition from searching to resolved
  vec3 baseColor = mix(
    vec3(0.1, 0.1, 0.12) + iridescence * 0.3, // searching: cool, shifting
    vec3(0.95, 0.95, 0.97),                    // resolved: warm white
    uResolved
  );

  gl_FragColor = vec4(baseColor, 1.0);
}

```

### Performance Budget

**Desktop:**

- Target 60fps during assembly animation
- Drop to 30fps acceptable during scroll (canvas compressing)
- Total JS bundle: <200kb gzipped
- WebGL context released after hero section passes

**Mobile:**

- SVG assembly: 60fps mandatory
- No WebGL loaded
- Total JS bundle: <150kb gzipped

### Progressive Enhancement Layers

1. **No JS:** Static name, all content visible, vertical scroll only
2. **JS, no WebGL:** SVG assembly animation, full scroll behavior
3. **JS + WebGL:** Full 3D shader experience
4. **JS + WebGL + high-end:** Post-processing effects enabled

---

## PART 7: AWARD POTENTIAL

### Why This Wins

**1. Technical craft is visible**

- Shader work demonstrates engineering at the graphics level
- Not achievable with templates or no-code tools
- Jury will recognize the effort

**2. Concept and execution are unified**

- "First Principles" isn't just a tagline—it's literally visualized
- The assembly metaphor carries through every decision

**3. The portfolio showcases the work AND the maker**

- Poppin + Stanford show range (startup hustle + enterprise scale)
- OdisAI shows current focus
- The site itself is the proof of capability

**4. Mobile isn't an afterthought**

- Graceful degradation that still delights
- SVG assembly is its own craft

### The One Screenshot Moment

Mid-assembly: 3D fragments with iridescent shaders, 70% converged, catching light, casting soft shadows. The name "TAYLOR ALLEN" emerging from beautiful chaos.

This image works everywhere—OG preview, Awwwards thumbnail, LinkedIn banner.

---

## SUMMARY OF CHANGES FROM v1

| Element | v1 | v2 |
| --- | --- | --- |
| Fragment rendering | CSS/basic Three.js | Custom GLSL shaders, full 3D materials |
| Location | San Ramon, CA | **Bay Area, CA** |
| Past project priority | Equal treatment | **Poppin featured**, Stanford elevated |
| Stanford role | Mentioned | **Highlighted as architecture credential** |
| Hackathon awards | Included | **Removed** |
| Mobile approach | Simplified mention | **Detailed SVG fallback system** |
| Shader details | Not specified | **Full GLSL concept provided** |

---

Ready to go deeper on the shader implementation, prototype the assembly physics, or refine the project card hierarchy further. What's the next priority?