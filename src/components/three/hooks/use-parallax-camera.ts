"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface UseParallaxCameraOptions {
  intensity?: number; // How much the camera moves (degrees)
  smoothness?: number; // Lerp factor (0-1, lower = smoother)
  enabled?: boolean;
  idleDrift?: boolean; // Enable subtle idle animation
  idleDriftSpeed?: number;
  idleDriftIntensity?: number;
}

export function useParallaxCamera({
  intensity = 2,
  smoothness = 0.08,
  enabled = true,
  idleDrift = true,
  idleDriftSpeed = 0.3,
  idleDriftIntensity = 0.5,
}: UseParallaxCameraOptions = {}) {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const lastActivityRef = useRef(Date.now());
  const isIdleRef = useRef(false);
  const baseRotationRef = useRef({ x: 0, y: 0 });

  // Store initial camera rotation
  useEffect(() => {
    baseRotationRef.current = {
      x: camera.rotation.x,
      y: camera.rotation.y,
    };
  }, [camera]);

  // Mouse move handler
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!enabled) return;

    mouseRef.current = {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight,
    };
    lastActivityRef.current = Date.now();
    isIdleRef.current = false;
  }, [enabled]);

  // Set up event listeners
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enabled, handleMouseMove]);

  // Update camera rotation each frame
  useFrame((state) => {
    if (!enabled) return;

    const time = state.clock.getElapsedTime();
    const intensityRad = (intensity * Math.PI) / 180; // Convert to radians

    // Check for idle state (no mouse movement for 3 seconds)
    const timeSinceActivity = Date.now() - lastActivityRef.current;
    isIdleRef.current = timeSinceActivity > 3000;

    if (isIdleRef.current && idleDrift) {
      // Idle drift animation - subtle figure-8 pattern
      const idleRad = (idleDriftIntensity * Math.PI) / 180;
      targetRotationRef.current = {
        x: baseRotationRef.current.x + Math.sin(time * idleDriftSpeed) * idleRad,
        y: baseRotationRef.current.y + Math.sin(time * idleDriftSpeed * 0.7) * Math.cos(time * idleDriftSpeed * 0.5) * idleRad,
      };
    } else {
      // Mouse-driven parallax
      const targetX = (mouseRef.current.y - 0.5) * intensityRad;
      const targetY = (mouseRef.current.x - 0.5) * intensityRad;

      targetRotationRef.current = {
        x: baseRotationRef.current.x + targetX,
        y: baseRotationRef.current.y + targetY,
      };
    }

    // Smooth interpolation
    currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * smoothness;
    currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * smoothness;

    // Apply to camera
    camera.rotation.x = currentRotationRef.current.x;
    camera.rotation.y = currentRotationRef.current.y;
  });

  return {
    mousePosition: mouseRef.current,
    isIdle: isIdleRef.current,
  };
}
