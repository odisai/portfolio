// ═══════════════════════════════════════════════════════════════════
// PORTFOLIO CONTENT — Obsidian Atelier
// ═══════════════════════════════════════════════════════════════════

export const CONTENT = {
  NAME: "Taylor Allen",
  TAGLINE: "Builder of premium, scalable systems",
  LOCATION: "Bay Area, CA",
  ROLE: "Founder • Full-Stack Engineer • Systems Architect",

  LINKS: {
    LINKEDIN: "https://www.linkedin.com/in/taylorallen0913",
    GITHUB: "https://github.com/taylorallen",
    EMAIL: "taylor@odisai.com",
    CALENDLY: "https://calendly.com/taylorallen0913-abnr/30min",
  },

  HERO: {
    POSITIONING:
      "I design and ship durable software with founder-level ownership — from MVPs to enterprise scale.",
    STATS: [
      { label: "Requests handled", value: 100, suffix: "M+" },
      { label: "Products shipped", value: 12, suffix: "+" },
      { label: "Teams led", value: 4, suffix: "+" },
    ],
  },

  CASE_STUDIES: [
    {
      id: "odisai",
      title: "OdisAI",
      role: "Co-Founder & CTO",
      summary:
        "Voice AI that answers clinic phones, books appointments, and automates follow-ups.",
      highlights: [
        "Real-time voice pipeline with retrieval + scheduling",
        "Designed for 24/7 coverage and compliance",
        "Optimized for low-latency, high conversion",
      ],
      metrics: ["98% answer rate", "-43% missed calls", "<1.2s response"],
      stack: ["TypeScript", "Python", "Next.js", "FastAPI", "PostgreSQL"],
    },
    {
      id: "poppin",
      title: "Poppin",
      role: "CTO & Co-Founder",
      summary:
        "Social commerce product with creator monetization and audience engagement.",
      highlights: [
        "Shipped MVP in 3 months",
        "Built payments + creator payouts",
        "Launched on iOS with realtime social feeds",
      ],
      metrics: ["3 month MVP", "2-person core team", "iOS launch"],
      stack: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
    },
    {
      id: "stanford",
      title: "Stanford Health Care",
      role: "Solutions Architecture",
      summary:
        "Enterprise systems serving millions of patients at one of the top U.S. hospital systems.",
      highlights: [
        "Architecture for 100M+ request scale",
        "Security-first patterns across critical apps",
        "Led cross-team integration strategy",
      ],
      metrics: ["100M+ requests", "Enterprise scale", "Mission critical"],
      stack: ["Java", "Spring Boot", "Kubernetes", "Kafka", "AWS"],
    },
  ],

  SIGNALS: [
    "UC Davis PLASMA Accelerator",
    "NSF I-Corps Regional",
    "NECX Elev X Phase 2",
    "3x Founder",
    "Stanford Health Care",
  ],

  METHOD: [
    {
      title: "Align",
      description:
        "Pressure-test the problem, define success, and align incentives before a line of code.",
    },
    {
      title: "Architect",
      description:
        "Design resilient systems that scale from day one without overbuilding.",
    },
    {
      title: "Ship",
      description:
        "Move fast with production-grade quality, observability, and a tight feedback loop.",
    },
  ],

  EXPERIENCE: [
    {
      year: "2025",
      title: "OdisAI",
      role: "Co-Founder & CTO",
      summary: "Voice AI platform for clinical call handling.",
    },
    {
      year: "2024",
      title: "Stanford Health Care",
      role: "Solutions Architecture",
      summary: "Enterprise architecture for patient systems.",
    },
    {
      year: "2023",
      title: "Sprift",
      role: "CTO & Co-Founder",
      summary: "Social commerce platform and real-time shopping.",
    },
    {
      year: "2021",
      title: "Poppin",
      role: "CTO & Co-Founder",
      summary: "Creator commerce and monetization tools.",
    },
  ],
} as const;
