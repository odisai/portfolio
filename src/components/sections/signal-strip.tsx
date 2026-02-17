"use client";

import { CONTENT } from "@/lib/constants";
import { Marquee } from "@/components/ui/marquee";
import { BlurFade } from "@/components/ui/blur-fade";

export function SignalStrip() {
  return (
    <section className="depth-section depth-signal relative overflow-hidden py-10 bg-[var(--color-obsidian)]">
      <div className="container-portfolio relative z-10">
        <BlurFade>
          <div className="flex items-center gap-3 text-[0.6rem] tracking-[0.4em] uppercase text-pearl/75">
            <span className="text-pearl/60">Signal</span>
            <div className="h-px w-12 bg-pearl/20" />
          </div>
        </BlurFade>
      </div>

      <div className="relative z-10 mt-6 border-y border-white/10 py-4">
        <Marquee speed={50} className="text-[0.65rem] uppercase tracking-[0.35em] text-pearl/70">
          {CONTENT.SIGNALS.map((signal) => (
            <span key={signal} className="px-4">{signal}</span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
