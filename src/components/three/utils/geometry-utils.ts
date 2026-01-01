import * as THREE from "three";

/**
 * Target vertex count for morphing - higher count = crisper letters
 * Increased from 2,562 to 8,000 for better letter definition
 */
export const TARGET_VERTEX_COUNT = 8000;

/**
 * Linear interpolation
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Normalize a BufferGeometry to a specific vertex count for morphing compatibility.
 * Uses spatial distribution for better vertex coverage.
 */
export function normalizeGeometry(
  geometry: THREE.BufferGeometry,
  targetCount: number = TARGET_VERTEX_COUNT
): Float32Array {
  const positions = geometry.attributes.position.array as Float32Array;
  const sourceCount = positions.length / 3;
  const result = new Float32Array(targetCount * 3);

  if (sourceCount === targetCount) {
    // Perfect match - direct copy
    result.set(positions);
  } else if (sourceCount > targetCount) {
    // Downsample: select evenly distributed vertices
    for (let i = 0; i < targetCount; i++) {
      const srcIdx = Math.floor((i / targetCount) * sourceCount) * 3;
      result[i * 3] = positions[srcIdx];
      result[i * 3 + 1] = positions[srcIdx + 1];
      result[i * 3 + 2] = positions[srcIdx + 2];
    }
  } else {
    // Upsample: first copy all source vertices, then fill with interpolated
    for (let i = 0; i < sourceCount; i++) {
      result[i * 3] = positions[i * 3];
      result[i * 3 + 1] = positions[i * 3 + 1];
      result[i * 3 + 2] = positions[i * 3 + 2];
    }

    // Fill remaining with interpolated vertices along the path
    const extraCount = targetCount - sourceCount;
    for (let i = 0; i < extraCount; i++) {
      const t = i / extraCount;
      const idx1 = Math.floor(t * (sourceCount - 1));
      const idx2 = Math.min(idx1 + 1, sourceCount - 1);
      const blend = t * (sourceCount - 1) - idx1;

      const resultIdx = (sourceCount + i) * 3;
      result[resultIdx] = lerp(positions[idx1 * 3], positions[idx2 * 3], blend);
      result[resultIdx + 1] = lerp(positions[idx1 * 3 + 1], positions[idx2 * 3 + 1], blend);
      result[resultIdx + 2] = lerp(positions[idx1 * 3 + 2], positions[idx2 * 3 + 2], blend);
    }
  }

  return result;
}

/**
 * Creates blob vertex positions using golden spiral distribution on a sphere,
 * with organic noise displacement.
 */
export function createMorphableBlobPositions(
  vertexCount: number,
  radius: number,
  seed: number
): Float32Array {
  const positions = new Float32Array(vertexCount * 3);

  // Golden spiral for even distribution on sphere
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  for (let i = 0; i < vertexCount; i++) {
    const t = i / (vertexCount - 1);
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = angleIncrement * i;

    // Base spherical coordinates
    let x = Math.sin(inclination) * Math.cos(azimuth);
    let y = Math.sin(inclination) * Math.sin(azimuth);
    let z = Math.cos(inclination);

    // Apply organic noise displacement for blob look
    const noise1 = Math.sin(x * 3 + seed) * Math.cos(y * 3 + seed) * 0.15;
    const noise2 = Math.sin(x * 5 + z * 5 + seed * 2) * 0.08;
    const noise3 = Math.cos(y * 7 + z * 4 + seed * 3) * 0.05;
    const displacement = 1 + noise1 + noise2 + noise3;

    positions[i * 3] = x * radius * displacement;
    positions[i * 3 + 1] = y * radius * displacement;
    positions[i * 3 + 2] = z * radius * displacement;
  }

  return positions;
}

/**
 * Create a BufferGeometry from positions array with computed normals
 */
export function createGeometryFromPositions(positions: Float32Array): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Create indices for triangle rendering (treat as point cloud converted to mesh)
  // For blob morphing, we'll use a sphere-like index pattern
  const vertexCount = positions.length / 3;
  const indices: number[] = [];

  // Create triangles using golden spiral neighbors
  // This approximates a triangulated sphere topology
  const width = Math.ceil(Math.sqrt(vertexCount));
  const height = Math.ceil(vertexCount / width);

  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const i0 = y * width + x;
      const i1 = i0 + 1;
      const i2 = i0 + width;
      const i3 = i2 + 1;

      if (i0 < vertexCount && i1 < vertexCount && i2 < vertexCount) {
        indices.push(i0, i1, i2);
      }
      if (i1 < vertexCount && i3 < vertexCount && i2 < vertexCount) {
        indices.push(i1, i3, i2);
      }
    }
  }

  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Compute smooth normals for a point cloud based on local neighborhoods
 */
export function computeSmoothNormals(positions: Float32Array): Float32Array {
  const count = positions.length / 3;
  const normals = new Float32Array(count * 3);

  // For each vertex, compute normal as normalized position (works for centered blobs)
  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];

    const len = Math.sqrt(x * x + y * y + z * z);
    if (len > 0) {
      normals[i * 3] = x / len;
      normals[i * 3 + 1] = y / len;
      normals[i * 3 + 2] = z / len;
    }
  }

  return normals;
}
