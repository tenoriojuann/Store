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
  var storage = firebase.storage();
  
  
  // Function to add new entries to the database
  
  function newStore(isbn, book_name, author, term, course,professor, crn, IDK, required, 
			q_new, q_used, q_rental, q_ebook,pz_new,pz_used,pz_rental,pz_ebook,
			summary) {
				
	var rootRef = database.ref();
	var storeRef = rootRef.child("BOOKS");
	
	// DATABASE structure
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
  
	// This node has to be process separetly
	// They will still appear in the database together with 
	// The other book-data
	var newPrizeRef = newStoreRef.child("PRIZE");
	newPrizeRef.set({
		EBOOK:pz_ebook,
		NEW:pz_new,
		RENTAL:pz_rental,
		USED: pz_used
	
  });
  
  	// This node has to be process separetly
	// They will still appear in the database together with 
	// The other book-data
    var newQuantityRef = newStoreRef.child("QUANTITY");
	newQuantityRef.set({
		EBOOK:q_ebook,
		NEW:q_new,
		RENTAL:q_rental,
		USED:q_used
	
  });

}

  // Function to get the database in JSON format
  // This is going to be used for the searching mechanism
  function getJSON(){
	  
	  var rootRef = database.ref();
	var storeRef = rootRef.child("BOOKS");
	
	  $.getJSON("https://bookstore-e0ecb.firebaseio.com/BOOKS.json", function(data){
		 return data
	  });
  }
  
  // These next function handle the user uploading the books.csv file
  function handleFiles(files) {
      // Check for the various File API support.
      if (window.FileReader) {
          // FileReader are supported.
          getAsText(files[0]);
      } else {
          alert('FileReader are not supported in this browser.');
      }
    }

    function getAsText(fileToRead) {
      var reader = new FileReader();
      // Read file into memory as UTF-8      
      reader.readAsText(fileToRead);
      // Handle errors load
      reader.onload = loadHandler;
      reader.onerror = errorHandler;
    }

    function loadHandler(event) {
      var csv = event.target.result;
      processData(csv);
    }

	
	// Once we got the file from the user
	// We can process it and then add it to the database
    function processData(csv) {
		var result = "isbn, book_name, author, term, course, IDK, professor, crn, required, q_new, q_used, q_rental, q_ebook,pz_new,pz_used,pz_rental,pz_ebook,summary\n" + csv;  //now you have the header
		var data = d3.csvParse(result);
		//Now that we got the file we can send it to the database.
		
		var dataInObject = [];
		for(var i =0; i < data.length; i ++){
			for (var property in data[i]) {
			
				dataInObject.push(data[i][property]);
			}
			
			newStore(dataInObject[0], dataInObject[1], dataInObject[2], dataInObject[3], dataInObject[4], dataInObject[5],
					dataInObject[6], dataInObject[7], dataInObject[8], dataInObject[9], dataInObject[10], dataInObject[11],
					dataInObject[12], dataInObject[13], dataInObject[14], dataInObject[15], dataInObject[16], dataInObject[17]);
		}
		
		
  
    }

	// ERRORS
    function errorHandler(evt) {
      if(evt.target.error.name == "NotReadableError") {
          alert("Cannot read file !");
      }
    }