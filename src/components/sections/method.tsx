"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

// ============================================
// FILM GRAIN COMPONENT
// ============================================

function FilmGrain() {
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    let frameId: number;
    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

    const animate = (time: number) => {
      if (time - lastTime >= interval) {
        setSeed(Math.random() * 1000);
        lastTime = time;
      }
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <svg className="pointer-events-none fixed inset-0 w-full h-full z-50 opacity-[0.02]">
      <filter id="grain-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="4"
          seed={seed}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" />
    </svg>
  );
}

// ============================================
// VIGNETTE COMPONENT
// ============================================

function Vignette() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-40"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.4) 100%)`,
      }}
    />
  );
}

// ============================================
// ORBITING SHAPES VISUAL ACCENT
// ============================================

function OrbitingShapes() {
  return (
    <div className="relative flex h-[400px] w-full items-center justify-center">
      {/* Center glow */}
      <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full blur-[60px]" />
      <div className="absolute w-20 h-20 bg-purple-500/10 rounded-full blur-[40px]" />

      {/* Inner orbit */}
      <OrbitingCircles
        className="border-none bg-transparent"
        duration={25}
        radius={80}
        path={true}
        iconSize={24}
        speed={0.8}
      >
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400/60 to-blue-600/40 backdrop-blur-sm" />
        <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-purple-400/50 to-purple-600/30 rotate-45" />
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400/40 to-blue-500/30" />
      </OrbitingCircles>

      {/* Outer orbit */}
      <OrbitingCircles
        className="border-none bg-transparent"
        duration={35}
        radius={140}
        path={true}
        iconSize={32}
        reverse
        speed={0.6}
      >
        <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-500/40 to-indigo-600/30 backdrop-blur-sm rotate-12" />
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-500/20" />
        <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-cyan-400/50 to-teal-500/30 rotate-45" />
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400/30 to-purple-500/20" />
      </OrbitingCircles>
    </div>
  );
}

// ============================================
// TYPES
// ============================================

interface Statement {
  text: string;
  emphasis: string[];
}

interface EmphasisMapping {
  statementIndex: number;
  wordIndex: number;
  threshold: number;
}

// ============================================
// DATA
// ============================================

const statements: Statement[] = [
  {
    text: "I've shipped systems at 100M+ request scale. The same rigor works at 10 users. Complexity doesn't scare me. Scope. Ship. Iterate.",
    emphasis: ["shipped systems", "100M+ request scale", "10 users", "Scope", "Ship", "Iterate"],
  },
];

// Reduced scroll height for faster scroll
const SCROLL_HEIGHT_MULTIPLIER = 2.5;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function isWordEmphasis(word: string, emphasisList: string[]): boolean {
  const cleanWord = word.toLowerCase().replace(/[.,—]/g, "");

  return emphasisList.some((em) => {
    const cleanEm = em.toLowerCase();

    if (cleanWord === cleanEm) return true;

    const emphasisWords = cleanEm.split(" ");
    return emphasisWords.some((emphWord) => {
      if (emphWord.length < 3 || cleanWord.length < 3) {
        return cleanWord === emphWord;
      }
      return cleanWord.includes(emphWord) || emphWord.includes(cleanWord);
    });
  });
}

function buildEmphasisMap(): EmphasisMapping[] {
  const mappings: EmphasisMapping[] = [];

  statements.forEach((statement, statementIdx) => {
    statement.text.split(" ").forEach((word, wordIdx) => {
      if (isWordEmphasis(word, statement.emphasis)) {
        mappings.push({
          statementIndex: statementIdx,
          wordIndex: wordIdx,
          threshold: 0,
        });
      }
    });
  });

  const totalWords = mappings.length;
  mappings.forEach((mapping, idx) => {
    mapping.threshold = 0.15 + (idx / (totalWords - 1)) * 0.7;
  });

  return mappings;
}

// ============================================
// COMPONENTS
// ============================================

interface RevealWordProps {
  word: string;
  isEmphasis: boolean;
  threshold: number;
  scrollProgress: MotionValue<number>;
}

