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

  // Empty turbopack config to suppress warning when using webpack
  turbopack: {},
};

export default nextConfig;
