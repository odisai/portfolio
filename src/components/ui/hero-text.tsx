"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { CONTENT } from "@/lib/constants";

interface HeroTextProps {
  visible: boolean;
  className?: string;
}

const DESCRIPTORS = CONTENT.DESCRIPTORS;
const ROTATION_INTERVAL = 3000;

export function HeroText({ visible, className }: HeroTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Rotate through descriptors when visible
  useEffect(() => {
    if (visible) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % DESCRIPTORS.length);
      }, ROTATION_INTERVAL);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [visible]);

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-20",
        className
      )}
    >
      {/* Main Name */}
      <div className="flex flex-col items-center">
        {/* TAYLOR */}
        <div className="overflow-hidden">
          <h1
            className={cn(
              "font-bold text-white uppercase transition-all duration-1000",
              "text-[clamp(3rem,12vw,10rem)] leading-[0.9] tracking-[-0.02em]",
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            )}
            style={{
              fontFamily: "var(--font-satoshi), system-ui, sans-serif",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Taylor
          </h1>
        </div>

        {/* ALLEN */}
        <div className="overflow-hidden">
          <h1
            className={cn(
              "font-bold text-white uppercase transition-all duration-1000",
              "text-[clamp(3rem,12vw,10rem)] leading-[0.9] tracking-[-0.02em]",
              visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full"
            )}
            style={{
              fontFamily: "var(--font-satoshi), system-ui, sans-serif",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: "100ms",
            }}
          >
            Allen
          </h1>
        </div>
      </div>

      {/* Descriptor Text */}
      <div
        className={cn(
          "mt-6 md:mt-8 h-8 overflow-hidden transition-opacity duration-700",
          visible ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: "300ms" }}
      >
        <div className="relative h-full flex items-center justify-center">
          {DESCRIPTORS.map((descriptor, index) => (
            <span
              key={descriptor}
              className={cn(
                "absolute text-sm md:text-base tracking-[0.15em] uppercase text-white/50",
                "transition-all duration-700"
              )}
              style={{
                fontFamily: "var(--font-satoshi), system-ui, sans-serif",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                opacity: index === currentIndex ? 1 : 0,
                transform:
                  index === currentIndex
                    ? "translateY(0)"
                    : index ===
                      (currentIndex - 1 + DESCRIPTORS.length) %
                        DESCRIPTORS.length
                    ? "translateY(-100%)"
                    : "translateY(100%)",
              }}
            >
              {descriptor}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

