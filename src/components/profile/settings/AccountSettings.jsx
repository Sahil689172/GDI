import React from 'react';
import { format } from 'date-fns';
import {
  UserCircle,
  Smartphone,
  Lock,
  Mail,
} from 'lucide-react';
import { useProfile } from '../../../context/ProfileContext';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';
import { GlassCard } from '../../../ui/GlassCard';

export const AccountSettings = () => {
  const {
    security,
    updateSettings,
    sessions,
    revokeSession,
    connectedAccounts,
    setConnectedAccount,
    triggerSave,
  } = useProfile();

  return (
    <div className="space-y-3">
      <SettingsSection title="Security" icon={Lock} defaultOpen>
        <SettingsRow
          label="Two-factor authentication"
          description="Extra layer on sign-in (demo)"
          toggleChecked={security.twoFactorEnabled}
          onToggleChange={(v) => updateSettings('security', 'twoFactorEnabled', v)}
        />
        <SettingsRow
          label="Login alerts"
          description="Notify on new device sign-in"
          toggleChecked={security.loginAlerts}
          onToggleChange={(v) => updateSettings('security', 'loginAlerts', v)}
        />
        <SettingsRow label="Session timeout">
          <select
            value={security.sessionTimeout}
            onChange={(e) =>
              updateSettings('security', 'sessionTimeout', Number(e.target.value))
            }
            className="input-field text-xs py-2 min-w-[100px]"
          >
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
            <option value={60}>1 hour</option>
          </select>
        </SettingsRow>
        <SettingsRow label="Password">
          <button
            type="button"
            onClick={() => triggerSave('Password change — demo only')}
            className="px-3 py-1.5 rounded-lg border border-border text-[10px] font-mono uppercase text-muted hover:text-foreground transition-colors"
          >
            Change
          </button>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Sessions" description="Active devices" icon={Smartphone}>
        <div className="space-y-2 py-1">
          {sessions.length === 0 ? (
            <p className="text-[10px] text-muted text-center py-6 font-sans">No sessions</p>
          ) : (
            sessions.map((s) => (
              <GlassCard key={s.id} className="!p-3" hover={false}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-foreground font-sans">
                      {s.device}
                      {s.current && (
                        <span className="ml-2 text-[9px] font-mono text-muted uppercase">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] font-mono text-muted mt-0.5">
                      {s.browser} · {format(new Date(s.lastActive), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  {!s.current && (
                    <button
                      type="button"
                      onClick={() => revokeSession(s.id)}
                      className="text-[9px] font-mono uppercase text-muted hover:text-foreground shrink-0"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </SettingsSection>

      <SettingsSection title="Connected accounts" icon={UserCircle}>
        <SettingsRow label="Google" description="Calendar & identity">
          <span className="text-[10px] font-mono text-muted uppercase">
            {connectedAccounts.google ? 'Linked' : 'Off'}
          </span>
        </SettingsRow>
        <SettingsRow label="GitHub" description="Sync repos (demo)">
          <button
            type="button"
            onClick={() => setConnectedAccount('github', !connectedAccounts.github)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all ${
              connectedAccounts.github
                ? 'bg-foreground text-background'
                : 'border-border text-muted'
            }`}
          >
            {connectedAccounts.github ? 'Connected' : 'Connect'}
          </button>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="App" icon={Mail}>
        <SettingsRow label="Account email" description="Read-only in demo">
          <span className="text-[10px] font-mono text-muted">operator@gottado.it</span>
        </SettingsRow>
        <div className="py-3">
          <button
            type="button"
            onClick={() => triggerSave('Sign out — demo only')}
            className="w-full py-2.5 rounded-xl border border-border text-xs text-muted hover:text-foreground font-sans transition-colors"
          >
            Sign out
          </button>
        </div>
      </SettingsSection>
    </div>
  );
};
