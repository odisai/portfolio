"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { isWebGL2Supported, cn } from "@/lib/utils";
import { SHADER } from "@/lib/constants";

interface SceneProps {
  children: React.ReactNode;
  className?: string;
}

function PostProcessing() {
  const offset = useMemo(
    () => new THREE.Vector2(SHADER.CHROMATIC_ABERRATION, SHADER.CHROMATIC_ABERRATION),
    []
  );

  return (
    <EffectComposer>
      {/* Depth of Field - subtle cinematic blur */}
      <DepthOfField
        focusDistance={SHADER.DOF.FOCUS_DISTANCE}
        focalLength={SHADER.DOF.FOCAL_LENGTH}
        bokehScale={SHADER.DOF.BOKEH_SCALE}
        height={SHADER.DOF.HEIGHT}
      />
      <Bloom
        intensity={SHADER.BLOOM_INTENSITY}
        luminanceThreshold={SHADER.BLOOM_THRESHOLD}
        luminanceSmoothing={0.8}
        radius={SHADER.BLOOM_RADIUS}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={offset}
        radialModulation={false}
        modulationOffset={0.5}
      />
    </EffectComposer>
  );
}

export function Scene({ children, className }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setWebglSupported(isWebGL2Supported());
  }, []);

  // Show nothing during SSR/hydration to prevent mismatch
  if (webglSupported === null) {
    return <div className={cn("canvas-container", className)} />;
  }

  if (!webglSupported) {
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
          fov: 50,
          near: 0.1,
          far: 1000,
          position: [0, 0, 8],
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop={reducedMotion ? "demand" : "always"}
      >
        <Suspense fallback={null}>
          {/* Environment lighting for reflections */}
          <Environment preset="studio" environmentIntensity={0.5} />

          {children}

          {/* Post-processing effects */}
          {!reducedMotion && <PostProcessing />}

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
