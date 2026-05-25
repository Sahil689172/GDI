import React from 'react';
import { ToggleSwitch } from './ToggleSwitch';

export const SettingsRow = ({
  label,
  description,
  children,
  toggleChecked,
  onToggleChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-foreground font-sans">{label}</p>
        {description && (
          <p className="text-[10px] text-muted font-sans mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      {onToggleChange ? (
        <ToggleSwitch checked={!!toggleChecked} onChange={onToggleChange} label={label} />
      ) : (
        <div className="shrink-0">{children}</div>
      )}
    </div>
  );
};
