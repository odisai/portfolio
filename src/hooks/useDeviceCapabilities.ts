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
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isLowEnd: false,
    targetVertexCount: 8000,
  });

  useEffect(() => {
    // Check viewport width
    const isMobile = window.innerWidth < 768;

    // Check CPU cores (4 or less = low-end)
    const cpuCores = navigator.hardwareConcurrency || 4;
    const isLowEnd = cpuCores < 4 || isMobile;

    // Adjust vertex count based on device
    const targetVertexCount = isLowEnd ? 4000 : 8000;

    setCapabilities({
      isMobile,
      isLowEnd,
      targetVertexCount,
    });

    // Re-check on resize
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        setCapabilities({
          isMobile: newIsMobile,
          isLowEnd: newIsMobile || cpuCores < 4,
          targetVertexCount: newIsMobile || cpuCores < 4 ? 4000 : 8000,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return capabilities;
}
