"use client";

import { useRef, useCallback, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface FragmentInteraction {
  index: number;
  intensity: number; // 0-1 based on distance from cursor
  isHovered: boolean;
}

interface UseFragmentInteractionsOptions {
  fragmentCount: number;
  enabled?: boolean;
  hoverRadius?: number; // Radius in world units for hover detection
  rippleDecay?: number; // How fast ripple effect decays
}

interface UseFragmentInteractionsResult {
  interactions: FragmentInteraction[];
  hoveredIndex: number | null;
  cursorWorldPosition: THREE.Vector3;
}

export function useFragmentInteractions({
  fragmentCount,
  enabled = true,
  hoverRadius = 1.5,
  rippleDecay = 0.95,
}: UseFragmentInteractionsOptions): UseFragmentInteractionsResult {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const cursorWorldPos = useRef(new THREE.Vector3());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const interactionsRef = useRef<FragmentInteraction[]>(
    Array.from({ length: fragmentCount }, (_, i) => ({
      index: i,
      intensity: 0,
      isHovered: false,
    }))
  );

  // Update mouse position on move
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!enabled) return;

    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, [enabled, gl.domElement]);

  // Set up event listener
  useFrame(() => {
    if (!enabled) return;

    // Update raycaster
    raycaster.current.setFromCamera(mouse.current, camera);

    // Get cursor position on the z=0 plane
    raycaster.current.ray.intersectPlane(plane.current, cursorWorldPos.current);

    // Update all fragment interactions based on distance
    interactionsRef.current.forEach((interaction, i) => {
      // Decay existing intensity
      interaction.intensity *= rippleDecay;
      interaction.isHovered = false;
    });
  });

  // Add listener once
  useFrame(() => {
    const canvas = gl.domElement;
    if (!canvas.dataset.interactionsAttached) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.dataset.interactionsAttached = "true";
    }
  });

  return {
    interactions: interactionsRef.current,
    hoveredIndex,
    cursorWorldPosition: cursorWorldPos.current,
  };
}

/**
 * Calculate interaction intensity for a fragment based on cursor distance
 */
export function getFragmentInteractionIntensity(
  fragmentPosition: THREE.Vector3,
  cursorPosition: THREE.Vector3,
  maxRadius: number = 2
): number {
  const distance = fragmentPosition.distanceTo(cursorPosition);
  if (distance > maxRadius) return 0;

  // Smooth falloff
  const normalized = 1 - distance / maxRadius;
  return normalized * normalized; // Quadratic falloff for smoother effect
}
