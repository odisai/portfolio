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
  fadeOut: number;
  // For floating animation
  floatOffset: THREE.Vector3;
  floatSpeed: number;
  rotationSpeed: THREE.Vector3;
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
  staggerDelay = 0.05,
  onAssemblyComplete,
  onAssemblyProgress,
}: UseAssemblyOptions) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAssembledRef = useRef(false);
  const timeRef = useRef(0);

  // Create fragment states
  const fragments = useMemo<FragmentState[]>(() => {
    return targetPositions.map((targetPosition) => {
      // Random scattered position
      const theta = random(0, Math.PI * 2);
      const phi = random(0, Math.PI);
      const r = random(scatterRadius * 0.6, scatterRadius);

      const scatteredPosition = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) - 3
      );

      const scatteredRotation = new THREE.Euler(
        random(-Math.PI, Math.PI),
        random(-Math.PI, Math.PI),
        random(-Math.PI, Math.PI)
      );

      const floatOffset = new THREE.Vector3(
        random(-1, 1),
        random(-1, 1),
        random(-0.5, 0.5)
      );

      const floatSpeed = random(0.3, 0.7);

      const rotationSpeed = new THREE.Vector3(
        random(-0.3, 0.3),
        random(-0.3, 0.3),
        random(-0.2, 0.2)
      );

      return {
        position: scatteredPosition.clone(),
        rotation: scatteredRotation.clone(),
        scale: new THREE.Vector3(1, 1, 1),
        targetPosition: targetPosition.clone(),
        scatteredPosition,
        scatteredRotation,
        progress: 0,
        fadeOut: 0,
        floatOffset,
        floatSpeed,
        rotationSpeed,
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
    });

    fragments.forEach((fragment, i) => {
      const delay = i * staggerDelay;

      // Movement to target position
      tl.to(
        fragment,
        {
          progress: 1,
          duration: assemblyDuration,
          ease: "power3.out",
        },
        delay
      );
    });

    // Trigger assembly complete when blobs reach positions (before fade)
    const completionTime = fragments.length * staggerDelay + assemblyDuration * 0.7;
    tl.call(() => {
      onAssemblyComplete?.();
    }, [], completionTime);

    // Fade out all blobs quickly after they reach positions  
    const fadeOutDelay = fragments.length * staggerDelay + assemblyDuration * 0.3;

    fragments.forEach((fragment, i) => {
      tl.to(
        fragment,
        {
          fadeOut: 1,
          duration: 0.5,
          ease: "power3.in",
        },
        fadeOutDelay + i * 0.01
      );
    });

    timelineRef.current = tl;
    return tl;
  }, [
    fragments,
    assemblyDuration,
    staggerDelay,
    onAssemblyComplete,
    onAssemblyProgress,
  ]);

  // Update fragment transforms each frame
  useFrame((_, delta) => {
    timeRef.current += delta;
    const time = timeRef.current;

    fragments.forEach((fragment) => {
      const {
        progress,
        scatteredPosition,
        targetPosition,
        scatteredRotation,
        floatOffset,
        floatSpeed,
        rotationSpeed,
      } = fragment;

      // Smooth easing
      const easedProgress = progress * progress * (3 - 2 * progress);

      // Position interpolation
      const baseX = lerp(scatteredPosition.x, targetPosition.x, easedProgress);
      const baseY = lerp(scatteredPosition.y, targetPosition.y, easedProgress);
      const baseZ = lerp(scatteredPosition.z, targetPosition.z, easedProgress);

      // Floating motion (reduces as progress increases)
      const floatIntensity = (1 - easedProgress) * 0.8;
      const floatX =
        Math.sin(time * floatSpeed + floatOffset.x * 10) *
        floatOffset.x *
        floatIntensity;
      const floatY =
        Math.cos(time * floatSpeed * 1.3 + floatOffset.y * 10) *
        floatOffset.y *
        floatIntensity;
      const floatZ =
        Math.sin(time * floatSpeed * 0.7 + floatOffset.z * 10) *
        floatOffset.z *
        floatIntensity;

      fragment.position.x = baseX + floatX;
      fragment.position.y = baseY + floatY;
      fragment.position.z = baseZ + floatZ;

      // Rotation slows down as it approaches target
      const spinIntensity = (1 - easedProgress) * 0.5;
      fragment.rotation.x =
        lerp(scatteredRotation.x, 0, easedProgress) +
        time * rotationSpeed.x * spinIntensity;
      fragment.rotation.y =
        lerp(scatteredRotation.y, 0, easedProgress) +
        time * rotationSpeed.y * spinIntensity;
      fragment.rotation.z =
        lerp(scatteredRotation.z, 0, easedProgress) +
        time * rotationSpeed.z * spinIntensity;

      // Gentle breathing when settled
      if (progress > 0.9) {
        const breathe = 1 + Math.sin(time * 1.5) * 0.015;
        fragment.scale.setScalar(breathe);
      }
    });
  });

  return {
    fragments,
    triggerAssembly,
    isAssembled: isAssembledRef.current,
  };
}
