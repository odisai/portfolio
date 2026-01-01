"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { CONTENT } from "@/lib/constants";

const credentials = CONTENT.PROJECTS.CURRENT.credentials;

export function CurrentBuild() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleSliderDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setSliderPosition(position);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0A0A0B 0%, #12121A 50%, #0A0A0B 100%)",
      }}
    >
      {/* Subtle accent glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
      </motion.div>

      <motion.div style={{ opacity }} className="container-portfolio relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <span className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40">
            Current Focus
          </span>
        </motion.div>

        {/* Hero project title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-[clamp(3rem,12vw,8rem)] font-light tracking-tight text-white leading-[0.9]">
            {CONTENT.PROJECTS.CURRENT.name}
          </h2>
          <p className="mt-4 text-lg text-white/60 max-w-xl">
            {CONTENT.PROJECTS.CURRENT.description}
          </p>
        </motion.div>

        {/* Role badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <span className="inline-block px-4 py-2 text-xs tracking-widest uppercase text-white/80 border border-white/20 rounded-full">
            {CONTENT.PROJECTS.CURRENT.role}
          </span>
        </motion.div>

        {/* Problem / Solution Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-24"
        >
          <div
            className="relative h-[400px] rounded-2xl overflow-hidden cursor-ew-resize select-none"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleSliderDrag}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleSliderDrag}
          >
            {/* Problem side (left) */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center"
              style={{
                clipPath: `inset(0 ${(1 - sliderPosition) * 100}% 0 0)`,
              }}
            >
              <div className="text-center px-8">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-white mb-3">The Problem</h3>
                <p className="text-white/50 max-w-sm mx-auto text-sm leading-relaxed">
                  Veterinarians spend 2+ hours daily on documentation. Fragmented data, paperwork chaos, and burnout.
                </p>
              </div>
            </div>

            {/* Solution side (right) */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 flex items-center justify-center"
              style={{
                clipPath: `inset(0 0 0 ${sliderPosition * 100}%)`,
              }}
            >
              <div className="text-center px-8">
                <div className="mb-6">
                  <svg className="w-16 h-16 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-white mb-3">The Solution</h3>
                <p className="text-white/50 max-w-sm mx-auto text-sm leading-relaxed">
                  AI-powered clinical documentation. Clean data flows, unified intelligence, time back to care.
                </p>
              </div>
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white/80 shadow-lg cursor-ew-resize"
              style={{ left: `${sliderPosition * 100}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 text-xs tracking-widest uppercase text-white/30">
              Problem
            </div>
            <div className="absolute bottom-4 right-4 text-xs tracking-widest uppercase text-white/30">
              Solution
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-white/30">
            Drag to explore
          </p>
        </motion.div>

        {/* Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <p className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40 mb-6">
            Recognition
          </p>
          <div className="flex flex-wrap gap-4">
            {credentials.map((credential, index) => (
              <motion.div
                key={credential}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="px-5 py-3 border border-white/10 rounded-lg bg-white/[0.02] backdrop-blur-sm"
              >
                <span className="text-sm text-white/70">{credential}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Visual accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
        />
      </motion.div>
    </section>
  );
}
