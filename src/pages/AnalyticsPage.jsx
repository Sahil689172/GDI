import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gauge,
  CheckSquare,
  Clock,
  Target,
} from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { useAnalyticsData } from '../hooks/useAnalyticsData';
import { PeriodFilter } from '../components/analytics/PeriodFilter';
import { MetricCard } from '../components/analytics/MetricCard';
import {
  ProductivityChartLazy,
  CompletionChartLazy,
  FocusTrendChartLazy,
} from '../components/analytics/AnalyticsChartsLazy';
import { ActivityHeatmap } from '../components/analytics/ActivityHeatmap';
import { InsightCards } from '../components/analytics/InsightCards';
import { FocusAnalyticsSection } from '../components/analytics/FocusAnalyticsSection';
import { GoalPerformanceSection } from '../components/analytics/GoalPerformanceSection';
import { TaskInsightsSection } from '../components/analytics/TaskInsightsSection';
import { AnalyticsSkeleton } from '../components/analytics/AnalyticsSkeleton';
import { AnalyticsEmptyState } from '../components/analytics/AnalyticsEmptyState';
import { staggerContainer } from '../animations/pageTransitions';

export const AnalyticsPage = () => {
  const [period, setPeriod] = useState('weekly');
  const data = useAnalyticsData(period);
  const { overview, loading, error, hasData } = data;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <PageHeader
        title="Diagnostic Insights"
        subtitle="Productivity intelligence from your tasks, focus, and goals."
        badge="Live metrics"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PeriodFilter value={period} onChange={setPeriod} />
        <p className="text-[10px] font-mono text-subtle uppercase tracking-widest">
          {loading ? 'Loading…' : `Synced · ${period} view`}
        </p>
      </div>

      {error && (
        <p className="mb-4 text-xs text-red-400/90 font-sans" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <AnalyticsSkeleton />
      ) : !hasData ? (
        <AnalyticsEmptyState />
      ) : (
        <motion.div
          key={period}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard
              label="Productivity Score"
              value={overview.productivityScore}
              suffix="%"
              icon={Gauge}
              glow={overview.productivityScore >= 70}
              delay={0}
            />
            <MetricCard
              label="Tasks Completed"
              value={overview.tasksCompleted}
              suffix={`/${overview.totalTasks}`}
              icon={CheckSquare}
              delay={0.05}
            />
            <MetricCard
              label="Focus Hours"
              value={overview.focusHours}
              suffix="h"
              icon={Clock}
              delay={0.1}
            />
            <MetricCard
              label="Goal Completion"
              value={overview.goalCompletionPct}
              suffix="%"
              icon={Target}
              glow={overview.goalCompletionPct >= 80}
              delay={0.15}
            />
          </div>

          <InsightCards insights={data.insights} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProductivityChartLazy data={data.dailyProductivity} />
            <CompletionChartLazy data={data.dailyCompletion} />
          </div>

          <FocusTrendChartLazy data={data.focusTrend} />

          <ActivityHeatmap cells={data.heatmap} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <FocusAnalyticsSection focus={data.focusAnalytics} />
            </div>
            <TaskInsightsSection insights={data.taskInsights} />
          </div>

          <GoalPerformanceSection goals={data.goals} />
        </motion.div>
      )}
    </motion.div>
  );
};
