import React, { useMemo } from 'react';
import { Flame, CheckCircle2, Clock, Target, Zap } from 'lucide-react';
import { useTasks } from '../../context/TasksContext';
import { useGoals } from '../../context/GoalsContext';
import { useFocus } from '../../context/FocusContext';
import { ProfileStatCard } from './ProfileStatCard';

export const ProfileDashboard = () => {
  const { stats: taskStats } = useTasks();
  const { stats: goalStats } = useGoals();
  const { analytics } = useFocus();

  const streak = goalStats.maxStreak || 0;
  const productivity = taskStats.productivity;

  const stats = useMemo(
    () => [
      { label: 'Streak', value: streak, suffix: 'd', icon: Flame },
      { label: 'Tasks Done', value: taskStats.completed, suffix: '', icon: CheckCircle2 },
      { label: 'Focus Hours', value: analytics.totalHours, suffix: 'h', icon: Clock },
      { label: 'Active Goals', value: goalStats.active, suffix: '', icon: Target },
      { label: 'Productivity', value: productivity, suffix: '%', icon: Zap },
    ],
    [streak, taskStats, analytics, goalStats, productivity]
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 min-w-0">
      {stats.map((s, i) => (
        <ProfileStatCard key={s.label} {...s} delay={i * 0.05} />
      ))}
    </div>
  );
};
