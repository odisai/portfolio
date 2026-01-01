"use client";

import { useEffect, useMemo, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";
import { Fragment } from "./fragment";
import { useAssembly } from "./hooks/use-assembly";
import { CONTENT } from "@/lib/constants";

interface FragmentAssemblyProps {
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

export function FragmentAssembly({ 
  autoPlay = true, 
  autoPlayDelay = 1000 
}: FragmentAssemblyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hasTriggeredRef = useRef(false);
  const { viewport } = useThree();
  
  // Calculate responsive scale based on viewport
  const scale = useMemo(() => {
    const baseScale = 0.5;
    const minScale = 0.25;
    const maxScale = 0.6;
    const viewportScale = Math.min(viewport.width / 12, viewport.height / 8);
    return Math.max(minScale, Math.min(maxScale, baseScale * viewportScale));
  }, [viewport.width, viewport.height]);

  // Create letter geometries for "TAYLOR" and "ALLEN"
  const letterData = useMemo(() => {
    const firstName = CONTENT.NAME.split(" ")[0]; // "TAYLOR"
    const lastName = CONTENT.NAME.split(" ")[1]; // "ALLEN"
    
    const letters: { char: string; row: number; index: number }[] = [];
    
    // First name - top row
    firstName.split("").forEach((char, i) => {
      letters.push({ char, row: 0, index: i });
    });
    
    // Last name - bottom row
    lastName.split("").forEach((char, i) => {
      letters.push({ char, row: 1, index: i });
    });
    
    return letters;
  }, []);

  // Initialize assembly hook
  const { fragments, setTargetPositions, triggerAssembly } = useAssembly({
    fragmentCount: letterData.length,
    scatterRadius: 12,
    assemblyDuration: 2.5,
    staggerDelay: 0.06,
  });

  // Calculate target positions for assembled state
  useEffect(() => {
    const positions: THREE.Vector3[] = [];
    const letterSpacing = 1.2;
    const rowSpacing = 2.0;
    
    const firstName = CONTENT.NAME.split(" ")[0];
    const lastName = CONTENT.NAME.split(" ")[1];
    
    // Calculate centering offsets
    const firstRowWidth = (firstName.length - 1) * letterSpacing;
    const secondRowWidth = (lastName.length - 1) * letterSpacing;
    
    letterData.forEach(({ row, index }) => {
      const rowWidth = row === 0 ? firstRowWidth : secondRowWidth;
      const x = (index * letterSpacing) - (rowWidth / 2);
      const y = row === 0 ? rowSpacing / 2 : -rowSpacing / 2;
      
      positions.push(new THREE.Vector3(x, y, 0));
    });
    
    setTargetPositions(positions);
  }, [letterData, setTargetPositions]);

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

  // Create simple box geometries as letter placeholders
  // In production, you'd use Text3D with a JSON font
  const letterGeometries = useMemo(() => {
    return letterData.map(({ char }) => {
      // Create a box geometry sized based on character
      const width = char === "I" ? 0.3 : char === "M" || char === "W" ? 1.0 : 0.7;
      const height = 1.0;
      const depth = 0.2;
      
      const geometry = new THREE.BoxGeometry(width, height, depth);
      return geometry;
    });
  }, [letterData]);

  return (
    <group ref={groupRef} scale={scale}>
      {fragments.map((fragmentState, i) => (
        <Fragment
          key={`fragment-${i}`}
          state={fragmentState}
          geometry={letterGeometries[i]}
        />
      ))}
    </group>
  );
}

