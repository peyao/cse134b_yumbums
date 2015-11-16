var firebaseRef = new Firebase("https://fiery-heat-9545.firebaseio.com/");
var PAGINATION_VALUE = 3;
//localStorage.removeItem('userId');

// Firebase
var $firebase = {
    setUser: function(callback) {
        $loader.show();

        var userId = localStorage.getItem('userId');

        if (userId === null) {
            var usersRef = firebaseRef.child('users');
            var pushRef = usersRef.push({
                created: Date.now()
            });
            userId = pushRef.key();
            localStorage.setItem('userId', userId);

            console.log('userId created: ' + userId);
        }

        $loader.hide();
        return callback(userId);
    },
    addHabit: function(habit, callback) {
        $loader.show();
        this.setUser(function(userId) {
            var habitsRef = firebaseRef.child('users/' + userId + '/habits');

            habit.created = Date.now();
            var pushRef = habitsRef.push(habit);

            return pushRef.key();
        });
        $loader.hide();
    },
    getHabit: function(habitKey, callback) {
        $loader.show();
        this.setUser(function(userId) {
            var habitRef = firebaseRef.child('users/' + userId + '/habits/' + habitKey);
            habitRef.once('value', function(snapshot) {
                callback(snapshot.val());
            }, function(err) {
                console.log("Err: " + err);
            });
        });
        $loader.hide();
    },
    getAllHabits: function(callback) {
        $loader.show();
        this.setUser(function(userId) {
            var habitsRef = firebaseRef.child('users/' + userId + '/habits');
            habitsRef.orderByKey()
                .once('value', function(snapshot) {
                    callback(snapshot.val());
                }, function(err) {
                    console.log('Err: ' + err);
                });
        });
        $loader.hide();
    },
    getFirstHabits: function(callback) {
        $loader.show();
        this.setUser(function(userId) {
            var habitsRef = firebaseRef.child('users/' + userId + '/habits');
            habitsRef.orderByKey()
                .limitToFirst(PAGINATION_VALUE)
                .once('value', function(snapshot) {
                    callback(snapshot.val());
                }, function(err) {
                    console.log("Err: " + err);
                });
        });
        $loader.hide();
    },
    getNextHabits: function(callback, habitKey) {
        $loader.show();
        this.setUser(function(userId) {
            var habitsRef = firebaseRef.child('users/' + userId + '/habits');
            habitsRef.orderByKey()
                .startAt(habitKey)
                .limitToFirst(PAGINATION_VALUE + 1)
                .once('value', function(snapshot) {
                    callback(snapshot.val());
                }, function(err) {
                    console.log("Err: " + err);
                });
        });
        $loader.hide();
    },
    updateHabit: function(habit, habitKey, callback) {
        $loader.show();
        this.setUser(function(userId) {
            var habitRef = firebaseRef.child('users/' + userId + '/habits/' + habitKey);
            habitRef.set(habit, callback);
        });
        $loader.hide();
    },
    deleteHabit: function(habitKey, callback) {
        $loader.show();
        this.setUser(function(userId) {
            console.log('deleteHabit():habitKey: ' + habitKey);
            var habitRef = firebaseRef.child('users/' + userId + '/habits/' + habitKey);
            habitRef.set(null, callback);
        });
        $loader.hide();
    }
};

var $loader = {
    show: function() {
        loader = document.getElementById('loader');
        if (!loader)
            return;
        loader.style.visibility = 'visible';
    },
    hide: function() {
        loader = document.getElementById('loader');
        if (!loader)
            return;
        loader.classList.add("anim-loader-fade-out");
        prefixedEvent(loader, "AnimationEnd", function() {
            loader.style.visibility = 'hidden';
            loader.className = ""; // Remove all classes
        });
    }
};

/*
function pageTransitionOut(location) {
    document.body.classList.add("anim-slide-out-right");
    prefixedEvent(document.body, "AnimationEnd", function() {
        document.getElementById('anim-wrapper').style.display = 'none';
        window.location.href = location;
    });
}
*/

var pfx = ["webkit", "moz", "MS", "o", ""];
function prefixedEvent(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p])
            type = type.toLowerCase();
        element.addEventListener(pfx[p] + type, callback, false);
    }
}

/*
firebase.child("hello").on("value", function(snapshot) {
    console.log(JSON.stringify(snapshot.val()));
});
*/
