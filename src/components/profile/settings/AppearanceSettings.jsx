import React from 'react';
import { Monitor, Sparkles } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useProfile } from '../../../context/ProfileContext';
import { ThemeToggle } from '../../ThemeToggle';
import { SettingsSection } from '../SettingsSection';
import { SettingsRow } from '../SettingsRow';

export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  const { appearance, updateSettings } = useProfile();

  return (
    <div className="space-y-3">
      <SettingsSection
        title="Theme"
        description="Dark or light interface"
        icon={Monitor}
        defaultOpen
      >
        <SettingsRow label="Color mode" description="Monochrome dark / light">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all ${
                theme === 'dark'
                  ? 'bg-foreground text-background border-border-strong'
                  : 'border-border text-muted'
              }`}
            >
              Dark
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase border transition-all ${
                theme === 'light'
                  ? 'bg-foreground text-background border-border-strong'
                  : 'border-border text-muted'
              }`}
            >
              Light
            </button>
            <ThemeToggle />
          </div>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Display" description="Layout and motion" icon={Sparkles}>
        <SettingsRow
          label="Compact layout"
          description="Tighter spacing across the app"
          toggleChecked={appearance.compactLayout}
          onToggleChange={(v) => updateSettings('appearance', 'compactLayout', v)}
        />
        <SettingsRow
          label="Ambient background"
          description="Subtle grid and orb animation"
          toggleChecked={appearance.ambientBackground}
          onToggleChange={(v) => updateSettings('appearance', 'ambientBackground', v)}
        />
        <SettingsRow
          label="Reduce motion"
          description="Minimize animations for accessibility"
          toggleChecked={appearance.reduceMotion}
          onToggleChange={(v) => updateSettings('appearance', 'reduceMotion', v)}
        />
      </SettingsSection>
    </div>
  );
};
