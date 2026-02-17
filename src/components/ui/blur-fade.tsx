"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
}

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.8,
  y = 20,
  once = true,
}: BlurFadeProps) {
  const reducedMotion = useReducedMotion();
  const { isMobile, isLowEnd, isTouch } = useDeviceCapabilities();
  const disableAnimation = reducedMotion || isMobile || isLowEnd || isTouch;

  if (disableAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
