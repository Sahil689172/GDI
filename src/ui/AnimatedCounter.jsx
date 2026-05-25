import React, { useEffect, memo } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { SPRING } from '../animations/motion';

export const AnimatedCounter = memo(function AnimatedCounter({ value, className = '' }) {
  const reduced = useReducedMotion();
  const spring = useSpring(0, reduced ? { duration: 0 } : SPRING.counter);
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  if (reduced) {
    return <span className={className}>{value}</span>;
  }

  return <motion.span className={className}>{display}</motion.span>;
});
