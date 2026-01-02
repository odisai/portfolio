/**
 * Type-safe access to design tokens and CSS variables
 * Provides a single source of truth for design system values
 */

// Color tokens - map to CSS variables in globals.css
export const COLORS = {
  space: "var(--color-space)",
  spaceLight: "var(--color-space-light)",
  spaceDark: "var(--color-space-dark)",
  architect: "var(--color-architect)",
  signal: "var(--color-signal)",
} as const;

// Common spacing patterns used across sections
export const SPACING = {
  section: "py-32 md:py-48",
  sectionTop: "pt-32 md:pt-48",
  sectionBottom: "pb-32 md:pb-48",
  container: "container-portfolio",
  marginLarge: "mb-16 md:mb-24",
  marginMedium: "mb-12 md:mb-16",
  marginSmall: "mb-8 md:mb-12",
} as const;

// Background gradients used in sections
export const GRADIENTS = {
  sectionBackground: "linear-gradient(180deg, #0A0A0B 0%, #12121A 50%, #0A0A0B 100%)",
  darkToLight: "linear-gradient(180deg, #0A0A0B 0%, #12121A 100%)",

  // Helper function for accent glows
  accentGlow: (color: string, opacity: number) => `${color}/${opacity}`,
} as const;

// Typography scales
export const TYPOGRAPHY = {
  heading: {
    hero: "text-[clamp(3rem,12vw,8rem)] font-light tracking-tight leading-[0.9]",
    large: "text-[clamp(2.5rem,10vw,6rem)] font-light tracking-tight leading-[0.95]",
    medium: "text-2xl font-light",
  },
  label: {
    section: "text-[0.625rem] tracking-[0.3em] uppercase text-white/40",
    small: "text-xs tracking-widest uppercase text-white/30",
  },
} as const;

// Common border styles
export const BORDERS = {
  subtle: "border border-white/10",
  medium: "border border-white/20",
  strong: "border border-white/30",
} as const;

// Animation durations from constants
export const DURATIONS = {
  fast: 400,
  medium: 600,
  slow: 800,
  verySlow: 1000,
} as const;
