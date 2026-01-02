"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { Fragment } from "./fragment";
import { useAssembly } from "./hooks/use-assembly";
import { useScrollEffects } from "./hooks/use-scroll-effects";
import { useTextGeometries } from "./hooks/use-text-geometries";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";

// Letters for "TAYLOR ALLEN"
const LETTERS = ["T", "A", "Y", "L", "O", "R", "A", "L", "L", "E", "N"];

// Generate positions for letters in two-row layout
function getLetterPosition(index: number): { x: number; y: number } {
  const spacingX = 0.85;
  const spacingY = 0.8; // Adjusted for better visual balance

  // Top row: TAYLOR (indices 0-5)
  // Bottom row: ALLEN (indices 6-10)
  const isTopRow = index < 6;

  if (isTopRow) {
    const rowWidth = 6 * spacingX;
    const x = -rowWidth / 2 + spacingX / 2 + index * spacingX;
    return { x, y: spacingY / 2 };
  } else {
    const localIndex = index - 6;
    const rowWidth = 5 * spacingX;
    const x = -rowWidth / 2 + spacingX / 2 + localIndex * spacingX;
    return { x, y: -spacingY / 2 };
  }
}

const LETTER_POSITIONS = LETTERS.map((_, i) => getLetterPosition(i));

interface FragmentAssemblyProps {
  autoPlay?: boolean;
  autoPlayDelay?: number;
  onAssemblyComplete?: () => void;
  onMorphComplete?: () => void;
  onAssemblyProgress?: (progress: number) => void;
  onFontsLoaded?: (loaded: boolean) => void;
  onFontError?: (error: Error) => void;
}

export function FragmentAssembly({
  autoPlay = true,
  autoPlayDelay = 800,
  onAssemblyComplete,
  onMorphComplete,
  onAssemblyProgress,
  onFontsLoaded,
  onFontError,
}: FragmentAssemblyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hasTriggeredRef = useRef(false);
  const { viewport, camera, gl } = useThree();

  // Accessibility: detect reduced motion preference
  const reducedMotion = useReducedMotion();

  // Performance: detect device capabilities
  const { targetVertexCount } = useDeviceCapabilities();

  // Load text geometries for morphing with device-appropriate vertex count
  const {
    letterPositions,
    isLoaded: fontsLoaded,
    error: fontError,
  } = useTextGeometries(LETTERS, targetVertexCount);

  // Notify parent of font loading state
  useEffect(() => {
    if (fontsLoaded) {
      onFontsLoaded?.(true);
    }
    if (fontError) {
      onFontError?.(fontError);
    }
  }, [fontsLoaded, fontError, onFontsLoaded, onFontError]);

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

  // Apply scroll effects to group and individual letter spread
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.z = scrollEffects.zOffset;
      const scrollScale = scale * scrollEffects.scale;
      groupRef.current.scale.setScalar(scrollScale);
    }

    // Apply horizontal spread to letters based on scroll progress
    // Letters spread outward from center as user scrolls
    const spreadAmount = scrollEffects.spread || 0;
    if (spreadAmount > 0) {
      fragments.forEach((fragment, i) => {
        const letterPos = LETTER_POSITIONS[i];
        const centerX = 0; // Center of the layout
        const offsetFromCenter = letterPos.x - centerX;

        // Spread letters away from center (0.3 units max)
        const spreadOffset = offsetFromCenter * spreadAmount * 0.3;

        // Apply spread to fragment's target position X
        // This adds to the existing position without modifying the base targetPosition
        fragment.position.x = fragment.position.x + spreadOffset * 0.1;
      });
    }
  });

  // Calculate responsive scale
  const scale = useMemo(() => {
    const baseScale = 1.2;
    const viewportScale = Math.min(viewport.width / 10, viewport.height / 6);
    return Math.max(0.6, Math.min(1.5, baseScale * viewportScale));
  }, [viewport.width, viewport.height]);

  // Create target positions for letter layout
  const targetPositions = useMemo(() => {
    return LETTER_POSITIONS.map((pos) => new THREE.Vector3(pos.x, pos.y, 0));
  }, []);

  // Seeds for each fragment's shader animation
  const seeds = useMemo(() => {
    return LETTERS.map((_, i) => i * 1.7 + 0.3);
  }, []);

  // Blob sizes - varied for visual interest
  const blobSizes = useMemo(() => {
    return [0.32, 0.36, 0.34, 0.38, 0.33, 0.35, 0.37, 0.34, 0.36, 0.34, 0.32];
  }, []);

  // Initialize assembly hook with accessibility adjustments
  const { fragments, triggerAssembly } = useAssembly({
    targetPositions,
    scatterRadius: reducedMotion ? 0 : 15, // No scatter for reduced motion
    assemblyDuration: reducedMotion ? 0 : 2.5, // Instant assembly
    staggerDelay: reducedMotion ? 0 : 0.05, // No stagger
    reducedMotion, // Pass to hook for initial state
    onAssemblyComplete,
    onMorphComplete,
    onAssemblyProgress,
  });

  // For reduced motion: immediately trigger completion callbacks
  useEffect(() => {
    if (reducedMotion && fontsLoaded) {
      // Trigger callbacks immediately since there's no animation
      onMorphComplete?.();
    }
  }, [reducedMotion, fontsLoaded, onMorphComplete]);

  // Handle letter click - trigger spin animation
  const handleLetterClick = useCallback((index: number) => {
    const fragment = fragments[index];

    // Spin animation: 360° rotation on Y-axis
    gsap.to(fragment.rotation, {
      y: fragment.rotation.y + Math.PI * 2,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  }, [fragments]);

  // Auto-play assembly animation
  // Store triggerAssembly in a ref to avoid effect re-runs when callback reference changes
  const triggerAssemblyRef = useRef(triggerAssembly);
  triggerAssemblyRef.current = triggerAssembly;

  useEffect(() => {
    if (autoPlay && !hasTriggeredRef.current) {
      const timeout = setTimeout(() => {
        hasTriggeredRef.current = true;
        triggerAssemblyRef.current();
      }, autoPlayDelay);

      return () => clearTimeout(timeout);
    }
  }, [autoPlay, autoPlayDelay]);

  return (
    <group ref={groupRef} scale={scale}>
      {fragments.map((fragmentState, i) => (
        <Fragment
          key={i}
          state={fragmentState}
          seed={seeds[i]}
          size={blobSizes[i % blobSizes.length]}
          letterPositions={fontsLoaded ? letterPositions[i] : undefined}
          cursorWorldPosition={cursorWorldPosRef.current}
          hoverRadius={2.5}
          scrollOpacity={scrollEffects.opacity}
          zCompression={scrollEffects.zCompression}
          onClick={() => handleLetterClick(i)}
        />
      ))}
    </group>
  );
}
