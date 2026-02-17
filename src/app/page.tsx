import { Hero } from "@/components/sections/hero";
import { CaseStudies } from "@/components/sections/current-build";
import { SignalStrip } from "@/components/sections/signal-strip";
import { Method } from "@/components/sections/method";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { SectionDivider } from "@/components/ui/section-divider";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <SectionDivider label="Work" />
        <CaseStudies />
        <SignalStrip />
        <SectionDivider label="Process" />
        <Method />
        <SectionDivider label="Experience" />
        <Experience />
        <SectionDivider label="Contact" />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
