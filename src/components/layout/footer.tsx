"use client";

import { motion } from "framer-motion";
import { CONTENT } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="container-portfolio py-8 border-t border-white/5">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Marquee name */}
        <div className="overflow-hidden w-48">
          <motion.div
            animate={{ x: [0, -100] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex gap-8 whitespace-nowrap"
          >
            <span className="text-xs text-white/20">{CONTENT.NAME}</span>
            <span className="text-xs text-white/20">{CONTENT.NAME}</span>
            <span className="text-xs text-white/20">{CONTENT.NAME}</span>
          </motion.div>
        </div>

        {/* Copyright */}
        <p className="text-xs text-white/20">
          © {new Date().getFullYear()} {CONTENT.NAME}. All rights reserved.
        </p>

        {/* Built with */}
        <p className="text-xs text-white/20">
          Built with Next.js, Three.js & GLSL
        </p>
      </div>
    </footer>
  );
}
