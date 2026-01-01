import { Hero } from "@/components/sections/hero";
import { CurrentBuild } from "@/components/sections/current-build";
import { Archive } from "@/components/sections/archive";
import { Method } from "@/components/sections/method";
import { Credentials } from "@/components/sections/credentials";
import { Contact } from "@/components/sections/contact";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <CurrentBuild />
        <Archive />
        <Method />
        <Credentials />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
