var OneSignal = OneSignal || [];
var oneSignalId = null;

initOneSignal();

function initOneSignal() {
    var DEFAULT_URL = 'http://localhost/src/list.html';

    /* Configured for Chrome and Safari */
    OneSignal.push(['init', {
        appId: '8f5de3fb-7578-4e0b-83e2-984979ad8b6d',
        safari_web_id: 'web.onesignal.auto.27be598e-7a22-4ed6-a01a-10378439b214',
        subdomainName: 'yumbums'
    }]);
    OneSignal.push(['setDefaultNotificationUrl', DEFAULT_URL]);
    OneSignal.push(['setDefaultTitle', 'Habits Not Yet Finished']);

    checkSubscription();
    OneSignal.push(['getIdsAvailable', function(ids) {
        oneSignalId = ids.userId;
        console.log(oneSignalId);
    }]);
}

function checkSubscription() {
    OneSignal.push(function() {
        if(OneSignal.isPushNotificationsSupported()) {
            OneSignal.isPushNotificationsEnabled(function(pushEnabled) {
               if(!pushEnabled)
                   OneSignal.push(['registerForPushNotifications']);
            });
        }
    });
}
