//accessor function to notifications
function notify() {
    var notifications = createNotification();
    if(notifications.length > 0)
        showNotification(notifications);
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
            var notification = new Notification('You have uncompleted habits!', options);
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
                    var notification = new Notification('You have uncompleted habits!', options);
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
    var habitList = localStorage.getItem('habitList');
    habitList = JSON.parse(habitList);
    console.log(habitList);

    var notification = [];
    if(habitList != null) {
        for(var i = 0; i < habitList.length; i++) {
            var habit = habitList[i];
            if(habit.notification == 'None') continue;
            var frequency = habit.weekFrequency;
            for(var j = 0; j < frequency.length; j++) {
                if(checkDay(frequency[j])) {
                    if(habit.notification == '15' || habit.notification == '30' ||
                        habit.notification == '45') {
                        if(checkInterval('minute', habit.notification)) {
                            notification.push(habit.title);
                        } else {
                            continue;
                        }
                    } else {
                        if(checkInterval('hour', habit.notification)) {
                            notification.push(habit.title);
                        } else {
                            continue;
                        }
                    }
                } else {
                    continue;
                }
            }
        }
    }

    return notification;
}

////////////////////////////////////////////////////////////////////////////////
// Utitlity funcs
////////////////////////////////////////////////////////////////////////////////

//intervalType is either Hour or Minute
function checkInterval(intervalType, interval) {
    console.log(intervalType + ' ' + interval);
    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    console.log(hour + ':' + minute);
    if(intervalType.toLowerCase() == 'hour') {
        if(hour % interval == 0)
            if(minute == 0)
                return true;
        else
            return false;
    }
    else if(intervalType.toLowerCase() == 'minute') {
        if(minute % interval == 0)
            return true;
        else
            return false;
    }
    return false;
}

//time is string in HH:MM format
//checks if given time is equal to current time
function checkHourMinute(time) {
    var today = new Date();
    var minutes = today.getMinutes();
    var hours = today.getHours();

    var arr = time.split(':');
    var inHour = arr[0];
    var inMinute = arr[1];

    if(inHour === hours && inMinute === minutes) {
        return true;
    }
    else {
        return false;
    }
}

function checkDay(day) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
                'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var today = new Date();
    var weekday = days[today.getDay()];
    if(day.toLowerCase() === weekday.toLowerCase()) {
        return true;
    }
    else {
        return false;
    }
}
