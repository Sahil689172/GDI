import React from 'react';
import { Bell, Volume2 } from 'lucide-react';
import { useProfile } from '../../../context/ProfileContext';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';

export const NotificationSettings = () => {
  const { notifications, updateSettings } = useProfile();

  return (
    <div className="space-y-3">
      <SettingsSection title="Alerts" description="What we notify you about" icon={Bell} defaultOpen>
        <SettingsRow
          label="Task reminders"
          description="Due dates and overdue tasks"
          toggleChecked={notifications.taskReminders}
          onToggleChange={(v) => updateSettings('notifications', 'taskReminders', v)}
        />
        <SettingsRow
          label="Focus session alerts"
          description="When a focus block ends"
          toggleChecked={notifications.focusAlerts}
          onToggleChange={(v) => updateSettings('notifications', 'focusAlerts', v)}
        />
        <SettingsRow
          label="Goal milestones"
          description="Progress checkpoints on goals"
          toggleChecked={notifications.goalMilestones}
          onToggleChange={(v) => updateSettings('notifications', 'goalMilestones', v)}
        />
        <SettingsRow
          label="Weekly digest"
          description="Summary email every Monday"
          toggleChecked={notifications.weeklyDigest}
          onToggleChange={(v) => updateSettings('notifications', 'weeklyDigest', v)}
        />
      </SettingsSection>

      <SettingsSection title="Sound" icon={Volume2}>
        <SettingsRow
          label="Session sounds"
          description="Chime on timer complete"
          toggleChecked={notifications.soundEnabled}
          onToggleChange={(v) => updateSettings('notifications', 'soundEnabled', v)}
        />
      </SettingsSection>
    </div>
  );
};
