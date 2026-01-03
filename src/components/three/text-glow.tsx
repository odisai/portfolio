"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SHADER } from "@/lib/constants";

interface TextGlowProps {
  visible?: boolean;
}

// Simple vertex shader
const glowVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Elliptical radial glow fragment shader
const glowFragmentShader = `
  uniform float uIntensity;
  uniform float uScrollProgress;
  uniform vec3 uColorCenter;
  uniform vec3 uColorEdge;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    // Ellipse matching TAYLOR/ALLEN text area (wider than tall)
    vec2 centered = (vUv - 0.5) * vec2(2.2, 1.6);
    float dist = length(centered);

    // Very soft exponential falloff
    float glow = exp(-dist * dist * 1.8);

    // Subtle time-based pulse
    float pulse = 1.0 + sin(uTime * 0.5) * 0.05;
    glow *= pulse;

    // Color gradient from center to edge
    vec3 color = mix(uColorCenter, uColorEdge, smoothstep(0.0, 0.8, dist));

    // Scroll interaction: fade out as user scrolls
    float scrollFade = 1.0 - uScrollProgress * 0.75;
    float opacity = uIntensity * glow * scrollFade;

    gl_FragColor = vec4(color, opacity);
  }
`;

export function TextGlow({ visible = false }: TextGlowProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollRef = useRef(0);
  const intensityRef = useRef(0);

  // Create shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uIntensity: { value: 0 },
        uScrollProgress: { value: 0 },
        uTime: { value: 0 },
        uColorCenter: {
          value: new THREE.Vector3(...(SHADER.COLORS.IRIDESCENT_BLUE as [number, number, number])),
        },
        uColorEdge: {
          value: new THREE.Vector3(...(SHADER.COLORS.IRIDESCENT_PURPLE as [number, number, number])),
        },
      },
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
  }, []);

  materialRef.current = material;

  // Animate intensity and scroll effects
  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    const time = clock.getElapsedTime();

    // Smooth intensity transition
    const targetIntensity = visible ? 0.6 : 0;
    intensityRef.current += (targetIntensity - intensityRef.current) * 0.04;

    // Smooth scroll interpolation
    const targetScroll = Math.min(window.scrollY / 500, 1);
    scrollRef.current += (targetScroll - scrollRef.current) * 0.06;

    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uIntensity.value = intensityRef.current;
    materialRef.current.uniforms.uScrollProgress.value = scrollRef.current;

    // Scale grows slightly on scroll
    if (meshRef.current) {
      const scrollScale = 1 + scrollRef.current * 0.4;
      meshRef.current.scale.setScalar(scrollScale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1.5]}>
      <planeGeometry args={[6, 3]} />
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
}
