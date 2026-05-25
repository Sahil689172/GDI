import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppearanceSettings } from './settings/AppearanceSettings';
import { NotificationSettings } from './settings/NotificationSettings';
import { ProductivitySettings } from './settings/ProductivitySettings';
import { CalendarSettings } from './settings/CalendarSettings';
import { PrivacySettings } from './settings/PrivacySettings';
import { AccountSettings } from './settings/AccountSettings';

const PANELS = {
  appearance: AppearanceSettings,
  notifications: NotificationSettings,
  productivity: ProductivitySettings,
  calendar: CalendarSettings,
  privacy: PrivacySettings,
  account: AccountSettings,
};

export const SettingsPanel = ({ activeTab }) => {
  const Panel = PANELS[activeTab] || AppearanceSettings;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <Panel />
      </motion.div>
    </AnimatePresence>
  );
};
