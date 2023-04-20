const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1447,
        height: 700,
        minWidth: 1447,
        minHeight: 744,
        frame: false,
        center: true,
        icon: 'build/icons/512x512.png',
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
        }
    });
    app.requestSingleInstanceLock();
    win.loadFile('web/main.html');
    // win.webContents.openDevTools();
    win.removeMenu();

    ipcMain.on("close", (event, data) => {
      app.quit();
    });
    ipcMain.on("minimize", (event, data) => {
      win.minimize()
    });
}

 app.whenReady().then(createWindow);
