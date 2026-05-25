import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardProvider } from './context/DashboardContext';
import { TasksProvider } from './context/TasksContext';
import { GoalsProvider } from './context/GoalsContext';
import { CalendarProvider } from './context/CalendarContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoadingScreen } from './components/LoadingScreen';
import { AppRoutes } from './routes/AppRoutes';

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
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
          <DashboardProvider>
            <AppContent />
          </DashboardProvider>
          </CalendarProvider>
          </GoalsProvider>
        </TasksProvider>
      </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
