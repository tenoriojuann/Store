var bookID = window.location.search.slice(4);
var myBook = null;

class Book {

	constructor(bookDetails){
		this.bookName= bookDetails.bookName;
		this.author= bookDetails.author;
		this.isbn = bookDetails.isbn;
		this.course= bookDetails.course;
		this.crn = bookDetails.crn;
		this.priceEbook= bookDetails.priceEbook;
		this.priceUsed= bookDetails.priceUsed;
		this.priceNew= bookDetails.priceNew;
		this.priceRental= bookDetails.priceRental;
		this.professor= bookDetails.professor;
		this.quantityNew= bookDetails.quantityNew;
		this.quantityUsed= bookDetails.quantityUsed;
		this.quantityRental= bookDetails.quantityRental;
		this.quantityEbook= bookDetails.quantityEbook;
		this.quantityTotal= (parseInt(bookDetails.quantityUsed)
			+ parseInt(bookDetails.quantityRental)
			+ parseInt(bookDetails.quantityNew));
		this.requirement= bookDetails.required;
		this.summary= bookDetails.summary;
		this.term= bookDetails.term;
	}

	print(){
		console.log(this);
	}


    constructor(bookDetails) {
        this.bookName = bookDetails.bookName;
        this.author = bookDetails.author;
        this.isbn = bookDetails.isbn;
        this.course = bookDetails.course;
        this.crn = bookDetails.crn;
        this.priceEbook = bookDetails.priceEbook;
        this.priceUsed = bookDetails.priceUsed;
        this.priceNew = bookDetails.priceNew;
        this.priceRental = bookDetails.priceRental;
        this.professor = bookDetails.professor;
        this.quantityEbook = bookDetails.quantityEbook;
        this.quantityUsed = bookDetails.quantityUsed;
        this.quantityNew = bookDetails.quantityNew;
        this.quantityRental = bookDetails.quantityRental;
        this.quantityTotal = (parseInt(bookDetails.quantityUsed)
        + parseInt(bookDetails.quantityRental)
        + parseInt(bookDetails.quantityNew));
        this.requirement = bookDetails.required;
        this.summary = bookDetails.summary;
        this.term = bookDetails.term;
    }

    print() {
        console.log(this);
    }

}

function getBookByID() {
    //reference to the root of the database
    var rootRef = database.ref();
    // referencing the 'books' node
    var storeRef = rootRef.child("books");
    // Grabbing the book from the database
    storeRef.child(bookID).once('value', function (book) {
        myBook = new Book(book.val());
        myBook.print();
        viewBookDetails();
    });
}

