import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Unlink, Calendar, Check } from 'lucide-react';
import { useCalendar } from '../../context/CalendarContext';

export const GoogleCalendarSync = ({ open, onClose }) => {
  const { googleConnected, setGoogleConnected } = useCalendar();

  const handleToggle = () => {
    setGoogleConnected(!googleConnected);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-overlay backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-sm liquid-glass rounded-2xl border border-border shadow-glass-glow p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg text-subtle hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-elevated border border-border flex items-center justify-center">
                <Calendar className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground font-sans">
                  Google Calendar
                </h2>
                <p className="text-[10px] text-muted font-sans mt-0.5">
                  Sync UI preview — OAuth not configured
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                'Two-way event sync',
                'Import existing calendars',
                'Push GDI deadlines',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs text-muted">
                  <Check className="w-3.5 h-3.5 text-foreground shrink-0" />
                  <span className="font-sans">{item}</span>
                </div>
              ))}
            </div>

            <div
              className={`p-4 rounded-xl border mb-5 ${
                googleConnected
                  ? 'bg-elevated border-border-strong'
                  : 'bg-surface border-border'
              }`}
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">
                Status
              </p>
              <p className="text-xs font-medium text-foreground font-sans">
                {googleConnected ? 'Connected (demo)' : 'Not connected'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
            >
              {googleConnected ? (
                <>
                  <Unlink className="w-4 h-4" />
                  Disconnect
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Connect Google Calendar
                </>
              )}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
