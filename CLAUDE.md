# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev     # Development server (uses webpack, not Turbopack)
npm run build   # Production build
npm run lint    # ESLint
```

## Architecture

This is a Next.js 16 portfolio site featuring a 3D WebGL hero animation built with React Three Fiber. The core visual is animated iridescent "blob" fragments that morph into text spelling "TAYLOR ALLEN".

### Three.js Animation System

The 3D animation pipeline in `src/components/three/`:

1. **Scene** (`scene.tsx`) - Canvas setup with post-processing (Bloom, ChromaticAberration) and studio environment lighting. Handles WebGL fallback and reduced motion preferences.

2. **FragmentAssembly** (`fragment-assembly.tsx`) - Orchestrates 11 fragment objects (one per letter). Manages:
   - Letter positioning for "TAYLOR" / "ALLEN" rows
   - Blob geometry generation with matching vertex counts
   - Cursor tracking for hover interactions

3. **Fragment** (`fragment.tsx`) - Individual morphing mesh with custom GLSL shaders:
   - Vertex shader: Morphs between blob and letter positions, applies noise deformation
   - Fragment shader: Iridescent/holographic material with Fresnel effects
   - Uniforms: `uMorphProgress`, `uResolved`, `uHoverIntensity`

4. **Hooks**:
   - `use-assembly.ts` - GSAP timeline for scattered → assembled animation with physics (floating, rotation)
   - `use-text-geometries.ts` - Loads Satoshi font JSON, generates TextGeometry for each letter
   - `use-parallax-camera.ts` - Mouse-driven camera parallax

5. **Geometry utilities** (`utils/geometry-utils.ts`) - `TARGET_VERTEX_COUNT = 8000` for morph compatibility. Normalizes any geometry to this count via up/downsampling.

### Key Configuration

- **React Compiler disabled** in `next.config.ts` - Three.js mutable objects are incompatible
- **Webpack shader imports** - `.glsl`, `.vert`, `.frag` files imported as raw source
- **Constants** in `src/lib/constants.ts` - Animation timings, shader colors, layout breakpoints

### Fonts

Three variable fonts loaded in `layout.tsx`:
- Satoshi (display): `--font-satoshi`
- Inter (body): `--font-inter`
- JetBrains Mono (code): `--font-jetbrains`

Font JSON for Three.js TextGeometry lives at `public/fonts/satoshi-bold.json`.

### Path Aliases

`@/*` maps to `./src/*`
