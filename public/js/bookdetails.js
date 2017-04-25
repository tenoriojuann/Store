var bookID = window.location.search.slice(4);
var myBook=null;

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
		this.quantityEbook= bookDetails.quantityEbook;
		this.quantityUsed= bookDetails.quantityUsed;
		this.quantityNew= bookDetails.quantityNew;
		this.quantityRental= bookDetails.quantityRental;
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

}

getBookByID();

function getBookByID() {
	//reference to the root of the database
	var rootRef = database.ref();
	// referencing the 'books' node 
	var storeRef = rootRef.child("books");
	// Grabbing the book from the database
	storeRef.child(bookID).once('value', function(book){
		myBook = new Book(book.val());
		myBook.print()
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
	Cookies.set('cart', JSON.stringify(cookie));

}

function removeFromCart() {
	var cookie = Cookies.getJSON('cart');

	cookie = jQuery.grep(cookie, function(value) {
  		return value != bookID;
	});

	Cookies.remove('cart');

	Cookies.set('cart', JSON.stringify(bookID));
}

