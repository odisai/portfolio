"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";

interface UseScrollEffectsOptions {
  enabled?: boolean;
  maxScroll?: number; // Pixels at which effect is fully applied
  smoothness?: number; // Interpolation factor (0-1)
}

interface ScrollEffects {
  /** 0 at top, 1 when scrolled past maxScroll */
  progress: number;
  /** Scale multiplier (1 at top, smaller when scrolled) */
  scale: number;
  /** Z offset (0 at top, negative when scrolled) */
  zOffset: number;
  /** Opacity (1 at top, lower when scrolled) */
  opacity: number;
  /** Letter spread multiplier (0 at top, positive when scrolled) */
  spread: number;
}

export function useScrollEffects({
  enabled = true,
  maxScroll = 400,
  smoothness = 0.08,
}: UseScrollEffectsOptions = {}): ScrollEffects {
  const scrollRef = useRef(0);
  const targetRef = useRef(0);
  const effectsRef = useRef<ScrollEffects>({
    progress: 0,
    scale: 1,
    zOffset: 0,
    opacity: 1,
    spread: 0,
  });

  const handleScroll = useCallback(() => {
    if (!enabled) return;
    targetRef.current = Math.min(window.scrollY / maxScroll, 1);
  }, [enabled, maxScroll]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initialize

    return () => window.removeEventListener("scroll", handleScroll);
  }, [enabled, handleScroll]);

  useFrame(() => {
    if (!enabled) return;

    // Smooth interpolation
    scrollRef.current += (targetRef.current - scrollRef.current) * smoothness;

    const progress = scrollRef.current;

    // Update effects based on scroll progress
    effectsRef.current = {
      progress,
      scale: 1 - progress * 0.15, // Scale down to 85% at full scroll
      zOffset: -progress * 3, // Push back 3 units
      opacity: 1 - progress * 0.6, // Fade to 40% opacity
      spread: progress * 0.3, // Spread letters apart slightly
    };
  });

  return effectsRef.current;
}
