"use client";

import { useState, ReactNode } from "react";

interface DragSliderProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  leftLabel?: string;
  rightLabel?: string;
  instructionText?: string;
  className?: string;
}

export function DragSlider({
  leftContent,
  rightContent,
  leftLabel = "Before",
  rightLabel = "After",
  instructionText = "Drag to explore",
  className = "",
}: DragSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setSliderPosition(position);
  };

  return (
    <div>
      <div
        className={`relative h-[400px] rounded-2xl overflow-hidden cursor-ew-resize select-none ${className}`}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleSliderDrag}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleSliderDrag}
      >
        {/* Left side */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            clipPath: `inset(0 ${(1 - sliderPosition) * 100}% 0 0)`,
          }}
        >
          {leftContent}
        </div>

        {/* Right side */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            clipPath: `inset(0 0 0 ${sliderPosition * 100}%)`,
          }}
        >
          {rightContent}
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white/80 shadow-lg cursor-ew-resize"
          style={{ left: `${sliderPosition * 100}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
            <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 text-xs tracking-widest uppercase text-white/30">
          {leftLabel}
        </div>
        <div className="absolute bottom-4 right-4 text-xs tracking-widest uppercase text-white/30">
          {rightLabel}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-white/30">
        {instructionText}
      </p>
    </div>
  );
}
