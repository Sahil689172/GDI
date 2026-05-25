import { DURATION, EASE, SPRING } from './motion';

/* ——— Page & content ——— */
export const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.out },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: DURATION.fast, ease: EASE.out },
  },
};

export const pageVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.instant } },
  exit: { opacity: 0, transition: { duration: DURATION.instant } },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.05, delayChildren: 0.06 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.out },
  },
};

export const staggerItemReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.instant } },
};

/* ——— Overlays & modals ——— */
export const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.fast, ease: EASE.out } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE.out } },
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.97, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRING.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 8,
    transition: { duration: DURATION.fast, ease: EASE.out },
  },
};

export const sheetVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: SPRING.soft,
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { duration: DURATION.fast, ease: EASE.out },
  },
};

export const paletteVariants = {
  initial: { opacity: 0, scale: 0.98, y: 12 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRING.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    y: 8,
    transition: { duration: DURATION.fast, ease: EASE.out },
  },
};

/* ——— FAB menu ——— */
export const fabMenuVariants = {
  closed: { opacity: 0, transition: { duration: DURATION.fast } },
  open: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.03,
    },
  },
};

export const fabItemVariants = {
  closed: { opacity: 0, y: 10, scale: 0.96 },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: SPRING.snappy,
  },
};

export const fabTriggerVariants = {
  closed: { rotate: 0 },
  open: { rotate: 45, transition: SPRING.snappy },
};

/* ——— Cards & buttons ——— */
export const cardHoverLift = {
  y: -3,
  transition: SPRING.soft,
};

export const cardTap = {
  scale: 0.985,
  transition: { duration: DURATION.instant },
};

export const buttonTap = {
  scale: 0.97,
  transition: { duration: DURATION.instant },
};

export const buttonHover = {
  scale: 1.02,
  transition: SPRING.soft,
};

/* ——— Navigation ——— */
export const navIndicatorTransition = {
  type: 'spring',
  stiffness: 380,
  damping: 34,
  mass: 0.75,
};

/* ——— Loading ——— */
export const loadingExit = {
  opacity: 0,
  transition: { duration: DURATION.slow, ease: EASE.out },
};

export const loadingStep = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: DURATION.fast, ease: EASE.out },
};

/* ——— Scroll reveal ——— */
export const scrollReveal = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.normal, ease: EASE.out },
  },
};
