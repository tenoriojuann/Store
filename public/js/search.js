var searchData = [];
var tableData = [];
var bookArray = [];
var findSearch = 0;
var myBook = [];


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
        threshold: 0.2,
        location: 0,
        distance: 5000,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [value.type1,value.type2,value.type3,value.type4]
    };

    var f = new Fuse(searchData, options);
    var output = f.search(value.value);

    for(var index in output) {

        tableData.push(output[index].item);
    }



    //After we get the search results we can draw the table
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



    $('#search-table').dynatable({
      dataset: {
      records: mergeMultiples(tableData),
      perPageDefault: 10
      },
      features: {
          search: false
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
                check.onclick = function(){
                    if(check.checked) {
                        $('#' + ((index * 7) + 20)).show("slow");
                        $('#' + ((index * 7) + 21)).show("slow");
                        $('#' + ((index * 7) + 22)).show("slow");
                        $('#' + ((index * 7) + 23)).show("slow");
                    }
                    else{
                        $('#' + ((index * 7) + 20)).hide("slow");
                        $('#' + ((index * 7) + 21)).hide("slow");
                        $('#' + ((index * 7) + 22)).hide("slow");
                        $('#' + ((index * 7) + 23)).hide("slow");
                    }
                };
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
                PQnewSum[0].innerHTML = (book.val().bookName + "<br>" + "<b>ISBN:</b> ");//insert bookname into first positon in cell
                PQnewSum.append(book.val().isbn + "<br>"); //insert isbn # under book name
                PQnewSum.append("<b>Author(s): </b>" + book.val().author + "<br><b>Brief Description:</b>"); //insert authors under isbn
                sumP = summaryArr.substring(0, summaryArr.indexOf('.')); //get the first (.)occurence of summary **still need to work on fixing this up**
                PQnewSum.append(sumP + "...<br/>"); //insert summary last

                if (findSearch == 1) {
                    PQnewSum.append("<br> This book is " + "<b>" + book.val().required + "</b>" + " for " + "<b>" + row.find('td:nth-last-child(11)').text() + "</b>");
                }

                if (findSearch == 2) {

                    PQnewSum.append("<br>CRN(s): " + row.find('td:nth-last-child(9)').text() + "<br>Professor(s) " + row.find('td:nth-last-child(10)').text());

                }
                //Price and Quantity for New**************************************
                var PQnew = row.find('td:nth-last-child(7)');
                PQnew[0].innerHTML = ("$" + book.val().priceNew);//insert $ sign
                var input = document.createElement('input');
                input.type = "text";
                input.id = ""+((index*7)+20);
                input.style.display = "none";
                //input.value = "0";  //Uncomment to make input values show as 0
                PQnew.append(input);
                var quantity = document.createElement('p');

                if (book.val().quantityNew <= 0 || book.val().quantityNew % 1 != 0)//check if qty less than or equal to 0, or if qty is an int
                {
                    quantity = outStock;
                    PQnew[0].innerHTML = ("$" + book.val().priceNew);//insert $ sign
                    PQnew.append( ("<br/>" + "<br>" + quantity));
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
                input1.id = ""+((index*7)+21);
                input1.style.display = "none";
                //input1.value = "0";  //Uncomment to make input values show as 0
                PQused.append(input1);
                var quantity1 = document.createElement('p');

                if (book.val().quantityUsed <= 0 || book.val().quantityUsed % 1 != 0)//check if qty less than or equal to 0, or if qty is an int
                {
                    quantity1 = outStock;
                    PQused[0].innerHTML = ("$" + book.val().priceUsed);//insert $ sign

                    PQused.append(("<br/>" + "<br>" + quantity1));
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
                input2.id = ""+((index*7)+22);
                input2.style.display = "none";
                //input2.value = "0";  //Uncomment to make input values show as 0
                PQrental.append(input2);

                var quantity2 = document.createElement('p');

                if (book.val().quantityRental <= 0 || book.val().quantityRental % 1 != 0)//check if qty less than or equal to 0, or if qty is an int
                {
                    quantity2 = outStock;
                    PQrental[0].innerHTML = ("$" + book.val().priceRental); //insert $ sign
                    PQrental.append(("<br/>" + "<br>" + quantity2));
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
                input3.id = ""+((index*7)+23);
                input3.style.display = "none";
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
                    PQebook[0].innerHTML = ("$" + book.val().priceEbook);//insert $ sign
                    PQebook.append (("<br/>" + "<br>" + quantity3));

                }

                bookArray.push(book.val());

            });
        }
    });


}


