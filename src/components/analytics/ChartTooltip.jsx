import React from 'react';

export const ChartTooltip = ({ active, payload, label, suffix = '', valueKey = 'value' }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value ?? payload[0].payload?.[valueKey];
  return (
    <div className="liquid-glass rounded-lg px-3 py-2 border border-border shadow-glass-glow">
      <p className="text-[10px] font-mono text-muted mb-0.5">{label}</p>
      <p className="text-sm font-mono font-bold text-foreground">
        {val}
        {suffix}
      </p>
    </div>
  );
};
