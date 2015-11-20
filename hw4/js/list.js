/**************************************************************************************
                            Function Definitions
**************************************************************************************/
var allHabits = {};
//var lastHabitKey;  //variable needed for adding habits to the bottom of the page as user scrolls
var habitsForDay = {};
var currentDayIndex = 0;

/*
 * Function that gets called when clicking the complete habit button, updates
 * the html on the page and also the values in the local storage
*/
function updateMessageDiv(msgElement, messageType, habitKey, callback){
    //get the current habit from local storage
    var currentHabit = allHabits[habitKey];

    var streaks = msgElement.querySelectorAll(".message-total strong");
    var newMessage;

    //update the message showing how close the user is to reaching the daily goal
    if(messageType == "complete"){
        currentHabit.completedToday += 1;
        if (currentHabit.completedToday <= currentHabit.dayFrequency){
	        newMessage = "Completed <strong>" + currentHabit.completedToday + "/" + currentHabit.dayFrequency + "</strong> for today!";
        } else {
	        newMessage = "Completed <strong>" + currentHabit.dayFrequency + "/" + currentHabit.dayFrequency + "</strong> goal + <strong>" + (currentHabit.completedToday-currentHabit.dayFrequency) +" More!</strong>" ;        
	    }
        
    }
    else{
        currentHabit.completedToday = 0;
        currentHabit.currentStreak = 0;
        streaks[0].innerHTML = 0;
        newMessage = "Too bad, try again next time.";
    }

    msgElement.getElementsByClassName("message-today")[0].innerHTML = newMessage;


    //update the progress bar
    var shadeWidth = calculateShadeWidth(currentHabit);
    var lines = msgElement.querySelectorAll("line");
    lines[0].setAttribute("x2", shadeWidth);
    lines[1].setAttribute("x1", shadeWidth);


    //if the user reached their goal for the day, then update their current and best streak,
    //along with redraw the progress bar
    if(currentHabit.completedToday == currentHabit.dayFrequency){
        currentHabit.currentStreak += 1;
        streaks[0].innerHTML = currentHabit.currentStreak;
        if(currentHabit.currentStreak > currentHabit.bestStreak){
            currentHabit.bestStreak = currentHabit.currentStreak;
            streaks[1].innerHTML = currentHabit.bestStreak;
        }
    }

    //commit the changes back to local storage
    //localStorage.setItem("habitList", JSON.stringify(habitList));
    $firebase.updateHabit(currentHabit, habitKey, callback);
}

function hideMessageAfter3Secs(element){
	var listElement = element.parentNode.parentNode;
	var msgElement = (listElement.getElementsByClassName("message"))[0];
    msgElement.style.visibility="hidden";
}

/*
* function that displays a message containing their current daily streak
* after the user completes or fails a habit.
*/
function showMsg(element, messageType) {
    var listElement = element.parentNode.parentNode;
    var habitKey = listElement.getAttribute("data-key");
    if(habitKey === null){
        return false;
    }
    var msgElement = (listElement.getElementsByClassName("message"))[0];
    updateMessageDiv(msgElement, messageType, habitKey, function() {
        msgElement.style.visibility="visible";
        setTimeout(function () {hideMessageAfter3Secs(element);}, 3000);
    });
}

function deleteHabit(element) {
    var child = element.parentNode.parentNode;
    var habitKey = child.getAttribute("data-key");
    if(habitKey == null){
        return false;
    }

    $firebase.deleteHabit(habitKey, function() {
        delete allHabits[habitKey];
        var parent = child.parentNode;
        child.classList.add("anim-slide-out-right-240-5");

        prefixedEvent(child, "AnimationEnd", function() {
            parent.removeChild(child);

            //reset the value of lastHabitKey if the last habit in the list was deleted
            /*var habitListElements = document.getElementById("habit-list").children;
            if(habitListElements.length === 0){
                lastHabitKey = null;
            }else{
                lastHabitKey = habitListElements[habitListElements.length - 1].getAttribute("data-key");
            }*/
        });
    });
}
function updateListHeaderWithDay(day){
	document.getElementById("daySelector").innerHTML = (day)
}

function checkDay() {
	var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var today = new Date();
    var weekday = days[today.getDay()];
    currentDayIndex = today.getDay();
    return weekday;
} /* END checkDay() */

