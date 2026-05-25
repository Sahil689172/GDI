import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProviders } from './providers/AppProviders';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouteLoader } from './ui/RouteLoader';
import { DURATION, EASE } from './animations/motion';

const LoadingScreen = lazy(() =>
  import('./components/LoadingScreen').then((m) => ({ default: m.LoadingScreen }))
);

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <Suspense fallback={<RouteLoader label="Starting..." />}>
            <LoadingScreen onFinished={() => setIsLoading(false)} />
          </Suspense>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.cinematic, ease: EASE.out }}
          className="min-h-screen"
        >
          <AppRoutes />
        </motion.div>
      )}
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary title="Application error">
      <BrowserRouter>
        <AppProviders>
          <AppContent />
        </AppProviders>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
