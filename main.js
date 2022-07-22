const { app, BrowserWindow, ipcMain } = require('electron');
const path                            = require('path');

function createWindow() {

    const win = new BrowserWindow({
        show: false,
        width: 640,
        height: 360,
        icon: __dirname + '/public_html/assets/icon-neutral.png',
        webPreferences: {
            preload: path.join( __dirname, 'preload.js' ),
        },
    });

    win.removeMenu();

    win.loadFile('public_html/index.html');

    // win.webContents.openDevTools();

    win.once( 'ready-to-show', () => {
        win.show();
    });

    return win;
}

// electron has initialized
app.whenReady().then( () => {

    win = createWindow();

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

// respond to status updates
ipcMain.on( 'status-update', ( event, arg ) => {
    // feedback
    // console.log( 'status is '+arg );
    // set icon
    win.setIcon( __dirname + '/public_html/assets/icon-'+arg+'.png' );
});

