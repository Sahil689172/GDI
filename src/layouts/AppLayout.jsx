import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlobalSearch } from '../components/GlobalSearch';
import { FloatingActionMenu } from '../components/FloatingActionMenu';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Topbar } from './Topbar';
import { PageTransition } from './PageTransition';
import { SandglassLoader } from '../ui/SandglassLoader';
import { useApp } from '../context/AppContext';
import { useIsMobileLayout } from '../hooks/useMediaQuery';

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
  const isMobile = useIsMobileLayout();

  const desktopPad = sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-64';

  return (
    <div className="mobile-app-shell min-h-[100dvh] w-full overflow-x-hidden text-foreground bg-background touch-manipulation">
      <AnimatedBackground />
      <GlobalSearch />
      <MobileDrawer />

      {!isMobile && <Sidebar />}
      <MobileNav />

      <div
        className={`mobile-main-column relative z-10 flex w-full min-w-0 min-h-[100dvh] flex-col ${desktopPad}`}
      >
        <Topbar />

        <main className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden overflow-y-auto scroll-smooth-touch">
          <div
            className={`w-full max-w-full mx-auto ${
              isMobile
                ? 'px-4 pt-2 pb-[calc(var(--mobile-nav-total)+var(--fab-clearance))]'
                : 'page-container px-4 md:px-8 pt-2 pb-8'
            }`}
          >
            <AnimatePresence mode="wait">
              <Suspense key={location.pathname} fallback={<RouteFallback />}>
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </Suspense>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <FloatingActionMenu />
    </div>
  );
};
