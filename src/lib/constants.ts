// ═══════════════════════════════════════════════════════════════════
// ANIMATION CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const ANIMATION = {
  // Intro sequence
  INTRO: {
    VOID_DURATION: 400,
    GENESIS_DURATION: 800,
    BURST_DURATION: 800,
    FADE_DURATION: 400,
    TOTAL_DURATION: 3200, // Total intro time before assembly starts
  },

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

  // Spring physics parameters (for GSAP elastic easing)
  SPRING: {
    ASSEMBLY_ELASTICITY: 0.8,
    ASSEMBLY_DAMPING: 0.4,
    SETTLE_ELASTICITY: 1.2,
    SETTLE_DAMPING: 0.6,
  },
} as const;

// ═══════════════════════════════════════════════════════════════════
// SHADER CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const SHADER = {
  // Fragment colors (as RGB arrays for shaders)
  COLORS: {
    // Darker searching state for more dramatic contrast
    SEARCHING: [0.08, 0.08, 0.1],
    // Toned down for better letter readability (was 0.92)
    RESOLVED: [0.75, 0.75, 0.8],
    // Vibrant iridescent colors
    IRIDESCENT_BLUE: [0.2, 0.6, 1.0],
    IRIDESCENT_PURPLE: [0.7, 0.3, 1.0],
  },

  // Post-processing - minimal bloom for crisp letters
  BLOOM_INTENSITY: 0.12,
  BLOOM_THRESHOLD: 0.9,
  BLOOM_RADIUS: 0.25,
  CHROMATIC_ABERRATION: 0.0002,

  // Depth of Field settings
  DOF: {
    FOCUS_DISTANCE: 0,
    FOCAL_LENGTH: 0.02,
    BOKEH_SCALE: 2,
    HEIGHT: 480,
  },

  // Lighting intensities - optimized for 3D letter readability
  LIGHTING: {
    KEY_INTENSITY: 1.1, // Increased for crisp letter definition
    FILL_INTENSITY: 0.4,
    RIM_INTENSITY: 0.3,
    ACCENT_INTENSITY: 0.15, // Reduced purple for better clarity
    AMBIENT_INTENSITY: 0.35,
  },
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

