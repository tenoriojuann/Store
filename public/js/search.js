var searchData = [];
var tableData = [];
var cookieID = [];

function search() {

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

    for(var index in output){

      tableData.push(output[index].item);
    }

    table();
}

//formats input for search
function processForm() {
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    value = unescape(temp[1]);

    return value;
}

function table(){
    $('#search-table').dynatable({
      dataset: {
      records: tableData,
      perPageDefault: 10
      },
      features:{
        search:false
      }
    }).bind('dynatable:afterProcess', setImages);

    setImages();
}

// Sets the images of the books to the given div
function setImages(){

$('#search-table tr').each(function(index) {

  var row = $(this);
  if(index>0){
    var isbn = row.find('td:last-child').text();
    storageRef.child('images/'+isbn+'.jpg').getDownloadURL().then(function(url){
      var img = document.createElement('img');
      img.src = url;
      img.height = "125";
      img.width = "100";
      img.onclick = function() {
          window.location = generateUrl("bookdetails.html", {
              id: '25' //book id here
          });
      };
      var check = document.createElement('input');
      check.setAttribute('type', 'checkbox');
      check.setAttribute('value', 'default');
      check.className = 'roundedOne';
      row.find('td:first-child').replaceWith(img);
      row.find('td:nth-last-child(4)').replaceWith(check);
    });
  }
});
}

// Finds the books that have been checked and adds the ID to the array
function saveIDs(){
  $('#search-table tr').each(function(index){
    var row = $(this);
    if(index>0){

      if(row.find('input[type="checkbox"]').is(':checked')){
          cookieID.push(row.find('td:nth-last-child(3)').text());
      }
    }
  });

//set cookie
  Cookies.set('id', JSON.stringify(cookieID));

  console.log(Cookies.getJSON('id'))
}

function generateUrl(url, params) {
    var i = 0, key;
    for (key in params) {
        if (i === 0) {
            url += "?";
        } else {
            url += "&";
        }
        url += key;
        url += '=';
        url += params[key];
        i++;
    }
    return url;
}

