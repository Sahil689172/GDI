import React, { memo } from 'react';
import { SandglassLoader } from './SandglassLoader';

export const RouteLoader = memo(function RouteLoader({ label = 'Loading stream...' }) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[40vh] gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <SandglassLoader size="lg" />
      <p className="text-[10px] font-mono text-muted uppercase tracking-widest">{label}</p>
    </div>
  );
});
