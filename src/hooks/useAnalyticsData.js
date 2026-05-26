import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { emptyAnalytics } from '../utils/analyticsEmpty';
import {
  fetchDailyAnalytics,
  fetchWeeklyAnalytics,
  fetchMonthlyAnalytics,
} from '../services/analyticsApi';

export const useAnalyticsData = (period = 'weekly') => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [data, setData] = useState(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setData(emptyAnalytics);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetcher =
      period === 'daily'
        ? fetchDailyAnalytics
        : period === 'monthly'
          ? fetchMonthlyAnalytics
          : fetchWeeklyAnalytics;

    fetcher()
      .then((analytics) => {
        if (cancelled) return;
        setData({
          ...emptyAnalytics,
          ...analytics,
          overview: {
            ...emptyAnalytics.overview,
            ...analytics.overview,
            streak: analytics.overview?.streak ?? user?.streak ?? 0,
          },
          focusAnalytics: {
            ...emptyAnalytics.focusAnalytics,
            ...analytics.focusAnalytics,
            streak: analytics.focusAnalytics?.streak ?? user?.streak ?? 0,
          },
          taskInsights: {
            ...emptyAnalytics.taskInsights,
            ...analytics.taskInsights,
          },
          goals: analytics.goals ?? emptyAnalytics.goals,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.parsed?.message || 'Failed to load analytics');
        setData(emptyAnalytics);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [period, isAuthenticated, authLoading, user?.streak]);

  return { ...data, loading, error };
};
