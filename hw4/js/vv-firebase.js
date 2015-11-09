var firebaseRef = new Firebase("https://fiery-heat-9545.firebaseio.com/");
//localStorage.removeItem('userId');

// Firebase
var $firebase = {
    setUser: function(callback) {
        var userId = localStorage.getItem('userId');

        if (userId === null) {
            var usersRef = firebaseRef.child('users');
            var pushRef = usersRef.push({ created: Date.now() });
            userId = pushRef.key();
            localStorage.setItem('userId', userId);

            console.log('userId created: ' + userId);
        }
        else {
            console.log('userId found: ' + userId);
        }

        return callback(userId);
    },
    addHabit: function(habit, callback) {
        this.setUser(function(userId) {
            var habitsRef = firebaseRef.child('users/' + userId + '/habits');

            habit.created = Date.now();
            var pushRef = habitsRef.push(habit);

            return pushRef.key();
        });
    },
    getHabit: function(habitKey, callback) {
        this.setUser(function(userId) {
            var habitRef = firebaseRef.child('users/' + userId + '/habits/' + habitKey);
            habitRef.once('value', function(snapshot) {
                return callback(snapshot.val());
            }, function (err) {
                console.log("Err: " + err);
            });
        });
    },
    getHabits: function(callback) {
        this.setUser(function(userId) {
            var habitsRef = firebaseRef.child('users/' + userId + '/habits');
            habitsRef.once('value', function(snapshot) {
                return callback(snapshot.val());
            }, function (err) {
                console.log("Err: " + err);
            });
        });
    },
    updateHabit: function(habit, habitKey, callback) {
        this.setUser(function(userId) {
            var habitRef = firebaseRef.child('users/' + userId + '/habits/' + habitKey);
            habitRef.set(habit, callback);
        });
    },
    deleteHabit: function(habitKey, callback) {
        this.setUser(function(userId) {
            console.log('deleteHabit():habitKey: ' + habitKey);
            var habitRef = firebaseRef.child('users/' + userId + '/habits/' + habitKey);
            habitRef.set(null, callback);
        });
    }
};




/*
firebase.child("hello").on("value", function(snapshot) {
    console.log(JSON.stringify(snapshot.val()));
});
*/
