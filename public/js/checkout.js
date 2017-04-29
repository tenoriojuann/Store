var subtotal = 0;
var totalBooks = 0;
var total = 0;

//TODO: make use of the variables above and put them under the table

// function will draw a table for the price
function price() {
    var cookie = Cookies.getJSON('cart');


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
    total = (subtotal * .07) + subtotal;


    $('#price').dynatable({
        dataset: {
            records: cookie,
            perPageDefault: 1
        },
        features: {
            search: false,
            paginate: false,
            recordCount: false
        }
    });
}

// grabs the username from the
$(document).ready(
    function () {
        $("#loginAID").click(function () {
            var user = $("#username").val();
            var pass = $("#pass2").val();

            checkUser(user, pass, function(userobject){
                console.log(userobject);


                if(userobject.money < total){
                    alert("Dude, you barely got money!\nPick a different payment method");
                    window.location = "checkout.html"
                }
                else{
                    updateUserMoney(total, userobject.money);
                    updateQuntities();

                    alert("Payment Accepted");
                    window.location = "receipt.html"
                }
            });

        });
    }
);

// shows the financial aid login page

$(document).ready(
    function () {
        $("#Faid").click(function (){

           $("#aid").show("slow");
           $("#menu").hide("slow");
            $("#price").hide();

        });
    }
);


// hides the financial aid login page

$(document).ready(
    function () {
        $("#cancelAID").click(function (){

            window.location = "checkout.html";

        });
    }
);

// Checks whether the user exists in the database
// If the user exists, then an object is return
// the object contains all of the user information
function checkUser(username, pass, callback){

    var rootRef = database.ref();
    // referencing the 'books' node
    var usersRef = rootRef.child("users");

    var userObject;
    usersRef.once('value', function(snapshot) {
        if (snapshot.hasChild(username)) {

            if(pass === snapshot.val()[username].password) {
                userObject =  snapshot.val()[username];
                callback(userObject);
            }
            else{
                alert("wrong password");
            }
        }
        else{
            alert("user does not exist");
        }
    });


}

//function will update money left for the user in the database

function updateUserMoney(moneySpent, financialAidMoney) {

    var user = $("#username").val();

    database.ref().child('/users/' + user)

        .update({ money: (parseInt(financialAidMoney || 0)-parseInt(moneySpent || 0)).toString()
        });
}

//function will update the quantities in the database

function updateQuntities() {
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

// hides the CC input form
$(document).ready(
    function () {
        $("#cancel").click(function () {
            window.location = "checkout.html";
        });
    });


// Evaluates the CC information
$(document).ready(
    function () {
        $("#submit").click(function () {
            var name = $('#name').val();
            var exp = $('#exp').val();
            var cvc = $('#cvc').val();
            var number = $('#number').val();

            if (verifyCard(name, number, cvc, exp)) {
                $('#billing').show('slow');
                $("#forms").toggle("slows");


            }
            else {
                alert("not");
            }
        
    });

 });


// press next on shipping information takes the user to a prompt
// if the user clicks ok then the user is taken to the receipt page
$(document).ready(
    function () {

        $('#Snext').click(function (){

            var r = confirm("Are you sure you want to submit your payment information?");

            if(r){
                alert("Thank you for the information!");
                window.location = "receipt.html";
            }
            else{
                window.location = "checkout.html";
            }
        })

}
);
// hides the paypal input form
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