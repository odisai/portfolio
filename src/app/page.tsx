import { Hero } from "@/components/sections/hero";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        
        {/* Add sections incrementally */}
        {/* <CurrentBuild /> */}
        {/* <Archive /> */}
        {/* <Method /> */}
        {/* <Credentials /> */}
        {/* <Contact /> */}
      </main>
    </SmoothScroll>
  );
}
