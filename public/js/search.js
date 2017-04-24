var results = [];
var searchData = [];

function search() {

    //TODO: this data needs to be appended to the HTML table
    //retrieve book data
    $.ajax({
        url: "https://bookstore-e0ecb.firebaseio.com/books.json",
        success: function (data) {
            results = data;
            console.log(data);
        }
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

    var f = new Fuse(results, options);
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
