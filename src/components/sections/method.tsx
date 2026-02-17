"use client";

import { CONTENT } from "@/lib/constants";
import { BlurFade } from "@/components/ui/blur-fade";
import { EdgeCard } from "@/components/ui/edge-card";

export function Method() {
  return (
    <section id="method" className="relative py-[var(--spacing-section)] bg-[var(--color-obsidian)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[8%] h-[260px] w-[260px] rounded-full bg-[var(--color-copper)]/6 blur-[120px]" />
      </div>
      <div className="container-portfolio">
        <BlurFade>
          <p className="text-[0.65rem] tracking-[0.4em] uppercase text-pearl/55">Method</p>
          <h2 className="mt-4 text-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">
            A tight, founder-grade delivery loop
          </h2>
        </BlurFade>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTENT.METHOD.map((item, index) => (
            <BlurFade key={item.title} delay={0.1 + index * 0.1}>
              <EdgeCard className="h-full p-6">
                <p className="text-[0.65rem] tracking-[0.4em] uppercase text-copper">
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-xl text-display text-pearl">{item.title}</h3>
                <p className="mt-3 text-sm text-pearl/70">{item.description}</p>
              </EdgeCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
