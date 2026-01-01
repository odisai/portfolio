"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isWebGL2Supported, cn } from "@/lib/utils";

interface SceneProps {
  children: React.ReactNode;
  className?: string;
}

export function Scene({ children, className }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  if (typeof window !== "undefined" && !isWebGL2Supported()) {
    return (
      <div className={cn("webgl-fallback", className)}>
        <p className="text-white-muted">
          WebGL not supported. Please use a modern browser.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("canvas-container", className)}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, 10],
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
