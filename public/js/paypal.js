//Stephen Chatham
//Group 8

//These functions are used to verify payment for PayPal
	var email;
	var passwaord;

//Verifies the provided password is correct
function verifyPassword(password){
	var passwordKey = '12345678';
		
	if (passwordKey.match(password))
		return true;
	else
		return false;
}

//Verifies if the email is valid
function verifyEmail(email){
	var validate = true;
			
	//Checks to make sure there is 1 and only 1 @ symbol 
	if (email.indexOf('@') <= 0 || email.indexOf('@') != email.lastIndexOf('@'))
		validate = false;
	else {
		var parts = email.split('@');
		var secondHalf = parts[1];
				
		//CHecks to make sure there is 1 and only 1 . in the second half of the email
		if (secondHalf.indexOf('.') == -1 || secondHalf.indexOf('.') != secondHalf.lastIndexOf('.')) 
			validate = false;
		else{
			var partTwo = secondHalf.split('.');
			var extension = partTwo[1];
					
			//checks to make sure the extension after the . is between 2 and 3 characters in length
			if (extension.length >= 4 || extension.length < 2)
				validate = false;
		}
	}	
	return validate;
}

//Verifies if the payment is valid
function verifyPayPal(email, password){
	if (verifyEmail(email) && verifyPassword(password))
		return true;
	else
		return false;
}
