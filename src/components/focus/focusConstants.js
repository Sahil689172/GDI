export const FOCUS_MODES = {
  pomodoro: { id: 'pomodoro', label: 'Pomodoro', sublabel: '25 / 5' },
  deep: { id: 'deep', label: 'Deep Work', sublabel: '90 min' },
  custom: { id: 'custom', label: 'Custom', sublabel: 'Set time' },
  longBreak: { id: 'longBreak', label: 'Long Break', sublabel: '15 min' },
};

export const PRESETS = {
  pomodoroWork: 25 * 60,
  pomodoroShort: 5 * 60,
  pomodoroLong: 15 * 60,
  deepWork: 90 * 60,
  longBreak: 15 * 60,
};

export const FOCUS_QUOTES = [
  { text: 'Depth is the superpower of the 21st century.', author: 'Cal Newport' },
  { text: 'The successful warrior is the average man, with laser-like focus.', author: 'Bruce Lee' },
  { text: 'Where focus goes, energy flows.', author: 'Tony Robbins' },
  { text: 'Concentrate all your thoughts upon the work at hand.', author: 'Alexander Graham Bell' },
  { text: 'One task at a time, one moment at a time.', author: 'Gotta-do-it' },
  { text: 'Silence the noise. Ship the work.', author: 'Gotta-do-it' },
  { text: 'Attention is the rarest and purest form of generosity.', author: 'Simone Weil' },
  { text: 'Do fewer things, better.', author: 'Gotta-do-it' },
];

export const formatFocusTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const formatDurationLabel = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};
