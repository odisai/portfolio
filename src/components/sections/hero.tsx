"use client";

import { useState, useEffect } from "react";
import { Scene } from "@/components/three/scene";
import { FragmentAssembly } from "@/components/three/fragment-assembly";
import { CameraController } from "@/components/three/camera-controller";
import { AmbientParticles } from "@/components/three/ambient-particles";
import { HeroText } from "@/components/ui/hero-text";
import { Navbar } from "@/components/ui/navbar";
import { CONTENT, SHADER } from "@/lib/constants";

export function Hero() {
  const [assemblyComplete, setAssemblyComplete] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [hideBlobs, setHideBlobs] = useState(false);

  // Fallback: show text after 4 seconds regardless
  useEffect(() => {
    const fallback = setTimeout(() => {
      setAssemblyComplete(true);
    }, 4000);
    return () => clearTimeout(fallback);
  }, []);

  // Show nav 300ms after assembly completes, hide blobs shortly after
  useEffect(() => {
    if (assemblyComplete) {
      const navTimer = setTimeout(() => setNavVisible(true), 300);
      const blobTimer = setTimeout(() => setHideBlobs(true), 500);
      return () => {
        clearTimeout(navTimer);
        clearTimeout(blobTimer);
      };
    }
  }, [assemblyComplete]);

  return (
    <section className="section-hero relative">
      {/* Navigation - slides in after assembly */}
      <Navbar visible={navVisible} />

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

        {/* Ambient Particle Field - minimal */}
        <AmbientParticles count={80} opacity={0.25} speed={0.08} />

        {/* Parallax Camera Controller */}
        <CameraController intensity={2.5} smoothness={0.06} idleDrift />

        {/* Fragment Assembly Animation - unmount after text appears */}
        {!hideBlobs && (
          <FragmentAssembly
            autoPlay
            autoPlayDelay={800}
            onAssemblyComplete={() => setAssemblyComplete(true)}
          />
        )}
      </Scene>

      {/* Crisp 2D Text - fades in as 3D blobs fade out */}
      <HeroText visible={assemblyComplete} />

      {/* Content Layer */}
      <div className="container-portfolio relative z-10 pointer-events-none">
        {/* Descriptor Text - appears after assembly */}

        {/* Location badge */}
        <div className="absolute left-8 bottom-8 text-[0.625rem] tracking-widest uppercase text-white/40">
          {CONTENT.LOCATION}
        </div>
      </div>

      {/* Scroll indicator - positioned relative to section */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-2 z-10 pointer-events-none">
        <span className="text-[0.5rem] tracking-[0.25em] uppercase text-white/30">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
