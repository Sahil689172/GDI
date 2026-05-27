import { app, BrowserWindow, ipcMain, nativeImage, Notification, Tray, Menu } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

let mainWindow = null;
let tray = null;

const iconPath = path.join(__dirname, 'assets', 'icon.png');

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 780,
    minWidth: 980,
    minHeight: 640,
    backgroundColor: '#000000',
    show: false,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow?.show());

  if (isDev) {
    const url = process.env.VITE_DEV_SERVER_URL || 'http://localhost:3000';
    await mainWindow.loadURL(url);
    if (process.env.GDI_OPEN_DEVTOOLS === '1') {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  } else {
    const indexHtml = path.join(app.getAppPath(), 'dist', 'index.html');
    await mainWindow.loadFile(indexHtml);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const createTrayFoundation = () => {
  try {
    const img = nativeImage.createFromPath(iconPath);
    tray = new Tray(img);
    const menu = Menu.buildFromTemplate([
      { label: 'Show', click: () => mainWindow?.show() },
      { label: 'Hide', click: () => mainWindow?.hide() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() },
    ]);
    tray.setToolTip('Gotta-do-it');
    tray.setContextMenu(menu);
    tray.on('double-click', () => mainWindow?.show());
  } catch {
    // Tray is optional foundation.
  }
};

app.whenReady().then(async () => {
  await createWindow();
  createTrayFoundation();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('desktop:notify', async (_evt, payload) => {
  const title = payload?.title || 'Gotta-do-it';
  const body = payload?.body || '';
  if (!Notification.isSupported()) return { ok: false, reason: 'not_supported' };
  new Notification({ title, body }).show();
  return { ok: true };
});

