"use client";

import { useEffect, useRef, useId } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimatedGrainProps {
  opacity?: number;
  intensity?: number;
  animated?: boolean;
}

export function AnimatedGrain({
  opacity = 0.035,
  intensity = 0.7,
  animated = true,
}: AnimatedGrainProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();
  const filterId = useId().replace(/:/g, "_");

  useEffect(() => {
    if (reducedMotion || !animated) return;

    let seed = 0;
    let interval: NodeJS.Timeout;

    const animate = () => {
      seed = (seed + 1) % 100;
      const turbulence = svgRef.current?.querySelector("feTurbulence");
      if (turbulence) {
        turbulence.setAttribute("seed", String(seed));
      }
    };

    // Animate at ~10fps for subtle grain movement
    interval = setInterval(animate, 100);

    return () => {
      clearInterval(interval);
    };
  }, [reducedMotion, animated]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9998]"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={intensity}
              numOctaves={3}
              stitchTiles="stitch"
              seed={0}
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          filter={`url(#${filterId})`}
          opacity={0.5}
        />
      </svg>
    </div>
  );
}
