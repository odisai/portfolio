"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { CONTENT } from "@/lib/constants";
import { cn } from "@/lib/utils";

const projects = CONTENT.PROJECTS.PAST;

interface ProjectCardProps {
  project: (typeof projects)[number];
  featured?: boolean;
  index: number;
}

function ProjectCard({ project, featured = false, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [buildLogPhase, setBuildLogPhase] = useState(0);

  // Build log animation phases
  const buildLogPhases = ["Wireframe", "Architecture", "Code", "Product"];

  const handleHover = (hovering: boolean) => {
    setIsHovered(hovering);
    if (hovering) {
      // Cycle through build log phases
      let phase = 0;
      const interval = setInterval(() => {
        phase++;
        if (phase >= buildLogPhases.length) {
          clearInterval(interval);
          setBuildLogPhase(buildLogPhases.length - 1);
        } else {
          setBuildLogPhase(phase);
        }
      }, 200);
      return () => clearInterval(interval);
    } else {
      setBuildLogPhase(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      className={cn(
        "flex-shrink-0 relative group cursor-pointer",
        featured ? "w-[500px]" : "w-[380px]"
      )}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? -5 : 0,
          translateZ: isHovered ? 20 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "relative rounded-2xl overflow-hidden bg-gradient-to-br border border-white/10",
          featured
            ? "from-gray-900 to-gray-800 h-[450px]"
            : "from-gray-900/80 to-gray-850/80 h-[380px]"
        )}
        style={{
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 10px 30px -10px rgba(0, 0, 0, 0.3)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Build log visualization */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          {/* Build log phase indicator */}
          {featured && (
            <div className="absolute top-4 right-4 flex gap-2">
              {buildLogPhases.map((phase, i) => (
                <div
                  key={phase}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    i <= buildLogPhase && isHovered
                      ? "bg-blue-400"
                      : "bg-white/20"
                  )}
                />
              ))}
            </div>
          )}

          {/* Visual representation area */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full h-[180px] rounded-lg overflow-hidden bg-black/30">
              {/* Wireframe phase */}
              <motion.div
                initial={false}
                animate={{ opacity: buildLogPhase === 0 || !isHovered ? 1 : 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="grid grid-cols-3 gap-2 w-32">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-8 rounded bg-white/10 border border-white/20" />
                  ))}
                </div>
              </motion.div>

              {/* Architecture phase */}
              <motion.div
                initial={false}
                animate={{ opacity: buildLogPhase === 1 ? 1 : 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg className="w-32 h-32 text-white/30" viewBox="0 0 100 100">
                  <rect x="10" y="10" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="1" />
                  <rect x="60" y="10" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="1" />
                  <rect x="35" y="45" width="30" height="20" fill="none" stroke="currentColor" strokeWidth="1" />
                  <line x1="25" y1="30" x2="50" y2="45" stroke="currentColor" strokeWidth="1" />
                  <line x1="75" y1="30" x2="50" y2="45" stroke="currentColor" strokeWidth="1" />
                  <rect x="35" y="75" width="30" height="15" fill="none" stroke="currentColor" strokeWidth="1" />
                  <line x1="50" y1="65" x2="50" y2="75" stroke="currentColor" strokeWidth="1" />
                </svg>
              </motion.div>

              {/* Code phase */}
              <motion.div
                initial={false}
                animate={{ opacity: buildLogPhase === 2 ? 1 : 0 }}
                className="absolute inset-0 p-4 font-mono text-[10px] text-green-400/60"
              >
                <div>{"const App = () => {"}</div>
                <div className="ml-4">{"return ("}</div>
                <div className="ml-8">{"<Component />"}</div>
                <div className="ml-4">{");"}</div>
                <div>{"}"}</div>
              </motion.div>

              {/* Product phase */}
              <motion.div
                initial={false}
                animate={{ opacity: buildLogPhase === 3 ? 1 : 0 }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20"
              >
                <div className="text-4xl font-light text-white/80">{project.name}</div>
              </motion.div>
            </div>
          </div>

          {/* Project info */}
          <div>
            <h3 className={cn(
              "font-light tracking-tight text-white mb-2",
              featured ? "text-3xl" : "text-2xl"
            )}>
              {project.name}
            </h3>
            <p className="text-xs tracking-widest uppercase text-white/50 mb-3">
              {project.role}
            </p>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              {project.description}
            </p>
            <p className="text-xs text-white/30">
              {project.period}
            </p>
          </div>
        </div>

        {/* Hover gradient overlay */}
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
}

export function Archive() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0.2, 0.8], ["5%", "-40%"]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] py-32 overflow-hidden bg-[#0A0A0B]"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Section header */}
        <div className="container-portfolio mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[0.625rem] tracking-[0.3em] uppercase text-white/40 block mb-4">
              The Archive
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight">
              Past Builds
            </h2>
          </motion.div>
        </div>

        {/* Horizontal scroll gallery */}
        <motion.div
          ref={scrollContainerRef}
          style={{ x }}
          className="flex gap-8 pl-8 md:pl-16"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              featured={index === 0} // Poppin is featured
              index={index}
            />
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <div className="container-portfolio mt-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xs text-white/30"
          >
            Scroll to explore →
          </motion.p>
        </div>
      </div>

      {/* Typography bridge */}
      <div className="absolute bottom-32 left-0 right-0 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-3xl font-light text-white/60 italic"
        >
          &ldquo;Building is a practice.&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
