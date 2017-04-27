// Function to add new entries to the database
function newStore(data) {

    var rootRef = database.ref();
    var storeRef = rootRef.child("books");

    // DATABASE structure
    var newStoreRef = storeRef.push();
    newStoreRef.set({
        author: data.author,
        bookName: data.book_name,
        course: data.course,
        professor: data.professor,
        crn: data.crn,
        isbn: data.isbn,
        required: data.required,
        summary: data.summary,
        term: data.term,
        priceEbook: data.pc_ebook,
        priceNew: data.pc_new,
        priceRental: data.pc_rental,
        priceUsed: data.pc_used,
        quantityEbook: data.q_ebook,
        quantityNew: data.q_new,
        quantityRental: data.q_rental,
        quantityUsed: data.q_used
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
    input.onclick = function () {
        processData(csv);
    }

}

// Once we got the file from the user
// We can process it and then add it to the database
function processData(csv) {
    // The file comes without headers by passing this string
    //we will have the header added to the csv file
    var result = "isbn,book_name,author,term,course,IDK,professor,crn,required,q_new,q_used,q_rental,q_ebook,pc_new,pc_used,pc_rental,pc_ebook,summary\n" + csv;
    var data = d3.csvParse(result);
    //Now that we got the file we can send it to the database.

    for (var index = 0; index < data.length; index++) {

        newStore(data[index]);
    }

    window.confirm("Database updated!");
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Cannot read file !");
    }
}