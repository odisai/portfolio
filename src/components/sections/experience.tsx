"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

// ============================================
// LOGOS
// ============================================

function OdisAILogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      {/* Sound wave / voice AI representation */}
      <circle
        cx="16"
        cy="16"
        r="14"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <circle
        cx="16"
        cy="16"
        r="10"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <circle
        cx="16"
        cy="16"
        r="6"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
    </svg>
  );
}

function StanfordLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      {/* Stanford S with tree abstraction */}
      <path
        d="M16 4C16 4 10 8 10 14C10 18 12 20 12 24C12 26 10 28 10 28H22C22 28 20 26 20 24C20 20 22 18 22 14C22 8 16 4 16 4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 4V14" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M13 10L16 14L19 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpriftLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      {/* Shopping bag with swipe gesture */}
      <rect
        x="8"
        y="10"
        width="16"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 10V8C12 5.79086 13.7909 4 16 4C18.2091 4 20 5.79086 20 8V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 18L20 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17 15L20 18L17 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PoppinLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      {/* Burst / pop effect */}
      <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M16 4V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 24V28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 16H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 16H28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.51472 7.51472L10.3431 10.3431"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M21.6569 21.6569L24.4853 24.4853"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.51472 24.4853L10.3431 21.6569"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M21.6569 10.3431L24.4853 7.51472"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExperienceLogo({
  id,
  isCurrent,
}: {
  id: string;
  isCurrent?: boolean;
}) {
  const baseClass = `w-8 h-8 flex-shrink-0 ${isCurrent ? "text-blue-400" : "text-white/40"}`;

  switch (id) {
    case "odisai":
      return <OdisAILogo className={baseClass} />;
    case "stanford":
      return <StanfordLogo className={baseClass} />;
    case "sprift":
      return <SpriftLogo className={baseClass} />;
    case "poppin":
      return <PoppinLogo className={baseClass} />;
    default:
      return null;
  }
}

// ============================================
// DATA
// ============================================

interface ExperienceItem {
  id: string;
  year: string;
  title: string;
  role: string;
  current?: boolean;
  description: string;
  achievements: string[];
  techStack: string[];
  link?: string;
}

const experiences: ExperienceItem[] = [
  {
    id: "odisai",
    year: "2025",
    title: "OdisAI",
    role: "Co-Founder & CTO",
    current: true,
    description:
      "Building voice AI that answers clinic phones 24/7, books appointments, and automates follow-up calls. Leading technical strategy and product development.",
    achievements: [
      "Architected end-to-end voice AI pipeline for real-time call handling",
      "UC Davis PLASMA Accelerator cohort member",
      "NSF I-Corps Regional participant",
      "NECX Elev X Phase 2 finalist",
    ],
    techStack: [
      "TypeScript",
      "Python",
      "Next.js",
      "FastAPI",
      "PostgreSQL",
      "OpenAI",
      "AWS",
    ],
  },
  {
    id: "stanford",
    year: "2024",
    title: "Stanford Health Care",
    role: "Solutions Architecture",
    description:
      "Enterprise solutions architecture for one of America's top-ranked hospital systems. Designed scalable systems serving millions of patients.",
    achievements: [
      "Designed enterprise integration architecture handling 100M+ requests",
      "Led technical strategy for critical patient-facing applications",
      "Implemented security-first architecture patterns",
      "Mentored engineering teams on best practices",
    ],
    techStack: ["Java", "Spring Boot", "Kubernetes", "Oracle", "AWS", "Kafka"],
    link: "https://stanfordhealthcare.org",
  },
  {
    id: "sprift",
    year: "2023",
    title: "Sprift",
    role: "CTO & Co-Founder",
    description:
      "Led technical development for a social commerce platform. Built the entire technical foundation from zero to launched product.",
    achievements: [
      "Built mobile app from concept to App Store launch",
      "Designed real-time social features and recommendation engine",
      "Implemented secure payment processing with Stripe",
      "Grew technical team from 0 to 4 engineers",
    ],
    techStack: [
      "React Native",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Stripe",
      "Firebase",
    ],
  },
  {
    id: "poppin",
    year: "2021",
    title: "Poppin",
    role: "CTO & Co-Founder",
    description:
      "Co-founded and led technical development for a social commerce platform connecting creators with audiences.",
    achievements: [
      "Shipped MVP in 3 months with 2-person team",
      "Built creator monetization and audience engagement tools",
      "Designed scalable backend architecture",
      "Led product strategy and technical roadmap",
    ],
    techStack: ["React", "Node.js", "MongoDB", "AWS", "Stripe"],
  },
];

// ============================================
// TIMELINE LINE COMPONENT
// ============================================

function TimelineLine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden lg:block"
    >
      {/* Background line */}
      <div className="absolute inset-0 w-px bg-linear-to-b from-transparent via-white/10 to-transparent" />

      {/* Animated progress line */}
      <motion.div
        className="absolute top-0 left-0 w-px bg-linear-to-b from-blue-500/80 via-blue-400/60 to-blue-500/80 origin-top"
        style={{ scaleY, height: "100%" }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-4 bg-blue-500/20 blur-md origin-top"
        style={{ scaleY, height: "100%" }}
      />
    </div>
  );
}

// ============================================
// YEAR MARKER COMPONENT
// ============================================

