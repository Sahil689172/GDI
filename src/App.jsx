import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardProvider } from './context/DashboardContext';
import { TasksProvider } from './context/TasksContext';
import { GoalsProvider } from './context/GoalsContext';
import { CalendarProvider } from './context/CalendarContext';
import { FocusProvider } from './context/FocusContext';
import { ProfileProvider } from './context/ProfileContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingScreen } from './components/LoadingScreen';
import { AppRoutes } from './routes/AppRoutes';
import { DURATION, EASE } from './animations/motion';

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
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
    <BrowserRouter>
      <ThemeProvider>
      <AppProvider>
        <TasksProvider>
          <GoalsProvider>
          <CalendarProvider>
          <FocusProvider>
          <ProfileProvider>
          <DashboardProvider>
            <AppContent />
          </DashboardProvider>
          </ProfileProvider>
          </FocusProvider>
          </CalendarProvider>
          </GoalsProvider>
        </TasksProvider>
      </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
