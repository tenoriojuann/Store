// function will draw a table for the price
function price() {
    var cookie = Cookies.getJSON('cart');
    console.log(cookie);
    var subtotal = 0;
    var totalBooks = 0;
    for (var index in cookie) {
        totalBooks += parseInt(cookie[index].new);
        totalBooks += parseInt(cookie[index].rental);
        totalBooks += parseInt(cookie[index].used);
        totalBooks += parseInt(cookie[index].ebook);


        subtotal += parseInt(cookie[index].priceNew) * parseInt(cookie[index].new);
        subtotal += parseInt(cookie[index].priceUsed) * parseInt(cookie[index].used);
        subtotal += parseInt(cookie[index].priceRental) * parseInt(cookie[index].rental);
        subtotal += parseInt(cookie[index].priceEbook) * parseInt(cookie[index].ebook);

    }
    var total = (subtotal * .07) + subtotal;

    var data = [{
        "amountOfBooks": totalBooks,//new+used+renotal+ebook
        "subtotal": subtotal,
        "total": total
    }];

    $('#price').dynatable({
        dataset: {
            records: data,
            perPageDefault: 1
        },
        features: {
            search: false,
            paginate: false,
            recordCount: false
        }
    });
}


//function will update the database

function updateDataBase() {

}

// Show the input form for the CC
$(document).ready(
    function () {
        $("#cc").click(function () {

        	document.getElementById('menu').style.display = "none";
        	document.getElementById('price').style.display = "none";
            new Card({
                form: document.querySelector('form'),
                container: '.card-wrapper'
            });
            $("#forms").show("slow");
        });

    });

// hide the CC input form
$(document).ready(
    function () {
        $("#cancel").click(function () {
        	document.getElementById('menu').style.display = "block";
        	document.getElementById('price').style.display = "block";
            $("#forms").hide("slow");
        });
    });

// Evaluate the CC information
$(document).ready(
    function () {
        $("#submit").click(function () {
            var name = $('#name').val();
            var exp = $('#exp').val();
            var cvc = $('#cvc').val();
            var number = $('#number').val();



            if(verifyCard(name,number,cvc,exp)){
            	$("#forms").toggle("slows");
            	window.location.reload();
            	setEmailToCookie();
            }
            if (verifyCard(name, number, cvc, exp)) {
                $("#forms").toggle("slows");
                Cookies.remove('cart');
                alert("THank you for your payment");

            }
            else {
                alert("not");
            }
        
    });

 });


function setEmailToCookie() {
    var txt;
    var email = prompt("Please enter your email to send receipt:");
    if (email == null || email == "") {
        txt = "User cancelled the prompt.";
    } else {
        txt = email;
    }
    Cookies.set('email', txt);
}



// hide the paypal input form
$(document).ready(
    function () {
        $("#cancel2").click(function () {
            $("#forms2").toggle("slows");
        });
    });


// show the paypal input form
$(document).ready(
    function () {
        $("#paypal").click(function () {
            $("#forms2").show("slows");
        });
    });


//Evaluate the paypal information
$(document).ready(
    function () {
        $("#login").click(function () {
            var email = $('#email').val();
            var pass = $('#pass').val();

            if (verifyPayPal(email, pass)) {
                // Do something once the paypal information is verified
            }
        });
    });