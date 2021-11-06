const { ipcRenderer } = require('electron');

function display_internet_status() {
    ipcRenderer.send( 'status-update', ( navigator.onLine ? 'online' : 'offline' ) );
}

window.addEventListener( 'online', display_internet_status );
window.addEventListener( 'offline', display_internet_status );

display_internet_status();

