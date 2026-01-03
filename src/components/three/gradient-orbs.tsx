"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SHADER } from "@/lib/constants";

interface GradientOrbsProps {
  enabled?: boolean;
}

// Soft radial gradient vertex shader
const orbVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Soft radial gradient fragment shader
const orbFragmentShader = `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uScrollProgress;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  varying vec2 vUv;

  void main() {
    // Radial gradient from center
    vec2 centered = vUv - 0.5;
    float dist = length(centered) * 2.0;

    // Super soft gaussian-like falloff
    float alpha = exp(-dist * dist * 2.5);

    // Subtle color blend based on position and time
    float colorMix = vUv.x * 0.5 + sin(uTime * 0.15) * 0.2 + 0.25;
    vec3 color = mix(uColor1, uColor2, colorMix);

    // Apply scroll fade (fade out as user scrolls)
    float scrollFade = 1.0 - uScrollProgress * 0.7;
    alpha *= uOpacity * scrollFade;

    gl_FragColor = vec4(color, alpha);
  }
`;

interface OrbConfig {
  position: [number, number, number];
  size: number;
  color1: [number, number, number];
  color2: [number, number, number];
  driftSpeed: number;
  driftOffset: number;
}

export function GradientOrbs({ enabled = true }: GradientOrbsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);
  const scrollRef = useRef(0);

  // Define 3 orbs with different positions and colors
  const orbConfigs: OrbConfig[] = useMemo(
    () => [
      {
        position: [-4, 1, -8],
        size: 10,
        color1: SHADER.COLORS.IRIDESCENT_BLUE as [number, number, number],
        color2: SHADER.COLORS.IRIDESCENT_PURPLE as [number, number, number],
        driftSpeed: 0.12,
        driftOffset: 0,
      },
      {
        position: [5, -1.5, -10],
        size: 12,
        color1: SHADER.COLORS.IRIDESCENT_PURPLE as [number, number, number],
        color2: [0.9, 0.3, 0.6] as [number, number, number], // Pink
        driftSpeed: 0.1,
        driftOffset: 2.1,
      },
      {
        position: [0, 2.5, -6],
        size: 8,
        color1: [0.3, 0.5, 0.9] as [number, number, number], // Softer blue
        color2: SHADER.COLORS.IRIDESCENT_BLUE as [number, number, number],
        driftSpeed: 0.14,
        driftOffset: 4.2,
      },
    ],
    []
  );

  // Create shader materials
  const materials = useMemo(() => {
    return orbConfigs.map((config) => {
      return new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0.35 },
          uScrollProgress: { value: 0 },
          uColor1: { value: new THREE.Vector3(...config.color1) },
          uColor2: { value: new THREE.Vector3(...config.color2) },
        },
        vertexShader: orbVertexShader,
        fragmentShader: orbFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
    });
  }, [orbConfigs]);

  // Store materials in ref for animation updates
  materialsRef.current = materials;

  // Smooth scroll tracking
  useFrame(({ clock }) => {
    if (!enabled) return;

    const time = clock.getElapsedTime();

    // Smooth scroll interpolation
    const targetScroll = Math.min(window.scrollY / 500, 1);
    scrollRef.current += (targetScroll - scrollRef.current) * 0.06;
    const scrollProgress = scrollRef.current;

    // Update each orb
    materials.forEach((material, index) => {
      const config = orbConfigs[index];

      material.uniforms.uTime.value = time;
      material.uniforms.uScrollProgress.value = scrollProgress;
    });

    // Animate group position based on scroll (drift up and to the side)
    if (groupRef.current) {
      groupRef.current.position.x = scrollProgress * 1.5;
      groupRef.current.position.y = scrollProgress * 2;
    }
  });

  if (!enabled) return null;

  return (
    <group ref={groupRef}>
      {orbConfigs.map((config, index) => {
        const time = index * config.driftOffset;
        // Add gentle floating motion offset
        const floatX = Math.sin(time * config.driftSpeed) * 0.5;
        const floatY = Math.cos(time * config.driftSpeed * 0.7) * 0.3;

        return (
          <mesh
            key={index}
            position={[
              config.position[0] + floatX,
              config.position[1] + floatY,
              config.position[2],
            ]}
          >
            <planeGeometry args={[config.size, config.size]} />
            <primitive object={materials[index]} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}
