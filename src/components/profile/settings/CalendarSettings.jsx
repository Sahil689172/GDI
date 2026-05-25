import React from 'react';
import { Calendar, Link2 } from 'lucide-react';
import { useProfile } from '../../../context/ProfileContext';
import { useCalendar } from '../../../context/CalendarContext';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';

export const CalendarSettings = () => {
  const { calendar, updateSettings, setConnectedAccount, connectedAccounts } = useProfile();
  const { googleConnected, setGoogleConnected } = useCalendar();

  const handleGoogleToggle = (v) => {
    setGoogleConnected(v);
    updateSettings('calendar', 'googleSyncEnabled', v);
    setConnectedAccount('google', v);
  };

  return (
    <div className="space-y-3">
      <SettingsSection title="Sync" description="External calendars" icon={Calendar} defaultOpen>
        <SettingsRow
          label="Google Calendar"
          description="Two-way sync (demo UI)"
          toggleChecked={googleConnected || calendar.googleSyncEnabled}
          onToggleChange={handleGoogleToggle}
        />
        <SettingsRow
          label="Sync assignments"
          description="Push task deadlines to calendar"
          toggleChecked={calendar.syncAssignments}
          onToggleChange={(v) => updateSettings('calendar', 'syncAssignments', v)}
        />
        <SettingsRow
          label="Sync focus blocks"
          description="Log focus sessions as events"
          toggleChecked={calendar.syncFocusBlocks}
          onToggleChange={(v) => updateSettings('calendar', 'syncFocusBlocks', v)}
        />
        <SettingsRow label="Reminder lead time">
          <select
            value={calendar.reminderLeadMinutes}
            onChange={(e) =>
              updateSettings('calendar', 'reminderLeadMinutes', Number(e.target.value))
            }
            className="input-field text-xs py-2 min-w-[100px]"
          >
            <option value={5}>5 min</option>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>1 hour</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Connected" icon={Link2}>
        <div className="py-3 space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface">
            <span className="text-xs font-sans text-foreground">Google</span>
            <span className="text-[10px] font-mono text-muted uppercase">
              {googleConnected ? 'Connected' : 'Not linked'}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-surface opacity-60">
            <span className="text-xs font-sans text-muted">GitHub</span>
            <span className="text-[10px] font-mono text-subtle">Coming soon</span>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
};
