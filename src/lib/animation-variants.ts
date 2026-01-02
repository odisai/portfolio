/**
 * Centralized Framer Motion animation variants
 * Provides consistent animation patterns across components
 */

export const FADE_IN_UP = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

export const FADE_IN_UP_SMALL = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6 },
};

export const FADE_IN_DOWN = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

export const SCALE_IN = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1 },
};

/**
 * Creates a stagger transition with configurable delay
 * @param index - Index of the item in the list
 * @param baseDelay - Base delay before stagger begins
 * @param staggerDelay - Delay between each item
 */
export const createStaggerTransition = (
  index: number,
  baseDelay = 0,
  staggerDelay = 0.1
) => ({
  duration: 0.5,
  delay: baseDelay + index * staggerDelay,
});

/**
 * Creates a delayed animation transition
 * @param delay - Delay before animation starts
 * @param duration - Duration of the animation
 */
export const createDelayedTransition = (delay: number, duration = 0.6) => ({
  duration,
  delay,
});

/**
 * Container variant for stagger children animations
 */
export const STAGGER_CONTAINER = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Item variant to be used with STAGGER_CONTAINER
 */
export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};