function createHabitNameListElement(currentHabit){
    var habitNameListElement = document.createElement("LI");
    var habitNameDiv = document.createElement("DIV");
    var habitNameText = document.createTextNode(currentHabit.title);
    habitNameDiv.setAttribute("class", "habit-name");
    var habitEditDeleteOpElementDiv = createHabitEditDeleteSmallOpElements (currentHabit);
    habitNameDiv.appendChild(habitNameText);
    habitNameListElement.appendChild(habitNameDiv);
    habitNameListElement.appendChild(habitEditDeleteOpElementDiv);
    return habitNameListElement;
}

function createHabitIconListElement(currentHabit){
    var habitIconListElement = document.createElement("LI");
    var habitIconImage = document.createElement("IMG");
    habitIconImage.setAttribute("class", "habit-icon");
    habitIconImage.setAttribute("src", currentHabit.icon);
    habitIconImage.setAttribute("alt", "Habit Icon");
    habitIconListElement.appendChild(habitIconImage);
    return habitIconListElement;
}

/*
 * Function that generates the html for the title of the habit and
 * the icon for the habit
*/
function createHabitInfoElement(currentHabit){
    var habitInfo = document.createElement("UL");
    habitInfo.setAttribute("class", "habit-info");
    var habitNameListElement = createHabitNameListElement(currentHabit);
    var habitIconListElement = createHabitIconListElement(currentHabit);
    habitInfo.appendChild(habitNameListElement);
    habitInfo.appendChild(habitIconListElement);
    return habitInfo;
}

function createMessageTotalSpan(currentHabit){
    var shadeWidth = calculateShadeWidth(currentHabit);

    var messageTotalSpan = document.createElement("SPAN");
    messageTotalSpan.setAttribute("class", "message-total");
    var currentStreakStrong = document.createElement("STRONG");
    var currentStreakText = document.createTextNode(currentHabit.currentStreak);
    currentStreakStrong.appendChild(currentStreakText);
    var messageTotalText = document.createTextNode(" days in a row! Best Record: ");
    var bestStreakStrong = document.createElement("STRONG");
    var bestStreakText = document.createTextNode(currentHabit.bestStreak);
    bestStreakStrong.appendChild(bestStreakText);
    var breakElement = document.createElement("BR");


    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", 180);
    svg.setAttribute("height", 25);
    var topLine = document.createElementNS(NS, "line");
    topLine.setAttribute("x1", 0);
    topLine.setAttribute("y1", 0);
    topLine.setAttribute("x2", shadeWidth);
    topLine.setAttribute("y2", 0);
    topLine.setAttribute('stroke', "rgba(65, 131, 215, 0.8)");
    topLine.setAttribute('stroke-width', 25);
    var bottomLine = document.createElementNS(NS, "line");
    bottomLine.setAttribute("x1", shadeWidth);
    bottomLine.setAttribute("y1", 0);
    bottomLine.setAttribute("x2", 180);
    bottomLine.setAttribute("y2", 0);
    bottomLine.setAttribute('stroke', "rgba(171,171,171,0.6)");
    bottomLine.setAttribute('stroke-width', 25);
    svg.appendChild(topLine);
    svg.appendChild(bottomLine);

    messageTotalSpan.appendChild(currentStreakStrong);
    messageTotalSpan.appendChild(messageTotalText);
    messageTotalSpan.appendChild(bestStreakStrong);
    messageTotalSpan.appendChild(breakElement);
    messageTotalSpan.appendChild(svg);
    return messageTotalSpan;
}

function createMessageTodaySpan(currentHabit){
    var messageTodaySpan = document.createElement("SPAN");
    messageTodaySpan.setAttribute("class", "message-today");
    var tempTextNode = document.createTextNode("Completed ");
    var timesCompletedStrong = document.createElement("STRONG");
    var timesCompletedText = document.createTextNode(currentHabit.completedToday + "/" + currentHabit.dayFrequency);
    timesCompletedStrong.appendChild(timesCompletedText);
    var tempTextNode2 = document.createTextNode(" for today!");
    messageTodaySpan.appendChild(tempTextNode);
    messageTodaySpan.appendChild(timesCompletedStrong);
    messageTodaySpan.appendChild(tempTextNode2);
    return messageTodaySpan;
}

