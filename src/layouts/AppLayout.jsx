import React, { Suspense, lazy, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Topbar } from './Topbar';
import { PageTransition } from './PageTransition';
import { MobileDrawer } from '../components/layout/MobileDrawer';
import { RouteLoader } from '../ui/RouteLoader';
import { useApp } from '../context/AppContext';
import { useIsMobileLayout } from '../hooks/useMediaQuery';

const AnimatedBackground = lazy(() =>
  import('../components/AnimatedBackground').then((m) => ({ default: m.AnimatedBackground }))
);
const CommandPalette = lazy(() =>
  import('../components/command/CommandPalette').then((m) => ({ default: m.CommandPalette }))
);
const FloatingActionMenu = lazy(() =>
  import('../components/FloatingActionMenu').then((m) => ({ default: m.FloatingActionMenu }))
);
const NotificationCenter = lazy(() =>
  import('../components/notifications/NotificationCenter').then((m) => ({
    default: m.NotificationCenter,
  }))
);
const OfflineBanner = lazy(() =>
  import('../components/sync/OfflineBanner').then((m) => ({ default: m.OfflineBanner }))
);
const SyncToast = lazy(() =>
  import('../components/sync/SyncToast').then((m) => ({ default: m.SyncToast }))
);

const DeferredChrome = memo(function DeferredChrome() {
  return (
    <>
      <Suspense fallback={null}>
        <AnimatedBackground />
      </Suspense>
      <Suspense fallback={null}>
        <CommandPalette />
      </Suspense>
      <Suspense fallback={null}>
        <FloatingActionMenu />
      </Suspense>
      <Suspense fallback={null}>
        <NotificationCenter />
      </Suspense>
      <Suspense fallback={null}>
        <SyncToast />
      </Suspense>
    </>
  );
});

export const AppLayout = memo(function AppLayout() {
  const { sidebarCollapsed } = useApp();
  const location = useLocation();
  const isMobile = useIsMobileLayout();

  const desktopPad = sidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-64';

  return (
    <div className="mobile-app-shell text-foreground bg-background">
      <DeferredChrome />
      <MobileDrawer />

      {!isMobile && <Sidebar />}
      <MobileNav />

      <div
        className={`mobile-main-column relative z-10 flex w-full min-w-0 flex-col ${desktopPad}`}
      >
        <Suspense fallback={null}>
          <OfflineBanner />
        </Suspense>
        <Topbar />

        <main id="main-content" className="w-full min-w-0 max-w-full" tabIndex={-1}>
          <div
            className={`w-full max-w-full mx-auto ${
              isMobile
                ? 'px-4 pt-2 pb-[calc(var(--mobile-nav-total)+var(--fab-clearance))]'
                : 'page-container px-4 md:px-8 pt-2 pb-8'
            }`}
          >
            <AnimatePresence mode="wait">
              <Suspense fallback={<RouteLoader />}>
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </Suspense>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
});
