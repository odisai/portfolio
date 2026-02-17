"use client";

import { useEffect, useState } from "react";
import { CONTENT } from "@/lib/constants";
import { BlurFade } from "@/components/ui/blur-fade";
import { Monogram } from "@/components/ui/monogram";
import { Footer } from "@/components/layout/footer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";

export function Contact() {
  const reducedMotion = useReducedMotion();
  const { isMobile, isLowEnd, isTouch } = useDeviceCapabilities();
  const shouldDeferEmbed = reducedMotion || isMobile || isLowEnd || isTouch;
  const [showEmbed, setShowEmbed] = useState(!shouldDeferEmbed);

  useEffect(() => {
    if (!shouldDeferEmbed) {
      setShowEmbed(true);
    }
  }, [shouldDeferEmbed]);

  return (
    <section
      id="contact"
      className="depth-section depth-contact relative overflow-hidden py-section bg-[var(--color-obsidian)] scroll-mt-28 md:scroll-mt-32"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-[10%] right-[10%] h-[260px] w-[260px] rounded-full bg-copper/6 blur-[120px]" />
      </div>
      <div className="container-portfolio relative z-10">
        <BlurFade>
          <p className="text-[0.65rem] tracking-[0.4em] uppercase text-pearl/70">
            Book a Call
          </p>
          <h2 className="mt-4 text-display text-[clamp(2.5rem,7vw,5rem)] leading-[1.02]">
            Let&apos;s build something that lasts.
          </h2>
        </BlurFade>

        <BlurFade delay={0.15}>
          <p className="mt-6 max-w-2xl text-lg text-pearl/80">
            Share the brief, and I&apos;ll respond with a focused plan and next
            steps.
          </p>
        </BlurFade>

        <BlurFade delay={0.2}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={CONTENT.LINKS.CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-copper text-[#120d0a] bg-copper uppercase tracking-[0.35em] text-[0.65rem] shadow-[0_0_20px_rgba(227,176,122,0.35)] hover:shadow-[0_0_30px_rgba(227,176,122,0.5)] transition-shadow"
            >
              Book a Call
            </a>
            <a
              href={`mailto:${CONTENT.LINKS.EMAIL}`}
              className="px-6 py-3 border border-white/10 text-pearl/70 uppercase tracking-[0.35em] text-[0.65rem] hover:border-white/30 hover:text-pearl transition-colors"
            >
              Email
            </a>
          </div>
        </BlurFade>

        <BlurFade delay={0.3}>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
            <div className="edge-cut copper-trace surface-card p-6">
              <p className="text-[0.65rem] tracking-[0.4em] uppercase text-pearl/40">
                Availability
              </p>
              <p className="mt-4 text-sm text-pearl/80">
                Currently accepting a limited number of premium engagements.
              </p>
              <div className="mt-6 flex items-center gap-3 text-pearl/60">
                <span className="h-2 w-2 rounded-full bg-copper" />
                <span className="text-xs uppercase tracking-[0.35em]">
                  Open
                </span>
              </div>
              <div className="mt-8 flex items-center gap-3 text-pearl/70">
                <Monogram className="h-10 w-10" />
                <span className="text-xs uppercase tracking-[0.35em]">
                  {CONTENT.LOCATION}
                </span>
              </div>
            </div>

            <div className="edge-cut copper-trace surface-card p-4">
              {showEmbed ? (
                <iframe
                  title="Calendly"
                  src={CONTENT.LINKS.CALENDLY}
                  loading="lazy"
                  className="h-[420px] md:h-[460px] w-full rounded-xl border border-white/10"
                />
              ) : (
                <div className="h-[420px] md:h-[460px] rounded-xl border border-white/10 bg-black/20 p-6 flex flex-col justify-between">
                  <div>
                    <p className="text-[0.65rem] tracking-[0.35em] uppercase text-pearl/45">
                      Scheduler
                    </p>
                    <p className="mt-3 text-sm text-pearl/75">
                      Calendly is deferred on this device for better
                      performance. Load it only when you need to book.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEmbed(true)}
                      className="px-4 py-2 border border-copper text-[#120d0a] bg-copper uppercase tracking-[0.28em] text-[0.6rem]"
                    >
                      Load Scheduler
                    </button>
                    <a
                      href={CONTENT.LINKS.CALENDLY}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-white/15 text-pearl/70 uppercase tracking-[0.28em] text-[0.6rem] hover:border-white/35 hover:text-pearl transition-colors"
                    >
                      Open in New Tab
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.35}>
          <div className="mt-12 flex flex-wrap gap-6 text-[0.7rem] uppercase tracking-[0.35em] text-pearl/70">
            <a
              href={`mailto:${CONTENT.LINKS.EMAIL}`}
              className="hover:text-pearl transition-colors"
            >
              Email
            </a>
            <a
              href={CONTENT.LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pearl transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={CONTENT.LINKS.GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pearl transition-colors"
            >
              GitHub
            </a>
          </div>
        </BlurFade>
      </div>

      <Footer />
    </section>
  );
}
