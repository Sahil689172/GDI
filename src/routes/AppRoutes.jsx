import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';

const HomePage = lazy(() =>
  import('../pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const TasksPage = lazy(() =>
  import('../pages/TasksPage').then((m) => ({ default: m.TasksPage }))
);
const GoalsPage = lazy(() =>
  import('../pages/GoalsPage').then((m) => ({ default: m.GoalsPage }))
);
const CalendarPage = lazy(() =>
  import('../pages/CalendarPage').then((m) => ({ default: m.CalendarPage }))
);
const AnalyticsPage = lazy(() =>
  import('../pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);
const FocusPage = lazy(() =>
  import('../pages/FocusPage').then((m) => ({ default: m.FocusPage }))
);
const ProfilePage = lazy(() =>
  import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);

export const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<HomePage />} />
      <Route path="tasks" element={<TasksPage />} />
      <Route path="goals" element={<GoalsPage />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="focus" element={<FocusPage />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
