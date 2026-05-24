import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const AnimatedCounter = ({ value, className = '' }) => {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={className}>{display}</motion.span>;
};
