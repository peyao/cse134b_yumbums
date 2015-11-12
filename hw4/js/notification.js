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
window.setInterval(function() {
    var habitList = localStorage.getItem('habitList');
    habitList = JSON.parse(habitList);
		if(DEBUG)
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

		if(DEBUG) console.log('list of notifications to send out : ' + notification);
		if(notification.length > 0) {
				notify(notification);
		}
}, 60000);

function notify(habitsToNotify) {
		var perm = Notification.permission;
		if(perm !== 'granted') {
				Notification.requestPermission(function(permission) {
						if(permission === 'granted') {
								sendNotification(habitsToNotify);
						}
				});
		} else {
				sendNotification(habitsToNotify);
		}
}

function sendNotification(habitsToNotify) {
		var notification = new Notification('This is a notification', {
				body: habitsToNotify.toString()
		});
}

////////////////////////////////////////////////////////////////////////////////
// Utitlity funcs
////////////////////////////////////////////////////////////////////////////////

//intervalType is either Hour or Minute
function checkInterval(intervalType, interval) {
    if(DEBUG) console.log(intervalType + ' ' + interval);
    var today = new Date();
    var hour = today.getHours();
    var minute = today.getMinutes();
    if(DEBUG) console.log(hour + ':' + minute);
    if(intervalType.toLowerCase() == 'hour') {
        if(hour % interval == 0)
            if(minute == 0)
                return true;
        else
            return false;
    }
    else if(intervalType.toLowerCase() == 'minute') {
				if(DEBUG) console.log(minute % interval);
        if(minute % interval == 0) {
						if(DEBUG) console.log('returning true');
            return true;
				}
        else {
						if(DEBUG) console.log('returning false');
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