function viewBookDetails() {




	storageRef.child('images/'+myBook.isbn+'.jpg').getDownloadURL().then(function(url){

		document.getElementById('imgArt').src = url;
		document.getElementById('Hnew').innerHTML += "<br>$" + myBook.priceNew;
		document.getElementById('Hused').innerHTML += "<br>$" + myBook.priceUsed;
		document.getElementById('Hrental').innerHTML += "<br>$" + myBook.priceRental;
		document.getElementById('Hebook').innerHTML += "<br>$" + myBook.priceEbook;
		document.getElementById('bookName').innerHTML = myBook.bookName;
		document.getElementById('summary').innerHTML = myBook.summary;
		document.getElementById('isbn').innerHTML = myBook.isbn;
		document.getElementById('author').innerHTML = myBook.author;
		document.getElementById('quantityNew').innerHTML = myBook.quantityNew;
		document.getElementById('quantityUsed').innerHTML = myBook.quantityUsed;
		document.getElementById('quantityRental').innerHTML = myBook.quantityRental;
		document.getElementById('quantityEbook').innerHTML = myBook.quantityEbook;
		document.getElementById('professor').innerHTML = myBook.professor;
		if(myBook.quantityEbook <= 0 || myBook.quantityEbook % 1 != 0) //check if qty less than or equal to 0, or if qty is an int
		{
			var strX = "Out of Stock";
			var redX = strX.fontcolor("red");
			document.getElementById('quantityEbook').innerHTML = redX;	
			
		}
		else //it must be in stock, so list as unlimited
		{
			var x = 'unlimited';
			document.getElementById('quantityEbook').innerHTML = x;
		}
		if(myBook.quantityNew <=0 || myBook.quantityNew % 1 != 0) //check if qty less than or equal to 0, or if qty is an int
		{
			var strX = "Out of Stock";
			var redX = strX.fontcolor("red");
			document.getElementById('quantityNew').innerHTML = redX;
		}
		if(myBook.quantityUsed <=0 || myBook.quantityUsed % 1 != 0) //check if qty less than or equal to 0, or if qty is an int
		{
			var strX = "Out of Stock";
			var redX = strX.fontcolor("red");
			document.getElementById('quantityUsed').innerHTML = redX;
		}
		if(myBook.quantityRental <= 0 || myBook.quantityRental % 1 != 0) //check if qty less than or equal to 0, or if qty is an int
		{
			var strX = "Out of Stock";
			var redX = strX.fontcolor("red");
			document.getElementById('quantityRental').innerHTML = redX;
		}

    storageRef.child('images/' + myBook.isbn + '.jpg').getDownloadURL().then(function (url) {


        document.getElementById('imgArt').src = url;
        document.getElementById('Hnew').innerHTML += "<br>$" + myBook.priceNew;
        document.getElementById('Hused').innerHTML += "<br>$" + myBook.priceUsed;
        document.getElementById('Hrental').innerHTML += "<br>$" + myBook.priceRental;
        document.getElementById('Hebook').innerHTML += "<br>$" + myBook.priceEbook;
        document.getElementById('bookName').innerHTML = myBook.bookName;
        document.getElementById('summary').innerHTML = myBook.summary;

    });
}


function addToCart() {

	// Need to check if the cookie exists first
	// format of the cookie will end up being different
	// but this is just a start
	var cookie = Cookies.getJSON('cart');

		myBook["id"] = bookID;
		myBook["new"] = document.getElementById('new').value;
		myBook["rental"] = document.getElementById('rental').value;
		myBook["used"] = document.getElementById('used').value;
		myBook["ebook"] = document.getElementById('ebook').value;

	if(cookie){
		cookie.push(myBook);

		Cookies.remove('cart');
		Cookies.set('cart', JSON.stringify(cookie));
	}
	else{
		var cookie = [];
		cookie.push(myBook);

		Cookies.remove('cart');
		Cookies.set('cart', JSON.stringify(cookie));
	}
	console.log(Cookies.getJSON('cart'));

	alert("YES! added to cart!");

}



    // Adding user input to the book
    var cookie = Cookies.getJSON('cart');

    myBook["id"] = bookID;
    myBook["new"] = document.getElementById('new').value;
    myBook["rental"] = document.getElementById('rental').value;
    myBook["used"] = document.getElementById('used').value;
    myBook["ebook"] = document.getElementById('ebook').value;

    // Need to check if the cookie exists first
    if (cookie) {
        cookie.push(myBook);

        Cookies.remove('cart');
        Cookies.set('cart', JSON.stringify(cookie));
    }
    else {
        var cookie = [];
        cookie.push(myBook);

        Cookies.remove('cart');
        Cookies.set('cart', JSON.stringify(cookie));
    }
    //console.log(Cookies.getJSON('cart'));
    alert("Item successfully added to cart!");
}

// TODO: going to leave this for now, but this needs to be contained in cart.js, not here
>>>>>>> origin/refactor
// Need to work on this one
function removeFromCart() {
    var cookie = Cookies.getJSON('cart');

    cookie = jQuery.grep(cookie, function (value) {
        return value != bookID;
    });

    Cookies.remove('cart');

    Cookies.set('cart', JSON.stringify(bookID));

    console.log(Cookies.getJSON('cart'));
}

//Scroll Pane function for summary description
$(function()
{
    $('.scroll-pane')
        .jScrollPane()
        .bind(
            'mousewheel',
            function(e)
            {
                e.preventDefault();
            }
        );
});
/*$(function()
{
	$('.scroll-pane').jScrollPane(
		{
			verticalDragMinHeight: 20,
			verticalDragMaxHeight: 20,
			horizontalDragMinWidth: 20,
			horizontalDragMaxWidth: 20
		}
	);
});*/

