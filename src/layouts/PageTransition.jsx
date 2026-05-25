import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { pageVariants, pageVariantsReduced } from '../animations/microinteractions';

export const PageTransition = memo(function PageTransition({ children }) {
  const location = useLocation();
  const reduced = useReducedMotion();
  const variants = reduced ? pageVariantsReduced : pageVariants;

  return (
    <motion.div
      key={location.pathname}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full ${reduced ? '' : 'gpu-promote'}`}
    >
      {children}
    </motion.div>
  );
});
