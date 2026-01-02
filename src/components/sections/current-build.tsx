"use client";

import { motion } from "framer-motion";
import { CONTENT } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/section-label";
import { Badge } from "@/components/ui/badge";
import { DragSlider } from "@/components/ui/drag-slider";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSectionInView } from "@/hooks/useSectionInView";
import { createStaggerTransition } from "@/lib/animation-variants";
import { GRADIENTS } from "@/lib/design-tokens";

const credentials = CONTENT.PROJECTS.CURRENT.credentials;

export function CurrentBuild() {
  const { ref, isInView } = useSectionInView();
  const { y: backgroundY, opacity } = useScrollAnimation(ref, {
    parallaxY: ["0%", "30%"],
    opacity: [0, 1, 1, 0],
  });

  return (
    <section
      ref={ref}
      className="relative min-h-[150vh] py-32 overflow-hidden"
      style={{
        background: GRADIENTS.sectionBackground,
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
        <SectionLabel delay={0.1}>Current Focus</SectionLabel>

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
          <Badge variant="role">{CONTENT.PROJECTS.CURRENT.role}</Badge>
        </motion.div>

        {/* Problem / Solution Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-24"
        >
          <DragSlider
            leftLabel="Problem"
            rightLabel="Solution"
            leftContent={
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full h-full flex items-center justify-center">
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
            }
            rightContent={
              <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 w-full h-full flex items-center justify-center">
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
            }
          />
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
              <Badge
                key={credential}
                variant="default"
                animate
                delay={createStaggerTransition(index, 0.8).delay}
              >
                {credential}
              </Badge>
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
