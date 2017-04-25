//These methods are used to verify payment with a credit card, all variables are strings

	var cardnumber;
	var cardholdername;
	var vercode;
	var expdate;

//checks to see if  card is valid
//returns a boolean
function verifyCard(cardholdername, cardnumber, vercode, expdate) {
	if (verifyCardNumber(cardnumber) && verifyCode(vercode) && verifyName(cardholdername) && verifyExpDate(expdate))
		return true;
	else
		return false;
}
	
//verifies the card number if valid
//returns a boolean
function verifyCardNumber(cardnumber){
	var cardKey = 16;
	var regexDigit = /\D/;
	
	//checks number length and if there is anything other than a number
	if (cardnumber.length == cardKey && !regexDigit.test(cardnumber))
		return true;
	else 
		return false;
}

//checks to see what card company the provided card belongs too
//Returns a string
function whatCompany(cardnumber){
	var company = new String('');
	var firstTwo = parseInt(cardnumber.substring(0, 2));
	var firstFour = parseInt(cardnumber.substring(0, 4));
	var firstThree = parseInt(cardnumber.substring(0, 3));
	var firstSix = parseInt(cardnumber.substring(0, 6));
			
	if (verifyCardNumber(cardnumber) == true){
		if ( cardnumber.charAt(0) == '4')
			company = 'VISA';
		else if (firstTwo >= 51 && firstTwo <= 55)
			company = 'MASTERCARD';
		else if (firstFour >= 2221 && firstFour <= 2720)
			company = 'MASTERCARD';
		else if (firstTwo == 65 || firstFour == 6011)
			company = 'DISCOVER';
		else if (firstThree >= 644 && firstThree <= 649)
			company = 'DISCOVER';
		else if (firstSix >= 622126 && firstSix <= 622925)
			company = 'DISCOVER';
		else
			company = 'UNKNOWN';
		
		return company;
	}
	else
		return 'error';	
}

//verifies the security code entered is valid
//returns a boolean
function verifyCode(vercode){
	var vercodekey = '777';
	var regexDigit = /\D/;
	
	if (vercodekey == vercode && !regexDigit.test(vercode))
		return true;
	else
		return false;
}

//verifies the provided name
//returns a boolean
function verifyName(cardholdername){
	var regexDigits = /\d/;
	var regexChar = /[^\w\s\*]/;
	
	//checks to see if the name contains any numbers
	if (regexDigits.test(cardholdername))
		return false;
	else {
		//checks for special characters excluding white-space
		if (regexChar.test(cardholdername))
			return false;
		else
			return true;
	}
}

//verifies the provided expiration date mm/dd/yyyy
//returns a boolean
function verifyExpDate(expdate){
	var month, day, year;
	var d = new Date();
			
	//Checks to make sure the date is 10 digits long mm/dd/yyyy
	if (expdate.length != 10)
		return false;
			
	//checks to make sure the date has the '/' in right places
	if (expdate.charAt(2) != '/' || expdate.charAt(5) != '/')
		return false;
		
	month = expdate.substring(0,2) -1;
	day = expdate.substring(3,5);
	year = expdate.substring(6, 10);
			
	//checks for a valid month 0-11
	if (month < 0 || month > 11)
		return false;
	
	//checks to make sure the day is a valid number
	if (day < 1 || day > 31)
		return false;
	
	//checks to make sure the date is in the future(i.e. after the current date)
	if (year >= d.getFullYear() && month >= d.getMonth() && day > d.getDate())
		return true;
	else
		return false;	
}