"use client";

import { Scene } from "@/components/three/scene";
import { FragmentAssembly } from "@/components/three/fragment-assembly";
import { CONTENT } from "@/lib/constants";

export function Hero() {
  return (
    <section className="section-hero relative">
      {/* Three.js Canvas Background */}
      <Scene className="!pointer-events-auto">
        {/* Enhanced lighting setup for iridescent materials */}

        {/* Ambient - low for dramatic contrast */}
        <ambientLight intensity={0.3} />

        {/* Key light - main illumination */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={2.0}
          color="#ffffff"
        />

        {/* Fill light - warm side fill */}
        <pointLight
          position={[-8, 3, 8]}
          intensity={0.8}
          color="#ffd4a3"
          distance={30}
        />

        {/* Rim light - cool backlight for edge definition */}
        <pointLight
          position={[0, -5, -10]}
          intensity={1.2}
          color="#60a5fa"
          distance={40}
        />

        {/* Accent light - purple for iridescent pop */}
        <pointLight
          position={[5, -3, 5]}
          intensity={0.6}
          color="#a855f7"
          distance={25}
        />

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
