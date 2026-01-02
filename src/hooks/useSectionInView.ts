import { useRef } from "react";
import { useInView } from "framer-motion";

interface SectionInViewOptions {
  margin?: `${number}px` | `${number}px ${number}px` | `${number}px ${number}px ${number}px ${number}px`;
  once?: boolean;
}

/**
 * Combines ref and useInView for section visibility detection
 * @param margin - Margin for triggering inView state (default: "-100px")
 * @param once - Whether to trigger only once (default: true)
 * @returns ref and isInView state
 */
export function useSectionInView(options?: SectionInViewOptions) {
  const { margin = "-100px" as const, once = true } = options ?? {};
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once, margin });

  return { ref, isInView };
}
