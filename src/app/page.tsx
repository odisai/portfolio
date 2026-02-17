import { Hero } from "@/components/sections/hero";
import { CaseStudies } from "@/components/sections/current-build";
import { SignalStrip } from "@/components/sections/signal-strip";
import { Method } from "@/components/sections/method";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <CaseStudies />
        <SignalStrip />
        <Method />
        <Experience />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
