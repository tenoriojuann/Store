var myform = $("form#myform");
var qq;
var tt3 = [];

var numCheck = 0;
var cookie = JSON.parse(localStorage.getItem('cart'));

console.log(cookie);

function printTable()
{
    send();
    var myTable = document.getElementById('shopping-cartx');

    newWin= window.open("");
    newWin.document.write(myTable.outerHTML);
    newWin.print();
    newWin.close();
}

function send(){


    var cookie = JSON.parse(localStorage.getItem('cart'));


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

    // Removes all Rows from the table
    var table = document.getElementById("shopping-cartx");

    for(var i = table.rows.length-1; i > 2; i--) //i > 2 (dont want to delete the wrong stuff when back is pressed)
    {
        table.deleteRow(i);
    }

    /*Insert users address / name / email here*/

    var holder = 0;
    for(var index in cookie){
        console.log(cookie[index].new);

        //qq = cookie[index].new;
        //var z = qq;

        //var tempTable =  document.getElementById('shopping-cartx');
        var tempT1 = document.getElementById('t1').innerHTML;
        var tempT2 = document.getElementById('t2').innerHTML;
        var tempT3 = document.getElementById('t3').innerHTML;
        var tempT4 = document.getElementById('t4').innerHTML;
        var tempT5 = document.getElementById('t5').innerHTML;
        var tempT6 = document.getElementById('t6').innerHTML;
        var tempT33 = 0, tempT44 = 0, tempT55 = 0, tempT66 = 0;


        tempT1 = (index); //Get #
        tempT2 = cookie[index].bookName; //Get BookName

        qq = cookie[index].new;
        if(cookie[index].new == holder || cookie[index].new % 1 != 0)
        {
            tempT3 = "";
            tempT33 = "";
        }
        else
        {
            tempT3 = "Price New: $ " + cookie[index].priceNew;
            tempT33 = "Qty (" + qq + ")";
            //tempT3 = "Price New $" + cookie[index].priceNew + " | " + "Qty (" + qq + ") | ";
        }

        qq = cookie[index].used;
        if(cookie[index].used == holder ||cookie[index].used % 1 != 0)
        {
            tempT4 = "";
            tempT44 = "";
        }
        else
        {

            tempT4 = "Price Used: $" + cookie[index].priceUsed;
            tempT44 = " | " + "Qty U(" + qq + ")";
        }

        qq = cookie[index].rental;
        if(cookie[index].rental == holder || cookie[index].rental % 1 != 0)
        {
            tempT5 = "";
            tempT55 = "";

        }
        else
        {
            tempT5 = "Price Rental: $" + cookie[index].priceRental;
            tempT55 = " | " + "Qty R(" + qq + ")";
        }
        qq = cookie[index].ebook;
        if(cookie[index].ebook == holder || cookie[index].ebook % 1 != 0)
        {
            tempT6 = "";
            tempT66 ="";
        }
        else
        {
            tempT6 = "Price Ebook: $"
            tempT66 = " | " + "Qty (" + qq + ")";
        }

        //$('#shopping-cartx').append
        $('#shopping-cartx').append('<tr><td>' + tempT1 + " " + tempT2 + " " + tempT3 + " " + tempT4 + " " + tempT5 + " " + tempT6 +
            '<br>' + tempT33 + " "  + tempT44 + " "  + tempT55 + " "  + tempT66);


        /* $('#shopping-cartx').append('<tr><td>'+"*"+(index+1)+'</td>'+
         '<td>'+"*"+cookie[index].bookName+'</td>'+
         '<td>'+"Price:"+(parseInt(cookie[index].priceNew)||0).toString()+'<br>'+
         "Purchased: "+(parseInt(cookie[index].new)||0).toString()+'</td>'+
         '<td>'+(parseInt(cookie[index].used)||0).toString()+'</td>'+
         '<td>'+(parseInt(cookie[index].rental)||0).toString()+'</td>'+
         '</tr><br>');*/
    }

    var totz = document.getElementById('t7').innerHTML;
    totz = "SubTotal: $" + subtotal.toString() +  '<br>' + "Total: $" + total.toString();
    $('#shopping-cartx').append(totz);


    //$('#shopping-cart').append('<tr><td>'+"Sub Total: "+subtotal.toString()+'</td><br>'+
    // '<td>'+"Total:"+ total.toString()+'<td>'+'</tr><br>');
    var message = $("#message");

    message.val($('#shopping-cartx').html());
    console.log(message.val());
}


myform.submit(function(event){
    event.preventDefault();

    myform.find("button").text("Sending...");

    send();
    email();
    Cookies.remove('cart');

});

function email(){

    // Change to your service ID, or keep using the default service
    var service_id = "default_service";
    var template_id = "temp";

    // Actually sends the message
    emailjs.sendForm(service_id,template_id,"myform")
        .then(function(){
            alert("Sent!");
            myform.find("button").text("Send");
            window.location = "index.html"
        }, function(err) {
            alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
            myform.find("button").text("Send");
        });

    return false;

}