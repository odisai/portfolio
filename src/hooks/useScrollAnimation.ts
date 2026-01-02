import { RefObject } from "react";
import { useScroll, useTransform, MotionValue } from "framer-motion";

type ScrollOffset = ["start end" | "end start" | "start start" | "end end", "start end" | "end start" | "start start" | "end end"];

interface ScrollAnimationOptions {
  offset?: ScrollOffset;
  parallaxY?: [string, string];
  opacity?: [number, number, number, number];
}

interface ScrollAnimationReturn {
  scrollYProgress: MotionValue<number>;
  y?: MotionValue<string>;
  opacity?: MotionValue<number>;
}

/**
 * Combines useScroll and useTransform for common scroll animations
 * @param ref - Reference to the element to track scroll progress
 * @param options - Configuration for scroll animations
 * @returns Scroll progress and optional transform values
 */
export function useScrollAnimation(
  ref: RefObject<HTMLElement | null>,
  options?: ScrollAnimationOptions
): ScrollAnimationReturn {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: options?.offset ?? ["start end", "end start"],
  });

  const result: ScrollAnimationReturn = { scrollYProgress };

  // Add parallax Y transformation if configured
  if (options?.parallaxY) {
    result.y = useTransform(scrollYProgress, [0, 1], options.parallaxY);
  }

  // Add opacity transformation if configured
  if (options?.opacity) {
    result.opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], options.opacity);
  }

  return result;
}
