"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FragmentState } from "./hooks/use-assembly";
import { SHADER } from "@/lib/constants";

interface FragmentProps {
  state: FragmentState;
  seed?: number;
  size?: number;
  letterPositions?: Float32Array;
  cursorWorldPosition?: THREE.Vector3;
  hoverRadius?: number;
  scrollOpacity?: number;
  zCompression?: number;
  onClick?: () => void;
}

// Organic blob vertex shader with morphing support
const vertexShader = `
  uniform float uTime;
  uniform float uSeed;
  uniform float uHoverIntensity;
  uniform float uMorphProgress;
  uniform float uResolved;
  uniform float uZCompression;

  attribute vec3 aLetterPosition;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vDisplacement;
  varying float vHoverIntensity;

  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;

    // Morph between blob and letter positions
    vec3 morphedPosition = mix(position, aLetterPosition, uMorphProgress);

    // Dynamic noise intensity (reduces as letter resolves)
    float noiseIntensity = mix(0.2, 1.0, 1.0 - uResolved);

    // Multi-octave noise for organic blob deformation
    float noise1 = snoise(morphedPosition * 2.0 + uTime * 0.5 + uSeed) * noiseIntensity;
    float noise2 = snoise(morphedPosition * 4.0 - uTime * 0.3 + uSeed * 2.0) * 0.5 * noiseIntensity;
    float noise3 = snoise(morphedPosition * 8.0 + uTime * 0.2 + uSeed * 3.0) * 0.25 * noiseIntensity;

    float totalNoise = (noise1 + noise2 + noise3) * 0.2;

    // Breathing/pulsing effect (more subtle when resolved)
    float breatheIntensity = mix(0.015, 0.04, 1.0 - uResolved);
    float breathe = sin(uTime * 1.5 + uSeed) * breatheIntensity;

    // Hover wobble effect
    float hoverWobble = uHoverIntensity * sin(uTime * 8.0 + morphedPosition.x * 5.0) * 0.03;
    float hoverLift = uHoverIntensity * 0.1;

    // Displaced position
    vec3 displaced = morphedPosition + normal * (totalNoise + breathe + hoverWobble);

    // Z-compression for scroll effect
    displaced.z *= (1.0 - uZCompression);
    displaced.z += hoverLift;

    vDisplacement = totalNoise;
    vNormal = normalize(normalMatrix * normal);
    vHoverIntensity = uHoverIntensity;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Iridescent/holographic fragment shader
const fragmentShaderCode = `
  uniform float uTime;
  uniform float uSeed;
  uniform float uScrollOpacity;
  uniform float uFadeOut;
  uniform float uMorphProgress;
  uniform float uResolved;
  uniform float uBaseOpacity;
  uniform vec3 uIridescentBlue;
  uniform vec3 uIridescentPurple;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vDisplacement;
  varying float vHoverIntensity;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);

    // Fresnel effect - sharper rim lighting on letters
    float NdotV = max(dot(normal, viewDir), 0.0);
    float fresnelPower = mix(3.0, 2.2, uResolved);
    float fresnel = pow(1.0 - NdotV, fresnelPower);

    // Thin-film interference simulation (more focused when resolved)
    float iridescenceIntensity = mix(1.0, 0.6, uResolved);
    float iridescenceFactor = fresnel + vDisplacement * 2.0 * iridescenceIntensity;

    // Time-based color shifting for holographic effect
    float timeShift = uTime * 0.4 + uSeed;

    // Rainbow iridescence based on view angle and position
    vec3 iridescence = vec3(
      sin(iridescenceFactor * 6.28 + timeShift + 0.0) * 0.5 + 0.5,
      sin(iridescenceFactor * 6.28 + timeShift + 2.09) * 0.5 + 0.5,
      sin(iridescenceFactor * 6.28 + timeShift + 4.18) * 0.5 + 0.5
    );

    // Position-based gradient
    float posGradient = vWorldPosition.y * 0.3 + vWorldPosition.x * 0.2;
    vec3 gradientIridescence = vec3(
      sin(posGradient + timeShift * 0.5) * 0.5 + 0.5,
      sin(posGradient + timeShift * 0.5 + 2.09) * 0.5 + 0.5,
      sin(posGradient + timeShift * 0.5 + 4.18) * 0.5 + 0.5
    );

    // Blend iridescence layers
    vec3 holoColor = mix(iridescence, gradientIridescence, 0.4);

    // Blue-purple base tint (stronger when resolved)
    vec3 baseTint = mix(uIridescentBlue, uIridescentPurple, fresnel + sin(timeShift) * 0.3);
    float tintStrength = mix(0.7, 0.85, uResolved);
    holoColor = mix(baseTint, holoColor, tintStrength);

    // Base color (brighter on letters for readability)
    vec3 baseColor = mix(vec3(0.08, 0.08, 0.1), vec3(0.12, 0.12, 0.15), uResolved);
    vec3 finalColor = baseColor + holoColor * 0.8;
    finalColor += fresnel * holoColor * 0.5;

    // Specular highlight (sharper on letters)
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    float specularPower = mix(64.0, 128.0, uResolved);
    float specular = pow(max(dot(normal, halfDir), 0.0), specularPower);
    float specularIntensity = mix(0.15, 0.25, uResolved);
    finalColor += specular * specularIntensity;

    // Hover glow
    vec3 hoverGlow = vec3(1.0, 0.95, 0.9) * vHoverIntensity * 0.3;
    vec3 hoverIridescence = holoColor * vHoverIntensity * 0.25;
    finalColor += hoverGlow + hoverIridescence;

    // Apply fade out and base opacity
    float finalOpacity = uBaseOpacity * uScrollOpacity * (1.0 - uFadeOut);

    gl_FragColor = vec4(finalColor, finalOpacity);
  }
