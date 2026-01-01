"use client";

import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Fragment } from "./fragment";
import { useAssembly } from "./hooks/use-assembly";

// Generate simple letter positions for "TAYLOR ALLEN"
function generateLetterPositions() {
  const firstName = "TAYLOR";
  const lastName = "ALLEN";
  const positions: Array<{ x: number; y: number; letter: string }> = [];
  
  const letterSpacing = 1.2;
  const rowSpacing = 1.8;
  
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
  const { viewport } = useThree();

  // Calculate responsive scale
  const scale = useMemo(() => {
    const baseScale = 0.8;
    const viewportScale = Math.min(viewport.width / 12, viewport.height / 8);
    return Math.max(0.4, Math.min(1.0, baseScale * viewportScale));
  }, [viewport.width, viewport.height]);

  // Create target positions from letter positions
  const targetPositions = useMemo(() => {
    return LETTER_POSITIONS.map((pos) => 
      new THREE.Vector3(pos.x, pos.y, 0)
    );
  }, []);

  // Create geometries for each fragment (using various polyhedra)
  const geometries = useMemo(() => {
    const geoTypes = [
      () => new THREE.IcosahedronGeometry(0.3, 0),
      () => new THREE.OctahedronGeometry(0.35, 0),
      () => new THREE.TetrahedronGeometry(0.4, 0),
      () => new THREE.DodecahedronGeometry(0.28, 0),
      () => new THREE.BoxGeometry(0.5, 0.5, 0.5),
    ];
    
    return LETTER_POSITIONS.map((_, i) => geoTypes[i % geoTypes.length]());
  }, []);

  // Initialize assembly hook
  const { fragments, triggerAssembly } = useAssembly({
    targetPositions,
    scatterRadius: 12,
    assemblyDuration: 2.5,
    staggerDelay: 0.04,
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
          geometry={geometries[i]}
        />
      ))}
    </group>
  );
}
