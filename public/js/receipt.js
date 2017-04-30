var myform = $("form#myform");

var cookie = Cookies.getJSON('cart');
console.log(cookie);

function printTable()
{
    send();
    var myTable = document.getElementById('shopping-cart');
    newWin= window.open("");
    newWin.document.write(myTable.outerHTML);
    newWin.print();
    newWin.close();
}

function send(){


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

    // Removes all Rows from the table
    var table = document.getElementById("shopping-cart");

    for(var i = table.rows.length - 1; i > 0; i--)
    {
        table.deleteRow(i);
    }

  for(var index in cookie){
    console.log(cookie[index].new);


  $('#shopping-cart').append('<tr><td>'+"*"+(index+1)+'</td>'+
                             '<td>'+"*"+cookie[index].bookName+'</td>'+
                             '<td>'+"Purchased: "+(parseInt(cookie[index].new)||0).toString()+"\nPrice:"+(parseInt(cookie[index].priceNew)||0).toString()+'</td>'+
                             '<td>'+(parseInt(cookie[index].used)||0).toString()+'</td>'+
                             '<td>'+(parseInt(cookie[index].rental)||0).toString()+'</td>'+
                             '<tr><br>');
}

$('#shopping-cart').append('<tr><td>'+"Sub Total: "+subtotal.toString()+'</td><br>'+
                           '<td>'+"Total:"+ total.toString()+'<td>'+'</tr><br>');
  var message = $("#message");

  message.val($('#shopping-cart').html());
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