/*
 * Function that displays numeric feedback about how many times they have completed a habit
*/
function createHabitMessageElement(currentHabit){
    var messageDiv = document.createElement("DIV");
    messageDiv.setAttribute("class", "message");
    var messageTotalSpan = createMessageTotalSpan(currentHabit);
    var messageTodaySpan = createMessageTodaySpan(currentHabit);
    var breakElement = document.createElement("BR");
    messageDiv.appendChild(messageTotalSpan);
    messageDiv.appendChild(breakElement);
    messageDiv.appendChild(messageTodaySpan);
    return messageDiv;
}

/*
 * Function that generates the buttons next to the title of each habit
 * that allow for editing, deleting of a habit
 */
function createHabitEditDeleteSmallOpElements(currentHabit){
	var habitOpDiv = document.createElement("DIV");
    habitOpDiv.setAttribute("class", "edit-delete");

    var editButton = document.createElement("BUTTON");
    editButton.setAttribute("class", "smallOp op-edit");
    editButton.setAttribute("type", "button");
    editButton.setAttribute("title", "edit habit");
    var editImage = document.createElement("IMG");
    editImage.setAttribute("src", "../img/edit.svg");
    editImage.setAttribute("alt", "Edit");
    editButton.appendChild(editImage);

    var deleteButton = document.createElement("BUTTON");
    deleteButton.setAttribute("class", "smallOp op-del");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("title", "delete habit");
    var deleteImage = document.createElement("IMG");
    deleteImage.setAttribute("src", "../img/delete.svg");
    deleteImage.setAttribute("alt", "Del");
    deleteButton.appendChild(deleteImage);

    habitOpDiv.appendChild(editButton);
    habitOpDiv.appendChild(deleteButton);
    return habitOpDiv;
}

/*
 * Function that generates the buttons at the bottom of each habit
 * that allow for editing, deleting, and marking completion of a habit
*/
function createHabitOpElement(currentHabit){
    var habitOpDiv = document.createElement("DIV");
    habitOpDiv.setAttribute("class", "habit-op");

    var doneButton = document.createElement("BUTTON");
    doneButton.setAttribute("class", "op op-done");
    doneButton.setAttribute("type", "button");
    doneButton.setAttribute("title", "done");
    var doneImage = document.createElement("IMG");
    doneImage.setAttribute("src", "../img/done.svg");
    doneImage.setAttribute("alt", "Done");
    doneButton.appendChild(doneImage);

    var failedButton = document.createElement("BUTTON");
    failedButton.setAttribute("class", "op op-failed");
    failedButton.setAttribute("type", "button");
    failedButton.setAttribute("title", "failed");
    var failedImage = document.createElement("IMG");
    failedImage.setAttribute("src", "../img/x.svg");
    failedImage.setAttribute("alt", "failed");
    failedButton.appendChild(failedImage);

    habitOpDiv.appendChild(doneButton);
    habitOpDiv.appendChild(failedButton);
    return habitOpDiv;
}

/*
* Function that generates the contents for a single habit
*/
function createHabitElement(currentHabit, habitKey, index){
    var habit = document.createElement("LI");
    habit.setAttribute("class", "anim-slide-in-right-" + (index+1));
    habit.setAttribute("data-key", habitKey);
    var habitInfo = createHabitInfoElement(currentHabit);
    var messageDiv = createHabitMessageElement(currentHabit);
    var habitOpDiv = createHabitOpElement(currentHabit);
    habit.appendChild(habitInfo);
    habit.appendChild(messageDiv);
    habit.appendChild(habitOpDiv);
    document.getElementById("habit-list").appendChild(habit);
}

function getWeekday() {
    var today = new Date().getDay();
    switch (today) {
        case 0:
            return "sunday";
        case 1:
            return "monday";
        case 2:
            return "tuesday";
        case 3:
            return "wednesday";
        case 4:
            return "thursday";
        case 5:
            return "friday";
        case 6:
            return "saturday";
    }
}

