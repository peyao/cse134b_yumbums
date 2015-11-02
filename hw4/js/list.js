function showMsg(element){
    var msgElement = (element.parentNode.parentNode.getElementsByClassName("message"))[0];
    msgElement.style.visibility="visible";
}

function deleteHabit(element){
    var child = element.parentNode.parentNode;
    var parent = child.parentNode;
    parent.removeChild(child);
}

function listHabits(){
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
    /*habits.push({
        title: "Sleep 8 Hours",
        icon: "../img/sleep.jpg",
        weekFrequency: 0,
        dayFrequency: 0,
        otherFrequency: 0,
        currentStreak: 2,
        bestStreak: 5
    });
    habits.push({
        title: "Sleep 8 Hours",
        icon: "../img/sleep.jpg",
        weekFrequency: 0,
        dayFrequency: 0,
        otherFrequency: 0,
        currentStreak: 2,
        bestStreak: 5
    });*/
    for(var i = 0; i<habits.length; i++){
        var habit = document.createElement("LI");
    }
}