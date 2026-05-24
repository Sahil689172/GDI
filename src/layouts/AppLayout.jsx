import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlobalSearch } from '../components/GlobalSearch';
import { FloatingActionMenu } from '../components/FloatingActionMenu';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Topbar } from './Topbar';
import { PageTransition } from './PageTransition';
import { SandglassLoader } from '../ui/SandglassLoader';
import { useApp } from '../context/AppContext';

const RouteFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
    <SandglassLoader size="lg" />
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-[10px] font-mono text-muted uppercase tracking-widest"
    >
      Loading stream...
    </motion.p>
  </div>
);

export const AppLayout = () => {
  const { sidebarCollapsed } = useApp();
  const location = useLocation();

  const mainPadding = sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-64';

  return (
    <div className="min-h-screen relative w-full overflow-x-hidden text-foreground bg-surface">
      <AnimatedBackground />
      <GlobalSearch />

      <div className={`relative z-10 flex w-full min-h-screen ${mainPadding} transition-[padding] duration-300`}>
        <Sidebar />
        <MobileNav />

        <div className="flex-1 flex flex-col min-h-screen w-full min-w-0">
          <Topbar />

          <main className="flex-1 px-4 md:px-8 pb-28 md:pb-8 overflow-y-auto select-none">
            <AnimatePresence mode="wait">
              <Suspense key={location.pathname} fallback={<RouteFallback />}>
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </Suspense>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <FloatingActionMenu />
    </div>
  );
};
