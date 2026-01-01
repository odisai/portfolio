// ═══════════════════════════════════════════════════════════════════
// ANIMATION CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const ANIMATION = {
  // Assembly animation
  ASSEMBLY_DURATION: 2500,
  ASSEMBLY_DURATION_MOBILE: 2000,
  
  // Fragment physics
  FRAGMENT_DAMPING: 0.8,
  FRAGMENT_STIFFNESS: 0.1,
  MAGNETIC_THRESHOLD: 0.1,
  
  // Camera
  CAMERA_IDLE_DRIFT: 0.5,
  CAMERA_PARALLAX_INTENSITY: 2,
  
  // Scroll
  SCROLL_TRIGGER_OFFSET: 0.2,
  
  // Easing (as CSS cubic-bezier strings)
  EASE: {
    OUT_EXPO: "cubic-bezier(0.16, 1, 0.3, 1)",
    OUT_QUINT: "cubic-bezier(0.22, 1, 0.36, 1)",
    IN_OUT_EXPO: "cubic-bezier(0.87, 0, 0.13, 1)",
    SPRING: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

// ═══════════════════════════════════════════════════════════════════
// SHADER CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const SHADER = {
  // Fragment colors (as RGB arrays for shaders)
  COLORS: {
    SEARCHING: [0.1, 0.1, 0.12],
    RESOLVED: [0.96, 0.96, 0.98],
    IRIDESCENT_BLUE: [0.23, 0.51, 0.97],
    IRIDESCENT_PURPLE: [0.55, 0.36, 0.97],
  },
  
  // Post-processing
  BLOOM_INTENSITY: 0.3,
  BLOOM_THRESHOLD: 0.8,
  CHROMATIC_ABERRATION: 0.002,
} as const;

// ═══════════════════════════════════════════════════════════════════
// LAYOUT CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const LAYOUT = {
  // Breakpoints (matching Tailwind)
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },
  
  // Z-indices
  Z_INDEX: {
    BACKGROUND: -1,
    DEFAULT: 0,
    ELEVATED: 10,
    NAV: 100,
    MODAL: 200,
    TOAST: 300,
  },
  
  // Container max widths
  MAX_WIDTH: {
    CONTENT: 1400,
    PROSE: 720,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════
// PORTFOLIO CONTENT
// ═══════════════════════════════════════════════════════════════════

export const CONTENT = {
  NAME: "Taylor Allen",
  TAGLINE: "Creating technology that matters",
  LOCATION: "Bay Area, CA",
  
  // Word rotation for hero
  DESCRIPTORS: ["Builder", "Architect", "Founder"],
  
  // Social links
  LINKS: {
    LINKEDIN: "https://www.linkedin.com/in/taylorallen0913",
    GITHUB: "https://github.com/taylorallen",
    EMAIL: "taylor@odisai.com",
  },
  
  // Projects
  PROJECTS: {
    CURRENT: {
      name: "OdisAI",
      role: "Co-Founder & CTO",
      description: "AI veterinary scribe technology automating clinical documentation",
      credentials: ["UC Davis PLASMA Accelerator", "NSF I-Corps Regional", "NECX Elev X Phase 2"],
    },
    PAST: [
      {
        name: "Poppin",
        role: "CTO & Co-Founder",
        period: "May 2021 — Feb 2022",
        description: "Social commerce platform. Led team from concept to shipped MVP.",
      },
      {
        name: "Stanford Health Care",
        role: "Solutions Architecture",
        period: "May 2024 — May 2025",
        description: "Enterprise architecture for one of the nation's leading health systems.",
      },
      {
        name: "Sprift",
        role: "CTO & Co-Founder",
        period: "May 2023 — Jan 2024",
        description: "Swipe. Shop. Save.",
      },
    ],
  },
} as const;

