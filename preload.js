const { ipcRenderer } = require('electron');
const net             = require('net');

const delay = 2;

function ip_is_online() {
    // console.log( 'You are online.' );
    document.body.className = 'online';
    ipcRenderer.send( 'status-update', 'online' );
}
function ip_is_offline() {
    // console.log( 'PANIC! You are offline.' );
    document.body.className = 'offline';
    ipcRenderer.send( 'status-update', 'offline' );
}
function dns_is_online() {
    console.log( 'Your DNS is online.' );
}
function dns_is_offline() {
    console.log( 'PANIC! Your DNS is offline.' );
}

setInterval( function () {

    const sock = new net.Socket();

    sock.setTimeout( 500 );

    sock.on( 'connect', function () {
        ip_is_online();
        sock.destroy();
    }).on( 'error', function ( e ) {
        ip_is_offline();
        sock.destroy();
    }).on( 'timeout', function ( e ) {
        ip_is_offline();
        sock.destroy();
    }).connect( 80, '1.1.1.1' );

}, 1000 * delay );

setTimeout( function () {
    setInterval( function () {

        const sock = new net.Socket();

        sock.setTimeout( 500 );

        sock.on( 'connect', function () {
            dns_is_online();
            sock.destroy();
        }).on( 'error', function ( e ) {
            dns_is_offline();
            sock.destroy();
        }).on( 'timeout', function ( e ) {
            dns_is_offline();
            sock.destroy();
        }).connect( 80, 'one.one.one.one' );

    }, 1000 * delay );
}, 1000 * delay / 2 );

