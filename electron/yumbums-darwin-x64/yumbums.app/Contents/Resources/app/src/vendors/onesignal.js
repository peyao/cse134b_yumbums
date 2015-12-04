var OneSignal = OneSignal || [];
var oneSignalId = null;
var isPushSupported = true;
var ENV = 'PRODUCTION';
//var ENV = 'DEBUG';

initOneSignal();

function initOneSignal() {
    var DEFAULT_URL = '';

    /* Configured for Chrome and Safari */
    if(ENV == 'DEBUG') {
        OneSignal.push(['init', {
            appId: '8f5de3fb-7578-4e0b-83e2-984979ad8b6d',
            safari_web_id: 'web.onesignal.auto.27be598e-7a22-4ed6-a01a-10378439b214',
            subdomainName: 'yumbums'
        }]);
        DEFAULT_URL = 'http://localhost:8080/src/list.html';
    }
    else if(ENV == 'PRODUCTION') {
        OneSignal.push(['init', {
            appId: '1f8dad4e-4d83-45ce-9a42-73434eee9182',
            safari_web_id: 'web.onesignal.auto.1afb9025-a2b0-4a54-8c00-23b218b2b39b',
            subdomainName: 'hostedyumbums'
        }]);
        DEFAULT_URL = 'http://peyao.me/yumbums/hw4/src/list.html';
    }

    OneSignal.push(['setDefaultNotificationUrl', DEFAULT_URL]);
    OneSignal.push(['setDefaultTitle', 'This is a friendly reminder to complete your habits']);

    checkSubscription();
    OneSignal.push(['getIdsAvailable', function(ids) {
        oneSignalId = ids.userId;
        console.log(oneSignalId);
    }]);
}

/*
 * Check if push notifications are supported, if not then fallback to
 * web notifications
 */
function checkSubscription() {
    OneSignal.push(function() {
        if(OneSignal.isPushNotificationsSupported()) {
            OneSignal.isPushNotificationsEnabled(function(pushEnabled) {
               if(!pushEnabled)
                   OneSignal.push(['registerForPushNotifications']);
            });
        } else {
            isPushSupported = false;
        }
    });
}
