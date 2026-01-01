"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Fragment } from "./fragment";
import { useAssembly } from "./hooks/use-assembly";
import { useScrollEffects } from "./hooks/use-scroll-effects";

// Generate positions for floating blobs (no longer tied to letters)
function generateBlobPositions() {
  const positions: Array<{ x: number; y: number }> = [];
  const count = 11; // Same count as before for visual consistency

  // Distribute blobs in a loose grid pattern
  const cols = 6;
  const rows = 2;
  const spacingX = 0.85;
  const spacingY = 1.2;

  for (let row = 0; row < rows; row++) {
    const colsInRow = row === 0 ? 6 : 5;
    const rowWidth = colsInRow * spacingX;
    const rowOffset = -rowWidth / 2 + spacingX / 2;

    for (let col = 0; col < colsInRow; col++) {
      positions.push({
        x: rowOffset + col * spacingX,
        y: (rows / 2 - row - 0.5) * spacingY,
      });
    }
  }

  return positions;
}

const BLOB_POSITIONS = generateBlobPositions();

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
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    },
    [gl.domElement]
  );

  // Set up mouse tracking
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [gl.domElement, handleMouseMove]);

  // Update cursor world position each frame
  useFrame(() => {
    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    raycasterRef.current.ray.intersectPlane(
      planeRef.current,
      cursorWorldPosRef.current
    );
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
      groupRef.current.position.z = scrollEffects.zOffset;
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

  // Create target positions
  const targetPositions = useMemo(() => {
    return BLOB_POSITIONS.map((pos) => new THREE.Vector3(pos.x, pos.y, 0));
  }, []);

  // Seeds for each fragment's shader animation
  const seeds = useMemo(() => {
    return BLOB_POSITIONS.map((_, i) => i * 1.7 + 0.3);
  }, []);

  // Blob sizes - varied for visual interest
  const blobSizes = useMemo(() => {
    return [0.32, 0.36, 0.34, 0.38, 0.33, 0.35, 0.37, 0.34, 0.36, 0.34, 0.32];
  }, []);

  // Initialize assembly hook
  const { fragments, triggerAssembly } = useAssembly({
    targetPositions,
    scatterRadius: 15,
    assemblyDuration: 2.5,
    staggerDelay: 0.05,
    onAssemblyComplete,
    onAssemblyProgress,
  });

  // Auto-play assembly animation
  useEffect(() => {
    if (autoPlay && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      const timeout = setTimeout(() => {
        triggerAssembly();
      }, autoPlayDelay);

      return () => clearTimeout(timeout);
    }
  }, [autoPlay, autoPlayDelay, triggerAssembly]);

  return (
    <group ref={groupRef} scale={scale}>
      {fragments.map((fragmentState, i) => (
        <Fragment
          key={i}
          state={fragmentState}
          seed={seeds[i]}
          size={blobSizes[i % blobSizes.length]}
          cursorWorldPosition={cursorWorldPosRef.current}
          hoverRadius={2.5}
          scrollOpacity={scrollEffects.opacity}
        />
      ))}
    </group>
  );
}
