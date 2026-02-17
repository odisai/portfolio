"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";

interface NumberTickerProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  duration = 1400,
  className,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const startRef = React.useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const { isMobile, isLowEnd, isTouch } = useDeviceCapabilities();
  const disableTickerAnimation = reducedMotion || isMobile || isLowEnd || isTouch;

  React.useEffect(() => {
    if (disableTickerAnimation) {
      setDisplayValue(value);
      return;
    }

    startRef.current = null;
    let rafId: number;

    const tick = (time: number) => {
      if (startRef.current === null) startRef.current = time;
      const progress = Math.min((time - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [disableTickerAnimation, value, duration]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
