export const motionTokens = {
  ease: {
    enter: [0.16, 1, 0.3, 1] as const,
    standard: [0.22, 1, 0.36, 1] as const,
  },
  duration: {
    fast: 0.16,
    spring: 0.58,
  },
  blur: {
    subtle: 2,
    soft: 4,
  },
  spring: {
    snappy: {
      type: "spring" as const,
      stiffness: 520,
      damping: 38,
      mass: 0.7,
    },
    morph: {
      type: "spring" as const,
      stiffness: 380,
      damping: 34,
      mass: 0.8,
    },
  },
} as const;
