"use client";

import { useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader, Font } from "three/examples/jsm/loaders/FontLoader.js";
import { normalizeGeometry, TARGET_VERTEX_COUNT } from "../utils/geometry-utils";

interface TextGeometriesResult {
  letterPositions: Float32Array[];
  isLoaded: boolean;
  error: Error | null;
}

/**
 * Hook to load font and generate normalized text geometries for morphing
 */
export function useTextGeometries(letters: string[]): TextGeometriesResult {
  const [font, setFont] = useState<Font | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Load font on mount
  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      "/fonts/satoshi-bold.json",
      (loadedFont) => {
        setFont(loadedFont);
      },
      undefined,
      (err) => {
        console.error("Failed to load font:", err);
        setError(err instanceof Error ? err : new Error("Failed to load font"));
      }
    );
  }, []);

  const result = useMemo<TextGeometriesResult>(() => {
    if (!font) {
      return { letterPositions: [], isLoaded: false, error };
    }

    const letterPositions: Float32Array[] = [];

    letters.forEach((letter) => {
      try {
        // Create text geometry for this letter
        const textGeo = new TextGeometry(letter, {
          font: font,
          size: 0.6,           // Size in world units
          depth: 0.12,         // Thinner for elegance
          curveSegments: 8,    // Curve quality
          bevelEnabled: true,
          bevelThickness: 0.02,
          bevelSize: 0.02,
          bevelSegments: 3,
        });

        // Center the geometry
        textGeo.center();

        // Normalize to target vertex count for morphing
        const normalizedPositions = normalizeGeometry(textGeo, TARGET_VERTEX_COUNT);
        letterPositions.push(normalizedPositions);

        // Clean up the text geometry
        textGeo.dispose();
      } catch (err) {
        console.error(`Failed to create geometry for letter "${letter}":`, err);
        // Create empty positions as fallback
        letterPositions.push(new Float32Array(TARGET_VERTEX_COUNT * 3));
      }
    });

    return { letterPositions, isLoaded: true, error: null };
  }, [font, letters, error]);

  return result;
}
