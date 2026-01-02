"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

const statements = [
  {
    text: "I architect systems that let teams move faster.",
    emphasis: ["architect", "faster"],
  },
  {
    text: "From startup MVPs to enterprise health systems—the principles are the same.",
    emphasis: ["startup MVPs", "enterprise health systems", "principles"],
  },
  {
    text: "Break it down. Build it right. Ship it.",
    emphasis: ["Break", "Build", "Ship"],
  },
];

interface AnimatedWordProps {
  word: string;
  isEmphasis: boolean;
  index: number;
  totalWords: number;
}

function AnimatedWord({ word, isEmphasis, index }: AnimatedWordProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "inline-block mr-[0.25em]",
        isEmphasis ? "text-white" : "text-white/50"
      )}
    >
      {word}
    </motion.span>
  );
}

interface StatementProps {
  statement: (typeof statements)[0];
  index: number;
}

function Statement({ statement, index }: StatementProps) {
  const words = statement.text.split(" ");

  const isEmphasis = (word: string) => {
    return statement.emphasis.some((em) =>
      word.toLowerCase().includes(em.toLowerCase()) ||
      em.toLowerCase().includes(word.toLowerCase().replace(/[.,—]/, ""))
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="mb-24 last:mb-0"
    >
      <p className="text-[clamp(1.5rem,5vw,3.5rem)] font-light leading-[1.3] tracking-tight max-w-5xl">
        {words.map((word, i) => (
          <AnimatedWord
            key={`${word}-${i}`}
            word={word}
            isEmphasis={isEmphasis(word)}
            index={i}
            totalWords={words.length}
          />
        ))}
      </p>
    </motion.div>
  );
}

export function Method() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 md:py-48 bg-[#0A0A0B]"
    >
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[100px] -translate-y-1/2" />
      </div>

      <div className="container-portfolio relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <span className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40">
            The Method
          </span>
        </motion.div>

        {/* Main statements */}
        <div className="mb-32">
          {statements.map((statement, index) => (
            <Statement key={index} statement={statement} index={index} />
          ))}
        </div>

        {/* Philosophy breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            {
              title: "Systems Thinking",
              description: "Every feature exists within a system. Understand the system first.",
            },
            {
              title: "0→1 Expertise",
              description: "Turning ambiguity into architecture. From concept to production.",
            },
            {
              title: "Ship Velocity",
              description: "Fast iteration with quality. Speed comes from clarity.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-px w-12 bg-white/20 mb-6 group-hover:w-20 group-hover:bg-white/40 transition-all duration-500" />
              <h3 className="text-lg font-medium text-white mb-3">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Decorative line */}
        <motion.div
          style={{ scaleX: lineProgress }}
          className="mt-32 h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent origin-left"
        />
      </div>
    </section>
  );
}
