"use client";

import { useState, useEffect } from "react";
import { Scene } from "@/components/three/scene";
import { FragmentAssembly } from "@/components/three/fragment-assembly";
import { CameraController } from "@/components/three/camera-controller";
import { AmbientParticles } from "@/components/three/ambient-particles";
import { Navbar } from "@/components/ui/navbar";
import { FallbackText } from "@/components/ui/fallback-text";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CONTENT, SHADER } from "@/lib/constants";

export function Hero() {
  const [morphComplete, setMorphComplete] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Accessibility: respect reduced motion preference
  const reducedMotion = useReducedMotion();

  // Font loading timeout: show fallback if fonts don't load in 5s
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!fontsLoaded && !fontError) {
        console.warn("Font loading timeout - showing fallback text");
        setShowFallback(true);
        setMorphComplete(true);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [fontsLoaded, fontError]);

  // Show fallback immediately on font error
  useEffect(() => {
    if (fontError) {
      console.error("Font loading failed - showing fallback text");
      setShowFallback(true);
      setMorphComplete(true);
    }
  }, [fontError]);

  // Show nav 300ms after morph completes
  useEffect(() => {
    if (morphComplete) {
      const navTimer = setTimeout(() => setNavVisible(true), 300);
      return () => clearTimeout(navTimer);
    }
  }, [morphComplete]);

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

        {/* Parallax Camera Controller - disabled for reduced motion */}
        <CameraController
          enabled={!reducedMotion}
          intensity={2.5}
          smoothness={0.06}
          idleDrift={!reducedMotion}
        />

        {/* Fragment Assembly - 3D letters persist throughout */}
        {!showFallback && (
          <FragmentAssembly
            autoPlay
            autoPlayDelay={800}
            onAssemblyComplete={() => console.log("\n\n\nassembly complete\n\n\n")}
            onMorphComplete={() => setMorphComplete(true)}
            onFontsLoaded={setFontsLoaded}
            onFontError={() => setFontError(true)}
          />
        )}
      </Scene>

      {/* Fallback 2D Text - shown if fonts fail to load */}
      <FallbackText visible={showFallback} />

      {/* Content Layer */}
      <div className="container-portfolio relative z-10 pointer-events-none">
        {/* Descriptor Text - appears after morph completes (only if not using fallback) */}
        {morphComplete && !showFallback && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-20 text-center">
            <p className="text-sm tracking-[0.15em] uppercase text-white/50 animate-fade-in">
              {CONTENT.DESCRIPTORS.join(" • ")}
            </p>
          </div>
        )}

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
