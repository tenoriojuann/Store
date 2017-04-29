var searchData = [];
var tableData = [];
var bookArray = [];
var findSearch = 0;


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
        threshold: 0.0,
        location: 0,
        distance: 5000,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [value.type1,value.type2,value.type3,value.type4]
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
	  v["type2"] = "professor";
	  v["type3"] = "professor";
	  v["type4"] = "professor";	
	  findSearch = 1;
    }
    else if(temp[0] == "course"){
      v["type1"] = "course";
      v["type2"] = "course";
	  v["type3"] = "course";
	  v["type4"] = "course";
	  findSearch = 2;
    }
    else if(temp[0] == "keyword"){
        v["type1"] = "summary";
        v["type2"] = "isbn";
		v["type3"] = "author";
		v["type4"] = "bookName"
    }
    return v;
}

function table(){

    console.log(tableData);
    tableData = mergeCRN(tableData);
    console.log(tableData);
    $('#search-table').dynatable({
      dataset: {
      records: tableData,
      perPageDefault: 10
      },
      features:{
        search:false,
      },
        readers: {
            color: function(cell, record) {

                // Inspect the source of this example
                // to see the getAverageRGB function.
                var $cell = $(cell);
                   console.log($cell.find('img').get(0));

                // Store the average RGB image color value
                // as a decimal in "dec" attribute.
                record['dec'] = dec;

                // Grab the dinosaur name.
                record['name'] = $cell.text();

                // Return the HTML of the cell to be stored
                // as the "color" attribute.
                return $cell.html();
            }
        }
    }).bind('dynatable:afterProcess', setImages)
    .bind('dynatable:afterProcess', modifyTableData);
    setImages();
    modifyTableData();
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
                img.height = "200"; //Changed dimensions of book
                img.width = "150";
                img.onclick = function() {
                    window.location = generateUrl("bookdetails.html", {
                        id: row.find('td:nth-last-child(2)').text()
                    });
                };
                var check = document.createElement('input');
                check.type = "checkbox";
                row.find('td:first-child').replaceWith(img); //table first child set to image
                row.find('td:last-child').replaceWith(check); //table last child set to check mark
            });
        }
    });



}


