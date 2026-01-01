"use client";

import { Scene } from "@/components/three/scene";
import { FragmentAssembly } from "@/components/three/fragment-assembly";
import { CameraController } from "@/components/three/camera-controller";
import { CONTENT, SHADER } from "@/lib/constants";

export function Hero() {
  return (
    <section className="section-hero relative">
      {/* Three.js Canvas Background */}
      <Scene className="!pointer-events-auto">
        {/* Enhanced lighting setup - rebalanced for letter readability */}

        {/* Ambient - slightly increased for base visibility */}
        <ambientLight intensity={SHADER.LIGHTING.AMBIENT_INTENSITY} />

        {/* Key light - reduced for less washout */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={SHADER.LIGHTING.KEY_INTENSITY}
          color="#ffffff"
        />

        {/* Fill light - warm side fill, reduced */}
        <pointLight
          position={[-8, 3, 8]}
          intensity={SHADER.LIGHTING.FILL_INTENSITY}
          color="#ffd4a3"
          distance={30}
        />

        {/* Rim light - significantly reduced to prevent edge blowout */}
        <pointLight
          position={[0, -5, -10]}
          intensity={SHADER.LIGHTING.RIM_INTENSITY}
          color="#60a5fa"
          distance={40}
        />

        {/* Accent light - purple for iridescent pop, reduced */}
        <pointLight
          position={[5, -3, 5]}
          intensity={SHADER.LIGHTING.ACCENT_INTENSITY}
          color="#a855f7"
          distance={25}
        />

        {/* Parallax Camera Controller */}
        <CameraController intensity={2.5} smoothness={0.06} idleDrift />

        {/* Fragment Assembly Animation */}
        <FragmentAssembly autoPlay autoPlayDelay={800} />
      </Scene>

      {/* Content Layer */}
      <div className="container-portfolio relative z-10 pointer-events-none">
        {/* Location badge */}
        <div className="absolute left-8 bottom-8 text-[0.75rem] tracking-wider uppercase text-white-muted">
          {CONTENT.LOCATION}
        </div>

        {/* Scroll indicator */}
        <div className="absolute right-8 bottom-8 flex flex-col items-center gap-2">
          <span className="text-[0.625rem] tracking-widest uppercase text-white-dim">
            Scroll
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white-dim to-transparent" />
        </div>
      </div>
    </section>
  );
}
