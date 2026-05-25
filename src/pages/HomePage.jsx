import React from 'react';
import { Dashboard } from '../components/Dashboard';
import { DashboardMobile } from '../components/dashboard/DashboardMobile';
import { useIsMobileLayout } from '../hooks/useMediaQuery';

export const HomePage = () => {
  const isMobile = useIsMobileLayout();
  return isMobile ? <DashboardMobile /> : <Dashboard />;
};