`;

// Create organic blob geometry
function createBlobGeometry(size: number, seed: number): THREE.SphereGeometry {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const positions = geometry.attributes.position.array as Float32Array;

  // Apply organic noise displacement to sphere
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];

    const noise1 = Math.sin(x * 3 + seed) * Math.cos(y * 3 + seed) * 0.15;
    const noise2 = Math.sin(x * 5 + z * 5 + seed * 2) * 0.08;
    const noise3 = Math.cos(y * 7 + z * 4 + seed * 3) * 0.05;
    const displacement = 1 + noise1 + noise2 + noise3;

    positions[i] *= displacement;
    positions[i + 1] *= displacement;
    positions[i + 2] *= displacement;
  }

  geometry.computeVertexNormals();
  return geometry;
}

export function Fragment({
  state,
  seed = 0,
  size = 0.35,
  letterPositions,
  cursorWorldPosition,
  hoverRadius = 2,
  scrollOpacity = 1,
  zCompression = 0,
  onClick,
}: FragmentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const hoverIntensityRef = useRef(0);

  // Create blob geometry with letter morph target
  const geometry = useMemo(() => {
    const blobGeom = createBlobGeometry(size, seed);

    // Add letter position attribute if provided
    if (letterPositions) {
      blobGeom.setAttribute(
        "aLetterPosition",
        new THREE.BufferAttribute(letterPositions, 3)
      );
    }

    return blobGeom;
  }, [size, seed, letterPositions]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHoverIntensity: { value: 0 },
        uScrollOpacity: { value: 1 },
        uFadeOut: { value: 0 },
        uMorphProgress: { value: 0 },
        uResolved: { value: 0 },
        uZCompression: { value: 0 },
        uSeed: { value: seed },
        uIridescentBlue: {
          value: new THREE.Vector3(...SHADER.COLORS.IRIDESCENT_BLUE),
        },
        uIridescentPurple: {
          value: new THREE.Vector3(...SHADER.COLORS.IRIDESCENT_PURPLE),
        },
        uBaseOpacity: { value: SHADER.BASE_OPACITY },
      },
      vertexShader,
      fragmentShader: fragmentShaderCode,
      side: THREE.DoubleSide,
      transparent: true,
    });
  }, [seed]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.copy(state.position);
      meshRef.current.rotation.copy(state.rotation);
      meshRef.current.scale.copy(state.scale);
    }

    // Calculate hover intensity based on cursor distance
    if (cursorWorldPosition && materialRef.current) {
      const distance = state.position.distanceTo(cursorWorldPosition);
      const targetIntensity =
        distance < hoverRadius
          ? Math.pow(1 - distance / hoverRadius, 2)
          : 0;

      hoverIntensityRef.current +=
        (targetIntensity - hoverIntensityRef.current) * 0.15;
    } else {
      hoverIntensityRef.current *= 0.9;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uHoverIntensity.value =
        hoverIntensityRef.current;
      materialRef.current.uniforms.uScrollOpacity.value = scrollOpacity;
      materialRef.current.uniforms.uFadeOut.value = state.fadeOut;
      materialRef.current.uniforms.uMorphProgress.value = state.morphProgress;
      materialRef.current.uniforms.uResolved.value = state.morphProgress >= 1.0 ? 1.0 : 0.0;
      materialRef.current.uniforms.uZCompression.value = zCompression;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={onClick}
      onPointerOver={() => {
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'default';
        }
      }}
    >
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
