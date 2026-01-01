import { Hero } from "@/components/sections/Hero";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

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