function YearMarker({
  year,
  isCurrent,
}: {
  year: string;
  isCurrent?: boolean;
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="absolute left-1/2 -translate-x-1/2 z-10 hidden lg:flex items-center justify-center"
    >
      {/* Outer glow for current */}
      {isCurrent && (
        <div className="absolute inset-0 w-14 h-14 -m-2 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
      )}

      {/* Circle */}
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          border-2 backdrop-blur-sm
          ${
            isCurrent
              ? "bg-blue-500/20 border-blue-400 shadow-[0_0_20px_rgba(96,165,250,0.4)]"
              : "bg-[#0A0A0B] border-white/20"
          }
        `}
      >
        <span
          className={`text-xs font-mono font-medium ${
            isCurrent ? "text-blue-300" : "text-white/60"
          }`}
        >
          {year.slice(-2)}
        </span>
      </div>
    </motion.div>
  );
}

// ============================================
// EXPERIENCE CARD COMPONENT
// ============================================

interface ExperienceCardProps {
  item: ExperienceItem;
  index: number;
  isLeft: boolean;
}

function ExperienceCard({ item, index, isLeft }: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <div
      ref={cardRef}
      className={`
        relative w-full lg:w-[calc(50%-2rem)]
        ${isLeft ? "lg:mr-auto lg:pr-8" : "lg:ml-auto lg:pl-8"}
      `}
    >
      {/* Year marker - positioned on timeline */}
      <div
        className={`
          absolute top-8
          ${isLeft ? "lg:-right-[calc(2rem+20px)]" : "lg:-left-[calc(2rem+20px)]"}
        `}
      >
        <YearMarker year={item.year} isCurrent={item.current} />
      </div>

      {/* Connector line to timeline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`
          hidden lg:block absolute top-[2.1rem] h-px w-8 bg-gradient-to-r
          ${
            isLeft
              ? "right-0 from-transparent to-white/20 origin-right"
              : "left-0 from-white/20 to-transparent origin-left"
          }
        `}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`
          relative p-6 rounded-2xl border backdrop-blur-sm
          transition-all duration-500 group
          ${
            item.current
              ? "bg-blue-500/[0.03] border-blue-500/20 shadow-[0_0_40px_rgba(96,165,250,0.08)]"
              : "bg-white/[0.02] border-white/[0.06] hover:border-white/10 hover:bg-white/[0.03]"
          }
        `}
      >
        {/* Current badge */}
        {item.current && (
          <div className="absolute -top-3 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
            <span className="text-[10px] tracking-widest uppercase text-blue-400 font-medium">
              Current
            </span>
          </div>
        )}

        {/* Mobile year badge */}
        <div className="lg:hidden mb-3">
          <span className="text-xs font-mono text-white/40">{item.year}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: 0.1,
              type: "spring",
              stiffness: 200,
            }}
          >
            <ExperienceLogo id={item.id} isCurrent={item.current} />
          </motion.div>
          <div>
            <h3
              className={`text-xl font-light mb-1 ${item.current ? "text-white" : "text-white/90"}`}
            >
              {item.title}
            </h3>
            <p
              className={`text-sm ${item.current ? "text-blue-300/70" : "text-white/50"}`}
            >
              {item.role}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 leading-relaxed mb-5">
          {item.description}
        </p>

        {/* Achievements */}
        <div className="mb-5">
          <ul className="space-y-2">
            {item.achievements.map((achievement, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-2.5 text-sm text-white/50"
              >
                <span
                  className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${item.current ? "bg-blue-400" : "bg-white/30"}`}
                />
                <span>{achievement}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {item.techStack.map((tech, i) => (
            <motion.span
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
              className={`
                px-2.5 py-1 text-[11px] rounded-md border
                ${
                  item.current
                    ? "text-blue-300/70 bg-blue-500/10 border-blue-500/20"
                    : "text-white/40 bg-white/[0.03] border-white/[0.06] group-hover:border-white/10"
                }
              `}
            >
              {tech}
            </motion.span>
          ))}
        </div>

        {/* External link */}
        {item.link && (
          <motion.a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="inline-flex items-center gap-1.5 mt-5 text-xs text-white/40 hover:text-blue-400 transition-colors"
          >
            <span>Visit website</span>
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </motion.a>
        )}
      </motion.div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 bg-[#0A0A0B] overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/[0.02] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/[0.015] rounded-full blur-[150px]" />
      </div>

      <div className="container-portfolio relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 lg:mb-28"
        >
          <span className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40">
            Experience
          </span>
          <h2 className="mt-4 text-[clamp(2rem,6vw,4rem)] font-light tracking-tight text-white leading-[1.1]">
            Where I&apos;ve worked
          </h2>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central Timeline Line */}
          <TimelineLine />

          {/* Experience Cards */}
          <div className="relative space-y-12 lg:space-y-20">
            {experiences.map((item, index) => (
              <ExperienceCard
                key={item.id}
                item={item}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* Tech Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-28 lg:mt-36 max-w-2xl mx-auto text-center"
        >
          <p className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40 mb-6">
            Stack
          </p>
          <p className="text-lg text-white/60 leading-relaxed font-light">
            I think in TypeScript, architect in Python, and prototype in Swift.
            Fluent in SQL and NoSQL, comfortable anywhere from mobile to
            infrastructure.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
