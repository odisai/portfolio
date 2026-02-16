"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Navbar } from "@/components/ui/navbar";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HyperText } from "@/components/ui/hyper-text";
import { Spotlight } from "@/components/ui/spotlight";

export function Hero() {
  const [phase, setPhase] = useState<"dark" | "reveal" | "complete">("dark");
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for parallax layers
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax transforms for different layers (deeper = slower)
  const orbX = useTransform(smoothMouseX, [-0.5, 0.5], [30, -30]);
  const orbY = useTransform(smoothMouseY, [-0.5, 0.5], [20, -20]);
  const textX = useTransform(smoothMouseX, [-0.5, 0.5], [8, -8]);
  const textY = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);

  // Sequence the reveal (skip effect when reduced motion - derive phase during render)
  useEffect(() => {
    if (reducedMotion) return;
    const revealTimer = setTimeout(() => setPhase("reveal"), 200);
    const completeTimer = setTimeout(() => setPhase("complete"), 2000);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, [reducedMotion]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const effectivePhase = reducedMotion ? "complete" : phase;
  const isRevealed =
    effectivePhase === "reveal" || effectivePhase === "complete";
  const isComplete = effectivePhase === "complete";

  return (
    <section
      ref={containerRef}
      className="section-hero relative overflow-hidden bg-space"
    >
      {/* Deep background - static noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Atmospheric orb layer - moves slowest on parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: orbX, y: orbY }}
      >
        {/* Primary blue orb - top right */}
        <div
          className="absolute top-[15%] right-[10%] w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(96, 165, 250, 0.08) 0%, rgba(96, 165, 250, 0.02) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Secondary purple orb - bottom left */}
        <div
          className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(139, 92, 246, 0.06) 0%, rgba(139, 92, 246, 0.015) 50%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        {/* Subtle center glow that emerges with text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isRevealed ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(96, 165, 250, 0.04) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* Edge vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(10, 10, 11, 0.4) 100%)",
        }}
      />

      {/* Spotlight effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(96, 165, 250, 0.15)"
      />

      {/* Navigation */}
      <Navbar visible={isComplete} />

      {/* Main content layer */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Typography container with subtle parallax */}
        <motion.div className="text-center" style={{ x: textX, y: textY }}>
          {/* Name - with HyperText scramble effect */}
          <div className="relative">
            {/* TAYLOR */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={
                isRevealed
                  ? {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }
                  : {}
              }
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="relative"
            >
              {isRevealed ? (
                <HyperText
                  as="h1"
                  duration={1200}
                  delay={300}
                  animateOnHover={true}
                  className="text-[clamp(3rem,11vw,9rem)] font-semibold tracking-[-0.02em] text-white leading-[0.85] font-display select-none"
                  style={{
                    textShadow: isComplete
                      ? "0 0 80px rgba(96, 165, 250, 0.15)"
                      : "none",
                  }}
                >
                  TAYLOR
                </HyperText>
              ) : (
                <h1 className="text-[clamp(3rem,11vw,9rem)] font-semibold tracking-[-0.02em] text-white leading-[0.85] font-display select-none opacity-0">
                  TAYLOR
                </h1>
              )}
            </motion.div>

            {/* ALLEN - slightly offset for depth */}
            <motion.div
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={
                isRevealed
                  ? {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                    }
                  : {}
              }
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.25,
              }}
              className="relative -mt-2 ml-[0.05em]"
            >
              {isRevealed ? (
                <HyperText
                  as="h1"
                  duration={1200}
                  delay={500}
                  animateOnHover={true}
                  className="text-[clamp(3rem,11vw,9rem)] font-semibold tracking-[-0.02em] text-white leading-[0.85] font-display select-none"
                  style={{
                    textShadow: isComplete
                      ? "0 0 80px rgba(96, 165, 250, 0.15)"
                      : "none",
                  }}
                >
                  ALLEN
                </HyperText>
              ) : (
                <h1 className="text-[clamp(3rem,11vw,9rem)] font-semibold tracking-[-0.02em] text-white leading-[0.85] font-display select-none opacity-0">
                  ALLEN
                </h1>
              )}
            </motion.div>
          </div>

          {/* Descriptor with elegant fade */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isComplete ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-6 text-[0.75rem] tracking-[0.15em] text-white/30 font-light"
          >
            Full-Stack Engineer & Founder · Stanford Healthcare · 3x Founder
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isComplete ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="absolute left-1/2 -translate-x-1/2 bottom-10 flex flex-col items-center gap-3 z-10"
      >
        <span className="text-[0.6rem] tracking-[0.3em] uppercase text-white/25">
          Scroll
        </span>
        <div className="relative w-px h-10 overflow-hidden">
          <motion.div
            animate={{
              y: ["-100%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 w-full bg-linear-to-b from-transparent via-white/30 to-transparent"
          />
        </div>
      </motion.div>

      {/* Top gradient fade for navbar blend */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10, 10, 11, 0.8) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
