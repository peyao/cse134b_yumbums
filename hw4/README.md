# Homework 4

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

function JohnWishon(){
    - restructured the HTML for add/edit.html files
    - wrote js for adding images to personal image icon field.
    - designed custom default icons for the app.
    - wrote js for in add/edit.js for form validations w/messages.
    - wrote js for adding a habit to local storage.
    - wrote css for add/edit form inputs, validation messages, and labels.
    - created delete habit confirmation check.
    - collaborated with teammates at weekly team meetings to discuss our direction with project.
}

function JacobKeifer(){
    - wrote js that creates all of the habits in the DOM of list.html based off the data fetched from the database, not the animations
    - added functionality for completing and failing a habit, along with keeping track of the daily streaks
    - added functionality that set default values for form elements in edit.html based off the current habit being edited.
    - added code functionality for deleting habit, not the animation though
    - created message in list.html telling user to add habits if they don't have any.
    - helped migrate our app from using local storage to using Firebase, wrote parts of some of the Firebase accessing methods
    - discussed the ideas for features and implementation of app.
}
