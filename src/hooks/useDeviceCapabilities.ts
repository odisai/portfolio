"use client";

import { useState, useEffect } from "react";

export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  targetVertexCount: number;
}

/**
 * Detect device capabilities for performance optimization
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => {
    // Compute initial state during render
    const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
    const cpuCores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
    const isLowEnd = cpuCores < 4 || isMobile;
    const targetVertexCount = isLowEnd ? 4000 : 8000;

    return {
      isMobile,
      isLowEnd,
      targetVertexCount,
    };
  });

  useEffect(() => {
    // Only handle resize in the effect
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      const cpuCores = navigator.hardwareConcurrency || 4;
      const newIsLowEnd = newIsMobile || cpuCores < 4;

      setCapabilities({
        isMobile: newIsMobile,
        isLowEnd: newIsLowEnd,
        targetVertexCount: newIsLowEnd ? 4000 : 8000,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return capabilities;
}
