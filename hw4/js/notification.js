/**
 * Figure out how many seconds have passed since last interval
 * and how many more seconds until next interval
 */
var d = new Date();
var currSeconds = d.getTime() / 1000;
//var timeSinceLastQuarter = currSeconds % 900; // 900 seconds (15 minutes)
var timeSinceLastQuarter = currSeconds % 10; // 10 seconds
var timeUntilNextQuarter = 10 - timeSinceLastQuarter;

/**
 * If we're in the middle of an interval then we'll wait
 * until the next interval and run a timer once we hit
 * the interval
 */
setTimeout(function() {
    setInterval(getHabitList, 10 * 1000);
    getHabitList();
}, timeUntilNextQuarter * 1000);

function getHabitList() {
    $firebase.getAllHabits(function(habits) {
        checkNotifications(habits);
    });
}

/******************************************************************************
 * Notification Functions
 ******************************************************************************/

/**
 * Iterate through my habits and check if any notifications
 * need to be sent
 */
function checkNotifications(habits) {
    if(habits == null)
        return;

    var arrHabitsToNotify = [];
    for (var id in habits) {
        var habit = habits[id];
        var interval = habit.notification;

        // Check if habit was already completed today
        if(habit.completedToday == habit.dayFrequency) {
            continue;
        }

        if (interval == 'None') continue;
        var frequency = habit.weekFrequency;
        for (var f in frequency) {
            if (checkDay(frequency[f])) {
                if (interval == '20') {
                    if (checkInterval('seconds', interval)) {
                        arrHabitsToNotify.push(habit.title);
                    } else {
                        continue;
                    }
                }
                else if (interval == '15' || interval == '30' || interval == '45') {
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

/**
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
        sendPushNotification(str);
    } else {
        sendWebNotification(str);
    }
}

/**
 * A fallback for when push notification isn't supported. Uses the
 * Notification API
 * @param strHabitList
 */
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

/**
 * Checks if current time is at the interval
 * @param intervalType a string containing either 'hour' or 'minute'
 * @param interval a number representing the interval
 */
function checkInterval(intervalType, interval) {
    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    if (intervalType.toLowerCase() == 'hour') {
        if (hour % interval == 0)
            if (minute == 0)
                if (second == 0)
                    return true;
        return false;
    }
    else if (intervalType.toLowerCase() == 'minute') {
        if (minute % interval == 0) {
            return true;
        }
        return false;
    }
    else if (intervalType.toLowerCase() == 'seconds') {
        if (second % interval == 0) {
            return true;
        }
        return false;
    }
    return false;
} /* END checkInterval() */

/**
 * Checks if current day of the week matches the one
 * set for notification
 */
function checkDay(day) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var today = new Date();
    var weekday = days[today.getDay()];
    if (day.toLowerCase() === weekday.toLowerCase()) {
        return true;
    }
    else {
        return false;
    }
} /* END checkDay() */