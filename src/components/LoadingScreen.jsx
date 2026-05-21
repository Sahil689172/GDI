import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  "Calibrating Focus Metrics...",
  "Structuring Productivity Dashboard...",
  "Synchronizing Flow Streaks...",
  "Powering Up Gotta-do-it...",
  "Welcome Sahil."
];

export const LoadingScreen = ({ onFinished }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState(0);

  // Cycle loading messages
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    // Smooth progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(stepInterval);
          setTimeout(() => {
            if (onFinished) onFinished();
          }, 600); // Small delay for fade transition
          return 100;
        }
        return prev + 1;
      });
    }, 45); // Takes about 4.5 seconds to load

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onFinished]);

  // Flip hourglass when progress reaches 33% and 66%
  useEffect(() => {
    if (progress === 33) {
      setRotation(180);
    } else if (progress === 66) {
      setRotation(360);
    }
  }, [progress]);

  // Hourglass SVG & Sand Animation Components
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-full bg-black z-50 flex flex-col items-center justify-center select-none"
    >
      {/* Background radial glow */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-[100px] pointer-events-none" />

      {/* Hourglass Container */}
      <div className="relative mb-10 flex flex-col items-center justify-center">
        {/* Hourglass Rotating Frame */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative w-28 h-28 flex items-center justify-center"
        >
          {/* Glass body reflections & structure */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-blue-950 fill-none stroke-current"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer glass boundary */}
            <path 
              d="M25,15 L75,15 C75,15 70,45 50,50 C30,45 25,15 25,15 Z" 
              className="stroke-blue-900/40 fill-black/40"
            />
            <path 
              d="M25,85 L75,85 C75,85 70,55 50,50 C30,55 25,85 25,85 Z" 
              className="stroke-blue-900/40 fill-black/40"
            />
            {/* Cap plates */}
            <line x1="20" y1="15" x2="80" y2="15" className="stroke-white" />
            <line x1="20" y1="85" x2="80" y2="85" className="stroke-white" />
            
            {/* Highlights */}
            <path d="M30,22 C32,25 35,32 40,36" className="stroke-blue-500/20" strokeWidth="1.5" />
            <path d="M70,78 C68,75 65,68 60,64" className="stroke-blue-500/20" strokeWidth="1.5" />
          </svg>

          {/* Core Sand Draining Effect */}
          {/* 1. Falling sand stream */}
          <div className="absolute top-[48px] bottom-[20px] left-[54px] w-[2px] overflow-hidden pointer-events-none z-10">
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="w-full h-8 bg-gradient-to-b from-white to-blue-500"
            />
          </div>

          {/* 2. Top Sand (Drains Downwards) */}
          <div className="absolute inset-0 flex justify-center items-start pt-[19px] z-0">
            <motion.div
              animate={{ 
                scaleY: [1, 0.6, 0.3, 0],
                transformOrigin: 'bottom'
              }}
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'
              }}
              key={`top-sand-${rotation}`}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-[42px] h-[31px] bg-gradient-to-b from-blue-900 to-white/70"
            />
          </div>

          {/* 3. Bottom Sand (Accumulates Upwards) */}
          <div className="absolute inset-0 flex justify-center items-end pb-[19px] z-0">
            <motion.div
              animate={{ 
                scaleY: [0, 0.4, 0.8, 1],
                transformOrigin: 'bottom'
              }}
              style={{
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
              }}
              key={`bottom-sand-${rotation}`}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-[42px] h-[31px] bg-gradient-to-t from-blue-950 to-white"
            />
          </div>

          {/* Dynamic Falling Sand Particles */}
          <div className="absolute inset-0 flex justify-center items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -15, opacity: 0 }}
                animate={{ y: 22, opacity: [0, 1, 1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: "linear"
                }}
                className="w-[2px] h-[2px] bg-white rounded-full"
              />
            ))}
          </div>
        </motion.div>
        
        {/* Soft blue glowing platform shadow */}
        <div className="w-16 h-[2px] bg-blue-500/20 rounded-full blur-[2px] mt-1 animate-pulse" />
      </div>

      {/* Brand Text Animation */}
      <div className="flex flex-col items-center">
        <motion.h1 
          initial={{ letterSpacing: "0.2em", opacity: 0 }}
          animate={{ letterSpacing: "0.08em", opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-2xl font-bold tracking-wider font-sans uppercase mb-1 text-white text-glow"
        >
          Gotta-do-it
        </motion.h1>
        <span className="text-[10px] font-mono tracking-widest text-blue-500 uppercase opacity-75">
          Focus Engine v1.0.0
        </span>
      </div>

      {/* Loading Steps & Micro progress bar */}
      <div className="absolute bottom-16 w-64 flex flex-col items-center justify-center">
        <div className="h-6 flex items-center justify-center mb-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 0.8 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-center tracking-wide text-white/70 font-sans"
            >
              {LOADING_STEPS[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Technical Minimal Progress Track */}
        <div className="relative w-full h-[2px] bg-blue-950/40 rounded-full overflow-hidden border border-blue-900/10">
          <motion.div
            style={{ width: `${progress}%` }}
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-900 via-white to-blue-500 shadow-blue-glow"
          />
        </div>
        
        <span className="text-[9px] font-mono text-blue-500 mt-2 opacity-60">
          {progress}% CALCULATED
        </span>
      </div>
    </motion.div>
  );
};
