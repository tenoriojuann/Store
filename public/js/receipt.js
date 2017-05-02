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
    var date = document.createElement('p');
    date.class = "topcorner";
    var d = new Date();
    date.innerHTML = (d);
    newWin= window.open("");
    newWin.document.write(date.outerHTML);
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

    for(var i = table.rows.length-1; i > 1; i--)
    {
        table.deleteRow(i);
    }

    /*Insert users address / name / email here*/
    $('#shopping-cartx').append('<tr><td>'+"Invoice # "+Math.floor((Math.random() * 100) + 1).toString()+'</td><tr>');

    $('#shopping-cartx').append('<tr>'+
        '<td>'+"#"+'</td>'+
        '<td>'+"Description"+'</td>'+
        '<td>'+"New"+'</td>'+
        '<td>'+"Used"+'</td>'+
        '<td>'+"Rental"+'</td>'+
        '<td>'+"Ebook"+'</td>');
    for(var index in cookie){

        $('#shopping-cartx').append('<tr><td>'+"*"+(index+1)+'</td>'+
            '<td>'+cookie[index].bookName+'</td>'+
            '<td>'+"Price: $"+(parseInt(cookie[index].priceNew)||0).toString()+'<br>'+
            "Purchased: "+(parseInt(cookie[index].new)||0).toString()+'</td>'+
            '<td>'+"\tPrice: $"+(parseInt(cookie[index].priceUsed)||0).toString()+'<br>'+
            "\tPurchased: "+(parseInt(cookie[index].used)||0).toString()+'</td>'+
            '<td>'+"\tPrice: $"+(parseInt(cookie[index].priceRental)||0).toString()+'<br>'+
            "\tPurchased: "+(parseInt(cookie[index].rental)||0).toString()+'</td>'+
            '<td>'+"\tPrice: $"+(parseInt(cookie[index].priceEbook)||0).toString()+'<br>'+
            "\tPurchased: "+(parseInt(cookie[index].ebook)||0).toString()+'</td>'+
            '</tr><br>');


    }

    var shipping = JSON.parse(localStorage.getItem('shipping'));

    $('#shopping-cartx').append('<tr>'+
        '<td><b>Shipping Address: </b></td></tr>' +
        '<tr><td>'+shipping.address+'</td></tr>'+
        '<tr><td>'+shipping.state+'</td></tr>'+
        '<tr><td>'+shipping.zip+'</td></tr>');



    var message = $("#message");

    message.val($('#shopping-cartx').html());
}


myform.submit(function(event){
    event.preventDefault();

    myform.find("button").text("Sending...");

    send();
    email();


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
            //Clear the localStorage
            localStorage.removeItem('cart');
            localStorage.removeItem('billing');
            localStorage.removeItem('shipping');
            window.location = "index.html"
        }, function(err) {
            alert("Send email failed!\r\n Response:\n " + JSON.stringify(err));
            myform.find("button").text("Send");
        });

    return false;

}