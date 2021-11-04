function display_internet_status() {
    document.body.className = navigator.onLine ? 'online' : 'offline';
}

window.addEventListener( 'online', display_internet_status );
window.addEventListener( 'offline', display_internet_status );

display_internet_status();

