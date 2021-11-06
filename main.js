const { app, BrowserWindow } = require('electron');
const path                   = require('path');

function createWindow() {

    const win = new BrowserWindow({
        show: false,
        width: 640,
        height: 360,
        // icon: null,
        icon: 'public_html/icon.png',
        // thickFrame: false,
        // fullscreen: true,
        // simpleFullscreen: true,
        // titleBarStyle: 'hidden',
        // titleBarOverlay: true,
        // titleBarOverlay: {
        //     color: '#f00',
        //     symbolColor: '#00f',
        // },
        // frame: false,
        // transparent: true,
        // backgroundColor: '#f09',
        // webPreferences: {
        //     preload: path.join( __dirname, 'preload.js' ),
        // },
    });

    // win.setIcon('public_html/icon.png');

    win.removeMenu();

    win.loadFile('public_html/index.html');

    // win.webContents.openDevTools();

    win.once( 'ready-to-show', () => {
        win.show();
    });
}

// electron has initialized
app.whenReady().then( () => {

    createWindow();

    // if macos: recreate window when dock icon clicked with no windows open
    app.on( 'activate', function () {
        if ( BrowserWindow.getAllWindows().length === 0 ) {
            createWindow();
        }
    });
});

// if not macos: quit app when all windows are closed
app.on( 'window-all-closed', function () {
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
});

