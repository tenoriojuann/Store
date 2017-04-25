var bookID = window.location.search.slice(4);

console.log(bookID);

function AddToCart(){
	var cookie = Cookies.getJSON('cart');

	cookie.push(bookID);

	Cookies.remove('cart');
	Cookies.set('cart',JSON.stringify(bookID));

}

function removeFromCart(){
	var cookie = Cookies.getJSON('cart');

	cookie = jQuery.grep(cookie, function(value) {
  		return value != bookID;
	});

	Cookies.remove('cart');

	Cookies.set('cart',JSON.stringify(bookID));
}