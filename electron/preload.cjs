const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('gdiDesktop', {
  notify: (payload) => ipcRenderer.invoke('desktop:notify', payload),
  platform: process.platform,
});

