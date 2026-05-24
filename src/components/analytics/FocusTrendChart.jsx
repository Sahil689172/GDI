import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { GlassCard } from '../../ui/GlassCard';
import { ChartTooltip } from './ChartTooltip';
import { CHART, chartMargins, axisTick } from './chartTheme';
import { Clock } from 'lucide-react';

export const FocusTrendChart = ({ data }) => {
  return (
    <GlassCard className="!p-4" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-3.5 h-3.5 text-muted" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
          Focus Hours Trend
        </h3>
      </div>
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={chartMargins}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} opacity={0.4} vertical={false} />
            <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: CHART.grid }} tickLine={false} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip suffix="h" valueKey="hours" />} />
            <Line
              type="monotone"
              dataKey="hours"
              stroke={CHART.stroke}
              strokeWidth={1.5}
              dot={{ fill: CHART.fill, r: 2, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: CHART.fill }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
