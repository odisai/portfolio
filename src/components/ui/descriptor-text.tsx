"use client";

import { useState, useEffect, useRef } from "react";
import { CONTENT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface DescriptorTextProps {
  assemblyComplete: boolean;
  className?: string;
}

export function DescriptorText({
  assemblyComplete,
  className,
}: DescriptorTextProps) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const descriptors = CONTENT.DESCRIPTORS; // ["Builder", "Architect", "Founder"]

  // Show after assembly completes + 500ms delay
  useEffect(() => {
    if (assemblyComplete) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [assemblyComplete]);

  // Rotate through descriptors
  useEffect(() => {
    if (!visible) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % descriptors.length);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, descriptors.length]);

  return (
    <div
      className={cn(
        "absolute left-1/2 -translate-x-1/2 bottom-[18vh]",
        "text-center transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div className="relative h-7 overflow-hidden">
        {descriptors.map((word, index) => (
          <span
            key={word}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "text-white/60 text-xs tracking-[0.35em] uppercase font-medium",
              "transition-all duration-500"
            )}
            style={{
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transform:
                index === currentIndex
                  ? "translateY(0)"
                  : index < currentIndex ||
                      (currentIndex === 0 && index === descriptors.length - 1)
                    ? "translateY(-100%)"
                    : "translateY(100%)",
              opacity: index === currentIndex ? 1 : 0,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Decorative dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {descriptors.map((_, index) => (
          <span
            key={index}
            className={cn(
              "w-1 h-1 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-white/50 scale-100"
                : "bg-white/20 scale-75"
            )}
          />
        ))}
      </div>
    </div>
  );
}
