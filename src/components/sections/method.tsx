"use client";

import { CONTENT } from "@/lib/constants";
import { BlurFade } from "@/components/ui/blur-fade";

const STEP_META = ["Discovery", "Systems", "Execution"] as const;

export function Method() {
  return (
    <section
      id="method"
      className="depth-section depth-method relative overflow-hidden py-section bg-obsidian scroll-mt-28 md:scroll-mt-32"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/45 to-transparent" />
        <div className="absolute top-[20%] right-[8%] h-[260px] w-[260px] rounded-full bg-copper/6 blur-[120px]" />
      </div>
      <div className="container-portfolio relative z-10">
        <BlurFade>
          <p className="text-[0.65rem] tracking-[0.4em] uppercase text-pearl/70">
            Method
          </p>
          <h2 className="mt-4 text-display text-[clamp(2rem,6vw,4.5rem)] leading-[1.05]">
            A tight, founder-grade delivery loop
          </h2>
        </BlurFade>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTENT.METHOD.map((item, index) => (
            <BlurFade key={item.title} delay={0.1 + index * 0.1}>
              <article className="group edge-cut relative h-full overflow-hidden border border-white/14 bg-linear-to-b from-[rgba(24,30,43,0.94)] via-[rgba(17,21,31,0.94)] to-[rgba(10,13,20,0.97)] p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-copper/35 hover:shadow-[0_18px_44px_rgba(0,0,0,0.35)]">
                <div className="absolute inset-0 opacity-16 bg-linear-to-b from-[rgba(255,250,242,0.06)] via-[rgba(255,250,242,0.06)] to-transparent" />
                <div className="absolute -right-16 -top-14 h-36 w-36 rounded-full bg-copper/18 blur-3xl transition-all duration-700 group-hover:bg-copper/24" />
                <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-teal-haze/20 blur-3xl transition-all duration-700 group-hover:bg-teal-haze/22" />

                {index < CONTENT.METHOD.length - 1 && (
                  <div className="pointer-events-none absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-linear-to-r from-copper/45 to-transparent md:block" />
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-[0.65rem] tracking-[0.42em] uppercase text-copper">
                      0{index + 1}
                    </p>
                    <p className="text-[0.55rem] tracking-[0.32em] uppercase text-pearl/50">
                      {STEP_META[index]}
                    </p>
                  </div>

                  <h3 className="mt-5 text-[clamp(1.25rem,2.8vw,1.7rem)] text-display text-pearl leading-[1.05]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-pearl/80">
                    {item.description}
                  </p>

                  <div className="mt-6 h-px w-full bg-linear-to-r from-copper/40 via-white/20 to-transparent" />
                  <p className="mt-3 text-[0.58rem] uppercase tracking-[0.3em] text-pearl/45">
                    Founder loop checkpoint
                  </p>
                </div>
              </article>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
