// global variables
var imageSelect;
var weeklySchedule = [];
var dayFreq = 0;
var currentKey = localStorage.getItem("currentKey");
var currentHabit;

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
}

function clearOther() {
    document.getElementById("others").value = null;
}

function updateHabit(callback){
    var habit = {
        title: document.getElementById("title").value,
        icon: imageSelect,
        weekFrequency: weeklySchedule,
        dayFrequency: dayFreq,
        notification: document.getElementById("selectNotification").value,
        currentStreak: currentHabit.currentStreak,
        bestStreak: currentHabit.bestStreak,
        completedToday: currentHabit.completedToday,
        timeCheck: currentHabit.timeCheck
    };

    $firebase.updateHabit(habit, currentKey, function() {
        callback();
        localStorage.setItem("currentKey", null);
        return true;
    });
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
    else if( document.getElementById("hIcon").childNodes[1]){
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

    // validation check
    if(invalidFlag){
        return false;
    }

    if(!updateHabit(function() {pageTransitionOut('list.html');})){
        return false;
    }
}

/*
 * initializes the values of the inputs in the form to the values
 * selected when creating a habit.
*/
function initializeFields(){
    //set the value of the title input field
    document.getElementById("title").value = currentHabit.title;

    //set which icon to be selected by default
    if(currentHabit.icon === "../img/virtue.png"){
        selectImage('icon1');
    }else if(currentHabit.icon === "../img/greyvice.png"){
        selectImage('icon2');
    }else{
        document.getElementById('icon3').src = currentHabit.icon;
        selectImage('icon3');
    }

    //check all day of the week checkboxes that the user selected
    //when creating the habit
    var dateCheckboxes = document.getElementsByName("date");
    for(var i = 0; i<currentHabit.weekFrequency.length; i++){
        var weekDate = currentHabit.weekFrequency[i];
        if(weekDate === "sunday"){
            dateCheckboxes[0].checked = true;
        }
        if(weekDate === "monday"){
            dateCheckboxes[1].checked = true;
        }
        if(weekDate === "tuesday"){
            dateCheckboxes[2].checked = true;
        }
        if(weekDate === "wednesday"){
            dateCheckboxes[3].checked = true;
        }
        if(weekDate === "thursday"){
            dateCheckboxes[4].checked = true;
        }
        if(weekDate === "friday"){
            dateCheckboxes[5].checked = true;
        }
        if(weekDate === "saturday"){
            dateCheckboxes[6].checked = true;
        }
    }

    //set the default value of the day frequency either by
    //checking one of the radio buttons or by setting the
    //value in the 'other' input field
    var dayRadioButtons = document.getElementsByName("day");
    var currentDayFrequency = currentHabit.dayFrequency;
    if(currentDayFrequency == 1){
        dayRadioButtons[0].checked = true;
    }else if(currentDayFrequency == 2){
        dayRadioButtons[1].checked = true;
    }else if(currentDayFrequency == 3){
        dayRadioButtons[2].checked = true;
    }else{
        document.getElementById("others").value = currentDayFrequency;
    }
    document.getElementById("selectNotification").value = currentHabit.notification;


}

function pageTransitionOut(location) {
    console.log("hello!");
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

function isInt(num){
    if(num % 1 === 0){
        return true;
    }else{
        return false;
    }
}

/********************** functions called on load of page ***************/
document.body.onunload = function() {
    location.reload(true);
};
$firebase.getHabit(currentKey, function(habit) {
    currentHabit = habit;
    initializeFields();
});
