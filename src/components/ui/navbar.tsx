"use client";

import { CONTENT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Monogram } from "@/components/ui/monogram";

interface NavbarProps {
  visible?: boolean;
  className?: string;
}

export function Navbar({ visible = true, className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "px-6 md:px-10 py-6 flex items-center justify-between",
        "transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none",
        className
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <a href="#top" className="flex items-center gap-3 text-pearl/80 hover:text-pearl transition-colors">
        <Monogram className="h-8 w-8" />
        <span className="text-[0.7rem] tracking-[0.4em] uppercase text-pearl/60">{CONTENT.LOCATION}</span>
      </a>

      <div className="hidden md:flex items-center gap-8 text-[0.65rem] tracking-[0.35em] uppercase text-pearl/50">
        <a href="#work" className="hover:text-pearl transition-colors">Work</a>
        <a href="#method" className="hover:text-pearl transition-colors">Method</a>
        <a href="#experience" className="hover:text-pearl transition-colors">Experience</a>
        <a href="#contact" className="hover:text-pearl transition-colors">Contact</a>
      </div>

      <a
        href={CONTENT.LINKS.CALENDLY}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[0.65rem] uppercase tracking-[0.35em] px-4 py-2 border border-copper text-copper hover:bg-[var(--color-copper)] hover:text-[#120d0a] transition-colors"
      >
        Book a Call
      </a>
    </nav>
  );
}
