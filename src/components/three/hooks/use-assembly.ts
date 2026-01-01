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
  morphProgress: number; // 0 = blob, 1 = letter shape
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
  staggerDelay = 0.06,
  onAssemblyComplete,
  onAssemblyProgress,
}: UseAssemblyOptions) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAssembledRef = useRef(false);
  const timeRef = useRef(0);

  // Create fragment states with enhanced properties
  const fragments = useMemo<FragmentState[]>(() => {
    return targetPositions.map((targetPosition, index) => {
      // Random scattered position - distributed in a sphere around the scene
      const theta = random(0, Math.PI * 2);
      const phi = random(0, Math.PI);
      const r = random(scatterRadius * 0.6, scatterRadius);

      const scatteredPosition = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) - 3 // Slightly behind camera
      );

      const scatteredRotation = new THREE.Euler(
        random(-Math.PI, Math.PI),
        random(-Math.PI, Math.PI),
        random(-Math.PI, Math.PI)
      );

      // Floating animation parameters - each fragment floats uniquely
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
        resolved: 0,
        morphProgress: 0, // Start as blob
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
      onComplete: () => {
        onAssemblyComplete?.();
      },
    });

    fragments.forEach((fragment, i) => {
      const delay = i * staggerDelay;

      // Pop-in scale animation (elastic)
      tl.to(
        fragment.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        },
        delay * 0.5 // Stagger the pop-in
      );

      // Movement to target position with spring overshoot
      tl.to(
        fragment,
        {
          progress: 1,
          duration: assemblyDuration,
          ease: `elastic.out(${ANIMATION.SPRING.ASSEMBLY_ELASTICITY}, ${ANIMATION.SPRING.ASSEMBLY_DAMPING})`,
        },
        delay + 0.3 // Start moving after pop-in begins
      );

      // Morph from blob to letter (starts 30% into movement, overlaps)
      tl.to(
        fragment,
        {
          morphProgress: 1,
          duration: assemblyDuration * 0.8,
          ease: "power2.inOut", // Smooth morph
        },
        delay + assemblyDuration * 0.3 // Start morphing 30% into movement
      );

      // Color transition to resolved state (after morph is mostly done)
      tl.to(
        fragment,
        {
          resolved: 1,
          duration: assemblyDuration * 0.5,
          ease: "power2.out",
        },
        delay + assemblyDuration * 0.6
      );

      // Settle animation - bouncy final placement
      tl.to(
        fragment.scale,
        {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.4,
          ease: `elastic.out(${ANIMATION.SPRING.SETTLE_ELASTICITY}, ${ANIMATION.SPRING.SETTLE_DAMPING})`,
        },
        delay + assemblyDuration * 0.9
      );
    });

    timelineRef.current = tl;
    return tl;
  }, [fragments, assemblyDuration, staggerDelay, onAssemblyComplete, onAssemblyProgress]);

  // Update fragment transforms each frame
  useFrame((state, delta) => {
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
        resolved
      } = fragment;

      // Smooth easing for position interpolation
      const easedProgress = progress * progress * (3 - 2 * progress);

      // Calculate base position (lerp between scattered and target)
      const baseX = lerp(scatteredPosition.x, targetPosition.x, easedProgress);
      const baseY = lerp(scatteredPosition.y, targetPosition.y, easedProgress);
      const baseZ = lerp(scatteredPosition.z, targetPosition.z, easedProgress);

      // Add floating motion (reduces as progress increases)
      const floatIntensity = (1 - easedProgress) * 0.8;
      const floatX = Math.sin(time * floatSpeed + floatOffset.x * 10) * floatOffset.x * floatIntensity;
      const floatY = Math.cos(time * floatSpeed * 1.3 + floatOffset.y * 10) * floatOffset.y * floatIntensity;
      const floatZ = Math.sin(time * floatSpeed * 0.7 + floatOffset.z * 10) * floatOffset.z * floatIntensity;

      fragment.position.x = baseX + floatX;
      fragment.position.y = baseY + floatY;
      fragment.position.z = baseZ + floatZ;

      // Rotation: blend from scattered rotation to zero, with continuous spin that slows down
      const spinIntensity = (1 - easedProgress) * 0.5;
      fragment.rotation.x = lerp(scatteredRotation.x, 0, easedProgress) + time * rotationSpeed.x * spinIntensity;
      fragment.rotation.y = lerp(scatteredRotation.y, 0, easedProgress) + time * rotationSpeed.y * spinIntensity;
      fragment.rotation.z = lerp(scatteredRotation.z, 0, easedProgress) + time * rotationSpeed.z * spinIntensity;

      // Subtle breathing scale when resolved (very subtle)
      if (resolved > 0.9) {
        const breathe = 1 + Math.sin(time * 1.5) * 0.02;
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
