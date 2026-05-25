import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { GlassCard } from '../../ui/GlassCard';
import { ChartTooltip } from './ChartTooltip';
import { CHART, chartMargins, axisTick } from './chartTheme';
import { Activity } from 'lucide-react';

export const ProductivityChart = ({ data }) => {
  return (
    <GlassCard className="!p-4" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-3.5 h-3.5 text-muted" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
          Daily Productivity
        </h3>
      </div>
      <div className="chart-responsive w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={chartMargins}>
            <defs>
              <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART.fill} stopOpacity={0.18} />
                <stop offset="100%" stopColor={CHART.fill} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} opacity={0.4} vertical={false} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: CHART.grid }} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip content={<ChartTooltip suffix="%" valueKey="value" />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={CHART.stroke}
              strokeWidth={1.5}
              fill="url(#prodGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
