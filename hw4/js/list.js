/**************************************************************************************
                            Function Definitions
**************************************************************************************/
var allHabits;
var firstHabitKey;
var lastHabitKey;

/*
 * Function that gets called when clicking the complete habit button, updates
 * the html on the page and also the values in the local storage
*/
function updateMessageDiv(msgElement, habitKey, callback){
    //get the current habit from local storage
    var currentHabit = allHabits[habitKey];

    //update the message showing how close the user is to reaching the daily goal
    currentHabit.completedToday += 1;
    var newMessage = "Completed <strong>" + currentHabit.completedToday + "/" + currentHabit.dayFrequency + "</strong> for today!";
    msgElement.getElementsByClassName("message-today")[0].innerHTML = newMessage;


    //update the progress bar
    var shadeWidth = calculateShadeWidth(currentHabit);
    var lines = msgElement.querySelectorAll("line");
    lines[0].setAttribute("x2", shadeWidth);
    lines[1].setAttribute("x1", shadeWidth);


    //if the user reached their goal for the day, then update their current and best streak,
    //along with redraw the progress bar
    if(currentHabit.completedToday == currentHabit.dayFrequency){
        var streaks = msgElement.querySelectorAll(".message-total strong");
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

function hideMessageAfter3Secs(element, habitKey){
	var listElement = element.parentNode.parentNode;
	var msgElement = (listElement.getElementsByClassName("message"))[0];
    msgElement.style.visibility="hidden";
}

function showMsg(element) {
    var listElement = element.parentNode.parentNode;
    var habitKey = listElement.getAttribute("data-key");
    if(habitKey === null){
        return false;
    }
    var msgElement = (listElement.getElementsByClassName("message"))[0];
    updateMessageDiv(msgElement, habitKey, function() {
        msgElement.style.visibility="visible";
        setTimeout(function () {hideMessageAfter3Secs(element, habitKey);}, 3000);
    });
}

/*
* Function that removes a habit from the array of habits that is stored in local storage
* This method needs to remove the habit at the proper index and also subtract 1 from the data-key
* attribute on all habits after the one getting deleted.  This is because deleting an element from an
* array forces all indeces after it to shift forward by 1.
*/
function deleteHabitFromDB(habitKey, callback){
    /*
    var habitList = N.parse(localStorage.getItem("habitList"));
    var habitListElement = document.querySelectorAll("#habit-list > li");
    for(var i = index + 1; i<habitListElement.length; i++){
        var habitElement = habitListElement[i];
        var habitIndex = habitElement.setAttribute("data-key", i - 1);
    }
    habitList.splice(index, 1);
    localStorage.setItem("habitList", JSON.stringify(habitList));
    $firebase.deleteHabit(habitKey, callback);
    */
}

function deleteHabit(element) {
    var child = element.parentNode.parentNode;
    var habitKey = child.getAttribute("data-key");
    if(habitKey == null){
        return false;
    }
    //only remove the habit from the page if it is successfully removed
    //from storage
    if(deleteHabitFromDB(habitKey)){
        var parent = child.parentNode;
        child.classList.add("anim-slide-out-right-240-5");

        prefixedEvent(child, "AnimationEnd", function() {
            parent.removeChild(child);
        });
    }

    $firebase.deleteHabit(habitKey, function() {
        delete allHabits[habitKey];
        var parent = child.parentNode;
        child.classList.add("anim-slide-out-right-240-5");

        prefixedEvent(child, "AnimationEnd", function() {
            parent.removeChild(child);
        });
    });
}

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
    svg.setAttribute("width", 150);
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
    bottomLine.setAttribute("x2", 150);
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

function clearHabitList(){
    var habitList = document.getElementById("habit-list");
    while(habitList.firstChild){
        habitList.removeChild(habitList.firstChild);
    }
}

function createHabitList(habits, fromWhichMethod){
    allHabits = habits;
    var deletedFlag = false;
    
    if(habits && habits.length != 0){
        var i = 0;
        for (var h in habits) {
            if(!deletedFlag && fromWhichMethod === "next"){
                delete allHabits[h];
                deletedFlag = true;
                continue;
            }
            
            if(i > 2 && fromWhichMethod === "prev"){
                delete allHabits[h];
                continue;
            }
            
            if(i === 0){
                firstHabitKey = h;    
            }
            
            var currentHabit = habits[h];
            var currentDate = new Date();
            currentDate.setHours(0);
            var currentTime = currentDate.getTime();

            //if it is a new day, then reset some values back to zero for some habits
            if(currentTime > currentHabit.timeCheck){
                //if the habit was not completed, then set the current streak back to zero
                if(currentHabit.completedToday < currentHabit.dayFrequency){
                    currentHabit.currentStreak = 0;
                }
                currentHabit.completedToday = 0;
            }
            createHabitElement(currentHabit, h, i);

            //values may have been reset if a new day occured, to reset stuff in local storage
            //localStorage.setItem("habitList", JSON.stringify(habits));
            i = i + 1;
        }
        
        lastHabitKey = h;
    }
}

/* LEAVE UNTIL PAGINATION IS CONFIRMED
function listHabits(callback){
    $firebase.getHabits(function(habits) {
        createHabitList(habits);
        callback();
    });
}
*/

/*
* Function that generates the list of habits on the page on load
*/

////////////////////////PAGINATION//////////////////////////////
function listHabits(callback){
    $firebase.getFirstHabits(function(habits) {
        createHabitList(habits);
        callback();
    });
}

function getPreviousHabits(callback){
    clearHabitList();
    $firebase.getPreviousHabits(function(habits) {
        createHabitList(habits, "prev");
        callback();
    }, firstHabitKey);
}

function getNextHabits(callback){
    clearHabitList();
    $firebase.getNextHabits(function(habits) {
        createHabitList(habits, "next");
        callback();
    }, lastHabitKey);
}
//////////////////////PAGINATION//////////////////////////////////

/*
 * Function that calculates the values that the lines in the svg element
 * need to be drawn with based off the user's current and best streak
*/
function calculateShadeWidth(currentHabit){

    var percentageCompleted = currentHabit.completedToday/currentHabit.dayFrequency;
    var shadeWidth = Math.floor(percentageCompleted * 150);
    if(shadeWidth > 150){
        shadeWidth = 150;
    }
    return shadeWidth;
}

function attachClickListeners(){
    var completedButtons = document.getElementsByClassName("op-done");
    for(var i = 0; i<completedButtons.length; i++){
        completedButtons[i].onclick = function(){
            showMsg(this);
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

/**************************************************************************************
                            Executed On Load of Page
**************************************************************************************/
document.body.onunload = function() {
    location.reload(true);
};
listHabits(function() {
    attachClickListeners();
});
