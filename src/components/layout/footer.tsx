"use client";

import { CONTENT } from "@/lib/constants";
import { Monogram } from "@/components/ui/monogram";

export function Footer() {
  return (
    <footer className="container-portfolio py-10 border-t border-white/[0.06]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-[0.65rem] tracking-[0.35em] uppercase text-pearl/30">
        <div className="flex items-center gap-3">
          <Monogram className="h-7 w-7" />
          <span>{CONTENT.NAME}</span>
        </div>

        <span>
          &copy; {new Date().getFullYear()} {CONTENT.NAME}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
