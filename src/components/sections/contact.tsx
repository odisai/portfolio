"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CONTENT } from "@/lib/constants";

// Deterministic positions to avoid hydration mismatch
const FRAGMENT_POSITIONS = [
  { left: 15, top: 20, rotate: 12 },
  { left: 75, top: 15, rotate: 35 },
  { left: 25, top: 65, rotate: 8 },
  { left: 85, top: 45, rotate: 42 },
  { left: 45, top: 80, rotate: 22 },
  { left: 60, top: 30, rotate: 5 },
  { left: 10, top: 50, rotate: 38 },
  { left: 90, top: 70, rotate: 15 },
  { left: 35, top: 25, rotate: 28 },
  { left: 70, top: 85, rotate: 40 },
  { left: 55, top: 55, rotate: 18 },
  { left: 20, top: 90, rotate: 33 },
];

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate submission - replace with actual form handler
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 bg-[#0A0A0B] flex flex-col"
    >
      {/* Floating fragments constellation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FRAGMENT_POSITIONS.map((pos, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.1 } : {}}
            transition={{ duration: 1, delay: i * 0.1 }}
            className="absolute w-4 h-4 bg-white/5 rounded-sm"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              transform: `rotate(${pos.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="container-portfolio relative z-10 flex-1 flex flex-col justify-center">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40">
            Open Channel
          </span>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-[clamp(2.5rem,10vw,6rem)] font-light tracking-tight text-white leading-[0.95] mb-6">
            Let&apos;s build
            <br />
            something.
          </h2>
          <p className="text-lg text-white/50 max-w-md">
            Have a project in mind? I&apos;m always open to discussing new opportunities
            and ideas.
          </p>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16 max-w-md"
        >
          {isSubmitted ? (
            <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/5">
              <p className="text-green-400">Thanks! I&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-white text-black text-sm font-medium rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "..." : "Send"}
              </button>
            </form>
          )}
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-6 mb-16"
        >
          <a
            href={`mailto:${CONTENT.LINKS.EMAIL}`}
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            Email
          </a>
          <a
            href={CONTENT.LINKS.LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={CONTENT.LINKS.GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/50 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </motion.div>

        {/* Location & availability */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center gap-4"
        >
          <span className="text-xs text-white/40">{CONTENT.LOCATION}</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/40">Available for projects</span>
          </span>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="container-portfolio py-8 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Marquee name */}
          <div className="overflow-hidden w-48">
            <motion.div
              animate={{ x: [0, -100] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex gap-8 whitespace-nowrap"
            >
              <span className="text-xs text-white/20">{CONTENT.NAME}</span>
              <span className="text-xs text-white/20">{CONTENT.NAME}</span>
              <span className="text-xs text-white/20">{CONTENT.NAME}</span>
            </motion.div>
          </div>

          {/* Copyright */}
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} {CONTENT.NAME}. All rights reserved.
          </p>

          {/* Built with */}
          <p className="text-xs text-white/20">
            Built with Next.js, Three.js & GLSL
          </p>
        </div>
      </footer>
    </section>
  );
}
