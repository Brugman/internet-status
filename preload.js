const { ipcRenderer } = require('electron');
const net             = require('net');

const delay = 2;

function ip_is_online() {
    document.body.classList.remove( 'ip-offline' );
    document.body.classList.add( 'ip-online' );

    ipcRenderer.send( 'check-ip', 'online' );
}

function ip_is_offline() {
    document.body.classList.remove( 'ip-online' );
    document.body.classList.add( 'ip-offline' );

    ipcRenderer.send( 'check-ip', 'offline' );
}

function dns_is_online() {
    document.body.classList.remove( 'dns-offline' );
    document.body.classList.add( 'dns-online' );
}

function dns_is_offline() {
    document.body.classList.remove( 'dns-online' );
    document.body.classList.add( 'dns-offline' );
}

setInterval( function () {

    const sock = new net.Socket();

    sock.setTimeout( 500 );

    sock.on( 'connect', function () {
        ip_is_online();
        sock.destroy();
    }).on( 'error', function () {
        ip_is_offline();
        sock.destroy();
    }).on( 'timeout', function () {
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
        }).on( 'error', function () {
            dns_is_offline();
            sock.destroy();
        }).on( 'timeout', function () {
            dns_is_offline();
            sock.destroy();
        }).connect( 80, 'one.one.one.one' );

    }, 1000 * delay );
}, 1000 * delay / 2 );

