import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { PageHeader } from '../ui/PageHeader';
import { staggerContainer, staggerItem } from '../animations/pageTransitions';
import { ProfileCard } from '../components/profile/ProfileCard';
import { ProfileDashboard } from '../components/profile/ProfileDashboard';
import { SettingsTabs } from '../components/profile/SettingsTabs';
import { SettingsPanel } from '../components/profile/SettingsPanel';
import { SaveToast } from '../components/profile/SaveToast';

export const ProfilePage = () => {
  const { saveToast } = useProfile();
  const [activeTab, setActiveTab] = useState('appearance');
  const [view, setView] = useState('overview');

  return (
    <>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        <PageHeader
          title="Profile"
          subtitle="Your productivity identity, preferences, and account controls."
          badge="Operator"
        />

        <motion.div variants={staggerItem} className="flex gap-2 mb-6">
          {[
            { id: 'overview', label: 'Dashboard' },
            { id: 'settings', label: 'Settings' },
          ].map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider border transition-all ${
                view === v.id
                  ? 'bg-elevated border-border-strong text-foreground shadow-glass-glow'
                  : 'border-border text-muted hover:text-foreground'
              }`}
            >
              {v.label}
            </button>
          ))}
        </motion.div>

        {view === 'overview' ? (
          <div className="space-y-6 max-w-5xl">
            <motion.div variants={staggerItem}>
              <ProfileCard />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ProfileDashboard />
            </motion.div>
            <motion.div variants={staggerItem}>
              <button
                type="button"
                onClick={() => {
                  setView('settings');
                  setActiveTab('appearance');
                }}
                className="text-[10px] font-mono text-muted uppercase tracking-wider hover:text-foreground transition-colors"
              >
                Open settings →
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(0,1.2fr)] gap-6 max-w-5xl">
            <motion.div variants={staggerItem} className="lg:sticky lg:top-24 lg:self-start">
              <SettingsTabs active={activeTab} onChange={setActiveTab} />
            </motion.div>
            <motion.div variants={staggerItem} className="min-w-0">
              <SettingsPanel activeTab={activeTab} />
            </motion.div>
          </div>
        )}
      </motion.div>

      <SaveToast message={saveToast} />
    </>
  );
};
