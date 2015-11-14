var DEBUG = false;

/*
 * Check if there's any notifications to send out every 1 minute
 * Checking every 1 minute may be too often but it has to cover the
 * scenario where the user opens the app at like 9:10, then checking
 * it every 15 minutes will miss the 9:15 notification mark. So we
 * have to check it every 1 minute b/c missing the scheduled time
 * by seconds is still fine, but not if we miss it by anywhere from
 * 1 minute to 14 minutes.
 */
window.setInterval(function () {
    $firebase.getAllHabits(function proccessHabitList(habits) {
        if (DEBUG) {
            console.log("firebase.getFirstHabits:");
            console.log(habits);
        }
        checkNotifications(habits);
    });
}, 60000);
/* END */


////////////////////////////////////////////////////////////////////////////////
// Notification Functions
////////////////////////////////////////////////////////////////////////////////

/*
 * Iterate through my habits and check if any notifications
 * need to be sent
 */
function checkNotifications(habits) {

    if (DEBUG) {
        console.log('checkNotifications(habits)');
        console.log(habits);
    }

    var arrHabitsToNotify = [];
    for (var id in habits) {
        var habit = habits[id];
        var interval = habit.notification;

        if (DEBUG) console.log(id);
        if (DEBUG) console.log(habits[id]);

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

function notify(habitsToNotify) {
    var strHabitList = "";
    for (i = 0, len = habitsToNotify.length; i < len; i++) {
        if (i == len - 1) {
            strHabitList += habitsToNotify[i];
        } else {
            strHabitList += habitsToNotify[i] + ", ";
        }
    }

    if (DEBUG) console.log('strHabitList: ' + strHabitList);

    if (oneSignalId != null) {
        if (DEBUG) console.log("SENDING notifications");
        sendNotification(strHabitList);
    }
}

////////////////////////////////////////////////////////////////////////////////
// Time Calculation Functions
////////////////////////////////////////////////////////////////////////////////p

//intervalType is either Hour or Minute
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

    if (inHour === hours && inMinute === minutes) {
        return true;
    }
    else {
        return false;
    }
}

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
}

