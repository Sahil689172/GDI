import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { RouteLoader } from '../ui/RouteLoader';
import { lazyRoute } from '../utils/lazyRoute';

const HomePage = lazyRoute(
  () => import('../pages/HomePage').then((m) => ({ default: m.HomePage })),
  'HomePage'
);
const TasksPage = lazyRoute(
  () => import('../pages/TasksPage').then((m) => ({ default: m.TasksPage })),
  'TasksPage'
);
const GoalsPage = lazyRoute(
  () => import('../pages/GoalsPage').then((m) => ({ default: m.GoalsPage })),
  'GoalsPage'
);
const CalendarPage = lazyRoute(
  () => import('../pages/CalendarPage').then((m) => ({ default: m.CalendarPage })),
  'CalendarPage'
);
const AnalyticsPage = lazyRoute(
  () => import('../pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })),
  'AnalyticsPage'
);
const FocusPage = lazyRoute(
  () => import('../pages/FocusPage').then((m) => ({ default: m.FocusPage })),
  'FocusPage'
);
const ProfilePage = lazyRoute(
  () => import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
  'ProfilePage'
);

const RouteBoundary = ({ children, name }) => (
  <ErrorBoundary title={`Could not load ${name}`}>{children}</ErrorBoundary>
);

export const AppRoutes = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route
        index
        element={
          <RouteBoundary name="Home">
            <Suspense fallback={<RouteLoader />}>
              <HomePage />
            </Suspense>
          </RouteBoundary>
        }
      />
      <Route
        path="tasks"
        element={
          <RouteBoundary name="Tasks">
            <Suspense fallback={<RouteLoader />}>
              <TasksPage />
            </Suspense>
          </RouteBoundary>
        }
      />
      <Route
        path="goals"
        element={
          <RouteBoundary name="Goals">
            <Suspense fallback={<RouteLoader />}>
              <GoalsPage />
            </Suspense>
          </RouteBoundary>
        }
      />
      <Route
        path="calendar"
        element={
          <RouteBoundary name="Calendar">
            <Suspense fallback={<RouteLoader />}>
              <CalendarPage />
            </Suspense>
          </RouteBoundary>
        }
      />
      <Route
        path="analytics"
        element={
          <RouteBoundary name="Analytics">
            <Suspense fallback={<RouteLoader />}>
              <AnalyticsPage />
            </Suspense>
          </RouteBoundary>
        }
      />
      <Route
        path="focus"
        element={
          <RouteBoundary name="Focus">
            <Suspense fallback={<RouteLoader />}>
              <FocusPage />
            </Suspense>
          </RouteBoundary>
        }
      />
      <Route
        path="profile"
        element={
          <RouteBoundary name="Profile">
            <Suspense fallback={<RouteLoader />}>
              <ProfilePage />
            </Suspense>
          </RouteBoundary>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
