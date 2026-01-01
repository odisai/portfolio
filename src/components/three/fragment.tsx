"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { FragmentState } from "./hooks/use-assembly";
import { SHADER } from "@/lib/constants";

interface FragmentProps {
  state: FragmentState;
  blobPositions: Float32Array;
  letterPositions: Float32Array;
  seed?: number;
}

// Premium iridescent/holographic vertex shader with morph support
const vertexShader = `
  uniform float uTime;
  uniform float uResolved;
  uniform float uMorphProgress;
  uniform float uSeed;

  attribute vec3 morphTarget;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vDisplacement;

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
    vec3 morphedPosition = mix(position, morphTarget, uMorphProgress);

    // Organic blob deformation - reduces as we morph AND resolve
    float deformAmount = mix(0.25, 0.0, max(uMorphProgress, uResolved));

    // Multi-octave noise for organic feel
    float noise1 = snoise(morphedPosition * 2.0 + uTime * 0.5 + uSeed);
    float noise2 = snoise(morphedPosition * 4.0 - uTime * 0.3 + uSeed * 2.0) * 0.5;
    float noise3 = snoise(morphedPosition * 8.0 + uTime * 0.2 + uSeed * 3.0) * 0.25;

    float totalNoise = (noise1 + noise2 + noise3) * deformAmount;

    // Breathing/pulsing effect (reduces during morph)
    float breathe = sin(uTime * 1.5 + uSeed) * 0.03 * (1.0 - max(uMorphProgress, uResolved));

    // Calculate normal - blend between blob normal (radial) and geometry normal
    vec3 blobNormal = normalize(position);
    vec3 blendedNormal = mix(blobNormal, normal, uMorphProgress);

    // Displaced position
    vec3 displaced = morphedPosition + blendedNormal * (totalNoise + breathe);

    vDisplacement = totalNoise;
    vNormal = normalize(normalMatrix * blendedNormal);

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldPosition = (modelMatrix * vec4(displaced, 1.0)).xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Premium iridescent/holographic fragment shader with morph awareness
const fragmentShaderCode = `
  uniform float uTime;
  uniform float uResolved;
  uniform float uMorphProgress;
  uniform float uSeed;
  uniform vec3 uColorSearching;
  uniform vec3 uColorResolved;
  uniform vec3 uIridescentBlue;
  uniform vec3 uIridescentPurple;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying float vDisplacement;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);

    // Fresnel effect - stronger rim lighting
    float NdotV = max(dot(normal, viewDir), 0.0);
    float fresnel = pow(1.0 - NdotV, 3.0);

    // === IRIDESCENT/HOLOGRAPHIC EFFECT ===

    // Thin-film interference simulation
    float iridescenceFactor = fresnel + vDisplacement * 2.0;

    // Time-based color shifting for holographic effect
    float timeShift = uTime * 0.4 + uSeed;

    // Rainbow iridescence based on view angle and position
    vec3 iridescence = vec3(
      sin(iridescenceFactor * 6.28 + timeShift + 0.0) * 0.5 + 0.5,
      sin(iridescenceFactor * 6.28 + timeShift + 2.09) * 0.5 + 0.5,
      sin(iridescenceFactor * 6.28 + timeShift + 4.18) * 0.5 + 0.5
    );

    // Add position-based variation for gradient across surface
    float posGradient = vWorldPosition.y * 0.3 + vWorldPosition.x * 0.2;
    vec3 gradientIridescence = vec3(
      sin(posGradient + timeShift * 0.5) * 0.5 + 0.5,
      sin(posGradient + timeShift * 0.5 + 2.09) * 0.5 + 0.5,
      sin(posGradient + timeShift * 0.5 + 4.18) * 0.5 + 0.5
    );

    // Blend different iridescence layers
    vec3 holoColor = mix(iridescence, gradientIridescence, 0.4);

    // Add blue-purple base tint
    vec3 baseTint = mix(uIridescentBlue, uIridescentPurple, fresnel + sin(timeShift) * 0.3);
    holoColor = mix(baseTint, holoColor, 0.7);

    // === SEARCHING VS RESOLVED STATES ===

    // Searching state: dark base + strong iridescence
    vec3 searchingColor = uColorSearching + holoColor * 0.8;
    searchingColor += fresnel * holoColor * 0.5; // Extra rim iridescence

    // Resolved state: bright with subtle iridescence (enhanced for letter readability)
    vec3 resolvedColor = uColorResolved;
    resolvedColor += holoColor * mix(0.15, 0.25, uMorphProgress); // More iridescence when letter
    resolvedColor += fresnel * 0.3; // White rim glow

    // Transition between states
    vec3 finalColor = mix(searchingColor, resolvedColor, uResolved);

    // === FINAL ENHANCEMENTS ===

    // Add specular highlight
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 64.0);
    finalColor += specular * 0.4 * (1.0 - uResolved * 0.5);

    // Edge enhancement when morphed (helps letter readability)
    float edgeBoost = uMorphProgress * 0.08 * (1.0 - NdotV);
    finalColor += edgeBoost;

    // Boost overall brightness slightly
    finalColor *= 1.1;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export function Fragment({ state, blobPositions, letterPositions, seed = 0 }: FragmentProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create geometry with morph target attribute
  const morphGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    // Set blob positions as base geometry
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(blobPositions, 3)
    );

    // Set letter positions as morph target
    geometry.setAttribute(
      "morphTarget",
      new THREE.BufferAttribute(letterPositions, 3)
    );

    // Compute normals for the blob (radial from center)
    const count = blobPositions.length / 3;
    const normals = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = blobPositions[i * 3];
      const y = blobPositions[i * 3 + 1];
      const z = blobPositions[i * 3 + 2];
      const len = Math.sqrt(x * x + y * y + z * z);
      if (len > 0) {
        normals[i * 3] = x / len;
        normals[i * 3 + 1] = y / len;
        normals[i * 3 + 2] = z / len;
      }
    }
    geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));

    // Create UV coordinates (spherical projection)
    const uvs = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const x = blobPositions[i * 3];
      const y = blobPositions[i * 3 + 1];
      const z = blobPositions[i * 3 + 2];
      uvs[i * 2] = 0.5 + Math.atan2(z, x) / (2 * Math.PI);
      uvs[i * 2 + 1] = 0.5 + Math.asin(y / Math.sqrt(x * x + y * y + z * z)) / Math.PI;
    }
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    // Create triangle indices for rendering
    // Using golden spiral neighbor approximation
    const indices: number[] = [];
    const width = Math.ceil(Math.sqrt(count));
    const height = Math.ceil(count / width);

    for (let row = 0; row < height - 1; row++) {
      for (let col = 0; col < width - 1; col++) {
        const i0 = row * width + col;
        const i1 = i0 + 1;
        const i2 = i0 + width;
        const i3 = i2 + 1;

        if (i0 < count && i1 < count && i2 < count) {
          indices.push(i0, i1, i2);
        }
        if (i1 < count && i3 < count && i2 < count) {
          indices.push(i1, i3, i2);
        }
      }
    }

    geometry.setIndex(indices);

    return geometry;
  }, [blobPositions, letterPositions]);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolved: { value: 0 },
        uMorphProgress: { value: 0 },
        uSeed: { value: seed },
        uColorSearching: { value: new THREE.Vector3(...SHADER.COLORS.SEARCHING) },
        uColorResolved: { value: new THREE.Vector3(...SHADER.COLORS.RESOLVED) },
        uIridescentBlue: { value: new THREE.Vector3(...SHADER.COLORS.IRIDESCENT_BLUE) },
        uIridescentPurple: { value: new THREE.Vector3(...SHADER.COLORS.IRIDESCENT_PURPLE) },
      },
      vertexShader,
      fragmentShader: fragmentShaderCode,
      side: THREE.DoubleSide,
    });
  }, [seed]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.copy(state.position);
      meshRef.current.rotation.copy(state.rotation);
      meshRef.current.scale.copy(state.scale);
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uResolved.value = state.resolved;
      materialRef.current.uniforms.uMorphProgress.value = state.morphProgress;
    }
  });

  return (
    <mesh ref={meshRef} geometry={morphGeometry}>
      <primitive object={shaderMaterial} ref={materialRef} attach="material" />
    </mesh>
  );
}
