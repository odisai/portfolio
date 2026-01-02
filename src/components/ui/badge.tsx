"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: string;
  variant?: "default" | "outline" | "role";
  delay?: number;
  animate?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  delay = 0,
  animate = false,
  className = "",
}: BadgeProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variantStyles = {
    default: "px-5 py-3 border border-white/10 rounded-lg bg-white/[0.02] backdrop-blur-sm text-sm text-white/70",
    outline: "px-3 py-1 text-xs text-white/50 border border-white/10 rounded-full hover:border-white/30 hover:text-white/70 transition-colors",
    role: "inline-block px-4 py-2 text-xs tracking-widest uppercase text-white/80 border border-white/20 rounded-full",
  };

  const Component = animate ? motion.span : "span";

  const animationProps = animate
    ? {
        ref,
        initial: { opacity: 0, y: 20 },
        animate: isInView ? { opacity: 1, y: 0 } : {},
        transition: { duration: 0.5, delay },
      }
    : {};

  return (
    <Component
      {...animationProps}
      className={cn(variantStyles[variant], className)}
    >
      {children}
    </Component>
  );
}