function modifyTableData(){

    $('#search-table tr').each(function(index) {
        var row = $(this);
        if (index > 0) {

            var rootRef = database.ref();
            // referencing the 'books' node
            var storeRef = rootRef.child("books");
            var id = row.find('td:nth-last-child(2)').text();

            var inStock = "In Stock"; //inStock var set to green
            inStock = inStock.fontcolor("green");

            var outStock = "Out of Stock"; //outStock var set to red
            outStock = outStock.fontcolor("red");


            storeRef.child(id).once('value').then(function (book) {
                //work here
                //***Load book name -> ISBN -> Author -> Brief description of Summary
                var PQnewSum = row.find('td:nth-last-child(8)'); //book description cell
                var sumP = document.createElement('p');
                var summaryArr = [];
                summaryArr = book.val().summary;
                PQnewSum[0].innerHTML = (book.val().bookName + "<br>" + "ISBN: ");//insert bookname into first positon in cell
                PQnewSum.append(book.val().isbn + "<br>"); //insert isbn # under book name
                PQnewSum.append("Author(s): " + book.val().author + "<br> Brief Description: "); //insert authors under isbn
                sumP = summaryArr.substring(0, summaryArr.indexOf('.')); //get the first (.)occurence of summary **still need to work on fixing this up**
                PQnewSum.append(sumP + "...<br/>"); //insert summary last

                if (findSearch == 1) {
                    PQnewSum.append("<br> This book is " + book.val().required + " for " +  row.find('td:nth-last-child(11)').text());
                }

                if (findSearch == 2) {

                    PQnewSum.append("<br>CRN(s): " + row.find('td:nth-last-child(9)').text() + "<br>Professor(s) " + row.find('td:nth-last-child(10)').text());

                }
                //Price and Quantity for New**************************************
                var PQnew = row.find('td:nth-last-child(7)');
                PQnew[0].innerHTML = ("$" + book.val().priceNew);//insert $ sign
                var input = document.createElement('input');
                input.type = "text";
                //input.value = "0";  //Uncomment to make input values show as 0
                PQnew.append(input);
                var quantity = document.createElement('p');

                if (book.val().quantityNew <= 0 || book.val().quantityNew % 1 != 0)//check if qty less than or equal to 0, or if qty is an int
                {
                    quantity = outStock;
                    PQnew[0].innerHTML = ("<br/>" + "<br>" + quantity);
                }
                else //print normal
                {
                    quantity.innerHTML = "<br>" + inStock + ": " + book.val().quantityNew;
                    PQnew.append(quantity);
                }


                //Price and Quantity for Used**************************************
                //Search Results Display Price / Input / Qty with Colored txt for stock
                var PQused = row.find('td:nth-last-child(6)');
                PQused[0].innerHTML = ("$" + book.val().priceUsed);//insert $ sign
                var input1 = document.createElement('input');
                input1.type = "text";
                //input1.value = "0";  //Uncomment to make input values show as 0
                PQused.append(input1);
                var quantity1 = document.createElement('p');

                if (book.val().quantityUsed <= 0 || book.val().quantityUsed % 1 != 0)//check if qty less than or equal to 0, or if qty is an int
                {
                    quantity1 = outStock;

                    PQused[0].innerHTML = ("<br/>" + "<br>" + quantity1);
                }
                else  //print normal
                {
                    quantity1.innerHTML = "<br>" + inStock + ": " + book.val().quantityUsed;
                    PQused.append(quantity1);
                }


                //Price and Quantity for Rental**************************************
                var PQrental = row.find('td:nth-last-child(5)');
                PQrental[0].innerHTML = ("$" + book.val().priceRental); //insert $ sign
                var input2 = document.createElement('input');
                input2.type = "text";
                //input2.value = "0";  //Uncomment to make input values show as 0
                PQrental.append(input2);
                var quantity2 = document.createElement('p');

                if (book.val().quantityRental <= 0 || book.val().quantityRental % 1 != 0)//check if qty less than or equal to 0, or if qty is an int
                {
                    quantity2 = outStock;
                    PQrental[0].innerHTML = ("<br/>" + "<br>" + quantity2);
                }
                else  //print normal
                {
                    quantity2.innerHTML = "<br>" + inStock + ": " + book.val().quantityRental;
                    PQrental.append(quantity2);
                }

                //price and quantity for eBook**************************************
                var PQebook = row.find('td:nth-last-child(4)');
                PQebook[0].innerHTML = ("$" + book.val().priceEbook);//insert $ sign
                var input3 = document.createElement('input');
                input3.type = "text";
                //input3.value = "0";  //Uncomment to make input values show as 0
                PQebook.append(input3);
                var quantity3 = document.createElement('p');

                if (book.val().quantityEbook > 0) //Any value over 0 = unlimited stock
                {
                    quantity3 = inStock + ": Unlimited";
                    PQebook.append("<br/>" + "<br>" + quantity3);

                }
                if (book.val().quantityEbook <= 0 || book.val().quantityEbook % 1 != 0) //Any int value under 0 = no stock
                {
                    quantity3 = outStock;
                    PQebook[0].innerHTML = ("<br/>" + "<br>" + quantity3);

                }

                bookArray.push(book.val());

            });
        }
    });


}


function mergeCRN(arr) {
    return _(arr)
            .groupBy('isbn')
            .map((object, isbn) => ({
            isbn: isbn,
            crn: _.map(object, 'crn').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            }),
            bookName: _.map(object, 'bookName').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            quantityNew: _.map(object, 'quantityNew').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            quantityRental: _.map(object, 'quantityRental').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            quantityUsed: _.map(object, 'quantityUsed').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            quantityEbook: _.map(object, 'quantityEbook').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            summary: _.map(object, 'summary')[0],
            id: _.map(object, 'id')[0],

            author: _.map(object, 'author').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            course: _.map(object, 'course').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            }),
            professor: _.map(object, 'professor').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            }),
            priceEbook: _.map(object, 'priceEbook').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            priceNew: _.map(object, 'priceNew').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            priceUsed: _.map(object, 'priceUsed').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            priceRental: _.map(object, 'priceRental').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            })[0],
            Required: _.map(object, 'Required').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            }),
            term: _.map(object, 'term').sort().filter(function (item, pos, ary){
                return !pos || item != ary[pos - 1];
            }),

        })).value();
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
          temp = book.val();
          temp["ebook"] = row.find('td:nth-last-child(4)').find('input').val();
          temp["rental"] = row.find('td:nth-last-child(5)').find('input').val();
          temp["used"] = row.find('td:nth-last-child(6)').find('input').val();
          temp["new"] = row.find('td:nth-last-child(7)').find('input').val();
          temp["id"] = book.key;
          myBook.push(temp);
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

