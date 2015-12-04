function onClickSignUp() {
  var signUpText = document.getElementById("signInMessage");
  signUpText.style.display = "block";
}

document.body.onload = function(){
  mixpanel.track('Page Loaded', {'Page Name': 'Login Page'});
}