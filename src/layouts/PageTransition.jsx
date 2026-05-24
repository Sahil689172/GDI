import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageVariants } from '../animations/pageTransitions';

export const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
