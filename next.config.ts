import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React Compiler for Three.js compatibility
  // React Compiler doesn't work well with mutable Three.js objects
  reactCompiler: false,
  
  // Configure webpack for raw shader imports
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      type: 'asset/source',
    });
    return config;
  },
  
  // Use webpack instead of Turbopack for shader imports
  // turbopack doesn't support ?raw imports well
};

export default nextConfig;
