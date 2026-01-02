"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SectionLabelProps {
  children: string;
  delay?: number;
  className?: string;
}

export function SectionLabel({ children, delay = 0, className = "" }: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={`mb-12 md:mb-16 ${className}`}
    >
      <span className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40">
        {children}
      </span>
    </motion.div>
  );
}
