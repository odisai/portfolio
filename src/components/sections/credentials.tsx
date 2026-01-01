"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const timeline = [
  { year: "2025", label: "OdisAI — Co-Founder & CTO", current: true },
  { year: "2024", label: "Stanford Health Care — Solutions Architecture", highlight: true },
  { year: "2023", label: "Sprift — CTO & Co-Founder" },
  { year: "2021", label: "Poppin — CTO & Co-Founder" },
  { year: "2020", label: "UC Berkeley — Computer Science" },
  { year: "2018", label: "UC San Diego — Data Science" },
];

const techProse = `I think in TypeScript, architect in Python, and prototype in Swift. Fluent in SQL and NoSQL, comfortable anywhere from mobile to infrastructure.`;

export function Credentials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const timelineProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 100]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 bg-[#0A0A0B]"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/[0.02] rounded-full blur-[120px]" />
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
            Credentials
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Timeline */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-light text-white mb-12"
            >
              Timeline
            </motion.h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10">
                <motion.div
                  style={{ height: timelineProgress }}
                  className="w-full bg-gradient-to-b from-blue-500/50 to-blue-500/0"
                />
              </div>

              {/* Timeline items */}
              <div className="space-y-8 pl-8">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Dot */}
                    <div className={`absolute -left-8 top-1.5 w-2 h-2 rounded-full ${
                      item.current
                        ? "bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
                        : item.highlight
                          ? "bg-white/60"
                          : "bg-white/30"
                    }`} />

                    {/* Content */}
                    <div>
                      <span className="text-xs text-white/40 font-mono">{item.year}</span>
                      <p className={`text-sm ${
                        item.current
                          ? "text-white"
                          : item.highlight
                            ? "text-white/80"
                            : "text-white/60"
                      }`}>
                        {item.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Stanford callout + Tech stack */}
          <div>
            {/* Stanford callout */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent"
            >
              <p className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40 mb-4">
                Enterprise Experience
              </p>
              <h3 className="text-2xl font-light text-white mb-2">
                Stanford Health Care
              </h3>
              <p className="text-sm text-white/50 mb-4">
                Solutions Architecture
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                Enterprise systems serving one of America&apos;s top-ranked hospitals.
                Architecture at scale, not just startup scrappy.
              </p>
            </motion.div>

            {/* Tech stack prose */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40 mb-6">
                Stack
              </p>
              <p className="text-lg text-white/70 leading-relaxed font-light">
                {techProse}
              </p>

              {/* Tech tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {["TypeScript", "Python", "Swift", "React", "Next.js", "Node.js", "PostgreSQL", "Redis", "AWS"].map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="px-3 py-1 text-xs text-white/50 border border-white/10 rounded-full hover:border-white/30 hover:text-white/70 transition-colors"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative element - fragments scattering (reverse assembly preview) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-32 flex justify-center gap-4"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-3 h-3 bg-white/10 rounded-sm"
              style={{
                transform: `rotate(${i * 15}deg)`,
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