function RevealWord({
  word,
  isEmphasis,
  threshold,
  scrollProgress,
}: RevealWordProps) {
  const transitionWidth = 0.05;

  const progress = useTransform(scrollProgress, (latest) => {
    const start = threshold - transitionWidth;
    if (latest <= start) return 0;
    if (latest >= threshold) return 1;
    return (latest - start) / transitionWidth;
  });

  const color = useTransform(progress, (p) => {
    const opacity = 0.4 + p * 0.6;
    return `rgba(255, 255, 255, ${opacity})`;
  });

  const glowOpacity = useTransform(progress, (p) => p * 0.6);
  const glowBlur = useTransform(progress, (p) => `${8 + p * 12}px`);

  const blueGlow = useTransform(progress, (p) =>
    `0 0 ${20 * p}px rgba(96, 165, 250, ${0.15 * p})`
  );
  const purpleGlow = useTransform(progress, (p) =>
    `0 0 ${25 * p}px rgba(168, 85, 247, ${0.1 * p})`
  );
  const whiteGlow = useTransform(progress, (p) =>
    `0 0 ${30 * p}px rgba(255, 255, 255, ${0.08 * p})`
  );

  const textShadow = useTransform(
    [blueGlow, purpleGlow, whiteGlow],
    ([blue, purple, white]) => `${blue}, ${purple}, ${white}`
  );

  if (!isEmphasis) {
    return (
      <span
        className="inline-block mr-[0.25em]"
        style={{ color: "rgba(255, 255, 255, 0.4)" }}
      >
        {word}
      </span>
    );
  }

  return (
    <motion.span
      className="inline-block mr-[0.25em] relative"
      style={{ color, textShadow }}
    >
      <motion.span
        className="absolute inset-0 -z-10 rounded-sm"
        style={{
          opacity: glowOpacity,
          filter: glowBlur,
          background: `radial-gradient(ellipse 120% 80% at 50% 50%, rgba(96, 165, 250, 0.15), rgba(168, 85, 247, 0.08), transparent 70%)`,
          transform: "scale(1.5)",
        }}
        aria-hidden="true"
      />
      {word}
    </motion.span>
  );
}

interface StatementBlockProps {
  statement: Statement;
  statementIndex: number;
  emphasisMap: EmphasisMapping[];
  scrollProgress: MotionValue<number>;
}

function StatementBlock({
  statement,
  statementIndex,
  emphasisMap,
  scrollProgress,
}: StatementBlockProps) {
  const words = statement.text.split(" ");

  return (
    <p className="text-[clamp(1.5rem,5vw,3.5rem)] font-light leading-[1.3] tracking-tight max-w-4xl">
      {words.map((word, wordIdx) => {
        const isEmphasis = isWordEmphasis(word, statement.emphasis);

        const mapping = emphasisMap.find(
          (m) => m.statementIndex === statementIndex && m.wordIndex === wordIdx
        );
        const threshold = mapping?.threshold ?? 0;

        return (
          <RevealWord
            key={`${statementIndex}-${wordIdx}`}
            word={word}
            isEmphasis={isEmphasis}
            threshold={threshold}
            scrollProgress={scrollProgress}
          />
        );
      })}
    </p>
  );
}

// Static fallback for reduced motion
function MethodStatic() {
  return (
    <section className="relative min-h-screen py-32 md:py-48 bg-[#0A0A0B]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[100px] -translate-y-1/2" />
      </div>

      <div className="container-portfolio relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">
          <div className="space-y-12">
            {statements.map((statement, index) => (
              <p
                key={index}
                className="text-[clamp(1.5rem,5vw,3.5rem)] font-light leading-[1.3] tracking-tight max-w-4xl"
              >
                {statement.text.split(" ").map((word, wordIdx) => {
                  const isEmphasis = isWordEmphasis(word, statement.emphasis);
                  return (
                    <span
                      key={`${word}-${wordIdx}`}
                      className="inline-block mr-[0.25em]"
                      style={{
                        color: isEmphasis
                          ? "rgba(255, 255, 255, 1)"
                          : "rgba(255, 255, 255, 0.4)",
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
          <div className="hidden lg:block">
            <OrbitingShapes />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const emphasisMap = useMemo(() => buildEmphasisMap(), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  if (reducedMotion) {
    return <MethodStatic />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0A0A0B]"
      style={{ height: `${SCROLL_HEIGHT_MULTIPLIER * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <Vignette />
        <FilmGrain />

        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[100px] -translate-y-1/2" />
        </div>

        {/* Content container - split layout */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-portfolio relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-center">
              {/* Text on left */}
              <div className="space-y-12">
                {statements.map((statement, index) => (
                  <StatementBlock
                    key={index}
                    statement={statement}
                    statementIndex={index}
                    emphasisMap={emphasisMap}
                    scrollProgress={scrollYProgress}
                  />
                ))}
              </div>

              {/* Orbiting circles on right - hidden on mobile */}
              <div className="hidden lg:block">
                <OrbitingShapes />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
