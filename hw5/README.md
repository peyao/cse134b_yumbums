# Homework 5

View the app here to receive push notifications: http://peyao.me/yumbums/hw4/src/welcome.html

## Login Credentials
Firebase: yumbumsdev@gmail.com : yumbumsdev!
Trackjs: yumbumsdev@gmail.com : yumbumsdev
Mixpanel: yumbumsdev@gmail.com : yumbumsdev

## Repository
https://github.com/peyao/yumbums

## Public Trello
To see what each team member did:
https://trello.com/b/cMPG2Ax2/cse134b-yumbums

## Team Members
    * Amr Kahhaleh
    * Jacob Keifer
    * John Wishon
    * Peter Yao
    * Zarni Wang


## Releases
Check the release/ folder for all the packaged binaries for different operating systems (including mobile).

## User Authentication
We use firebase user authentication APIs to authenticate users and save their habits. At the login screen, users can either login or sign up with an email and password. If they sign up, they'll taken to the welcome page, and if they log in, they'll be taken right into the list page. On the list page, we added a logout button. If a user clicks on logout and try to go back to the list, they'll be redirected to the login page to login again. Habits are now tied to the user account rather than to the local storage, so users can access different habits from different user accounts on one computer. Finally, we added a "Reset password" functionality to the login screen. If a user forgets their password, we send them a temporary password to their account email. They can use that temporary password to login in the next 24 hours. As they login with the temporary password, they'll be redirected to "change password" page that allows them to choose a new password instead of that temporary one.

## Minification, Bundling
We use gulp as a task runner that does all of the minification and bundling of our application through gulp plugins.  It is automated pretty well and all it requires is to run the command 'gulp' in the hw4 directory.  This command runs all of the tasks in 'gulpfile.js' and outputs the new files in a folder called 'dist' that mimics the directory structure of the rest of our application.  This was pretty easy for the most part, the only challenge came with the fact that we weren't always consistent with using relative or abolute paths in our code, so sometimes the code ended up accessing files from the un-optimized code and not from the dist folder.  This was fixed by making all of the paths to be consistently relative.

## Image Spriting
The first step of image spriting is also done using a gulp plugin, and this plugin basically takes all of the .png and .jpg files in our img folder and generates a sprite.png file out of them and also a sprite.css file for us to use in our code.  Image spriting turned out to be pretty difficult to implement in our code because fitting the sprite images exactly inside the habit icons was a challenge and also getting them to look good as the page got resized was a challenge as well.  We had to change the size of some of the images before we created sprites out of them in order to get a sprite grid that was easier to deal with.  We also had to change some of the css that is automatically generated through the gulp plugin in order to get our sprites to look good on the page, so image spriting is not an automated process.  There is a separate command for image spriting and it is 'gulp sprites'.  This command should be run with caution and only when new images are added to the img folder.

## Error Reporting
We are using TrackJs service to handle error reporting because it is very easy to setup. We configure TrackJs to catch every error so that we don't have to modify code from hw4. For hw5 specific code, we specifically use TrackJs's console.error() methods to track errors and user behavior. Specifically in user authentication when a user tries to log in multiple times in succession. Despite TrackJs's claim that they also log network errors and XHR messages, we haven't been able to log error messages from OneSignal.

## Chrome App
We managed to successfully create a simple Chrome app, but we couldn't implement our habit app as a Chrome app because we have to either take one of two routes in our implementation. The first implementation is the easier one where we just link the Chrome app to open the hosted version of our app, but we couldn't implement this because of Chrome's security policy that doesn't let us open a remote page while developing locally. The second implementation is to build a custom UI for the Chrome app and implement all of our habit app's functionality within the Chrome app. The second option would take too much time to implement and meet the deadline.

## Native OS Support Using Electron (W10, OSX, Linux)
We use Electron to package our application so that it runs like a native program on W10, OSX, and Linux. This was a fairly straightforward process that was mostly figuring out how to structure our files to allow for easy packaging. Once that was figured out, the packaging process is the same for packaging to each of the three systems. The output packages are pretty large so they cannot be sent through email. Their packages will be included in the /release folder.

## Phonegap
We use Phonegap to package our webapp for iOS and Android. We ran into some issues with notifications, but the rest is working fine. Another problem we encountered was uploading images on Android, our original code was not opening the Android filepicker. Changing our <input> element to accept all content-types with image/, we were able to get the Android filepicker to open.

## Image Uploads
With the implementation of user accounts, we had to find a solution for saving images on a server. We decided to simply convert images to base64 strings and store them on Firebase as a data URI. When we grab habits, Firebase will send us back the habit with the base64 string.

## Notifications
Notifications work on All operating system using Electron, but we couldn't get OneSignal's Phonegap SDK to installation to work properly. Reading through OneSignal's documentation, they have a separate SDK for Phonegap with a different API. If we had managed to get it to work on Phonegap then, our implementation of it would be to build wrapper functions to handle checking the platform and using the appropriate API to handle receiving and pushing notifications.

##Individual Contributions
```
var JohnWishon = function(){
    - restructured the HTML for add/edit.html files
    - wrote js for adding images to personal image icon field.
    - designed custom default icons for the app.
    - wrote js for in add/edit.js for form validations w/messages.
    - wrote js for adding a habit to local storage.
    - wrote css for add/edit form inputs, validation messages, and labels.
    - created delete habit confirmation check.
    - Integrated Mixpanel analytics.
    - Worked with Peter on Phonegap integration.
    - Worked with Jacob on image sprites.
    - collaborated with teammates at weekly team meetings to discuss our direction with project, and up to completion.
    - YumBums rules!
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
    - Set up Electron and port to OSX, Win10, Linux.
    - Set up Phonegap and port to Android and iOS.
}

var AmrKahhaleh function() {
	- Mainly worked on list.js, list.html, and list.css
	- Re-designing and styling almost all the elements on list.html (desktop and mobile)
	- wrote js for dynamically handling the habits displayed to user on list.html
	- added new header to list.html that includes functionality to navigate between different weekdays to view different tasks
	- wrote js to handle progress bar/message behavior based on user habits
	- Collaborated and met with teammates every week to closely consider the details of how the app looks, feels, and behaves.
	- Did all user-authentication work in Firebase and in login.js, login.html, login.css, changePassword.html, and the logout functionality on list.html
}

var ZarniWang = function() {
	- Worked on the Notifications system
	- Mostly on notification.js, server.js, and onesignal.js
	- Made contributions to vv-firebase.js and list.js to retrieve all habits stored in firebase and filter them by day
	- Integrated OneSignal and Notification.js to handle push notifications and web notifications
	- Collaborated with team to determine the workflow for notifications and how the app will look and function
}
```
