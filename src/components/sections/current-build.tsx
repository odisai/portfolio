"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { CONTENT } from "@/lib/constants";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { EdgeCard } from "@/components/ui/edge-card";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";

type CallStep = "incoming" | "triage" | "booking" | "confirm";

const STEP_ORDER: CallStep[] = ["incoming", "triage", "booking", "confirm"];
const STEP_DURATIONS: Record<CallStep, number> = {
  incoming: 2200,
  triage: 2600,
  booking: 2600,
  confirm: 2800,
};

const TRANSCRIPT = [
  {
    step: "triage",
    sender: "ai",
    text: "Thanks for calling Sunnyvale Vet after-hours. Is this an emergency?",
  },
  {
    step: "triage",
    sender: "client",
    text: "My dog is limping but alert.",
  },
  {
    step: "booking",
    sender: "ai",
    text: "Thanks. I can book a visit tomorrow morning. What time works?",
  },
  {
    step: "booking",
    sender: "client",
    text: "Tomorrow at 9am.",
  },
  {
    step: "confirm",
    sender: "ai",
    text: "Booked for 9:00 AM with Dr. Chen. You'll get a text confirmation.",
  },
];

function PulseRings({ count = 3 }: { count?: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 rounded-full border border-copper/20"
          initial={{ scale: 0.7, opacity: 0.6 }}
          animate={{ scale: 2.1, opacity: 0 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function TranscriptBubble({
  sender,
  text,
  delay,
  animated = true,
}: {
  sender: "ai" | "client";
  text: string;
  delay: number;
  animated?: boolean;
}) {
  const isAI = sender === "ai";

  if (!animated) {
    return (
      <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
        <div
          className={`max-w-[80%] rounded-2xl px-3 py-2 text-[10px] leading-[1.4] ${
            isAI
              ? "bg-white/6 text-pearl/85 border border-white/10"
              : "bg-copper/20 text-pearl border border-copper/30"
          }`}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`flex ${isAI ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-[10px] leading-[1.4] ${
          isAI
            ? "bg-white/6 text-pearl/85 border border-white/10"
            : "bg-copper/20 text-pearl border border-copper/30"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}

function OdisAIPreview() {
  const reducedMotion = useReducedMotion();
  const { isMobile, isLowEnd, isTouch } = useDeviceCapabilities();
  const [step, setStep] = useState<CallStep>("incoming");
  const previewRef = useRef<HTMLDivElement>(null);
  const isPreviewInView = useInView(previewRef, {
    margin: "-20% 0px -20% 0px",
  });
  const minimalMode = reducedMotion || isMobile || isLowEnd || isTouch;

  useEffect(() => {
    if (reducedMotion || !isPreviewInView) return;

    const timeout = setTimeout(() => {
      const idx = STEP_ORDER.indexOf(step);
      setStep(
        idx === STEP_ORDER.length - 1 ? STEP_ORDER[0] : STEP_ORDER[idx + 1],
      );
    }, STEP_DURATIONS[step]);

    return () => clearTimeout(timeout);
  }, [step, reducedMotion, isPreviewInView]);

  const stepIndex = useMemo(() => STEP_ORDER.indexOf(step), [step]);
  const effectiveStepIndex = reducedMotion ? STEP_ORDER.length - 1 : stepIndex;

  const transcriptForStep = TRANSCRIPT.filter(
    (item) => STEP_ORDER.indexOf(item.step as CallStep) <= effectiveStepIndex,
  );
  const visibleTranscript = minimalMode
    ? transcriptForStep.slice(-3)
    : transcriptForStep;

  return (
    <div ref={previewRef} className="relative w-full max-w-[280px] mx-auto">
      <div
        className={`absolute rounded-full bg-copper/15 ${minimalMode ? "-inset-6 blur-[70px]" : "-inset-8 blur-[90px]"}`}
      />
      <div className="relative aspect-9/19 rounded-[32px] bg-black border border-white/15 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#121622] via-black to-black" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_20%,rgba(240,187,132,0.12),transparent_55%)]" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black border border-white/10" />
        <div className="relative z-10 p-4 flex flex-col h-full">
          <div className="flex items-center justify-between text-[10px] text-pearl/70">
            <span>9:41</span>
            <span className="text-pearl/60">OdisAI</span>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/4 p-3 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-pearl/85">
                  {effectiveStepIndex === 0
                    ? "Incoming call"
                    : "After-hours triage"}
                </p>
                <p className="text-[9px] text-pearl/50">Sunnyvale Vet Clinic</p>
              </div>
              <div className="text-[8px] uppercase tracking-[0.35em] text-copper">
                {effectiveStepIndex === 0 ? "Ringing" : "Live"}
              </div>
            </div>
            {effectiveStepIndex === 0 && !minimalMode && (
              <PulseRings count={2} />
            )}
          </div>

          <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/60 p-3">
            <div className="flex items-center justify-between text-[9px] text-pearl/50">
              <span>Conversation</span>
              <span className="text-pearl/35">After-hours assistant</span>
            </div>
            <div className="mt-3 space-y-2">
              {minimalMode ? (
                visibleTranscript.map((item, index) => (
                  <TranscriptBubble
                    key={`${item.text}-${index}`}
                    sender={item.sender as "ai" | "client"}
                    text={item.text}
                    delay={0}
                    animated={false}
                  />
                ))
              ) : (
                <AnimatePresence>
                  {visibleTranscript.map((item, index) => (
                    <TranscriptBubble
                      key={`${item.text}-${index}`}
                      sender={item.sender as "ai" | "client"}
                      text={item.text}
                      delay={index * 0.12}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {effectiveStepIndex >= 2 &&
              (minimalMode ? (
                <div className="mt-4 rounded-2xl border border-copper/30 bg-copper/12 p-3">
                  <p className="text-[10px] text-copper">Appointment booked</p>
                  <p className="text-[9px] text-pearl/60">
                    Tomorrow · 9:00 AM · Dr. Chen
                  </p>
                </div>
              ) : (
                <motion.div
                  key="appointment"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 rounded-2xl border border-copper/30 bg-copper/12 p-3"
                >
                  <p className="text-[10px] text-copper">Appointment booked</p>
                  <p className="text-[9px] text-pearl/60">
                    Tomorrow · 9:00 AM · Dr. Chen
                  </p>
                </motion.div>
              ))}
          </AnimatePresence>

          <div className="mt-4 rounded-2xl border border-white/15 bg-white/4 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-pearl/80">98% Answer Rate</p>
                <p className="text-[9px] text-pearl/50">After-hours coverage</p>
              </div>
              <div className="text-[9px] text-copper">24/7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseStudyCard({
  title,
  role,
  summary,
  highlights,
  metrics,
  stack,
  visual,
}: {
  title: string;
  role: string;
  summary: string;
  highlights: readonly string[];
  metrics: readonly string[];
  stack: readonly string[];
  visual?: React.ReactNode;
}) {
  return (
    <CardSpotlight className="h-full">
      <EdgeCard className="h-full p-8">
        <div className="absolute top-6 right-6 text-[0.6rem] uppercase tracking-[0.4em] text-pearl/35">
          Case Study
        </div>
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          <div className="flex-1">
            <p className="text-[0.65rem] tracking-[0.4em] uppercase text-pearl/40">
              {role}
            </p>
            <h3 className="mt-3 text-2xl text-display text-pearl">{title}</h3>
            <p className="mt-3 text-sm text-pearl/80">{summary}</p>

            <ul className="mt-5 space-y-2 text-sm text-pearl/70">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-copper" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              {metrics.map((metric) => (
                <span
                  key={metric}
                  className="text-[0.65rem] uppercase tracking-[0.35em] text-copper border border-copper/40 px-3 py-1"
                >
                  {metric}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="text-[0.6rem] uppercase tracking-[0.3em] text-pearl/40 border border-white/10 px-3 py-1"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {visual && (
            <div className="lg:w-[280px] flex items-center justify-center">
              {visual}
            </div>
          )}
        </div>
      </EdgeCard>
    </CardSpotlight>
  );
}

export function CaseStudies() {
  const [odisai, poppin, stanford] = CONTENT.CASE_STUDIES;

  return (
    <section
      id="work"
      className="depth-section depth-work relative overflow-hidden py-section bg-obsidian scroll-mt-28 md:scroll-mt-32"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] h-[320px] w-[320px] rounded-full bg-copper/5 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[10%] h-[280px] w-[280px] rounded-full bg-white/5 blur-[120px]" />
      </div>
      <div className="container-portfolio relative z-10">
        <BlurFade>
          <p className="text-[0.65rem] tracking-[0.4em] uppercase text-pearl/70">
            Selected Work
          </p>
          <h2 className="mt-4 text-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">
            Highlighted experiences with real impact
          </h2>
        </BlurFade>
        <BlurFade delay={0.1}>
          <p className="mt-3 text-mono text-[0.7rem] tracking-[0.3em] uppercase text-pearl/60">
            03 curated engagements · founder-grade outcomes
          </p>
        </BlurFade>

        <div className="mt-12 grid grid-cols-1 gap-8">
          <BlurFade delay={0.1}>
            <CaseStudyCard
              title={odisai.title}
              role={odisai.role}
              summary={odisai.summary}
              highlights={odisai.highlights}
              metrics={odisai.metrics}
              stack={odisai.stack}
              visual={<OdisAIPreview />}
            />
          </BlurFade>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BlurFade delay={0.2}>
              <CaseStudyCard
                title={poppin.title}
                role={poppin.role}
                summary={poppin.summary}
                highlights={poppin.highlights}
                metrics={poppin.metrics}
                stack={poppin.stack}
              />
            </BlurFade>
            <BlurFade delay={0.25}>
              <CaseStudyCard
                title={stanford.title}
                role={stanford.role}
                summary={stanford.summary}
                highlights={stanford.highlights}
                metrics={stanford.metrics}
                stack={stanford.stack}
              />
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  );
}
