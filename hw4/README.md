# Homework 4

View the app here to receive push notifications: http://peyao.me/yumbums/hw4/src/welcome.html

## XSS

The only text input fields we give to the user are for the habit title and daily frequency. Daily frequency will not
accept any input that is not a number while habit title does accept script tags. But we prevent the injected scripts
from executing by putting it into the DOM, in list.html, using the document.createTextNode() so it is interpreted as
text rather than an html node. But since everything is client side, anyone malicious enough to try script injection
can just modify the javascript code to get around any client side protection.

## Notifications

*Our choice of technology*:

We use OneSignal Push Notification service for Chrome (desktop and mobile) and Safari (desktop). We first tried out
Goroost, but we eventually moved onto OneSignal for multiple reasons. OneSignal has a free plan and allows us to register multiple domains and does not restrict us in the features and platforms available to us. While Goroost only has a 30 day free trial for 1 registered domain, no Safari support for a trial account, and no support for pushing to target subscribers. Having multiple domains was a big deal in our decision because we needed a domain for localhost so we can test on our app locally and a second domain for deploying and turning in. OneSignal also gives us the option of scheduling and cancelling scheduled notifications. OneSignal has SDK support for native Android and iOS platforms along with JavaScript bindings for mobile (i.e. Cordova) that will be useful for us in the next assignment if it ever goes in that direction.

We also use Notification.js as a fallback to handle web notifications when push notification isn't supported (i.e. Firefox, Internet Explorer). We decided to use this small library instead of implementing web notifications on our own because it support multiple browsers, including mobile.

**Features**

- Can add notifications for each habit to run at 20 seconds (for grading), 15 minutes, 30 minutes, 25 minutes, etc. intervals
- Can receive push notifications on Chrome, Chrome mobile, and OSX Safari
- Can receive web notifications, if push isn't supported, on Firefox, Firefox mobile, iOS Safari
- Can receive notification on Internet Explorer when the site is pinned

**Implications of client side for notifications**

Given the scope of the project, we didn't setup a server to handle server sided code execution (only hosting and
delivery of our files). So we have to handle all our operations client side. This raises security issues like
making ReST api calls for notification pushing and storing API keys and other secrets on the client. Since we don't
have a server, our current implementation of checking and sending notifications does not work when the tabs are closed. However, we are able to receive push notifications even with closed tabs when pushed from the OneSignal dashboard. We can solve this issue by scheduling notifications and adding signal callbacks to our data in Firebase so
that we are notified whenever notification options are changed so we can cancel scheduled notifications as needed.

The benefits of the client side however, also simplifies our application in a big way. Since we are already within
the user context, each client only manages one user (we are assuming the user is already logged into our app)
so our javascript code only has to deal with the habits and notifications of a single user. This saves us the work of
having to manage which user to send what notification and possibly even where to send the notification if the user has
multiple browsers and platforms from the server side.

**Supported Platforms**

- Push
    - Chrome / Chrome Mobile
    - OSX Safari
- Web
    - Firefox / Firefox Mobile
    - Internet Explorer (requires pinned sites)
    - Safari Mobile

## General Changes to Previous Design
1) Added an X button next to the green complete button for a habit that represents not completing a habit.  The functionality of what this button was supposed to do was a little vague so our team decided on the following functionality.  When clicked, the daily amount of times that a habit had been completed for the day gets set back to 0.  Also, it resets the user's current streak for that habit back to 0, so if they had completed the habit 4 days in a row but then clicked the X button, then their current streak goes back to 0.

2) Another change was to make it so when the user goes to list.html, only the habits for the current day are displayed.  We felt like the selecting weekday functionality in add.html made no sense unless habits only showed up on the days that you specified them to show up.  One problem with this is that the user might still want to view or edit habits from other weekdays than the current day. So we added functionality that allows users to view habits for each day of the week by clicking on the left or right arrows which moves you to a different day. This allows users to see their habits for any day of the week if they want to, but since the page defaults to the current day, it will not force them to make many clicks in order to get to the current day, which they are probably more interested in.

3) We moved the + button on list.html from the bottom right of the screen to the top of the screen, and made it so it is fixed on top of the screen as the user scrolls down.  We did this because sometimes the + button would not be visible on some screen sizes, and also the + button was sometimes hard to notice when it was at the bottom right of the screen.  Moving the button so that it is fixed to the top of the screen makes it so it is more visible and easier to find, but still not in the user's way as they are trying to view habits.

4) We moved the edit and delete button for each habit to the top right of each habit card and made them much smaller.  The edit and delete button are not likely to be used very often, so we decided it was best to move them away from the user's main focus point in the habit card.  They are still visible and obvious on what they do, but the two buttons don't divert the attention away from the rest of the elements in the habit card.  We didn't hide them in a slider because we felt that swiping the screen in order to see options may not be entirely obvious to many users, so they wouldn't know how to edit or delete habits.

5) We changed the message that displays for when a user completes a habit.  We made it so that if the user completed a habit more times in a day than they specified as their goal when creating a habit, they would get a message indicating how many more times above their goal they achieved for the day.  We did this because it can be more satisfactory to a user to see how much they are overachieving instead of just saying they reached their goal.  Even though this is a little thing, it can make the user feel happier with themselves and encourage them to keep completing their habits.  Also, the message disappears after 3 seconds because we decided that it doesn't make sense to leave congratulatory messages on the page especially if the user leaves the browser tab open for long periods of time.  For example, if a user completed a habit but left their browser tab open, they would still see the message the next day when they view it, which is misleading because the new day resets the daily completed values.

