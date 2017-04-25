var bookID = window.location.search.slice(4);
var bookDetails;
var myBook;

function Book() {
	    book = {
		Name: bookDetails.bookName,
		Author: bookDetails.author,
		ISBN: bookDetails.isbn,
		Aourse: bookDetails.course,
		CRN: bookDetails.crn,
		PriceEbook: bookDetails.priceEbook,
		PriceUsed: bookDetails.priceUsed,
		PriceNew: bookDetails.priceNew,
		PriceRental: bookDetails.priceRental,
		Professor: bookDetails.professor,
		QuantityEbook: bookDetails.quantityEbook,
		QuantityUsed: bookDetails.quantityUsed,
		QuantityNew: bookDetails.quantityNew,
		QuantityRental: bookDetails.quantityRental,
		QuantityTotal: (parseInt(bookDetails.quantityUsed)
			+ parseInt(bookDetails.quantityRental)
			+ parseInt(bookDetails.quantityNew)),
		Requirement: bookDetails.required,
		Summary: bookDetails.summary,
		Term: bookDetails.term
	};

	return book;
}

getBookByID();

function getBookByID() {
	$.ajax({
		url: "http://ksu-bookstore.firebaseio.com/books/" + bookID + "/.json",
		success: function(results) {
			bookDetails = results;
			myBook = new Book();
			console.log(myBook);
		}
	});

}

function viewBookDetails() {

}

function addToCart() {

	// Need to check if the cookie exists first

	// format of the cookie will end up being different
	// but this is just a start
	var cookie = Cookies.getJSON('cart');

	cookie.push(bookID);

	Cookies.remove('cart');
	Cookies.set('cart', JSON.stringify(bookID));

}

function removeFromCart() {
	var cookie = Cookies.getJSON('cart');

	cookie = jQuery.grep(cookie, function(value) {
  		return value != bookID;
	});

	Cookies.remove('cart');

	Cookies.set('cart', JSON.stringify(bookID));
}

