"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { lerp, random } from "@/lib/utils";
import { ANIMATION } from "@/lib/constants";

export interface FragmentState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  targetPosition: THREE.Vector3;
  scatteredPosition: THREE.Vector3;
  scatteredRotation: THREE.Euler;
  progress: number;
  resolved: number;
}

interface UseAssemblyOptions {
  targetPositions: THREE.Vector3[];
  scatterRadius?: number;
  assemblyDuration?: number;
  staggerDelay?: number;
  onAssemblyComplete?: () => void;
  onAssemblyProgress?: (progress: number) => void;
}

export function useAssembly({
  targetPositions,
  scatterRadius = 15,
  assemblyDuration = ANIMATION.ASSEMBLY_DURATION / 1000,
  staggerDelay = 0.04,
  onAssemblyComplete,
  onAssemblyProgress,
}: UseAssemblyOptions) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAssembledRef = useRef(false);

  // Create fragment states
  const fragments = useMemo<FragmentState[]>(() => {
    return targetPositions.map((targetPosition) => {
      // Random scattered position
      const theta = random(0, Math.PI * 2);
      const phi = random(0, Math.PI);
      const r = random(scatterRadius * 0.5, scatterRadius);

      const scatteredPosition = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) - 5
      );

      const scatteredRotation = new THREE.Euler(
        random(-Math.PI, Math.PI),
        random(-Math.PI, Math.PI),
        random(-Math.PI, Math.PI)
      );

      return {
        position: scatteredPosition.clone(),
        rotation: scatteredRotation.clone(),
        scale: new THREE.Vector3(1, 1, 1),
        targetPosition: targetPosition.clone(),
        scatteredPosition,
        scatteredRotation,
        progress: 0,
        resolved: 0,
      };
    });
  }, [targetPositions, scatterRadius]);

  // Trigger assembly animation
  const triggerAssembly = useCallback(() => {
    if (isAssembledRef.current) return;
    isAssembledRef.current = true;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      onUpdate: () => {
        const totalProgress =
          fragments.reduce((sum, f) => sum + f.progress, 0) / fragments.length;
        onAssemblyProgress?.(totalProgress);
      },
      onComplete: () => {
        onAssemblyComplete?.();
      },
    });

    fragments.forEach((fragment, i) => {
      const delay = i * staggerDelay;

      tl.to(
        fragment,
        {
          progress: 1,
          duration: assemblyDuration,
          ease: "expo.out",
        },
        delay
      );

      tl.to(
        fragment,
        {
          resolved: 1,
          duration: assemblyDuration * 0.4,
          ease: "power2.out",
        },
        delay + assemblyDuration * 0.6
      );
    });

    timelineRef.current = tl;
    return tl;
  }, [fragments, assemblyDuration, staggerDelay, onAssemblyComplete, onAssemblyProgress]);

  // Update fragment transforms each frame
  useFrame(() => {
    fragments.forEach((fragment) => {
      const { progress, scatteredPosition, targetPosition, scatteredRotation } = fragment;
      const easedProgress = progress * progress * (3 - 2 * progress);

      fragment.position.x = lerp(scatteredPosition.x, targetPosition.x, easedProgress);
      fragment.position.y = lerp(scatteredPosition.y, targetPosition.y, easedProgress);
      fragment.position.z = lerp(scatteredPosition.z, targetPosition.z, easedProgress);

      fragment.rotation.x = lerp(scatteredRotation.x, 0, easedProgress);
      fragment.rotation.y = lerp(scatteredRotation.y, 0, easedProgress);
      fragment.rotation.z = lerp(scatteredRotation.z, 0, easedProgress);
    });
  });

  return {
    fragments,
    triggerAssembly,
    isAssembled: isAssembledRef.current,
  };
}
