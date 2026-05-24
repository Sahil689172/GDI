import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { Grid3X3 } from 'lucide-react';

const LEVEL_OPACITY = [0.08, 0.2, 0.4, 0.65, 0.95];
const DAY_LABELS = ['', 'M', '', 'W', '', 'F', ''];

export const ActivityHeatmap = ({ cells }) => {
  const weeks = 12;
  const byWeek = Array.from({ length: weeks }, () => []);

  cells.forEach((cell) => {
    if (byWeek[cell.week]) byWeek[cell.week][cell.day] = cell;
  });

  return (
    <GlassCard className="!p-4" hover={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-3.5 h-3.5 text-muted" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted font-sans">
            Activity Heatmap
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] font-mono text-subtle mr-1">Less</span>
          {LEVEL_OPACITY.map((op, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-sm border border-border"
              style={{ backgroundColor: `color-mix(in srgb, var(--fg) ${op * 100}%, transparent)` }}
            />
          ))}
          <span className="text-[8px] font-mono text-subtle ml-1">More</span>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="flex gap-[3px] min-w-max">
          <div className="flex flex-col gap-[3px] pt-0.5 pr-1">
            {DAY_LABELS.map((d, i) => (
              <span
                key={i}
                className="h-[11px] text-[8px] font-mono text-subtle leading-[11px]"
              >
                {d}
              </span>
            ))}
          </div>
          {byWeek.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, di) => {
                const cell = week[di];
                const level = cell?.level ?? 0;
                return (
                  <motion.div
                    key={`${wi}-${di}`}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.003 }}
                    title={cell?.date}
                    className="w-[11px] h-[11px] rounded-sm border border-border/50"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--fg) ${LEVEL_OPACITY[level] * 100}%, transparent)`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};