6) We shifted the Check and X buttons to be centered with the progress bar. We felt like their initial location was a little weird and the connection to the progress bar didn't feel so intuitive. Centering them under the progress bar would automatically strengthen their relationship and purpose in the user's head.

##Individual Contributions
var JohnWishon = function(){
    - restructured the HTML for add/edit.html files
    - wrote js for adding images to personal image icon field.
    - designed custom default icons for the app.
    - wrote js for in add/edit.js for form validations w/messages.
    - wrote js for adding a habit to local storage.
    - wrote css for add/edit form inputs, validation messages, and labels.
    - created delete habit confirmation check.
    - collaborated with teammates at weekly team meetings to discuss our direction with project.
}

var JacobKeifer = function(){
    - wrote js that creates all of the habits in the DOM of list.html based off the data fetched from the database, not the animations
    - added functionality for completing and failing a habit, along with keeping track of the daily streaks
    - added functionality that set default values for form elements in edit.html based off the current habit being edited.
    - added code functionality for deleting habit, not the animation though
    - created message in list.html telling user to add habits if they don't have any.
    - helped migrate our app from using local storage to using Firebase, wrote parts of some of the Firebase accessing methods
    - discussed the ideas for features and implementation of app.
}

var PeterYao = function() {
    - CSS/JS animations & page transitions for all pages.
    - Worked with Jacob on Firebase implementation:
        - Migrate from localstorage to Firebase
        - Getting habits
        - Updating habits
        - Deleting habits
    - Added animated preloaders during Firebase AJAX calls to show loading.
    - Serve site from a live web server (DigitalOcean).
    - Facilitate team task tracking with Trello.
}

var AmrKahhaleh function() {
	- Mainly worked on list.js, list.html, and list.css
	- Re-designing and styling almost all the elements on list.html (desktop and mobile)
	- wrote js for dynamically handling the habits displayed to user on list.html
	- added new header to list.html that includes functionality to navigate between different weekdays to view different tasks
	- wrote js to handle progress bar/message behavior based on user habits
	- Collaborated and met with teammates every week to closely consider the details of how the app looks, feels, and behaves.
}

var ZarniWang = function() {
	- Worked on the Notifications system
	- Mostly on notification.js, server.js, and onesignal.js
	- Made contributions to vv-firebase.js and list.js to retrieve all habits stored in firebase and filter them by day
	- Integrated OneSignal and Notification.js to handle push notifications and web notifications
	- Collaborated with team to determine the workflow for notifications and how the app will look and function
}


# Homework 5

## Minification, Bundling
We use gulp as a task runner that does all of the minification and bundling of our application through gulp plugins.  It is automated pretty well and all it requires is to run the command 'gulp' in the hw4 directory.  This command runs all of the tasks in 'gulpfile.js' and outputs the new files in a folder called 'dist' that mimics the directory structure of the rest of our application.  This was pretty easy for the most part, the only challenge came with the fact that we weren't always consistent with using relative or abolute paths in our code, so sometimes the code ended up accessing files from the un-optimized code and not from the dist folder.  This was fixed by making all of the paths to be consistently relative.

## Image Spriting
The first step of image spriting is also done using a gulp plugin, and this plugin basically takes all of the .png and .jpg files in our img folder and generates a sprite.png file out of them and also a sprite.css file for us to use in our code.  Image spriting turned out to be pretty difficult to implement in our code because fitting the sprite images exactly inside the habit icons was a challenge and also getting them to look good as the page got resized was a challenge as well.  We had to change the size of some of the images before we created sprites out of them in order to get a sprite grid that was easier to deal with.  We also had to change some of the css that is automatically generated through the gulp plugin in order to get our sprites to look good on the page, so image spriting is not an automated process.  There is a separate command for image spriting and it is 'gulp sprites'.  This command should be run with caution and only when new images are added to the img folder.

## Error Reporting
We are using TrackJs service to handle error reporting because it is very easy to setup. We configure TrackJs to catch every error so that we don't have to modify code from hw4. For hw5 specific code, we specifically use TrackJs's console.error() methods to track errors and user behavior. Specifically in user authentication when a user tries to log in multiple times in succession. Despite TrackJs's claim that they also log network errors and XHR messages, we haven't been able to log error messages from OneSignal.

## Chrome App
We managed to successfully create a simple Chrome app, but we couldn't implement our habit app as a Chrome app because we have to either take one of two routes in our implementation. The first implementation is the easier one where we just link the Chrome app to open the hosted version of our app, but we couldn't implement this because of Chrome's security policy that doesn't let us open a remote page. The second implementation is to build a custom UI for the Chrome app and implement all of our habit app's functionality within the Chrome app. The second option would take too much time to implement and meet the deadline.

## Native OS Support Using Electron (W10, OSX, Linux)
We use Electron to package our application so that it runs like a native program on W10, OSX, and Linux. This was a fairly straightforward process that was mostly figuring out how to structure our files to allow for easy packaging. Once that was figured out, the packaging process is the same for packaging to each of the three systems. The output packages are pretty large so they cannot be sent through email. Their packages will be included in the /release folder.

## Phonegap
We use Phonegap to package our webapp for iOS and Android. We ran into some issues with notifications, but the rest is working fine. Another problem we encountered was uploading images on Android, our original code was not opening the Android filepicker. Changing our <input> element to accept all content-types with image/, we were able to get the Android filepicker to open.
