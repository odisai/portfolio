import { Hero } from "@/components/sections/hero";
import { Method } from "@/components/sections/method";
import { CurrentBuild } from "@/components/sections/current-build";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <Method />
        <CurrentBuild />
        <Experience />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
