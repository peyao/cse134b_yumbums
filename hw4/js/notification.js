var DEBUG = true;

/*
 * Figure out how many seconds until the next quarter hour mark
 */
var d = new Date();
var currSeconds = d.getTime() / 1000;
var timeSinceLastQuarter = currSeconds % 900; // 900 seconds (15 minutes)
var timeUntilNextQuarter = 900 - timeSinceLastQuarter;

setTimeout(function() {
    if(DEBUG) console.log('It is now the quarter hour mark');
    setInterval(getHabitList, 900 * 1000);
    getHabitList();
}, timeUntilNextQuarter * 1000);

function getHabitList() {
    $firebase.getAllHabits(function proccessHabitList(habits) {
        if (DEBUG) {
            console.log("firebase.getAllHabits:");
            console.log(habits);
        }
        checkNotifications(habits);
    });
}

/******************************************************************************
 * Notification Functions
 ******************************************************************************/

/*
 * Iterate through my habits and check if any notifications
 * need to be sent
 */
function checkNotifications(habits) {

    if (DEBUG) {
        console.log('checkNotifications(habits)');
        console.log(habits);
    }

    if(habits == null)
        return;

    var arrHabitsToNotify = [];
    for (var id in habits) {
        var habit = habits[id];
        var interval = habit.notification;

        if (DEBUG) console.log(id);
        if (DEBUG) console.log(habits[id]);

        // Check if habit was already completed today
        if(habit.completedToday == habit.dayFrequency) {
            if(DEBUG) console.log(habit.title + ' is already completed so skipping');
            continue;
        }

        if (interval == 'None') continue;
        var frequency = habit.weekFrequency;
        for (var f in frequency) {
            if (checkDay(frequency[f])) {
                if (interval == '15' || interval == '30' || interval == '45') {
                    if (checkInterval('minute', interval)) {
                        arrHabitsToNotify.push(habit.title);
                    } else {
                        continue;
                    }
                } else {
                    if (checkInterval('hour', interval)) {
                        arrHabitsToNotify.push(habit.title);
                    } else {
                        continue;
                    }
                }
            } else {
                continue;
            }
        }
    }

    if (arrHabitsToNotify.length != 0) {
        notify(arrHabitsToNotify);
    }
}

/*n
 * Format notifications into a nice string then call the
 * REST API
 */
function notify(habitsToNotify) {
    var str = '';
    var i;
    for(i = 0, len = habitsToNotify.length; i < len; i++) {
        if (i == len - 1) {
            str += habitsToNotify[i];
        } else {
            str += habitsToNotify[i] + ", ";
        }
    }

    if(isPushSupported && oneSignalId != null) {
        if (DEBUG) console.log("SENDING OneSignal notifications");
        sendPushNotification(str);
    } else {
        if (DEBUG) console.log("SENDING Web notifications");
        sendWebNotification(str);
    }
}

function sendWebNotification(strHabitList) {
    var title = 'You have incomplete habits';
    var chk = Notification.permission;
    if(chk !== 'granted') {
        Notification.requestPermission(function(permission) {
            if(permission === 'granted') {
                var notification = new Notification(title, {
                    body: strHabitList
                });
            }
        });
    }
    else {
        var notification = new Notification(title, {
            body: strHabitList
        });
    }
}

/******************************************************************************
 * Time Calculation Functions
 ******************************************************************************/

/*
 * Checks if current time is at the interval
 * intervalType a string containing either 'hour' or 'minute'
 */
function checkInterval(intervalType, interval) {
    if (DEBUG) console.log(intervalType + ' ' + interval);
    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    if (DEBUG) console.log(hour + ':' + minute);
    if (intervalType.toLowerCase() == 'hour') {
        if (hour % interval == 0)
            if (minute == 0)
                return true;
            else
                return false;
    }
    else if (intervalType.toLowerCase() == 'minute') {
        if (DEBUG) console.log(minute % interval);
        if (minute % interval == 0) {
            if (DEBUG) console.log('returning true');
            return true;
        }
        else {
            if (DEBUG) console.log('returning false');
            return false;
        }
    }
    return false;
} /* END checkInterval() */

/*
 * time is string in HH:MM format
 * checks if given time is equal to current time
 */
function checkHourMinute(time) {
    var today = new Date();
    var minutes = today.getMinutes();
    var hours = today.getHours();

    var arr = time.split(':');
    var inHour = arr[0];
    var inMinute = arr[1];

    if (inHour === hours && inMinute === minutes) {
        return true;
    }
    else {
        return false;
    }
} /* END checkHourMinute() */

/*
 * Checks if current day of the week matches the one
 * set for notification
 */
function checkDay(day) {
    if (DEBUG) console.log('Checking day:');
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var today = new Date();
    var weekday = days[today.getDay()];
    if (DEBUG) console.log('today: ' + weekday.toLowerCase() + ' ' + 'habit day: ' + day.toLowerCase());
    if (day.toLowerCase() === weekday.toLowerCase()) {
        return true;
    }
    else {
        return false;
    }
} /* END checkDay() */