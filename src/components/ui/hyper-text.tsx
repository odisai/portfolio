"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type CharacterSet = string[] | readonly string[];

interface HyperTextProps {
  /** The text content to be animated */
  children: string;
  /** Optional className for styling */
  className?: string;
  /** Duration of the animation in milliseconds */
  duration?: number;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Component to render as - defaults to div */
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3";
  /** Whether to start animation when element comes into view */
  startOnView?: boolean;
  /** Whether to trigger animation on hover */
  animateOnHover?: boolean;
  /** Custom character set for scramble effect. Defaults to uppercase alphabet */
  characterSet?: CharacterSet;
  /** Optional style */
  style?: React.CSSProperties;
}

const DEFAULT_CHARACTER_SET = Object.freeze(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
) as readonly string[];

const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

export function HyperText({
  children,
  className,
  duration = 800,
  delay = 0,
  as: Component = "div",
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTER_SET,
  style,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState<string[]>(() =>
    children.split(""),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const iterationCount = useRef(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating) {
      iterationCount.current = 0;
      setIsAnimating(true);
    }
  };

  // Handle animation start based on view or delay
  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setIsAnimating(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsAnimating(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-30% 0px -30% 0px" },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay, startOnView]);

  // Handle scramble animation
  useEffect(() => {
    if (!isAnimating) return;

    const maxIterations = children.length;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      iterationCount.current = progress * maxIterations;

      setDisplayText((currentText) =>
        currentText.map((letter, index) =>
          letter === " "
            ? letter
            : index <= iterationCount.current
              ? children[index]
              : characterSet[getRandomInt(characterSet.length)],
        ),
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [children, duration, isAnimating, characterSet]);

  const content = (
    <AnimatePresence>
      {displayText.map((letter, index) => (
        <motion.span key={index} className={cn(letter === " " ? "w-3" : "")}>
          {letter.toUpperCase()}
        </motion.span>
      ))}
    </AnimatePresence>
  );

  const sharedProps = {
    className: cn("overflow-hidden", className),
    onMouseEnter: handleAnimationTrigger,
    style,
  };

  // Use motion variants for each supported tag
  if (Component === "h1") {
    return (
      <motion.h1 ref={elementRef} {...sharedProps}>
        {content}
      </motion.h1>
    );
  }
  if (Component === "h2") {
    return (
      <motion.h2 ref={elementRef} {...sharedProps}>
        {content}
      </motion.h2>
    );
  }
  if (Component === "h3") {
    return (
      <motion.h3 ref={elementRef} {...sharedProps}>
        {content}
      </motion.h3>
    );
  }
  if (Component === "p") {
    return (
      <motion.p ref={elementRef} {...sharedProps}>
        {content}
      </motion.p>
    );
  }
  if (Component === "span") {
    return (
      <motion.span ref={elementRef} {...sharedProps}>
        {content}
      </motion.span>
    );
  }

  return (
    <motion.div ref={elementRef} {...sharedProps}>
      {content}
    </motion.div>
  );
}
