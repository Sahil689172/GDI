/** Premium motion tokens — cinematic, subtle, performance-first */

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.45, 0, 0.2, 1],
  linear: 'linear',
};

export const DURATION = {
  instant: 0.12,
  fast: 0.22,
  normal: 0.38,
  slow: 0.55,
  cinematic: 0.72,
};

export const SPRING = {
  soft: { type: 'spring', stiffness: 300, damping: 32, mass: 0.8 },
  snappy: { type: 'spring', stiffness: 400, damping: 30, mass: 0.75 },
  gentle: { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 },
  counter: { type: 'spring', stiffness: 90, damping: 22, mass: 0.6 },
};

/** Merge config when user prefers reduced motion */
export const motionConfig = (reduced, config) =>
  reduced ? { duration: DURATION.instant } : config;

export const tween = (reduced, duration = DURATION.normal, ease = EASE.out) =>
  motionConfig(reduced, { duration, ease });
