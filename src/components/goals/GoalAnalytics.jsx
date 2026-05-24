import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { GlassCard } from '../../ui/GlassCard';
import { TrendingUp, Activity } from 'lucide-react';

const chartStroke = 'var(--fg)';
const chartGrid = 'var(--border-color)';
const chartFill = 'var(--fg)';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="liquid-glass rounded-lg px-3 py-2 border border-border text-[10px] font-mono">
      <p className="text-muted mb-0.5">{label}</p>
      <p className="text-foreground font-bold">{payload[0].value}%</p>
    </div>
  );
};

export const GoalAnalytics = ({ weeklyTrend, goals }) => {
  const completionTrend = goals.slice(0, 5).map((g) => ({
    name: g.title.length > 12 ? `${g.title.slice(0, 12)}…` : g.title,
    progress: g.progress,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <GlassCard className="!p-4" hover={false}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-muted" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
              Weekly Consistency
            </h3>
          </div>
        </div>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="consistencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartFill} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={chartFill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: 'var(--muted)', fontSize: 9 }}
                axisLine={{ stroke: chartGrid }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--muted)', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="consistency"
                stroke={chartStroke}
                strokeWidth={1.5}
                fill="url(#consistencyGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="!p-4" hover={false}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-muted" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
              Goal Progress
            </h3>
          </div>
        </div>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completionTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--muted)', fontSize: 8 }}
                axisLine={{ stroke: chartGrid }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--muted)', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="progress" fill={chartFill} radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
