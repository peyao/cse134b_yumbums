// global variables
var imageSelect;
var weeklySchedule = [];
var dayFreq = 0;

//upload personal image
function setIcon() {
    //open the open file dialog
    document.getElementById('iconFile').click();
    document.getElementById('iconFile').onchange = function() {
        var file = this.files[0];
        var url = window.URL.createObjectURL(file);
        document.getElementById('icon3').src = url;
    };
}

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
    unradio = document.getElementsByName("notification");
    for (var i = 0; i < unradio.length - 1; i++) {
        unradio[i].checked = false;
    }
}

function clearOther() {
    document.getElementById("others").value = null;
}

/* my failed attempt to create html element with js, jacob teach me the way
function createTimeInput () {

    var timeInput = document.createElement("INPUT");
    timeInput.setAttribute("type", "time");
    timeInput.setAttribute("id", "timeValue");
    var timeLabel = document.createElement("LABEL");
    timeLabel.appendChild(timeInput);
    document.body.getElementById("nt-list").appendChild(timeLabel);
}
*/
function addHabitInStorage(callback){
    var currentDate = new Date();
    currentDate.setHours(0);
    var startOfDay = currentDate.getTime();
    var habit = {
        title: document.getElementById("title").value,
        icon: imageSelect,
        weekFrequency: weeklySchedule,
        dayFrequency: dayFreq,
        notification: document.getElementById("selectNotification").value,
        currentStreak: 0,
        bestStreak: 0,
        completedToday: 0,
        timeCheck: startOfDay
    };

    //need to retrieve the list of habits or create a list
    //of habits if the list is empty

    /*
    var habitList = JSON.parse(localStorage.getItem("habitList"));
    if(!habitList || habitList.length == 0){
        habitList = [];
    }

    //adds the habit to the end of the list and stores the list back
    //in local storage
    habitList.push(habit);
    var stringHabit = JSON.stringify(habitList);
    //localStorage.setItem("habitList", stringHabit);
    */

    $firebase.addHabit(habit);
    callback();
}

function pageTransitionOut(location) {
    document.body.classList.add("anim-slide-out-right");
    prefixedEvent(document.body, "AnimationEnd", function() {
        document.getElementById('anim-wrapper').style.display = 'none';
        window.location.href = location;
    });
}

var pfx = ["webkit", "moz", "MS", "o", ""];
function prefixedEvent(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p])
            type = type.toLowerCase();
        element.addEventListener(pfx[p] + type, callback, false);
    }
}

function validateForm() {
    //icon select validation
    if(!document.getElementById("title").value){
        alert("Choose a title for your habit")
        return false;
    }

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

    addHabitInStorage(function() {
        pageTransitionOut('list.html');
    });
}

document.body.onunload = function() {
    location.reload(true);
};