/*
 * Function that takes an object containing the habits to put on the page
 * for the current day and prints them to the page.
*/
function createHabitList(habits /*,fromWhichMethod*/){
    //var deletedFlag = false;
    if(habits){
        var i = 0;
        for (var h in habits) {

            /*
            var today = getWeekday();
            if (habits[h].weekFrequency.indexOf(today) === -1) {
                console.log("Skipping...");
                continue;
            }
            */

            //when retrieving habits as user scrolls down the page, firebase always returns one
            //extra result from the database.  This extra habit is the same habit as the last habit
            //on the page before the user scrolled.  This basically skips over the extra habit so it
            //is not put on the page twice
            /*if(!deletedFlag && fromWhichMethod === "next"){
                deletedFlag = true;
                continue;
            }*/

            var currentHabit = habits[h];
            var currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            var currentTime = currentDate.getTime(); //time at the start of the current day

            //if it is a new day, then reset some values back to zero for some habits
            if(currentTime > currentHabit.timeCheck){
                //if the habit was not completed, then set the current streak back to zero
                if(currentHabit.completedToday < currentHabit.dayFrequency){
                    currentHabit.currentStreak = 0;
                }
                currentHabit.completedToday = 0;
                currentHabit.timeCheck = currentTime; //just set time check to beginning of the day
                $firebase.updateHabit(currentHabit, h, function(){}); //no need for a callback, can just be asynchronous
            }
            createHabitElement(currentHabit, h, i);

            i = i + 1;
        }

        //lastHabitKey = h; //set last habit key equal to the last habit iterated over
    }
}

/*
* Function that calls other functions for retrieving and printing the habits on the page
*/
function listHabits(day, callback){
    getHabitsForDay(day, function() {
        if(Object.keys(habitsForDay).length === 0) {
            document.getElementById("noHabitsDisplay").style.display = "block";
        }else{
            document.getElementById("noHabitsDisplay").style.display = "none";
        }
        createHabitList(habitsForDay);
        callback();
    });
}

/*function getNextHabits(callback){
    if(!lastHabitKey){
        return;
    }
    
    
    $firebase.getNextHabits(function(habits) {
        createHabitList(habits, "next");
        callback();
    }, lastHabitKey);
}*/

/*
 * function that uses takes an input an object containing habits and
 * creates an object containing the habits corresponding to the current day
 * and creates an object containing habits for all days. 
*/
function createLocalHabitObjects(habits, today, callback){
    habitsForDay = {};
    for(h in habits) {
        var habit = habits[h];
        for(i in habit.weekFrequency) {
            if(today.toLowerCase() === habit.weekFrequency[i].toLowerCase()) {
                habitsForDay[h] = habit;
            }
        }
        allHabits[h] = habit;
    }
    callback();
}

/*
* Function that retrieves all habits for the current user from the database or a local
* object.  On page load, the habits will be retrieved from Firebase, but afterwards
* the habits will be retrieved from the local object allHabits
*/
function getHabitsForDay(today, callback) {
    if(Object.keys(allHabits).length === 0){
        $firebase.getAllHabits(function(habits) {
            createLocalHabitObjects(habits, today, callback);
        });
    }else{
        createLocalHabitObjects(allHabits, today, callback);
    }
    
}
//////////////////////PAGINATION//////////////////////////////////

/*
 * Function that calculates the values that the lines in the svg element
 * need to be drawn with based off the user's current and best streak
*/
function calculateShadeWidth(currentHabit){

    var percentageCompleted = currentHabit.completedToday/currentHabit.dayFrequency;
    var shadeWidth = Math.floor(percentageCompleted * 180);
    if(shadeWidth > 180){
        shadeWidth = 180;
    }
    return shadeWidth;
}

