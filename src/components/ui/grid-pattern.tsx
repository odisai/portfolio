import React from "react";
import { cn } from "@/lib/utils";

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  stroke?: string;
  className?: string;
}

export function GridPattern({
  width = 72,
  height = 72,
  x = 0,
  y = 0,
  stroke = "rgba(231, 226, 217, 0.12)",
  className,
}: GridPatternProps) {
  const patternId = React.useId();

  return (
    <svg
      className={cn("absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={patternId}
          x={x}
          y={y}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            stroke={stroke}
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id={`${patternId}-fade`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`${patternId}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${patternId}-fade)`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} mask={`url(#${patternId}-mask)`} />
    </svg>
  );
}
