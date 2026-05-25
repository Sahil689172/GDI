import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { scrollReveal } from '../../animations/microinteractions';

export const ScrollReveal = ({
  children,
  className = '',
  delay = 0,
  as: Component = motion.div,
  ...props
}) => {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const MotionComp = Component;

  return (
    <MotionComp
      variants={scrollReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-48px 0px -48px 0px', amount: 0.12 }}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionComp>
  );
};
