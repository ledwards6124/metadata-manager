const { ipcMain } = require('electron');

function setupIPC(mainWindow) {
    ipcMain.once('page-rendered', () => {
        mainWindow.show();
    })
}

module.exports = { setupIPC };