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
        document.getElementById('icon3').setAttribute("class","icon");
        document.getElementById('icon3').setAttribute("onclick", "selectImage('icon3')");
        selectImage('icon3');
    };
}

function selectImage(name) {
    //Clear all the other effects
    document.getElementById('icon1').style.border = "none";
    document.getElementById('icon2').style.border = "none";
    document.getElementById('icon3').style.border = "none";
    //imageSelect = null;
    var image = document.getElementById(name);
    image.style.border = "2px solid #42A5F5";
    imageSelect = image.getAttribute("src");
}

function uncheckradio() {
    var unradio = document.getElementsByName("day");

    for (var i = 0; i < unradio.length - 1; i++) {
        unradio[i].checked = false;
    }
    unradio = document.getElementsByName("notification");
    for ( i = 0; i < unradio.length - 1; i++) {
        unradio[i].checked = false;
    }
}

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

function invalidMess(message){
    var aMessage = document.createTextNode(message);
    var aElement = document.createElement("ALERT");
    aElement.setAttribute("style", "color:red; font-size:small;");
    aElement.appendChild(aMessage);
    return aElement
}

function validateForm() {

    // local variables
    var orphan;
    var invalidFlag = false;
    var rfield = " *required field";
    var efield = " *enter an integer (1-99)";

    // title validation
    if(!document.getElementById("title").value){
        if(document.getElementById("title_text").childNodes[1]){
            orphan = document.getElementById("title_text");
            orphan.removeChild(orphan.childNodes[1]);
        }
        document.getElementById("title_text").appendChild(invalidMess(rfield));
        invalidFlag = true;
    }
    else if(document.getElementById("title_text").childNodes[1]){
        orphan = document.getElementById("title_text");
        orphan.removeChild(orphan.childNodes[1]);
    }

    //icon select validation
    if(imageSelect == null){
        if(document.getElementById("hIcon").childNodes[1]){
            orphan = document.getElementById("hIcon");
            orphan.removeChild(orphan.childNodes[1]);
        }
        document.getElementById("hIcon").appendChild(invalidMess(rfield));
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
        if(document.getElementById("hWeekly").childNodes[1]){
            orphan = document.getElementById("hWeekly");
            orphan.removeChild(orphan.childNodes[1]);
        }
        document.getElementById("hWeekly").appendChild(invalidMess(rfield));
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

    // set daily frequency variable
    if(!selectedradio && dailyOther){
        if(isNaN(dailyOther) || !isInt(dailyOther) || dailyOther < 1 || dailyOther > 99){
            document.getElementById("others").value = null;
            dailyOther = null;
            if(document.getElementById("hDaily").childNodes[1]){
                orphan = document.getElementById("hDaily");
                orphan.removeChild(orphan.childNodes[1]);
            }
            document.getElementById("hDaily").appendChild(invalidMess(efield));
            invalidFlag = true;
        }else{
            dayFreq = parseInt(dailyOther);
        }
    }
    
    else if(!selectedradio && !dailyOther) {
        if(document.getElementById("hDaily").childNodes[1]){
            orphan = document.getElementById("hDaily");
            orphan.removeChild(orphan.childNodes[1]);
        }
        document.getElementById("hDaily").appendChild(invalidMess(rfield));
        invalidFlag = true;
    }
    else if(document.getElementById("hDaily").childNodes[1]){
        orphan = document.getElementById("hDaily");
        orphan.removeChild(orphan.childNodes[1]);
    }

    if (!dailyOther.match(/^0?[1-9]\d?$/ ) ){
        document.getElementById("others").value = null;
        dailyOther = null;
        if(document.getElementById("hDaily").childNodes[1]){
            orphan = document.getElementById("hDaily");
            orphan.removeChild(orphan.childNodes[1]);
        }
        document.getElementById("hDaily").appendChild(invalidMess(efield));
        invalidFlag = true;
    }

    // validation check
    if(invalidFlag) {
        return false;
    }

    addHabitInStorage(function() {
        pageTransitionOut('list.html');
    });
}

document.body.onunload = function() {
    location.reload(true);
};
