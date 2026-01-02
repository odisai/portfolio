"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// ============================================
// FILM GRAIN COMPONENT
// ============================================

function FilmGrain() {
  const [seed, setSeed] = useState(0);

  // Animate grain by changing seed
  useEffect(() => {
    let frameId: number;
    let lastTime = 0;
    const fps = 24; // Film-like frame rate
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
    <svg className="pointer-events-none fixed inset-0 w-full h-full z-50 opacity-[0.025]">
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
    text: "I've shipped systems at 10M+ scale. The same rigor works at 10 users. Complexity doesn't scare me. Unclear requirements do. Scope. Build. Ship. Iterate.",
    emphasis: ["shipped systems", "10M+ scale", "10 users", "Unclear requirements", "Scope", "Build", "Ship", "Iterate"],
  },
];

// Scroll height multiplier - provides scroll distance for reveals
// Single statement block with multiple emphasis reveals
const SCROLL_HEIGHT_MULTIPLIER = 3.5;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function isWordEmphasis(word: string, emphasisList: string[]): boolean {
  const cleanWord = word.toLowerCase().replace(/[.,—]/g, "");

  // Skip very short words to avoid false matches (e.g., "I" matching "architect")
  if (cleanWord.length < 3) return false;

  return emphasisList.some((em) => {
    const cleanEm = em.toLowerCase();

    // Check if the word matches the full emphasis phrase exactly
    if (cleanWord === cleanEm) return true;

    // Check if any individual word in the emphasis phrase matches
    const emphasisWords = cleanEm.split(" ");
    return emphasisWords.some((emphWord) => {
      // Require substantial match (at least 3 chars)
      if (emphWord.length < 3) return cleanWord === emphWord;
      return cleanWord.includes(emphWord) || emphWord.includes(cleanWord);
    });
  });
}

// Build a flat list of all emphasis words with their scroll thresholds
function buildEmphasisMap(): EmphasisMapping[] {
  const mappings: EmphasisMapping[] = [];

  statements.forEach((statement, statementIdx) => {
    statement.text.split(" ").forEach((word, wordIdx) => {
      if (isWordEmphasis(word, statement.emphasis)) {
        mappings.push({
          statementIndex: statementIdx,
          wordIndex: wordIdx,
          threshold: 0, // Will be calculated below
        });
      }
    });
  });

  // Distribute thresholds evenly across scroll range (15% to 85%)
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
  // Non-emphasis words stay at 40% opacity
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

  // Emphasis words reveal based on scroll threshold
  const transitionWidth = 0.05; // Smooth transition window

  // Calculate progress for both color and glow
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

  // Glow effect - subtle bloom with chromatic shift
  // Uses hero's iridescent colors: blue (#60a5fa) and purple (#a855f7)
  const glowOpacity = useTransform(progress, (p) => p * 0.6);
  const glowBlur = useTransform(progress, (p) => `${8 + p * 12}px`);

  // Chromatic aberration - slight color shift at edges
  const blueGlow = useTransform(progress, (p) =>
    `0 0 ${20 * p}px rgba(96, 165, 250, ${0.15 * p})`
  );
  const purpleGlow = useTransform(progress, (p) =>
    `0 0 ${25 * p}px rgba(168, 85, 247, ${0.1 * p})`
  );
  const whiteGlow = useTransform(progress, (p) =>
    `0 0 ${30 * p}px rgba(255, 255, 255, ${0.08 * p})`
  );

  // Combined text-shadow for chromatic bloom effect
  const textShadow = useTransform(
    [blueGlow, purpleGlow, whiteGlow],
    ([blue, purple, white]) => `${blue}, ${purple}, ${white}`
  );

  return (
    <motion.span
      className="inline-block mr-[0.25em] relative"
      style={{ color, textShadow }}
    >
      {/* Background bloom - soft radial glow behind text */}
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
    <p className="text-[clamp(1.5rem,5vw,3.5rem)] font-light leading-[1.3] tracking-tight max-w-5xl">
      {words.map((word, wordIdx) => {
        const isEmphasis = isWordEmphasis(word, statement.emphasis);

        // Find threshold for this word (if it's an emphasis word)
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
        <div className="space-y-12">
          {statements.map((statement, index) => (
            <p
              key={index}
              className="text-[clamp(1.5rem,5vw,3.5rem)] font-light leading-[1.3] tracking-tight max-w-5xl"
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

  // Pre-compute emphasis mappings with thresholds
  const emphasisMap = useMemo(() => buildEmphasisMap(), []);

  // Track scroll progress through the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // For reduced motion: show all text revealed immediately
  if (reducedMotion) {
    return <MethodStatic />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0A0A0B]"
      style={{ height: `${SCROLL_HEIGHT_MULTIPLIER * 100}vh` }}
    >
      {/* Sticky container - pins content exactly in place while scrolling */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Vignette overlay - cinematic depth */}
        <Vignette />

        {/* Film grain overlay - animated noise texture */}
        <FilmGrain />

        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[100px] -translate-y-1/2" />
        </div>

        {/* Content container - absolutely positioned to prevent any movement */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-portfolio relative z-10">
            {/* All statements visible, left-aligned, completely static */}
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
          </div>
        </div>
      </div>
    </section>
  );
}
