# Homework 4

## Notifications

Our choice of technology:

We use OneSignal Push Notification service for Chrome (desktop and mobile) and Safari (desktop). We first tried out
Goroost, but we eventually moved onto OneSignal for multiple reasons. OneSignal has a free plan and allows us to register
multiple domains and does not restrict us in the features and platforms available to us. While Goroost only has a 30
day free trial for 1 registered domain, no Safari support for a trial account, and no support for pushing to target subscribers. 
Having multiple domains was a big deal in our decision because we needed a domain for localhost so we can test on 
our locally and a second domain to deploy and turnin. OneSignal also has SDK support for native Android and iOS platforms
along with JavaScript bindings for mobile (i.e. Cordova) that will be useful for us in the next assignment.

**Limitations of Technology and Scope of Project**

Given the scope of the project, we didn't setup a server to handle server sided code execution (only hosting and
delivery of our files). So we have to handle all our operations client side. So this raises security issues like
making ReST api calls for notification pushing and storing API keys that are supposed to be kept secret on the client.

**Features**

- Can add notifications for each habit to run at 20 seconds (for grading), 15 minutes, 30 minutes, 25 minutes, etc. intervals
- Can receive push notifications on Chrome, Chrome mobile, and OSX Safari
- Can receive web notifications, if push isn't supported, on Firefox, Firefox mobile, iOS Safari
- Can receive notification on Internet Explorer when the site is pinned

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