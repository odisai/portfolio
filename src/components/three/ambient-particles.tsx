"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { random } from "@/lib/utils";

interface AmbientParticlesProps {
  count?: number;
  radius?: number;
  minSize?: number;
  maxSize?: number;
  opacity?: number;
  speed?: number;
  enabled?: boolean;
}

// Particle vertex shader
const particleVertexShader = `
  uniform float uTime;
  uniform float uSpeed;

  attribute float aScale;
  attribute float aOffset;
  attribute vec3 aVelocity;

  varying float vOpacity;

  void main() {
    vec3 pos = position;

    // Gentle floating motion
    float t = uTime * uSpeed + aOffset;
    pos.x += sin(t * 0.5 + aOffset * 6.28) * 0.3;
    pos.y += cos(t * 0.3 + aOffset * 3.14) * 0.4 + sin(t * 0.1) * 0.2;
    pos.z += sin(t * 0.2 + aOffset * 2.0) * 0.2;

    // Slow drift
    pos += aVelocity * uTime * 0.1;

    // Wrap around bounds (soft reset)
    pos = mod(pos + 15.0, 30.0) - 15.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Size attenuation
    gl_PointSize = aScale * (300.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 1.0, 8.0);

    // Depth-based opacity fade
    float depth = -mvPosition.z;
    vOpacity = smoothstep(20.0, 5.0, depth) * smoothstep(1.0, 3.0, depth);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Particle fragment shader
const particleFragmentShader = `
  uniform float uOpacity;
  varying float vOpacity;

  void main() {
    // Soft circular particle
    float dist = length(gl_PointCoord - 0.5);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.2, dist) * vOpacity * uOpacity;

    // Subtle warm white color
    vec3 color = vec3(0.95, 0.93, 0.9);

    gl_FragColor = vec4(color, alpha);
  }
`;

export function AmbientParticles({
  count = 350,
  radius = 12,
  minSize = 0.5,
  maxSize = 2.0,
  opacity = 0.35,
  speed = 0.12,
  enabled = true,
}: AmbientParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, scales, offsets, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const offsets = new Float32Array(count);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Distribute in a box around the scene, biased toward back
      positions[i * 3] = random(-radius, radius);
      positions[i * 3 + 1] = random(-radius * 0.6, radius * 0.6);
      positions[i * 3 + 2] = random(-radius * 0.5, -2); // Behind the letters

      scales[i] = random(minSize, maxSize);
      offsets[i] = random(0, 1);

      // Very slow random drift
      velocities[i * 3] = random(-0.02, 0.02);
      velocities[i * 3 + 1] = random(-0.01, 0.01);
      velocities[i * 3 + 2] = random(-0.01, 0.01);
    }

    return { positions, scales, offsets, velocities };
  }, [count, radius, minSize, maxSize]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: opacity },
        uSpeed: { value: speed },
      },
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [opacity, speed]);

  useFrame(({ clock }) => {
    if (materialRef.current && enabled) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
    geo.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 3));
    return geo;
  }, [positions, scales, offsets, velocities]);

  if (!enabled) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </points>
  );
}
