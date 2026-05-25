import React, { memo } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { TasksProvider } from '../context/TasksContext';
import { GoalsProvider } from '../context/GoalsContext';
import { CalendarProvider } from '../context/CalendarContext';
import { FocusProvider } from '../context/FocusContext';
import { ProfileProvider } from '../context/ProfileContext';
import { DashboardProvider } from '../context/DashboardContext';

const ProviderTree = memo(function ProviderTree({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
      <AppProvider>
        <TasksProvider>
          <GoalsProvider>
            <CalendarProvider>
              <FocusProvider>
                <ProfileProvider>
                  <DashboardProvider>{children}</DashboardProvider>
                </ProfileProvider>
              </FocusProvider>
            </CalendarProvider>
          </GoalsProvider>
        </TasksProvider>
      </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
});

export const AppProviders = ({ children }) => <ProviderTree>{children}</ProviderTree>;
