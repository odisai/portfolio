"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
  reverse?: boolean;
  speed?: number;
}

export function Marquee({
  children,
  className,
  pauseOnHover = true,
  reverse = false,
  speed = 45,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "relative flex overflow-hidden",
        pauseOnHover && "group",
        className
      )}
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-6",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-6",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{ animationDuration: `${speed}s` }}
        aria-hidden="true"
      >
        {children}
      </div>
      {pauseOnHover && (
        <style jsx>{`
          .group:hover .animate-marquee,
          .group:hover .animate-marquee-reverse {
            animation-play-state: paused;
          }
        `}</style>
      )}
    </div>
  );
}
