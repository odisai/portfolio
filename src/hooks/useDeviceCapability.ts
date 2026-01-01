"use client";

import { useState, useEffect } from "react";

interface DeviceCapability {
  tier: "low" | "medium" | "high";
  particleCount: number;
  enableDOF: boolean;
  enableParticles: boolean;
  bloomQuality: "low" | "medium" | "high";
}

const DEFAULT_CAPABILITY: DeviceCapability = {
  tier: "high",
  particleCount: 350,
  enableDOF: true,
  enableParticles: true,
  bloomQuality: "high",
};

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(DEFAULT_CAPABILITY);

  useEffect(() => {
    // Check for mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Check for GPU info (rough heuristic)
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl");
    const debugInfo = gl?.getExtension("WEBGL_debug_renderer_info");
    const renderer = debugInfo
      ? (gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string) || ""
      : "";

    // Detect low-end devices
    const isLowEnd =
      isMobile ||
      renderer.includes("Intel") ||
      renderer.includes("Mali") ||
      renderer.includes("Adreno 5");

    // Detect mid-range devices
    const isMidRange =
      renderer.includes("Adreno 6") ||
      renderer.includes("Apple") ||
      renderer.includes("AMD");

    if (isLowEnd) {
      setCapability({
        tier: "low",
        particleCount: 100,
        enableDOF: false,
        enableParticles: false,
        bloomQuality: "low",
      });
    } else if (isMidRange) {
      setCapability({
        tier: "medium",
        particleCount: 200,
        enableDOF: true,
        enableParticles: true,
        bloomQuality: "medium",
      });
    }
    // High-end is the default
  }, []);

  return capability;
}
