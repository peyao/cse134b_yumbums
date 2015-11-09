/**************************************************************************************
                            Function Definitions
**************************************************************************************/

/*
 * Function that gets called when clicking the complete habit button, updates
 * the html on the page and also the values in the local storage
*/
function updateMessageDiv(msgElement, habitIndex){
    //get the current habit from local storage
    var habitList = JSON.parse(localStorage.getItem("habitList"));
    var currentHabit = habitList[habitIndex];

    //update the message showing how close the user is to reaching the daily goal
    currentHabit.completedToday += 1;
    var newMessage = "Completed <strong>" + currentHabit.completedToday + "/" + currentHabit.dayFrequency + "</strong> for today!";
    msgElement.getElementsByClassName("message-today")[0].innerHTML = newMessage;

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
        var shadeWidth = calculateShadeWidth(currentHabit);
        var lines = msgElement.querySelectorAll("line");
        lines[0].setAttribute("x2", shadeWidth);
        lines[1].setAttribute("x1", shadeWidth);
    }

    //commit the changes back to local storage
    localStorage.setItem("habitList", JSON.stringify(habitList));
}

function showMsg(element) {
    var listElement = element.parentNode.parentNode;
    var habitIndex = listElement.getAttribute("data-index");
    if(habitIndex === null){
        return false;
    }
    var msgElement = (listElement.getElementsByClassName("message"))[0];
    updateMessageDiv(msgElement, parseInt(habitIndex));
    msgElement.style.visibility="visible";
}

/*
* Function that removes a habit from the array of habits that is stored in local storage
* This method needs to remove the habit at the proper index and also subtract 1 from the data-index
* attribute on all habits after the one getting deleted.  This is because deleting an element from an
* array forces all indeces after it to shift forward by 1.
*/
function deleteHabitInStorage(index){
    var habitList = JSON.parse(localStorage.getItem("habitList"));
    var habitListElement = document.querySelectorAll("#habit-list > li");
    for(var i = index + 1; i<habitListElement.length; i++){
        var habitElement = habitListElement[i];
        var habitIndex = habitElement.setAttribute("data-index", i - 1);
    }
    habitList.splice(index, 1);
    localStorage.setItem("habitList", JSON.stringify(habitList));
    return true;
}

function deleteHabit(element) {
    var child = element.parentNode.parentNode;
    var habitIndex = parseInt(child.getAttribute("data-index"));
    if(habitIndex == null){
        return false;
    }
    //only remove the habit from the page if it is successfully removed
    //from storage
    if(deleteHabitInStorage(habitIndex)){
        var parent = child.parentNode;
        child.classList.add("anim-slide-out-right-240-5");

        prefixedEvent(child, "AnimationEnd", function() {
            parent.removeChild(child);
        });
    }
}

function createHabitNameListElement(currentHabit){
    var habitNameListElement = document.createElement("LI");
    var habitNameDiv = document.createElement("DIV");
    var habitNameText = document.createTextNode(currentHabit.title);
    habitNameDiv.setAttribute("class", "habit-name");
    habitNameDiv.appendChild(habitNameText);
    habitNameListElement.appendChild(habitNameDiv);
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

    var editButton = document.createElement("BUTTON");
    editButton.setAttribute("class", "op op-edit");
    editButton.setAttribute("type", "button");
    editButton.setAttribute("title", "edit habit");
    var editImage = document.createElement("IMG");
    editImage.setAttribute("src", "../img/edit.svg");
    editImage.setAttribute("alt", "Edit");
    editButton.appendChild(editImage);

    var deleteButton = document.createElement("BUTTON");
    deleteButton.setAttribute("class", "op op-del");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("title", "delete habit");
    var deleteImage = document.createElement("IMG");
    deleteImage.setAttribute("src", "../img/delete.svg");
    deleteImage.setAttribute("alt", "Del");
    deleteButton.appendChild(deleteImage);

    habitOpDiv.appendChild(doneButton);
    habitOpDiv.appendChild(editButton);
    habitOpDiv.appendChild(deleteButton);
    return habitOpDiv;
}

/*
* Function that generates the contents for a single habit
*/
function createHabitElement(currentHabit, index){
    var habit = document.createElement("LI");
    habit.setAttribute("class", "anim-slide-in-right-" + (index+1));
    habit.setAttribute("data-index", index);
    var habitInfo = createHabitInfoElement(currentHabit);
    var messageDiv = createHabitMessageElement(currentHabit);
    var habitOpDiv = createHabitOpElement(currentHabit);
    habit.appendChild(habitInfo);
    habit.appendChild(messageDiv);
    habit.appendChild(habitOpDiv);
    document.getElementById("habit-list").appendChild(habit);
}

/*
* Function that generates the list of habits on the page
*/
function listHabits(){
    var habits = JSON.parse(localStorage.getItem("habitList"));
    console.log(JSON.stringify(habits, null, 2));
    if(habits && habits.length != 0){
        for(var i = 0; i<habits.length; i++){
            var currentHabit = habits[i];
            createHabitElement(currentHabit, i);
        }
    }
}

/*
 * Function that calculates the values that the lines in the svg element
 * need to be drawn with based off the user's current and best streak
*/
function calculateShadeWidth(currentHabit){
    if(currentHabit.bestStreak === 0){
        return 0;
    }
    var percentageCompleted = currentHabit.currentStreak/currentHabit.bestStreak;
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

    var completedButtons = document.getElementsByClassName("op-edit");
    for(var i = 0; i<completedButtons.length; i++){
        //When trying to edit the habit, the index of the habit being edited
        //needs to be set in local storage so that edit.js can retrieve the
        //value and no which habit in the habitList to edit.
        completedButtons[i].onclick = function(){
            var child = this.parentNode.parentNode;
            var habitIndex = parseInt(child.getAttribute("data-index"));
            if(habitIndex == null){
                return false;
            }
            localStorage.setItem("currentIndex", habitIndex);
            //location.href='edit.html';
            pageTransitionOut('edit.html');
        };
    }

    var completedButtons = document.getElementsByClassName("op-del");
    for(var i = 0; i<completedButtons.length; i++){
        completedButtons[i].onclick = function(){
            deleteHabit(this);
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
listHabits();
attachClickListeners();
