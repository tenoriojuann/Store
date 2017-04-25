


function price(){
	var cookie = Cookies.getJSON('cart');
	var subtotal =0;
	for(var index in cookie){
		subtotal += cookie[index].price; 
	}
	var total = (subtotal*.07)+ subtotal;

	var data = {
		"amountOfBooks" : cookie.length,
		"subtotal" : subtotal,
		"total" : total
	}

	$('#price').dynatable({
      dataset: {
      records: data,
      perPageDefault: 1
      },
      features:{
        search:false
      }
    });
}

// Show the input form for the CC
$(document).ready(
    function(){
        $("#cc").click(function () {
       	new Card({
            form: document.querySelector('form'),
            container: '.card-wrapper'
        });
            $("#forms").show("slow");
        });

    });

// hide the CC input form
$(document).ready(
    function(){
        $("#cancel").click(function () {
            $("#forms").toggle("slows");
        });
 });

// Evaluate the CC information
$(document).ready(
    function(){
        $("#submit").click(function () {
            var name = $('#name').val();
            var exp = $('#exp').val();
            var cvc = $('#cvc').val();
            var number = $('#number').val();


            if(verifyCard(name,number,cvc,exp)){
            	alert("YAY");
            }
            else{
            	alert("not");
            }
        });
 });




// hide the paypal input form
$(document).ready(
    function(){
        $("#cancel2").click(function () {
            $("#forms2").toggle("slows");
        });
 });


// show the paypal input form
$(document).ready(
    function(){
        $("#paypal").click(function () {
            $("#forms2").show("slows");
        });
 });


//Evaluate the paypal information
$(document).ready(
    function(){
        $("#login").click(function () {
        	var email = $('#email').val();
        	var pass = $('#pass').val();

            if(verifyPayPal(email,pass)) {
            	// Do something once the paypal information is verified
            }
        });
});