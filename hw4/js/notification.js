function notify() {
    showNotification(createNotification());
}

function showNotification(msg) {
    //Check if Notification is supported
    //for FF and Chrome
    if('Notification' in window) {
        console.log(Notification.permission);
        if(Notification.permission === 'granted') {
            var options = {
                body: msg
            }
            var notification = new Notification('Hi!', options);
            setTimeout(notification.close.bind(notification), 5000);
        }
        else if(Notification.permission !== 'denied') {
            console.log('asking for notification...');
            Notification.requestPermission(function (permission) {
                console.log('permission asked...');
                console.log(permission);
                if(permission === 'granted') {
                    var options = {
                        body: msg
                    }
                    var notification = new Notification('Hi!', options);
                    setTimeout(notification.close.bind(notification), 5000);
                }
            });
        }
    }
    //for IE
    else if (window.external.msSiteModeSetIconOverlay){
        if(window.external.msIsSiteMode()) {
            // Current page is a pinned site
            window.external.msSiteModeSetIconOverlay('../img/icon.png', msg);
        }
    }
    else {
        alert('Notification not supported by this browser or browser version!');
    }
}

function createNotification() {
    // iterate through all notification msgs and form single notification
    var habitList = localStorage.getItem("habitList");
    habitList = JSON.parse(habitList);
    var currentDate = getCurrentDate();
    var notification = [];
    if(habitList != null) {
        for(var i = 0; i < habitList.length; i++) {
            var habit = habitList[i];
            var frequency = habit.weekFrequency;
            for(var j = 0; j < frequency.length; j++) {
                if(frequency[j].toLowerCase() == currentDate.day.toLowerCase()) {
                    notification.push(habit.title);
                }
            }
        }
    }

    console.log(notification);
    return notification;
}

function getCurrentDate() {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var today = new Date();
    return {'day': days[today.getDay()],
            'time': today.getTime()};
}
