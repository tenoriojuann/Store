var config = {
    apiKey: "AIzaSyCRDKyvIxu8HOniceJ-Xot7PC8XFDg54Lc",
    authDomain: "bookstore-e0ecb.firebaseapp.com",
    databaseURL: "https://bookstore-e0ecb.firebaseio.com",
    projectId: "bookstore-e0ecb",
    storageBucket: "bookstore-e0ecb.appspot.com",
    messagingSenderId: "201530925901"
  };
  firebase.initializeApp(config);
      // Get a reference to the database service
  var database = firebase.database();
  
  function newStore(isbn, book_name, author, term, course,professor, crn, required, 
			q_new, q_used, q_rental, q_ebook,pz_new,pz_used,pz_rental,pz_ebook,
			summary) {
				
	var rootRef = database.ref();
	var storeRef = rootRef.child("BOOKS");
	
	var newStoreRef = storeRef.push();
	newStoreRef.set({
    AUTHOR: author,
    BOOK_NAME: book_name,
    COURSE : course,
	CRN : crn,
	ISBN : isbn,
	REQUIRED: required,
	SUMMARY: summary,
	TERM: term
  });
  
	var newPrizeRef = newStoreRef.child("PRIZE").push();
	newPrizeRef.set({
		EBOOK:pz_ebook,
		NEW:pz_new,
		RENTAL:pz_rental,
		USED: pz_used
	
  });
  
    var newQuantityRef = newStoreRef.child("QUANTITY").push();
	newQuantityRef.set({
		EBOOK:q_ebook,
		NEW:q_new,
		RENTAL:q_rental,
		USED:q_used
	
  });
}
