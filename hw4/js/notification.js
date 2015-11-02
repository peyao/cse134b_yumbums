function showNotification(msg) {
    //Check if Notification is supported
    if('Notification' in window) {
        // FF + Chrome
        Notification.requestPermission(function (permission) {
            if(permission === 'granted') {
                var notification = new Notification(msg);
            }
        });
    } else if (window.external.msSiteModeSetIconOverlay){
        // IE
        if(window.external.msIsSiteMode()) {
            // Current page is a pinned site
            window.external.msSiteModeSetIconOverlay('../img/icon.png', msg);
        }
    } else {
        alert('Notification not supported by this browser or browser version!');
    }
}
