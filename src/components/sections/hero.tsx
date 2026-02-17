"use client";

import { Navbar } from "@/components/ui/navbar";
import { Monogram } from "@/components/ui/monogram";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { CONTENT } from "@/lib/constants";
import Image from "next/image";

const HEADER_IMAGE_URL =
  "https://lh3.googleusercontent.com/a/ACg8ocJmNAUiPCeGvw28LaNWKOBEP1rnLRMtkLQWmfi8vK8y0MnF6e03=s317-c-no";

export function Hero() {
  return (
    <section
      id="top"
      className="section-hero relative overflow-hidden bg-obsidian"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-[5%] h-[360px] w-[360px] rounded-full bg-copper/10 blur-[140px]" />
        <div className="absolute bottom-0 left-[8%] h-[280px] w-[280px] rounded-full bg-white/5 blur-[140px]" />
      </div>

      <div className="absolute right-[10%] top-[12%] hidden lg:block monogram-watermark">
        <Monogram className="h-48 w-48 text-copper" />
      </div>

      <Navbar visible />

      <div className="container-portfolio relative z-10 py-section">
        <div className="absolute -inset-x-8 -top-8 bottom-0 z-0 bg-linear-to-r from-[rgba(14,15,19,0.9)] via-[rgba(14,15,19,0.65)] to-transparent blur-2xl" />
        <div className="relative z-10">
          <BlurFade>
            <p className="text-[0.65rem] tracking-[0.5em] uppercase text-pearl/65">
              {CONTENT.ROLE}
            </p>
          </BlurFade>

          <BlurFade delay={0.1}>
            <h1 className="mt-6 text-display text-display-glow text-[clamp(3rem,10vw,8rem)] leading-[0.92]">
              {CONTENT.NAME}
            </h1>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg text-pearl/80">
              {CONTENT.HERO.POSITIONING}
            </p>
          </BlurFade>

          <BlurFade delay={0.3}>
            <div className="mt-10 flex justify-center md:justify-start">
              <div className="relative w-full max-w-[320px] overflow-hidden rounded-[32px] border border-white/20 bg-white/5 p-1 shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
                <Image
                  src={HEADER_IMAGE_URL}
                  alt={`${CONTENT.NAME} header portrait`}
                  width={400}
                  height={400}
                  sizes="(max-width: 768px) 90vw, 320px"
                  className="h-full w-full object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-white/10" />
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.4}>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={CONTENT.LINKS.CALENDLY}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-copper text-[#120d0a] bg-copper uppercase tracking-[0.35em] text-[0.65rem] shadow-[0_0_20px_rgba(240,187,132,0.45)] hover:shadow-[0_0_32px_rgba(240,187,132,0.6)] transition-shadow"
              >
                Book a Call
              </a>
              <a
                href={`mailto:${CONTENT.LINKS.EMAIL}`}
                className="px-6 py-3 border border-white/15 text-pearl/80 uppercase tracking-[0.35em] text-[0.65rem] hover:border-white/35 hover:text-pearl transition-colors"
              >
                Email
              </a>
            </div>
          </BlurFade>

          <BlurFade delay={0.5}>
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
              {CONTENT.HERO.STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="edge-cut copper-trace surface-card px-6 py-5"
                >
                  <div className="text-3xl text-display text-pearl">
                    <NumberTicker value={stat.value} />
                    <span className="text-copper">{stat.suffix}</span>
                  </div>
                  <p className="mt-2 text-[0.65rem] uppercase tracking-[0.4em] text-pearl/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </BlurFade>

          <BlurFade delay={0.6}>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-[0.65rem] uppercase tracking-[0.4em] text-pearl/60">
              <span className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-copper shadow-[0_0_14px_rgba(240,187,132,0.8)]" />
                Available for select engagements
              </span>
              <span className="text-mono text-pearl/45">
                OBS-ATELIER // 2026
              </span>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
