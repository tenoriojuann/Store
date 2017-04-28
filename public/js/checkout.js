// function will draw a table for the price
function price() {
    var cookie = Cookies.getJSON('cart');

    var subtotal = 0;
    var totalBooks = 0;
    for (var index in cookie) {
        totalBooks += (parseInt(cookie[index].new) || 0);
        totalBooks += (parseInt(cookie[index].rental)|| 0);
        totalBooks += (parseInt(cookie[index].used)|| 0);
        totalBooks += (parseInt(cookie[index].ebook)|| 0);


        subtotal += (parseInt(cookie[index].priceNew)|| 0) * (parseInt(cookie[index].new )|| 0);
        subtotal += (parseInt(cookie[index].priceUsed) || 0)* (parseInt(cookie[index].used)|| 0);
        subtotal += (parseInt(cookie[index].priceRental) || 0)* (parseInt(cookie[index].rental)|| 0);
        subtotal += (parseInt(cookie[index].priceEbook)|| 0) * (parseInt(cookie[index].ebook)|| 0);

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
var cookie = Cookies.getJSON('cart');
    for(var index in cookie){
        firebase.database().ref().child('/books/' + cookie[index].id)
            .update({ quantityNew: (parseInt(cookie[index].quantityNew || 0)-parseInt(cookie[index].new || 0)).toString(), 
                    quantityRental: (parseInt(cookie[index].quantityRental || 0)-parseInt(cookie[index].rental || 0)).toString(), 
                    quantityUsed: (parseInt(cookie[index].quantityUsed || 0)-parseInt(cookie[index].used || 0)).toString(), 
                    quantityEbook: (parseInt(cookie[index].quantityEbook)-parseInt(cookie[index].ebook || 0)).toString() 
                });
    }
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
            window.location = "checkout.html";
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

            if (verifyCard(name, number, cvc, exp)) {
                $("#forms").toggle("slows");
                $(location).attr('href', "receipt.html");
                alert("THank you for your payment");

            }
            else {
                alert("not");
            }
        
    });

 });




// hide the paypal input form
$(document).ready(
    function () {
        $("#cancel2").click(function () {
            window.location = "checkout.html";
        });
    });

// show the paypal input form
$(document).ready(
    function () {
        $("#paypal").click(function () {
            $('#menu').hide('slow');
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
                $('#forms2').hide('slow');
                $('#billing').show('slow');
                // Do something once the paypal information is verified
            }
        });
    });


// Clicking next on the billing information will take the user to the
// shipping information

$(document).ready(
    function(){
        $('#Bnext').click(function(){

            $('#billing').hide('slow');
            $('#shipping').show('slow');
        });
});