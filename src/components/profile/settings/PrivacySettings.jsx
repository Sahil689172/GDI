import React from 'react';
import { Shield, Download } from 'lucide-react';
import { useProfile } from '../../../context/ProfileContext';
import { useTasks } from '../../../context/TasksContext';
import { useGoals } from '../../../context/GoalsContext';
import { useFocus } from '../../../context/FocusContext';
import { useCalendar } from '../../../context/CalendarContext';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { buildExportPayload, downloadJson } from '../../../utils/exportUserData';

export const PrivacySettings = () => {
  const { profile, privacy, updateSettings, triggerSave } = useProfile();
  const { workspaces } = useTasks();
  const { goals } = useGoals();
  const { history } = useFocus();
  const { events } = useCalendar();

  const handleExport = () => {
    const payload = buildExportPayload({
      profile,
      tasks: workspaces,
      goals,
      focusHistory: history,
      calendarEvents: events,
    });
    downloadJson(payload);
    triggerSave('Export downloaded');
  };

  return (
    <div className="space-y-3">
      <SettingsSection title="Privacy" icon={Shield} defaultOpen>
        <SettingsRow
          label="Local analytics"
          description="Improve insights on-device only"
          toggleChecked={privacy.localAnalytics}
          onToggleChange={(v) => updateSettings('privacy', 'localAnalytics', v)}
        />
        <SettingsRow
          label="Share progress"
          description="Public profile (future)"
          toggleChecked={privacy.shareProgress}
          onToggleChange={(v) => updateSettings('privacy', 'shareProgress', v)}
        />
        <SettingsRow label="History retention">
          <select
            value={privacy.retainHistoryDays}
            onChange={(e) =>
              updateSettings('privacy', 'retainHistoryDays', Number(e.target.value))
            }
            className="input-field text-xs py-2 min-w-[100px]"
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={365}>1 year</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Data export" description="Download your data" icon={Download}>
        <div className="py-3">
          <p className="text-[10px] text-muted font-sans mb-4 leading-relaxed">
            Export tasks, goals, focus sessions, and calendar events as JSON. Stored locally in
            your browser.
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="w-full py-3 rounded-xl border border-border-strong bg-elevated text-xs font-mono uppercase tracking-wider text-foreground hover:shadow-glass-glow transition-all"
          >
            Export all data
          </button>
        </div>
      </SettingsSection>
    </div>
  );
};
