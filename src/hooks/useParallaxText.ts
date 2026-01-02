"use client";

import { useState, useEffect, useRef } from "react";

interface ParallaxTextOptions {
  intensity?: number;
  smoothness?: number;
  maxRotation?: number;
  enabled?: boolean;
}

interface ParallaxTransform {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
}

/**
 * Hook for creating parallax 3D text effects based on mouse movement
 * Returns transform values that can be applied to text elements
 */
export function useParallaxText({
  intensity = 20,
  smoothness = 0.1,
  maxRotation = 8,
  enabled = true,
}: ParallaxTextOptions = {}) {
  const [transform, setTransform] = useState<ParallaxTransform>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  });

  const targetRef = useRef<ParallaxTransform>({
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
  });

  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) {
      setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Normalize mouse position to -1 to 1
      const normalizedX = (clientX / innerWidth) * 2 - 1;
      const normalizedY = (clientY / innerHeight) * 2 - 1;

      // Calculate target transforms
      targetRef.current = {
        x: normalizedX * intensity,
        y: normalizedY * intensity,
        rotateX: -normalizedY * maxRotation, // Negative for natural tilt
        rotateY: normalizedX * maxRotation,
      };
    };

    const animate = () => {
      setTransform((current) => ({
        x: current.x + (targetRef.current.x - current.x) * smoothness,
        y: current.y + (targetRef.current.y - current.y) * smoothness,
        rotateX:
          current.rotateX +
          (targetRef.current.rotateX - current.rotateX) * smoothness,
        rotateY:
          current.rotateY +
          (targetRef.current.rotateY - current.rotateY) * smoothness,
      }));

      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [intensity, smoothness, maxRotation, enabled]);

  // Generate CSS transform string
  const transformString = `translate3d(${transform.x}px, ${transform.y}px, 0) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`;

  return {
    transform: transformString,
    values: transform,
  };
}
