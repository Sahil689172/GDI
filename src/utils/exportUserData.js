export const buildExportPayload = ({
  profile,
  tasks,
  goals,
  focusHistory,
  calendarEvents,
}) => ({
  exportedAt: new Date().toISOString(),
  app: 'gotta-do-it',
  version: '1.0.0',
  profile,
  tasks,
  goals,
  focusSessions: focusHistory,
  calendarEvents,
});

export const downloadJson = (payload, filename = 'gdi-export.json') => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
