"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FragmentState } from "./hooks/use-assembly";
import { SHADER } from "@/lib/constants";

interface FragmentProps {
  state: FragmentState;
  geometry: THREE.BufferGeometry;
}

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShaderCode = `
  uniform float uTime;
  uniform float uResolved;
  uniform vec3 uColorSearching;
  uniform vec3 uColorResolved;
  uniform vec3 uIridescentBlue;
  uniform vec3 uIridescentPurple;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
    
    float iridescenceShift = fresnel + sin(uTime * 0.5) * 0.1;
    vec3 iridescence = mix(uIridescentBlue, uIridescentPurple, iridescenceShift);
    
    vec3 searchingColor = uColorSearching + iridescence * 0.4;
    vec3 finalColor = mix(searchingColor, uColorResolved, uResolved);
    
    finalColor += fresnel * uResolved * 0.3;
    
    float edge = pow(fresnel, 3.0) * 0.2;
    finalColor += vec3(edge) * (1.0 - uResolved);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function Fragment({ state, geometry }: FragmentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolved: { value: 0 },
        uColorSearching: { value: new THREE.Vector3(...SHADER.COLORS.SEARCHING) },
        uColorResolved: { value: new THREE.Vector3(...SHADER.COLORS.RESOLVED) },
        uIridescentBlue: { value: new THREE.Vector3(...SHADER.COLORS.IRIDESCENT_BLUE) },
        uIridescentPurple: { value: new THREE.Vector3(...SHADER.COLORS.IRIDESCENT_PURPLE) },
      },
      vertexShader,
      fragmentShader: fragmentShaderCode,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.copy(state.position);
      meshRef.current.rotation.copy(state.rotation);
      meshRef.current.scale.copy(state.scale);
    }
    
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uResolved.value = state.resolved;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
