import React from 'react';
import { motion } from 'framer-motion';

const Pulse = ({ className = '' }) => (
  <div
    className={`rounded-xl bg-elevated animate-pulse border border-border ${className}`}
  />
);

export const AnalyticsSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Pulse key={i} className="h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Pulse className="h-52" />
        <Pulse className="h-52" />
      </div>
      <Pulse className="h-40" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Pulse className="h-48 lg:col-span-2" />
        <Pulse className="h-48" />
      </div>
    </motion.div>
  );
};
