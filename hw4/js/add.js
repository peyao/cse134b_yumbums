var pageTransitionOut = function(location) {
    document.body.classList.add("anim-slide-out-right");
    prefixedEvent(document.body, "AnimationEnd", function() {
        document.getElementById('anim-wrapper').style.display = 'none';
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


// global variables
var imageSelect;
var weeklySchedule = [];
var dayFreq = 0;

function selectImage(name) {
    //Clear all the other effects
    document.getElementById('icon1').style.border = "none";
    document.getElementById('icon2').style.border = "none";
    document.getElementById('icon3').style.border = "none";
    imageSelect = null;
    var image = document.getElementById(name);
    image.style.border = "5px solid #42A5F5";
    imageSelect = image.getAttribute("src");
}
function uncheckradio() {
    var unradio = document.getElementsByName("day");
    for (var i = 0; i < unradio.length - 1; i++) {
        unradio[i].checked = false;
    }
}
function clearOther() {
    document.getElementById("others").value = null;
}
function validateForm() {
    //icon select validation
    if(imageSelect == null){
        alert("Choose an icon");
        return false;
    }
    // checkbox validation
    var checkboxes = document.getElementsByName("date");
    var checkedweekly = false;
    var i;
    for (i = 0; i < checkboxes.length ; i ++){
        if(checkboxes[i].checked){
            checkedweekly = true;
            weeklySchedule.push(checkboxes[i].value);
        }
    }
    if (!checkedweekly){
        alert("Enter weekly frequency");
        return false;
    }
    // radio button and others validation
    var daily = document.getElementsByName("day");
    var dailyOther = document.getElementById("others").value;
    var selectedradio = false;
    for (i = 0; i < daily.length - 1; i++){
        if (daily[i].checked) {
            selectedradio = true;
            dayFreq = daily[i].value;
            break;
        }
    }
    if(!selectedradio){
        dayFreq = dailyOther;
    }
    if(!selectedradio && !dailyOther) {
        alert("Enter daily frequency");
        return false;
    }
    var habit = [{
        title: document.getElementById("title").value,
        icon: imageSelect,
        weekFrequency: weeklySchedule,
        dayFrequency: dayFreq,
        otherFrequency: 0,
        currentStreak: 0,
        bestStreak: 0,
        completedToday: 0
    }];
    var stringHabit = JSON.stringify(habit);
    localStorage.setItem("habitList", stringHabit);

}