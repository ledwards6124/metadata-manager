// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC methods to the renderer process securely
contextBridge.exposeInMainWorld('electron', {
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),
});
