import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { GlassCard } from '../../ui/GlassCard';
import { ChartTooltip } from './ChartTooltip';
import { CHART, chartMargins, axisTick } from './chartTheme';
import { CheckSquare } from 'lucide-react';

export const CompletionChart = ({ data }) => {
  return (
    <GlassCard className="!p-4" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare className="w-3.5 h-3.5 text-muted" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
          Task Completions
        </h3>
      </div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={chartMargins}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} opacity={0.4} vertical={false} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: CHART.grid }} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip valueKey="completed" />} />
            <Bar dataKey="completed" fill={CHART.fill} radius={[4, 4, 0, 0]} opacity={0.88} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
