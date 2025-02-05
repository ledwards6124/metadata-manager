const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { setupIPC } = require('./ipcHandles');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional: Preload script
      nodeIntegration: false, // Disable Node.js in the renderer process for security
      contextIsolation: true, // Enable context isolation for security
      nativeWindowOpen: false
    },
  });

  // Load the React app
  mainWindow.loadURL('http://localhost:3000');

  setupIPC(mainWindow);

  // Open the DevTools (optional, for development)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});