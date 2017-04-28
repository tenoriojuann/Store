var searchData = [];
var tableData = [];
var cookieID = [];

function search() {

    //retrieve book data
    $.ajax({
        url: "https://ksu-bookstore.firebaseio.com/books.json",
        success: function (data) {

            for(id in data){
                // the id is the key to the object
                // but we will later need it and so now I added it as
                // an entry in the object
                data[id]["id"] = id;
                // data is an object of objects but
                // the search needs an array of objects
                searchData.push(data[id]);
            }

        },
        async: false
    });

    var value = processForm();

    var options = {
        include: ["score"],
        shouldSort: true,
        tokenize: false,
        matchAllTokens: false,
        findAllMatches: true,
        // threshold determines strictness of search
        threshold: 0.1,
        location: 0,
        distance: 5000,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [value.type1,value.type2]
    };

    var f = new Fuse(searchData, options);
    var output = f.search(value.value);

    for(var index in output){

      tableData.push(output[index].item);
    }
    table();
}

//formats input for search
function processForm() {
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    var v = {};
    v["value"] = unescape(temp[1]);
    v.value = v.value.replace(new RegExp("\\+","g"),' ');

    if(temp[0] == "professor"){
      v["type1"] = "professor"; 
      v["type2"] = "author";
    }
    else if(temp[0] == "course"){
      v["type1"] = "course";
      v["type2"] = "course";
    }
    else if(temp[0] == "keyword"){
      v["type1"] = "summary"
      v["type2"] = "summary"
    }
    return v;
}

function table(){
    $('#search-table').dynatable({
      dataset: {
      records: tableData,
      perPageDefault: 10
      },
      features:{
        search:false
      }
    }).bind('dynatable:afterProcess', setImages);

    setImages();
}


