"use client";

import { CONTENT } from "@/lib/constants";
import { BlurFade } from "@/components/ui/blur-fade";

export function Experience() {
  return (
    <section
      id="experience"
      className="depth-section depth-experience relative overflow-hidden py-section bg-obsidian scroll-mt-28 md:scroll-mt-32"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/58 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/44 to-transparent" />
        <div className="absolute top-[15%] left-[12%] h-[220px] w-[220px] rounded-full bg-white/5 blur-[110px]" />
      </div>
      <div className="container-portfolio relative z-10">
        <BlurFade>
          <p className="text-[0.65rem] tracking-[0.4em] uppercase text-pearl/70">
            Experience
          </p>
          <h2 className="mt-4 text-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">
            A focused timeline of impact
          </h2>
        </BlurFade>

        <div className="mt-12 grid grid-cols-1 gap-6">
          {CONTENT.EXPERIENCE.map((item, index) => (
            <BlurFade key={item.title} delay={0.1 + index * 0.08}>
              <div className="edge-cut copper-trace bg-surface/80 px-6 py-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="text-lg text-display text-pearl">
                      {item.title}
                    </h3>
                    <p className="text-sm text-pearl/75">{item.role}</p>
                  </div>
                  <span className="text-[0.7rem] tracking-[0.4em] uppercase text-copper">
                    {item.year}
                  </span>
                </div>
                <p className="mt-3 text-sm text-pearl/80">{item.summary}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
