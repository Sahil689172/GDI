import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { Sparkles, AlertCircle, TrendingUp } from 'lucide-react';

const ICONS = {
  positive: TrendingUp,
  neutral: Sparkles,
  alert: AlertCircle,
};

export const InsightCards = ({ insights }) => {
  if (!insights?.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {insights.map((item, i) => {
        const Icon = ICONS[item.type] || Sparkles;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
          >
            <GlassCard className="!p-4" hover>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-elevated border border-border flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-foreground font-sans mb-1">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-muted font-sans leading-relaxed">{item.body}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
};
