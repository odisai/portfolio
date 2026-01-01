"use client";

import { useParallaxCamera } from "./hooks/use-parallax-camera";

interface CameraControllerProps {
  enabled?: boolean;
  intensity?: number;
  smoothness?: number;
  idleDrift?: boolean;
}

/**
 * Camera controller that adds parallax mouse tracking and idle drift.
 * Must be placed inside a Canvas context.
 */
export function CameraController({
  enabled = true,
  intensity = 2.5,
  smoothness = 0.06,
  idleDrift = true,
}: CameraControllerProps) {
  useParallaxCamera({
    intensity,
    smoothness,
    enabled,
    idleDrift,
    idleDriftSpeed: 0.25,
    idleDriftIntensity: 0.8,
  });

  return null;
}