function attachClickListeners(){
    var completedButtons = document.getElementsByClassName("op-done");
    for(var i = 0; i<completedButtons.length; i++){
        completedButtons[i].onclick = function(){
            showMsg(this, "complete");
        };
    }
    var editButtons = document.getElementsByClassName("op-edit");
    for(var i = 0; i<editButtons.length; i++){
        //When trying to edit the habit, the index of the habit being edited
        //needs to be set in local storage so that edit.js can retrieve the
        //value and no which habit in the habitList to edit.
        editButtons[i].onclick = function(){
            var child = this.parentNode.parentNode.parentNode.parentNode;
            var habitKey = child.getAttribute("data-key");
            if(habitKey == null){
                return false;
            }
            localStorage.setItem("currentKey", habitKey);
            pageTransitionOut('edit.html');
        };
    }

    var deleteButtons = document.getElementsByClassName("op-del");
    for(var i = 0; i<deleteButtons.length; i++){
        deleteButtons[i].onclick = function(){
            if (window.confirm("Are you sure you want to delete this habit?")) {
                deleteHabit(this.parentNode.parentNode);
            }
        };
    }

    var failedButtons = document.getElementsByClassName("op-failed");
    var failedLength = failedButtons.length;
    for(var i = 0; i<failedLength; i++){
        failedButtons[i].onclick = function(){
            showMsg(this, "failed");
        }
    }
    
    var nextDayButton = document.getElementById("rightDaySelectorButton");
    nextDayButton.onclick = function(){
        var nextDayIndex = getNextDay(currentDayIndex);
        updateListHeaderWithDay(dayText(nextDayIndex));
        currentDayIndex = nextDayIndex;
        removeHabitsFromPage();
        listHabits(dayText(nextDayIndex), function() {
            attachClickListeners();
            //window.onscroll = scrollListener;
        });
    };
    
    var previousDayButton = document.getElementById("leftDaySelectorButton");
    previousDayButton.onclick = function(){
        var previousDayIndex = getPreviousDay(currentDayIndex);
        updateListHeaderWithDay(dayText(previousDayIndex));
        currentDayIndex = previousDayIndex;
        removeHabitsFromPage();
        listHabits(dayText(previousDayIndex), function() {
            attachClickListeners();
            //window.onscroll = scrollListener;
        });
    };
}

/*
* function that clears out all of the habits on the page, this is uded
* when selecting a different day to view habits for because the page
* needs to remove the current habits before it can put the new ones on.
*/
function removeHabitsFromPage(){
    var habitPageList = document.querySelectorAll("#habit-list > li");
    var listLength = habitPageList.length;
    for(var i = 0; i<listLength; i++){
        habitPageList[i].parentNode.removeChild(habitPageList[i]);
    }
}

function getPreviousDay(currentDay){
	switch (currentDay) {
        case 6:
            return 5;
        case 5:
            return 4;
        case 4:
            return 3;
        case 3:
            return 2;
        case 2:
            return 1;
        case 1:
            return 0;
        case 0:
            return 6;
    }
}

function getNextDay(currentDay){
	switch (currentDay) {
        case 6:
            return 0;
        case 5:
            return 6;
        case 4:
            return 5;
        case 3:
            return 4;
        case 2:
            return 3;
        case 1:
            return 2;
        case 0:
            return 1;
    }
}

//function that converts an integer value into a string representaion of the day
function dayText(dayIndex){
	switch (dayIndex) {
        case 6:
            return "Saturday";
        case 5:
            return "Friday";
        case 4:
            return "Thursday";
        case 3:
            return "Wednesday";
        case 2:
            return "Tuesday";
        case 1:
            return "Monday";
        case 0:
            return "Sunday";
    }
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

//listener attached to window that fires every time user scrolls.  Basically checks if the
//user has scrolled to the bottom of the page or not and retrieves the next 3 habits from the
//database if this is true.
/*function scrollListener(){
    var bodyElement = document.body,
    htmlElement = document.documentElement;

    //browser conformant way to find height of document
    var documentHeight = Math.max( bodyElement.scrollHeight, bodyElement.offsetHeight,
                    htmlElement.clientHeight, htmlElement.scrollHeight, htmlElement.offsetHeight );

    //browser conformant way to get height that user has scrolled to on page
    var supportPageOffset = window.pageXOffset !== undefined;
    var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    var scrollHeight = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;

    //checks if the user has scrolled to the bottom
    if(scrollHeight + window.innerHeight >= documentHeight){
        getNextHabits(attachClickListeners, lastHabitKey);
    }
}*/

function printJson(s){
    console.log(JSON.stringify(s));
}

/**************************************************************************************
                            Executed On Load of Page
**************************************************************************************/
document.body.onunload = function() {
    location.reload(true);
};

updateListHeaderWithDay(checkDay());

listHabits(checkDay(), function() {
    attachClickListeners();
    //window.onscroll = scrollListener;
});
