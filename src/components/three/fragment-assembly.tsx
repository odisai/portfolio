"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Fragment } from "./fragment";
import { useAssembly } from "./hooks/use-assembly";
import { useTextGeometries } from "./hooks/use-text-geometries";
import { useScrollEffects } from "./hooks/use-scroll-effects";
import { createMorphableBlobPositions, TARGET_VERTEX_COUNT } from "./utils/geometry-utils";

// Generate letter positions for "TAYLOR ALLEN"
function generateLetterPositions() {
  const firstName = "TAYLOR";
  const lastName = "ALLEN";
  const positions: Array<{ x: number; y: number; letter: string }> = [];

  const letterSpacing = 0.9;
  const rowSpacing = 1.4;

  // First row: TAYLOR
  const firstRowWidth = firstName.length * letterSpacing;
  const firstRowOffset = -firstRowWidth / 2 + letterSpacing / 2;

  firstName.split("").forEach((letter, i) => {
    positions.push({
      x: firstRowOffset + i * letterSpacing,
      y: rowSpacing / 2,
      letter,
    });
  });

  // Second row: ALLEN
  const secondRowWidth = lastName.length * letterSpacing;
  const secondRowOffset = -secondRowWidth / 2 + letterSpacing / 2;

  lastName.split("").forEach((letter, i) => {
    positions.push({
      x: secondRowOffset + i * letterSpacing,
      y: -rowSpacing / 2,
      letter,
    });
  });

  return positions;
}

const LETTER_POSITIONS = generateLetterPositions();

interface FragmentAssemblyProps {
  autoPlay?: boolean;
  autoPlayDelay?: number;
  onAssemblyComplete?: () => void;
  onAssemblyProgress?: (progress: number) => void;
}

export function FragmentAssembly({
  autoPlay = true,
  autoPlayDelay = 800,
  onAssemblyComplete,
  onAssemblyProgress,
}: FragmentAssemblyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hasTriggeredRef = useRef(false);
  const { viewport, camera, gl } = useThree();

  // Cursor tracking for hover interactions
  const mouseRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());
  const cursorWorldPosRef = useRef(new THREE.Vector3());
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  // Mouse move handler
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, [gl.domElement]);

  // Set up mouse tracking
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [gl.domElement, handleMouseMove]);

  // Update cursor world position each frame
  useFrame(() => {
    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    raycasterRef.current.ray.intersectPlane(planeRef.current, cursorWorldPosRef.current);
  });

  // Scroll effects for parallax depth
  const scrollEffects = useScrollEffects({
    enabled: true,
    maxScroll: 500,
    smoothness: 0.06,
  });

  // Apply scroll effects to group
  useFrame(() => {
    if (groupRef.current) {
      // Apply scroll-based z offset for depth effect
      groupRef.current.position.z = scrollEffects.zOffset;

      // Apply subtle scale reduction on scroll
      const scrollScale = scale * scrollEffects.scale;
      groupRef.current.scale.setScalar(scrollScale);
    }
  });

  // Calculate responsive scale
  const scale = useMemo(() => {
    const baseScale = 1.2;
    const viewportScale = Math.min(viewport.width / 10, viewport.height / 6);
    return Math.max(0.6, Math.min(1.5, baseScale * viewportScale));
  }, [viewport.width, viewport.height]);

  // Extract just the letters for text geometry generation
  const letters = useMemo(() => {
    return LETTER_POSITIONS.map((pos) => pos.letter);
  }, []);

  // Load text geometries for morphing
  const { letterPositions: textPositions, isLoaded: fontLoaded } = useTextGeometries(letters);

  // Create target positions from letter positions
  const targetPositions = useMemo(() => {
    return LETTER_POSITIONS.map((pos) => new THREE.Vector3(pos.x, pos.y, 0));
  }, []);

  // Create blob positions with matching vertex count for each fragment
  const blobPositionsArray = useMemo(() => {
    const sizes = [0.32, 0.36, 0.34, 0.38, 0.33, 0.35, 0.37, 0.34, 0.36, 0.34, 0.32];

    return LETTER_POSITIONS.map((_, i) => {
      const size = sizes[i % sizes.length];
      const seed = i * 1.5 + 0.5;
      return createMorphableBlobPositions(TARGET_VERTEX_COUNT, size, seed);
    });
  }, []);

  // Seeds for each fragment's shader animation
  const seeds = useMemo(() => {
    return LETTER_POSITIONS.map((_, i) => i * 1.7 + 0.3);
  }, []);

  // Initialize assembly hook
  const { fragments, triggerAssembly } = useAssembly({
    targetPositions,
    scatterRadius: 15,
    assemblyDuration: 3.0,
    staggerDelay: 0.06,
    onAssemblyComplete,
    onAssemblyProgress,
  });

  // Auto-play assembly animation
  useEffect(() => {
    if (autoPlay && !hasTriggeredRef.current && fontLoaded) {
      hasTriggeredRef.current = true;
      const timeout = setTimeout(() => {
        triggerAssembly();
      }, autoPlayDelay);

      return () => clearTimeout(timeout);
    }
  }, [autoPlay, autoPlayDelay, triggerAssembly, fontLoaded]);

  // Don't render until font is loaded
  if (!fontLoaded || textPositions.length === 0) {
    return null;
  }

  return (
    <group ref={groupRef} scale={scale}>
      {fragments.map((fragmentState, i) => (
        <Fragment
          key={i}
          state={fragmentState}
          blobPositions={blobPositionsArray[i]}
          letterPositions={textPositions[i]}
          seed={seeds[i]}
          cursorWorldPosition={cursorWorldPosRef.current}
          hoverRadius={2.5}
          scrollOpacity={scrollEffects.opacity}
        />
      ))}
    </group>
  );
}
