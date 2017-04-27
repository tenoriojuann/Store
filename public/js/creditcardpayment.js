//These methods are used to verify payment with a credit card, all variables are strings
//checks to see if  card is valid
//returns a boolean
function verifyCard(cardholdername, cardnumber, vercode, expdate) {
    if (verifyCardNumber(cardnumber) && verifyCode(vercode) && verifyName(cardholdername) && verifyExpDate(expdate))
        return true;
    else
        return false;
}

//verifies the card number if valid
//the passed card number should be a string
//returns a boolean
function verifyCardNumber(cardnumber) {
    var noSpaceNumb;
    noSpaceNumb = removeWhiteSpace(cardnumber);
    var cardKey = 16; // acounting for spaces
    var regexDigit = /\D/;

    //checks number length and if there is anything other than a number
    if (noSpaceNumb.length == cardKey && !regexDigit.test(noSpaceNumb))
        return true;
    else
        console.log("failed card number");

    return false;
}
//checks to see what card company the provided card belongs too
//Returns a string
function whatCompany(cardnumber) {
    var noSpaceNumb = removeWhiteSpace(cardnumber);
    var company = new String('');
    var firstTwo = parseInt(noSpaceNumb.substring(0, 2));
    var firstFour = parseInt(noSpaceNumb.substring(0, 4));
    var firstThree = parseInt(noSpaceNumb.substring(0, 3));
    var firstSix = parseInt(noSpaceNumb.substring(0, 6));

    if (verifyCardNumber(cardnumber)) {
        if (cardnumber.charAt(0) == '4')
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
function verifyCode(vercode) {
    var vercodekey = '777';
    var regexDigit = /\D/;

    if (vercodekey == vercode && !regexDigit.test(vercode))
        return true;
    else
        console.log("failed code number");
    return false;
}
//verifies the provided name
//returns a boolean
function verifyName(cardholdername) {
    var regexDigits = /\d/;
    var regexChar = /[^\w\s\*]/;

    //checks to see if the name contains any numbers
    if (regexDigits.test(cardholdername)) {
        console.log("failed, name contains numbers");
        return false;
    }
    else {
        //checks for special characters excluding white-space
        if (regexChar.test(cardholdername)) {
            console.log("failed, name has special characters");
            return false;
        }
        else
            return true;
    }
}
//verifies the provided expiration date mm/yy
//returns a boolean
function verifyExpDate(expdate) {
    var month, year;
    var yearPrefix = new String('20');
    var d = new Date();
    expdate = removeWhiteSpace(expdate);
    //Checks to make sure the date is 5 digits long 'mm/yy'
    if (expdate.length != 5)
        return false;

    //checks to make sure the date has the '/' in right places
    if (expdate.charAt(2) != '/')
        return false;

    month = expdate.substring(0, 2) - 1; //months are from 0-12 so you have to subtract 1 from what is entered to compare correct month
    year = yearPrefix.concat(expdate.substring(3, 5));

    //checks for a valid month 0-11
    if (month < 0 || month > 11)
        return false;

    //checks to make sure the date is in the future(i.e. after the current date)
    if (year >= d.getFullYear() && month >= d.getMonth())
        return true;

    else
        return false;
}
//Removes any white space out of the card number string
//returns a new string
function removeWhiteSpace(cardnumber) {
    var newNumber = '';

    for (var i = 0; i <= cardnumber.length; i++) {
        if (cardnumber.charAt(i) != ' ')
            newNumber = newNumber.concat(cardnumber.charAt(i));
    }
    return newNumber;
}