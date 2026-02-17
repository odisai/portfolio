"use client";

import { useState, useEffect } from "react";

export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  isTouch: boolean;
  targetVertexCount: number;
}

/**
 * Detect device capabilities for performance optimization
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const getCapabilities = (): DeviceCapabilities => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isLowEnd: false,
        isTouch: false,
        targetVertexCount: 8000,
      };
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const cpuCores = navigator.hardwareConcurrency || 4;
    const deviceMemory = (
      navigator as Navigator & {
        deviceMemory?: number;
      }
    ).deviceMemory;

    const isLowEnd =
      prefersReducedMotion ||
      isMobile ||
      isTouch ||
      cpuCores <= 4 ||
      (deviceMemory !== undefined && deviceMemory <= 4);

    return {
      isMobile,
      isLowEnd,
      isTouch,
      targetVertexCount: isLowEnd ? 3000 : 8000,
    };
  };

  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => {
    return getCapabilities();
  });

  useEffect(() => {
    const update = () => setCapabilities(getCapabilities());
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchMq = window.matchMedia("(pointer: coarse)");

    update();
    window.addEventListener("resize", update);
    mobileMq.addEventListener("change", update);
    reducedMq.addEventListener("change", update);
    touchMq.addEventListener("change", update);

    return () => {
      window.removeEventListener("resize", update);
      mobileMq.removeEventListener("change", update);
      reducedMq.removeEventListener("change", update);
      touchMq.removeEventListener("change", update);
    };
  }, []);

  return capabilities;
}
