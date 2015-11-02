function showMsg(element) {
    var msgElement = (element.parentNode.parentNode.getElementsByClassName("message"))[0];
    msgElement.style.visibility="visible";
}

function deleteHabit(element) {
    var child = element.parentNode.parentNode;
    var parent = child.parentNode;
    child.classList.add("anim-slide-out-right-240-5");

    prefixedEvent(child, "AnimationEnd", function() {
        parent.removeChild(child);
    });
}

function listHabits() {
    var habits = [];
    habits.push({
        title: "Sleep 8 Hours",
        icon: "../img/sleep.jpg",
        weekFrequency: 0,
        dayFrequency: 0,
        otherFrequency: 0,
        currentStreak: 2,
        bestStreak: 5
    });
    for(var i = 0; i<habits.length; i++){
        var habit = document.createElement("LI");
    }
}

var pageFadeOut = function(location) {
    document.body.classList.add("anim-slide-out-right");
    prefixedEvent(document.body, "AnimationEnd", function() {
        window.location.href = location;
    });
};

var pfx = ["webkit", "moz", "MS", "o", ""];
function prefixedEvent(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p])
            type = type.toLowerCase();
        element.addEventListener(pfx[p] + type, callback, false);
    }
}
