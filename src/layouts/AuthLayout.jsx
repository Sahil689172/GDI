import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { DURATION, EASE } from '../animations/motion';

export const AuthLayout = () => (
  <div className="auth-shell min-h-screen min-h-[100dvh] flex flex-col bg-background text-foreground relative overflow-hidden">
    <div className="absolute inset-0 bg-tech-grid opacity-40 pointer-events-none" />
    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[min(600px,90vw)] h-[400px] rounded-full bg-orb-1 blur-[120px] pointer-events-none" />

    <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 pt-safe">
      <Link to="/login" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl border border-border bg-surface flex items-center justify-center shadow-glass-glow">
          <Zap className="w-4 h-4 text-foreground" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-muted group-hover:text-foreground transition-colors">
          Gotta-do-it
        </span>
      </Link>
      <ThemeToggle />
    </header>

    <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8 pb-safe">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.cinematic, ease: EASE.out }}
        className="w-full max-w-md"
      >
        <Outlet />
      </motion.div>
    </main>

    <footer className="relative z-10 py-4 text-center">
      <p className="text-[9px] font-mono text-subtle uppercase tracking-[0.2em]">
        Focus OS · Secure session
      </p>
    </footer>
  </div>
);
