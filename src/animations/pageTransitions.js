/**
 * @deprecated Import from `./microinteractions` or `./index` for new code.
 * Re-exports kept for backward compatibility.
 */
export {
  pageVariants,
  pageVariantsReduced,
  staggerContainer,
  staggerItem,
  staggerItemReduced,
} from './microinteractions';

export const slideVariants = {
  initial: { opacity: 0, x: 16 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -12,
    transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
  },
};
