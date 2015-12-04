var firebaseRef = new Firebase("https://fiery-heat-9545.firebaseio.com/");

function onClickSignUp() {
	
	var usermail = document.getElementById("usermail").value;
	var password = document.getElementById("password").value;
	console.log('usermail: ' + usermail);
	console.log('password: ' + password);
	
	firebaseRef.createUser({
		email    : usermail,
		password : password
	}, function(error, userData) {
		if (error) {
			var signUpText = document.getElementById("signInMessage");
			switch (error.code) {
			case "EMAIL_TAKEN":
				console.log("Email already taken. Please choose a different email.");
				signUpText.innerHTML = "Email already taken. Please choose a different email.";
				break;
			case "INVALID_EMAIL":
				console.log("Invalid email format. Please enter a valid email address.");
				signUpText.innerHTML = "Invalid email format. Please enter a valid email address.";
				break;
			case "INVALID_PASSWORD":
				console.log("Please enter a valid password.");
				signUpText.innerHTML = "Please enter a valid password.";
				break;
			default:
				console.log("Error signing user up:", error);
    		}
    		signUpText.style.display = "block";
    		
  		} else {
  			console.log("Successfully created user account with uid:", userData.uid);
  			
  			// Create user id on local storage and on firebase
  			localStorage.setItem('userId', userData.uid);
  			
  			$firebase.createUser(function(){
	  			// Login user and then navigate to welcome page
	  			var userObj = {email: usermail, password:password};
	  			firebaseRef.authWithPassword(userObj, function(logInError, authData){
		  			window.location.href = 'welcome.html';
	  			});
  			});
  		}
	});
	
	
	var signUpText = document.getElementById("signInMessage");
	signUpText.style.display = "block";
	
	
}

function onClickSignIn() {
	console.log("pressed Login!");
	
	var usermail = document.getElementById("usermail").value;
	var password = document.getElementById("password").value;
	console.log('usermail: ' + usermail);
	console.log('password: ' + password);
	
	firebaseRef.authWithPassword({
		email    : usermail,
		password : password
	}, function(error, authData) {
		if (error) {
			var signUpText = document.getElementById("signInMessage");
			switch (error.code) {
			case "INVALID_EMAIL":
				console.log("The specified user account email is invalid.");
				signUpText.innerHTML = "Invalid email format. Please enter a valid email address.";
				break;
			case "INVALID_PASSWORD":
				console.log("The specified user account password is incorrect.");
				signUpText.innerHTML = "The password you entered is incorrect. Please try again.";
				break;
			case "INVALID_USER":
				console.log("The specified user account does not exist.");
				signUpText.innerHTML = "This email account does not exist. Please enter a differnet email.";
				break;
			default:
				console.log("Error logging user in:", error);
    		}
    		signUpText.style.display = "block";
    		
  		} else {
  			console.log("Authenticated successfully with payload:", authData);
  			localStorage.setItem('userId', authData.uid);
  			
  			var usersRef = firebaseRef.child('users');
            var pushRef = usersRef.push({
                lastLogin: Date.now()
            });
            
            if (authData.password.isTemporaryPassword) {
	            window.location.href = 'changePassword.html';
			} else {
            	window.location.href = 'list.html';
        	}
  		}
  	}, {
	  	remember: "sessionOnly"
	});
}
function onClickResetPassword(){
	var usermail = document.getElementById("usermail").value;
	firebaseRef.resetPassword({
	  email: usermail
	}, function(error) {
	  if (error) {
		var signUpText = document.getElementById("signInMessage");
	    switch (error.code) {
	      case "INVALID_USER":
	        console.log("The specified user account does not exist.");
	        signUpText.innerHTML = "This email account does not exist. Please enter a differnet email.";
	        break;
	      default:
	        console.log("Error resetting password:", error);
	    }
	    signUpText.style.display = "block";
	  } else {
	    console.log("Password reset email sent successfully!");
	    var signUpText = document.getElementById("signInMessage");
		signUpText.innerHTML = "You'll recieve an email with a new temporary password to login.";
		signUpText.style.display = "block";
	  }
	});
}

function onClickChangePassword(){
	var usermail = document.getElementById("usermail").value;
	var tempPassword = document.getElementById("tempPassword").value;
	var password = document.getElementById("password").value;
	console.log('password: ' + password);
	
	firebaseRef.changePassword({
	  email: usermail,
	  oldPassword: tempPassword,
	  newPassword: password
	}, function(error) {
	  if (error) {
	    switch (error.code) {
	      case "INVALID_PASSWORD":
	        console.log("The specified user account password is incorrect.");
	        break;
	      case "INVALID_USER":
	        console.log("The specified user account does not exist.");
	        break;
	      default:
	        console.log("Error changing password:", error);
	    }
	  } else {
	    console.log("User password changed successfully!");
	    var userObj = {email: usermail, password:password};
	  	firebaseRef.authWithPassword(userObj, function(logInError, authData){
		  	window.location.href = 'list.html';
	  	});
	  }
	});
}

document.body.onload = function(){
  mixpanel.track('Page Loaded', {'Page Name': 'Login Page'});
}