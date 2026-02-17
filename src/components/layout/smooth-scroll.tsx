"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();
  const { isMobile, isLowEnd, isTouch } = useDeviceCapabilities();

  useEffect(() => {
    // Native scrolling is less janky on constrained/touch devices.
    if (reducedMotion || isMobile || isLowEnd || isTouch) return;

    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease out expo
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Expose lenis to global scope for GSAP ScrollTrigger integration
    // @ts-expect-error - Adding to window for GSAP
    window.lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      // @ts-expect-error - Added to window for GSAP
      delete window.lenis;
    };
  }, [isLowEnd, isMobile, isTouch, reducedMotion]);

  return <>{children}</>;
}
