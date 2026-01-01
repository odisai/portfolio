"use client";

import { useRef, useMemo, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { lerp, random } from "@/lib/utils";
import { ANIMATION } from "@/lib/constants";

export interface FragmentState {
  // Current position/rotation
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  
  // Target (assembled) position/rotation
  targetPosition: THREE.Vector3;
  targetRotation: THREE.Euler;
  targetScale: THREE.Vector3;
  
  // Scattered (initial) position/rotation
  scatteredPosition: THREE.Vector3;
  scatteredRotation: THREE.Euler;
  
  // Animation state
  progress: number; // 0 = scattered, 1 = assembled
  velocity: THREE.Vector3;
  resolved: number; // 0 = searching, 1 = resolved (for shader)
}

interface UseAssemblyOptions {
  fragmentCount: number;
  scatterRadius?: number;
  assemblyDuration?: number;
  staggerDelay?: number;
}

export function useAssembly({
  fragmentCount,
  scatterRadius = 15,
  assemblyDuration = ANIMATION.ASSEMBLY_DURATION / 1000,
  staggerDelay = 0.08,
}: UseAssemblyOptions) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAssembledRef = useRef(false);
  
  // Create fragment states
  const fragments = useMemo<FragmentState[]>(() => {
    return Array.from({ length: fragmentCount }, () => {
      // Random scattered position
      const theta = random(0, Math.PI * 2);
      const phi = random(0, Math.PI);
      const r = random(scatterRadius * 0.5, scatterRadius);
      
      const scatteredPosition = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi) + random(-5, 5)
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
        targetPosition: new THREE.Vector3(0, 0, 0),
        targetRotation: new THREE.Euler(0, 0, 0),
        targetScale: new THREE.Vector3(1, 1, 1),
        scatteredPosition,
        scatteredRotation,
        progress: 0,
        velocity: new THREE.Vector3(),
        resolved: 0,
      };
    });
  }, [fragmentCount, scatterRadius]);

  // Set target positions for each fragment
  const setTargetPositions = useCallback((positions: THREE.Vector3[]) => {
    positions.forEach((pos, i) => {
      if (fragments[i]) {
        fragments[i].targetPosition.copy(pos);
      }
    });
  }, [fragments]);

  // Animate assembly using GSAP
  const triggerAssembly = useCallback(() => {
    if (isAssembledRef.current) return;
    isAssembledRef.current = true;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      defaults: {
        ease: "expo.out",
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
          duration: assemblyDuration * 0.5,
          ease: "power2.out",
        },
        delay + assemblyDuration * 0.7
      );
    });

    timelineRef.current = tl;
    return tl;
  }, [fragments, assemblyDuration, staggerDelay]);

  // Scatter (reverse animation)
  const triggerScatter = useCallback(() => {
    if (!isAssembledRef.current) return;
    isAssembledRef.current = false;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const tl = gsap.timeline({
      defaults: {
        ease: "expo.in",
      },
    });

    fragments.forEach((fragment, i) => {
      const delay = i * staggerDelay * 0.5;
      
      tl.to(
        fragment,
        {
          resolved: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        delay
      );
      
      tl.to(
        fragment,
        {
          progress: 0,
          duration: assemblyDuration * 0.8,
          ease: "expo.in",
        },
        delay + 0.1
      );
    });

    timelineRef.current = tl;
    return tl;
  }, [fragments, assemblyDuration, staggerDelay]);

  // Update fragment positions/rotations each frame
  useFrame(() => {
    fragments.forEach((fragment) => {
      const { progress, scatteredPosition, scatteredRotation, targetPosition, targetRotation } = fragment;
      
      fragment.position.x = lerp(scatteredPosition.x, targetPosition.x, progress);
      fragment.position.y = lerp(scatteredPosition.y, targetPosition.y, progress);
      fragment.position.z = lerp(scatteredPosition.z, targetPosition.z, progress);
      
      fragment.rotation.x = lerp(scatteredRotation.x, targetRotation.x, progress);
      fragment.rotation.y = lerp(scatteredRotation.y, targetRotation.y, progress);
      fragment.rotation.z = lerp(scatteredRotation.z, targetRotation.z, progress);
    });
  });

  return {
    fragments,
    setTargetPositions,
    triggerAssembly,
    triggerScatter,
    isAssembled: isAssembledRef.current,
  };
}
