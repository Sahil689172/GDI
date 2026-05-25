import React from 'react';
import { Sliders } from 'lucide-react';
import { useProfile } from '../../../context/ProfileContext';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { FOCUS_MODES } from '../../focus/focusConstants';

export const ProductivitySettings = () => {
  const { productivity, updateSettings } = useProfile();

  return (
    <div className="space-y-3">
      <SettingsSection title="Defaults" description="How you work" icon={Sliders} defaultOpen>
        <SettingsRow label="Default focus mode" description="Quick-start preference">
          <select
            value={productivity.defaultFocusMode}
            onChange={(e) => updateSettings('productivity', 'defaultFocusMode', e.target.value)}
            className="input-field text-xs py-2 min-w-[120px]"
          >
            {Object.values(FOCUS_MODES).map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </SettingsRow>
        <SettingsRow label="Default task priority">
          <select
            value={productivity.defaultTaskPriority}
            onChange={(e) => updateSettings('productivity', 'defaultTaskPriority', e.target.value)}
            className="input-field text-xs py-2 min-w-[100px]"
          >
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </SettingsRow>
        <SettingsRow
          label="Auto-start breaks"
          description="Begin pomodoro break after focus"
          toggleChecked={productivity.autoStartBreaks}
          onToggleChange={(v) => updateSettings('productivity', 'autoStartBreaks', v)}
        />
        <SettingsRow
          label="Focus quotes"
          description="Show quotes on focus page"
          toggleChecked={productivity.showFocusQuotes}
          onToggleChange={(v) => updateSettings('productivity', 'showFocusQuotes', v)}
        />
        <SettingsRow
          label="Week starts Monday"
          toggleChecked={productivity.weekStartsMonday}
          onToggleChange={(v) => updateSettings('productivity', 'weekStartsMonday', v)}
        />
      </SettingsSection>
    </div>
  );
};
