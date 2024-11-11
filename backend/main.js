const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const nodeID3 = require('node-id3');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,  // Enable Node.js integration in the renderer process
    },
  });

  // Load your React app from the build folder (development server)
  mainWindow.loadURL('http://localhost:3000');  // Use for dev mode

  // For production build, use this instead:
  // mainWindow.loadFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.handle('read-id3', async (event, filePath) => {
  const id3Data = await nodeID3.read(filePath);
  return id3Data;
});

app.on('ready', createWindow);

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
