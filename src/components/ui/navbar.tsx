"use client";

import React from "react";
import { CONTENT } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavbarProps {
  visible: boolean;
  className?: string;
}

export function Navbar({ visible, className }: NavbarProps) {
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "px-8 py-6 flex items-center justify-between",
        "transition-all duration-700",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none",
        className
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Logo / Name + Location */}
      <div className="flex items-center gap-6">
        <a
          href="#"
          className="text-white/90 text-sm font-medium tracking-wide hover:text-white transition-colors pointer-events-auto"
        >
          TA
        </a>
        <div className="h-3 w-px bg-white/20" />
        <span className="text-[0.625rem] tracking-widest uppercase text-white/40">
          {CONTENT.LOCATION}
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-8">
        <a
          href="#work"
          className="text-white/50 text-xs tracking-widest uppercase hover:text-white/90 transition-colors pointer-events-auto"
        >
          Work
        </a>
        <a
          href="#about"
          className="text-white/50 text-xs tracking-widest uppercase hover:text-white/90 transition-colors pointer-events-auto"
        >
          About
        </a>
        <a
          href={CONTENT.LINKS.LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 text-xs tracking-widest uppercase hover:text-white/90 transition-colors pointer-events-auto"
        >
          LinkedIn
        </a>
        <a
          href={`mailto:${CONTENT.LINKS.EMAIL}`}
          className="text-white/90 text-xs tracking-widest uppercase px-4 py-2 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all pointer-events-auto"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
