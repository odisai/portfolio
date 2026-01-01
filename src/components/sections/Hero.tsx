"use client";

import { Scene } from "@/components/three/Scene";
import { CONTENT } from "@/lib/constants";

export function Hero() {
  return (
    <section className="section-hero relative">
      {/* Three.js Canvas Background */}
      <Scene className="!pointer-events-auto">
        {/* FragmentAssembly component will go here */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        {/* Placeholder mesh - replace with FragmentAssembly */}
        <mesh rotation={[0.4, 0.4, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#2563EB" metalness={0.5} roughness={0.2} />
        </mesh>
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

