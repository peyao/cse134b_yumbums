/**
 * chrome.app.window.create() takes a url and can open webpages, but Chrome
 * has security restrictions that doesn't let me open remote pages when developing
 * locally. So I'm opening a local html page to show that we can get a chrome app
 * running. Even if we can't open up a webpage for some reason, we can still build
 * a UI for the chrome app within the html page.
 */
chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html');
});
