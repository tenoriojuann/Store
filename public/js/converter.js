
  
  // Function to add new entries to the database
  
  function newStore(isbn, book_name, author, term, course, IDK, professor, crn, required, 
			q_new, q_used, q_rental, q_ebook,pz_new,pz_used,pz_rental,pz_ebook,
			summary) {
				
	var rootRef = database.ref();
	var storeRef = rootRef.child("books");
	
	// DATABASE structure
	var newStoreRef = storeRef.push();
	newStoreRef.set({
    author: author,
    bookName: book_name,
    course : course,
    professor : professor,
	crn : crn,
	isbn : isbn,
	required: required,
	summary: summary,
	term: term,
	priceEbook:pz_ebook,
	priceNew:pz_new,
	priceRental:pz_rental,
	priceUsed: pz_used,
	quantityEbook:q_ebook,
	quantityNew:q_new,
	quantityRental:q_rental,
	quantityUsed:q_used
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

		reader.onerror = errorHandler;
		reader.onload = loadHandler;
      
    }

    function loadHandler(event) {
    	var csv = event.target.result;
    	var div = document.getElementById('inputForm');
    	var input = document.createElement('button');

    	div.appendChild(input);
    	var t = document.createTextNode("Submit");       // Create a text node
		input.appendChild(t);
        input.onclick = function(){processData(csv);}

    }

	
	// Once we got the file from the user
	// We can process it and then add it to the database
    function processData(csv) {
    	// The file comes without headers by passing this string
    	//we will have the header added to the csv file
		var result = "isbn,book_name,author,term,course,IDK,professor,crn,required,q_new,q_used,q_rental,q_ebook,pz_new,pz_used,pz_rental,pz_ebook,summary\n" + csv;  
		var data = d3.csvParse(result);
		//Now that we got the file we can send it to the database.
		
		var dataInObject = [];
		for(var i =0; i < data.length; i ++){
			while(dataInObject.length > 0) {
				dataInObject.pop();
			}
			for (var property in data[i]) {
			
				dataInObject.push(data[i][property]);
			} 

			// PERHAPS THIS WILL BE BETTER BY PASSING THE WHOLE OBJECT---I was a little tipy when this happened
			newStore(dataInObject[0], dataInObject[1], dataInObject[2], dataInObject[3], dataInObject[4], dataInObject[5],
					dataInObject[6], dataInObject[7], dataInObject[8], dataInObject[9], dataInObject[10], dataInObject[11],
					dataInObject[12], dataInObject[13], dataInObject[14], dataInObject[15], dataInObject[16], dataInObject[17]); 
		
		}

		window.confirm("Database updated!");
    }

	// ERRORS
    function errorHandler(evt) {
      if(evt.target.error.name == "NotReadableError") {
          alert("Cannot read file !");
      }
    }