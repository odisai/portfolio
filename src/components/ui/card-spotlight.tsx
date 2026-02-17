"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function CardSpotlight({
  children,
  className,
  spotlightColor = "rgba(196, 138, 90, 0.18)",
}: CardSpotlightProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    containerRef.current?.style.setProperty("--spotlight-x", `${x}px`);
    containerRef.current?.style.setProperty("--spotlight-y", `${y}px`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("group relative overflow-hidden", className)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor}, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}
