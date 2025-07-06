const { app, BrowserWindow, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    alwaysOnTop: true,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // opsional, kosong juga gak apa
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false,
      media: true,
    }
  });

  win.loadFile('index.html');
}

// Izinkan akses media (kamera)
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === 'media') {
      callback(true); // izinkan kamera
    } else {
      callback(false);
    }
  });

  createWindow();
});

// MacOS safe exit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
