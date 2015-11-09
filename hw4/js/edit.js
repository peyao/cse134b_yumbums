// global variables
var imageSelect;
var weeklySchedule = [];
var dayFreq = 0;
var currentIndex;

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
}

function clearOther() {
    document.getElementById("others").value = null;
}

function updateHabitInStorage(callback){
    var habit = {
        title: document.getElementById("title").value,
        icon: imageSelect,
        weekFrequency: weeklySchedule,
        dayFrequency: dayFreq,
        otherFrequency: 0,
        currentStreak: 0,
        bestStreak: 0,
        completedToday: 0
    };

    var habitList = JSON.parse(localStorage.getItem("habitList"));
    if(!habitList || habitList.length == 0){
        return false;
    }
    habitList[currentIndex] = habit;
    var stringHabit = JSON.stringify(habitList);
    localStorage.setItem("habitList", stringHabit);
    localStorage.setItem("currentIndex", null);
    callback();
    return true;
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

    if(!updateHabitInStorage(function() {
        pageTransitionOut('list.html');
    })){
        return false;
    }
}

/*
 * initializes the values of the inputs in the form to the values
 * selected when creating a habit.
*/
function initializeFields(){
    //get the habit that the user wants to edit
    var habitList = JSON.parse(localStorage.getItem("habitList"));
    currentIndex = localStorage.getItem("currentIndex");
    var currentHabit;
    if(!habitList || habitList.length == 0 || currentIndex == null){
        return false;
    }else{
        currentHabit = habitList[currentIndex];
    }

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
}

/********************** functions called on load of page ***************/
initializeFields();
