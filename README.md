# Taylor Allen Portfolio

Personal portfolio website featuring a 3D WebGL hero animation with morphing iridescent fragments.

**Live at:** [taylorallen.dev](https://taylorallen.dev)

## Features

- **3D Hero Animation** - Animated blob fragments that morph into text using React Three Fiber and custom GLSL shaders
- **Iridescent Materials** - Premium holographic shaders with Fresnel effects and dynamic lighting
- **Parallax Camera** - Mouse-driven camera movement with idle drift animation
- **Performance Optimized** - WebGL2 detection, reduced motion support, and responsive design

## Tech Stack

- **Next.js 16** - React framework with App Router
- **React Three Fiber** - Three.js renderer for React
- **GSAP** - Animation timeline and physics
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lenis** - Smooth scroll

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Architecture

The core 3D animation system lives in `src/components/three/`:
- Custom vertex morphing between blob and letter geometries
- GLSL shaders for iridescent materials
- GSAP-powered assembly animation with staggered timing
- 8,000 vertex meshes for crisp letter definition

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## License

© 2025 Taylor Allen. All rights reserved.