// Sets the images of the books to the given div
function setImages(){

$('#search-table tr').each(function(index) {

  var row = $(this);
  if(index>0){
    var isbn = row.find('td:nth-last-child(3)').text();
    storageRef.child('images/'+isbn+'.jpg').getDownloadURL().then(function(url){
      var img = document.createElement('img');
      img.src = url;
      img.height = "125";
      img.width = "100";
      img.onclick = function() {
          window.location = generateUrl("bookdetails.html", {
              id: row.find('td:nth-last-child(2)').text()
          });
      };
	  
      var rootRef = database.ref();
      // referencing the 'books' node
      var storeRef = rootRef.child("books");
      var id = row.find('td:nth-last-child(2)').text();
	  
	  var inStock = "In Stock"; //inStock var set to green
		inStock = inStock.fontcolor("green");
	  
	  var outStock = "Out of Stock"; //outStock var set to red
		outStock = outStock.fontcolor("red");
      
	  storeRef.child(id).once('value').then(function (book) {
		//Price and Quantity for New**************************************/
		var mycell = row.find('td:nth-last-child(7)');
        mycell[0].innerHTML = ("$" + book.val().priceNew);//insert $ sign
        var input = document.createElement('input');
        input.type = "text";
		//input.value = "0";  //Uncomment to make input values show as 0
        mycell.append(input);
        var quantity = document.createElement('p');
		if(book.val().quantityNew <= 0 || book.val().quantityNew % 1 != 0)//check if qty less than or equal to 0, or if qty is an int
		{
			quantity = outStock;
			book.val().quantityNew = quantity;
			mycell.append("<br/>" + "<br>" + quantity);
		}
		else //print normal
		{
			quantity.innerHTML = "<br>" +inStock + ": " + book.val().quantityNew;
			mycell.append(quantity);
        }
		console.log(mycell[0].innerHTML);
		
		//Price and Quantity for Used**************************************/
		var mycell2= row.find('td:nth-last-child(6)');
		mycell2[0].innerHTML = ("$" + book.val().priceUsed);//insert $ sign
		var input1 = document.createElement('input');
        input1.type = "text";
		//input1.value = "0";  //Uncomment to make input values show as 0
        mycell2.append(input1);
        var quantity1 = document.createElement('p');
       
		if(book.val().quantityUsed <= 0 || book.val().quantityUsed % 1 != 0)//check if qty less than or equal to 0, or if qty is an int
		{
			quantity1 = outStock;
			book.val().quantityUsed = quantity1;
			mycell2.append("<br/>" + "<br>" + quantity1);
		}
		else  //print normal
		{
			quantity1.innerHTML = "<br>" +inStock+ ": " + book.val().quantityUsed;
			mycell2.append(quantity1);
		}
		console.log(mycell2[0].innerHTML);
		
		//Price and Quantity for Rental**************************************/
		var mycell3= row.find('td:nth-last-child(5)');
		mycell3[0].innerHTML = ("$" + book.val().priceRental); //insert $ sign
		var input2 = document.createElement('input');
        input2.type = "text";
		//input2.value = "0";  //Uncomment to make input values show as 0
        mycell3.append(input2);
        var quantity2 = document.createElement('p');
		
		if(book.val().quantityRental <= 0 || book.val().quantityRental % 1 != 0)//check if qty less than or equal to 0, or if qty is an int
		{
			quantity2=outStock;
			book.val().quantityRental = quantity2;
			mycell3.append("<br/>" + "<br>" + quantity2);
		}
		else  //print normal
		{
			quantity2.innerHTML = "<br>" +inStock+ ": " + book.val().quantityRental;
			mycell3.append(quantity2);
		}
		console.log(mycell3[0].innerHTML);
		
		//price and quantity for eBook**************************************/
		var mycell4= row.find('td:nth-last-child(4)');
		mycell4[0].innerHTML = ("$" + book.val().priceEbook);//insert $ sign
		var input3 = document.createElement('input');
        input3.type = "text";
		//input3.value = "0";  //Uncomment to make input values show as 0
        mycell4.append(input3);
        var quantity3 = document.createElement('p');

		if(book.val().quantityEbook > 0) //Any value over 0 = unlimited stock
		{
			quantity3 = inStock + ": Unlimited";
			book.val().quantityEbook = quantity3;
		}
		if(book.val().quantityEbook <= 0 || book.val().quantityEbook % 1 != 0) //Any int value under 0 = no stock
		{
			quantity3=outStock;
			book.val().quantityEbook =quantity3;
		}     
        mycell4.append("<br/>" + "<br>" + quantity3);
		console.log(mycell4[0].innerHTML);
      });
	  
      var check = document.createElement('input');
      check.type = "checkbox";
      row.find('td:first-child').replaceWith(img); //table first child set to image
      row.find('td:last-child').replaceWith(check); //table last child set to check mark 
    });
  }
});
}



function sendToCart(){

  var myBook = [];
  var rootRef = database.ref();
  // referencing the 'books' node
  var storeRef = rootRef.child("books");

  $('#search-table tr').each(function(index){
    // Ignoring headers
    if(index > 0){
      var row = $(this);
      // Detect all the ticked checkboxes
      if(row.find('input').is(':checked')){
        
        var id = row.find('td:nth-last-child(2)').text();
        
        storeRef.child(id).once('value').then(function (book) {
          myBook.push(new Book(book.val()));
          
         
        });
      }
    }
  });

  // waiting for the async function to finish
  setTimeout(function(){
    setCookies(myBook);
  }, 1000);
}

function setCookies(myBook){

      var cookie = Cookies.getJSON('cart');
      console.log(myBook);
      if(cookie === undefined){
        cookie = [];
        for (var index in myBook){
          cookie.push(myBook[index]);
        }
      }
      else{
        
        for (var index in myBook){
          cookie.push(myBook[index]);
        }
      }
      
      console.log(cookie);
      Cookies.remove('cart');
      Cookies.set('cart', JSON.stringify(cookie));
      console.log(Cookies.getJSON('cart'));
      alert("YES! added to cart!");

}

function generateUrl(url, params) {
    var i = 0, key;
    for (key in params) {
        if (i === 0) {
            url += "?";
        } else {
            url += "&";
        }
        url += key;
        url += '=';
        url += params[key];
        i++;
    }
    return url;
}

