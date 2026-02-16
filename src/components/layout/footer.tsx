"use client";

import { CONTENT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="container-portfolio py-8 mt-auto border-t border-white/[0.06]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] tracking-wide text-white/25">
        <span className="uppercase">
          {CONTENT.NAME}
        </span>

        <span>
          &copy; {new Date().getFullYear()} {CONTENT.NAME}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
