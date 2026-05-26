import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAnalytics } from '../services/analyticsApi';
import { emptyAnalytics } from '../utils/analyticsEmpty';

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

    fetchAnalytics(period)
      .then((analytics) => {
        if (cancelled) return;
        setData({
          ...analytics,
          overview: {
            ...analytics.overview,
            streak: analytics.overview?.streak ?? user?.streak ?? 0,
          },
          focusAnalytics: {
            ...analytics.focusAnalytics,
            streak: analytics.focusAnalytics?.streak ?? user?.streak ?? 0,
          },
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