function mergeMultiples(arr) {
    return _(arr)
            .groupBy('isbn')
            .map((object, isbn) => ({

                isbn: isbn,
                crn: _.map(object, 'crn').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                }),
                bookName: _.map(object, 'bookName').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                quantityNew: _.map(object, 'quantityNew').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                quantityRental: _.map(object, 'quantityRental').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                quantityUsed: _.map(object, 'quantityUsed').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                quantityEbook: _.map(object, 'quantityEbook').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                summary: _.map(object, 'summary')[0],
                id: _.map(object, 'id')[0],

                author: _.map(object, 'author').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                course: _.map(object, 'course').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                }),
                professor: _.map(object, 'professor').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                }),
                priceEbook: _.map(object, 'priceEbook').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                priceNew: _.map(object, 'priceNew').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                priceUsed: _.map(object, 'priceUsed').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                priceRental: _.map(object, 'priceRental').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })[0],
                Required: _.map(object, 'Required').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                }),
                term: _.map(object, 'term').sort().filter(function (item, pos, ary) {
                    return !pos || item != ary[pos - 1];
                })
            }))
            .value();
}


function sendToCart(){


  var rootRef = database.ref();
  // referencing the 'books' node
  var storeRef = rootRef.child("books");

  var checkedBox = 0;
  $('#search-table tr').each(function(index){
    // Ignoring headers
    if(index > 0){
      var row = $(this);
      // Detect all the ticked checkboxes
      if(row.find('input').is(':checked')){
        
        var id = row.find('td:nth-last-child(2)').text();
        
        storeRef.child(id).once('value').then(function (book) {
          temp = book.val();
          if(parseInt(row.find('td:nth-last-child(4)').find('input').val() || -1) > temp.quantityEbook){
              alert("The entered number of ebooks exceeds our inventory!");

          }
          else {
              temp["ebook"] = (parseInt(row.find('td:nth-last-child(4)').find('input').val()) || 0).toString();
          }
            if(parseInt(row.find('td:nth-last-child(5)').find('input').val() ||-1) > temp.quantityRental){
                alert("The entered number of rental books exceeds our inventory!");

            }
            else {
                temp["rental"] = (parseInt(row.find('td:nth-last-child(5)').find('input').val()) || 0).toString();
            }
            if(parseInt(row.find('td:nth-last-child(6)').find('input').val() ||-1) > temp.quantityUsed){
                alert("The entered number of used books exceeds our inventory!");

            }
            else {
                temp["used"] = (parseInt(row.find('td:nth-last-child(6)').find('input').val()) || 0).toString();
            }
            if(parseInt(row.find('td:nth-last-child(7)').find('input').val() || -1) > temp.quantityNew){
                alert("The entered number of new books exceeds our inventory!");

            }
            else {
                temp["new"] = (parseInt(row.find('td:nth-last-child(7)').find('input').val()) || 0).toString();
            }

            temp["id"] = book.key;

            myBook.push(temp);

        });
          checkedBox +=1;
      }


    }
  });

if(checkedBox > 0) {
    // waiting for the async function to finish
    setTimeout(function () {

        setCookies();
    }, 2000);
}
else{
    alert("Please select at least a book");
}
}

function setCookies(){

      var cookie =  JSON.parse(localStorage.getItem('cart'));

      if(cookie == null){


          localStorage.setItem('cart', JSON.stringify(myBook));
          alert("YES! added to cart!1");


      }
      else{

          //cookie = mergeMultiples(cookie);

          var cookieL = cookie.length;
        for (var index in myBook){
          cookie.push(myBook[index]);
        }

          localStorage.setItem('cart', JSON.stringify(cookie));

          if(cookie.length > cookieL) {

              alert("YES! added to cart!");
          }
          else{
              alert("Please try again!");
          }


      }

    console.log(JSON.parse(localStorage.getItem('cart')));

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

