"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

interface IntroOverlayProps {
  onIntroComplete: () => void;
  onPhaseChange?: (phase: IntroPhase) => void;
}

export type IntroPhase =
  | "void"      // Initial dark state
  | "genesis"   // Point of light emerges
  | "burst"     // Explosion outward
  | "ready"     // Ready for assembly
  | "complete"; // Intro finished

export function IntroOverlay({ onIntroComplete, onPhaseChange }: IntroOverlayProps) {
  const [phase, setPhase] = useState<IntroPhase>("void");
  const [isVisible, setIsVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const updatePhase = useCallback((newPhase: IntroPhase) => {
    setPhase(newPhase);
    onPhaseChange?.(newPhase);
  }, [onPhaseChange]);

  useEffect(() => {
    if (!overlayRef.current || !orbRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        updatePhase("complete");
        setIsVisible(false);
        onIntroComplete();
      }
    });

    timelineRef.current = tl;

    // Phase 1: VOID - subtle ambient (0-0.8s)
    tl.to({}, { duration: 0.4 });

    // Phase 2: GENESIS - orb emerges (0.8-2s)
    tl.call(() => updatePhase("genesis"), [], 0.4);

    // Orb scales up with pulse
    tl.fromTo(orbRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      },
      0.4
    );

    // Orb pulses
    tl.to(orbRef.current, {
      scale: 1.2,
      duration: 0.3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: 1,
    }, 1.2);

    // Phase 3: BURST - explosion (2-2.8s)
    tl.call(() => updatePhase("burst"), [], 2);

    // Rings expand
    if (ringsRef.current) {
      const rings = ringsRef.current.children;
      tl.to(rings, {
        scale: 15,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
      }, 2);
    }

    // Orb expands and fades
    tl.to(orbRef.current, {
      scale: 3,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
    }, 2.1);

    // Phase 4: READY - overlay fades (2.8-3.2s)
    tl.call(() => updatePhase("ready"), [], 2.8);

    // Overlay fades to transparent
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
    }, 2.8);

    return () => {
      tl.kill();
    };
  }, [onIntroComplete, updatePhase]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505] pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Central orb */}
          <div
            ref={orbRef}
            className="relative w-16 h-16 opacity-0"
            style={{ transform: 'scale(0)' }}
          >
            {/* Core glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#60a5fa] via-[#a855f7] to-[#ec4899] blur-sm" />

            {/* Inner core */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/90 to-[#60a5fa]/80" />

            {/* Shimmer effect */}
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)',
                animationDuration: '2s',
              }}
            />
          </div>

          {/* Expansion rings */}
          <div ref={ringsRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-16 h-16 rounded-full border opacity-40"
                style={{
                  borderColor: i === 0 ? '#60a5fa' : i === 1 ? '#a855f7' : '#ec4899',
                  borderWidth: '1px',
                }}
              />
            ))}
          </div>

          {/* Subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
