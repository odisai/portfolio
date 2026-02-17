"use client";

import { CONTENT } from "@/lib/constants";
import { BlurFade } from "@/components/ui/blur-fade";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { EdgeCard } from "@/components/ui/edge-card";

function OdisAIPreview() {
  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <div className="absolute -inset-8 rounded-full bg-[var(--color-copper)]/10 blur-[80px]" />
      <div className="relative aspect-[9/19] rounded-[32px] bg-black border border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#101015] via-black to-black" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black border border-white/10" />
        <div className="relative z-10 p-4 flex flex-col h-full">
          <div className="flex items-center justify-between text-[10px] text-pearl/70">
            <span>9:41</span>
            <span className="text-pearl/40">OdisAI</span>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[11px] text-pearl/70">Incoming call</p>
              <p className="text-[9px] text-pearl/30">Sunnyvale Vet</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
              <p className="text-[11px] text-pearl/70">AI agent active</p>
              <p className="text-[9px] text-pearl/30">Appointment booked</p>
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-[var(--color-copper)]/30 bg-[var(--color-copper)]/10 p-3">
            <p className="text-[10px] text-copper">98% Answer Rate</p>
            <p className="text-[9px] text-pearl/40">Live performance snapshot</p>
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
  highlights: string[];
  metrics: string[];
  stack: string[];
  visual?: React.ReactNode;
}) {
  return (
    <CardSpotlight className="h-full">
      <EdgeCard className="h-full p-8">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          <div className="flex-1">
            <p className="text-[0.65rem] tracking-[0.4em] uppercase text-pearl/40">
              {role}
            </p>
            <h3 className="mt-3 text-2xl text-display text-pearl">{title}</h3>
            <p className="mt-3 text-sm text-pearl/60">{summary}</p>

            <ul className="mt-5 space-y-2 text-sm text-pearl/50">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-copper)]" />
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

          {visual && <div className="lg:w-[280px] flex items-center justify-center">{visual}</div>}
        </div>
      </EdgeCard>
    </CardSpotlight>
  );
}

export function CaseStudies() {
  const [odisai, poppin, stanford] = CONTENT.CASE_STUDIES;

  return (
    <section id="work" className="relative py-[var(--spacing-section)] bg-[var(--color-obsidian)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] h-[320px] w-[320px] rounded-full bg-[var(--color-copper)]/5 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[10%] h-[280px] w-[280px] rounded-full bg-white/5 blur-[120px]" />
      </div>
      <div className="container-portfolio">
        <BlurFade>
          <p className="text-[0.65rem] tracking-[0.4em] uppercase text-pearl/40">Selected Work</p>
          <h2 className="mt-4 text-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">
            Highlighted experiences with real impact
          </h2>
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
