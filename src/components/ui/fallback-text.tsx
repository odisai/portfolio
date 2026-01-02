"use client";

interface FallbackTextProps {
  visible: boolean;
}

/**
 * Simple 2D text fallback when 3D letters fail to load
 */
export function FallbackText({ visible }: FallbackTextProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="text-center animate-fade-in">
        <h1
          className="font-satoshi font-bold uppercase tracking-name text-white"
          style={{
            fontSize: "clamp(3rem, 12vw, 10rem)",
            lineHeight: 0.9,
          }}
        >
          Taylor
          <br />
          Allen
        </h1>
        <p className="mt-8 text-sm tracking-[0.15em] uppercase text-white/50">
          Builder • Architect • Founder
        </p>
      </div>
    </div>
  );
}
