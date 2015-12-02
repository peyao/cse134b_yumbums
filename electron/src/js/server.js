/**
 * Forms a POST request to the OneSignal REST API
 * We only use XMLHttpRequest because push notification will only work
 * on Chrome and Safari and in the future Firefox. So we don't have to
 * worry about making this request in Internet Explorer
 */
function sendPushNotification(msg) {
    var req = new XMLHttpRequest();
    req.open('POST', 'https://onesignal.com/api/v1/notifications', true);
    req.setRequestHeader('Content-Type', 'application/json');

    if(ENV == 'DEBUG') {
        req.setRequestHeader('Authorization',
            'Basic NjA0ZTdiMTUtN2RiNi00MzRkLThhNzUtMjFmNmE4ZGMwYjRj');
    }
    else {
        req.setRequestHeader('Authorization',
            'Basic M2Q1NTI0ZTctNDEyNy00Y2VjLWIzOWYtMjNmMDAwNjk5OTQ1');
    }

    req.onreadystatechange = function () {
        if (req.readyState == 4) {
            console.log(req.response);
        }
    };

    var message = {};
    if(ENV == 'DEBUG') {
        message = {
            app_id: '8f5de3fb-7578-4e0b-83e2-984979ad8b6d',
            contents: {'en': msg},
            include_player_ids: [oneSignalId]
        };
    }
    else {
        message = {
            app_id: '1f8dad4e-4d83-45ce-9a42-73434eee9182',
            contents: {'en': msg},
            include_player_ids: [oneSignalId]
        };
    }

    console.log('SENDING msg:');
    console.log(message);

    req.send(JSON.stringify(message));
}
