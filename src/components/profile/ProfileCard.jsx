import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Pencil, Check, X } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { useProfile } from '../../context/ProfileContext';

export const ProfileCard = () => {
  const { profile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    if (!editing) setDraft(profile);
  }, [profile, editing]);

  const initials = (profile.name || profile.email || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const save = () => {
    updateProfile(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  return (
    <GlassCard className="!p-5 md:!p-6" glow>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <motion.div
          layout
          className="w-20 h-20 rounded-2xl bg-elevated border border-border-strong flex items-center justify-center shadow-glass-glow shrink-0"
        >
          <span className="text-2xl font-bold font-mono text-foreground text-glow">{initials}</span>
        </motion.div>

        <div className="flex-1 w-full text-center sm:text-left">
          {editing ? (
            <div className="space-y-3">
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full input-field text-sm font-sans"
                placeholder="Name"
              />
              <input
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                className="w-full input-field text-xs font-mono"
                placeholder="Email"
              />
              <input
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                className="w-full input-field text-xs"
                placeholder="Role"
              />
              <textarea
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                rows={2}
                className="w-full input-field text-xs resize-none font-sans"
                placeholder="Bio"
              />
              <div className="flex gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={save}
                  className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-medium flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  className="px-4 py-2 rounded-xl border border-border text-xs text-muted hover:text-foreground flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-foreground font-sans">{profile.name}</h2>
              <p className="text-[10px] font-mono text-muted mt-0.5">{profile.email}</p>
              <p className="text-[10px] font-mono text-subtle uppercase tracking-wider mt-1">
                {profile.role}
              </p>
              {profile.bio && (
                <p className="text-xs text-muted font-sans mt-3 max-w-md leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </>
          )}
        </div>

        {!editing && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditing(true)}
            className="shrink-0 p-2.5 rounded-xl border border-border text-muted hover:text-foreground hover:border-border-strong transition-all"
            aria-label="Edit profile"
          >
            <Pencil className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border">
        <User className="w-3.5 h-3.5 text-muted" />
        <span className="text-[9px] font-mono text-subtle uppercase tracking-wider">
          Operator ID · GDID-{profile.name.slice(0, 2).toUpperCase()}
          {String(Date.now()).slice(-4)}
        </span>
      </div>
    </GlassCard>
  );
};
