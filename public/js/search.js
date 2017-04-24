
var searchData = [];

function search() {

    //TODO: this data needs to be appended to the HTML table
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
        keys: ['author','bookName','course', 'professor', 'crn', 'summary']
    };

    var f = new Fuse(searchData, options);
    var output = f.search(value);

    for(var index in output) {
        searchData.push(output[index].item);
    }
}

//formats input for search
function processForm() {
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    value = unescape(temp[1]);

    return value;
}

$(document).ready(function() {
    $('#search-table').DataTable();
} );
