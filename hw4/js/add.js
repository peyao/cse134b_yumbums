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

    // local variables
    var orphan;
    var invalidFlag = false;

    // title validation
    if(!document.getElementById("title").value){
        var aMessage1 = document.createTextNode(" *required field");
        var aElement1 = document.createElement("ALERT");
        aElement1.setAttribute("style", "color:red; font-size:small;");
        aElement1.appendChild(aMessage1);

        if(document.getElementById("title_text").childNodes[1]){
            orphan = document.getElementById("title_text");
            orphan.removeChild(orphan.childNodes[1]);
        }
        document.getElementById("title_text").appendChild(aElement1);
        invalidFlag = true;
    }
    else if(document.getElementById("title_text").childNodes[1]){
        orphan = document.getElementById("title_text");
        orphan.removeChild(orphan.childNodes[1]);
    }

    //icon select validation
    if(imageSelect == null){
        var aMessage2 = document.createTextNode(" *required field");
        var aElement2 = document.createElement("ALERT");
        aElement2.setAttribute("style", "color:red; font-size:small;");
        aElement2.appendChild(aMessage2);
        if(document.getElementById("hIcon").childNodes[1]){
            orphan = document.getElementById("hIcon");
            orphan.removeChild(orphan.childNodes[1]);
        }
        document.getElementById("hIcon").appendChild(aElement2);
        invalidFlag = true;
    }
    else if(document.getElementById("hIcon").childNodes[1]){
        orphan = document.getElementById("hIcon");
        orphan.removeChild(orphan.childNodes[1]);
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
        var aMessage3 = document.createTextNode(" *required field");
        var aElement3 = document.createElement("ALERT");
        aElement3.setAttribute("style", "color:red; font-size:small;");
        aElement3.appendChild(aMessage3);

        if(document.getElementById("hWeekly").childNodes[1]){
            orphan = document.getElementById("hWeekly");
            orphan.removeChild(orphan.childNodes[1]);
        }
        document.getElementById("hWeekly").appendChild(aElement3);
        invalidFlag = true;
    }
    else if(document.getElementById("hWeekly").childNodes[1]){
        orphan = document.getElementById("hWeekly");
        orphan.removeChild(orphan.childNodes[1]);
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
        var aMessage4 = document.createTextNode(" *required field");
        var aElement4 = document.createElement("ALERT");
        aElement4.setAttribute("style", "color:red; font-size:small;");
        aElement4.appendChild(aMessage4);

        if(document.getElementById("hDaily").childNodes[1]){
            orphan = document.getElementById("hDaily");
            orphan.removeChild(orphan.childNodes[1]);
        }
        document.getElementById("hDaily").appendChild(aElement4);
        invalidFlag = true;
    }
    else if(document.getElementById("hDaily").childNodes[1]){
        orphan = document.getElementById("hDaily");
        orphan.removeChild(orphan.childNodes[1]);
    }
    if(invalidFlag){
        return false;
    }

    addHabitInStorage(function() {
        pageTransitionOut('list.html');
    });
}

document.body.onunload = function() {
    location.reload(true);
};
