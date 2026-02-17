"use client";

import { CONTENT } from "@/lib/constants";
import { Marquee } from "@/components/ui/marquee";
import { BlurFade } from "@/components/ui/blur-fade";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";

export function SignalStrip() {
  const reducedMotion = useReducedMotion();
  const { isMobile, isLowEnd, isTouch } = useDeviceCapabilities();
  const useStaticStrip = reducedMotion || isMobile || isLowEnd || isTouch;

  return (
    <section className="depth-section depth-signal signal-strip relative overflow-hidden bg-obsidian">
      <div className="container-portfolio relative z-10">
        <BlurFade>
          <div className="signal-strip-header">
            <span className="signal-strip-rule" />
            <span className="signal-strip-label">Signal</span>
            <span className="signal-strip-rule" />
          </div>
        </BlurFade>
      </div>

      <div className="signal-strip-rail relative z-10">
        {useStaticStrip ? (
          <div className="signal-strip-static overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {CONTENT.SIGNALS.map((signal) => (
              <span key={signal} className="signal-strip-pill">
                {signal}
              </span>
            ))}
          </div>
        ) : (
          <Marquee speed={44} className="signal-strip-marquee">
            {CONTENT.SIGNALS.map((signal) => (
              <span key={signal} className="signal-strip-pill">
                {signal}
              </span>
            ))}
          </Marquee>
        )}
      </div>
    </section>
  );
}
