    var results = [];
    var value;



// Sets the images of the books to the given div
function setImages(){

$('#my-final-table tr').each(function(index){

  var row = $(this);
  if(index>0){

    
    storageRef.child('images/'+row.find('td:last-child').text()+'.jpg').getDownloadURL().then(function(url){
      var img = document.createElement('img');
      img.src = url;
      img.height = "125";
      img.width = "100";
      row.find('td:first-child').replaceWith(img);
    });
  }
  row.find('td:last-child').replaceWith('<p></p>');
});
}

// Formating the input to the search

function processForm()
  {
    var parameters = location.search.substring(1).split("&");
    var temp = parameters[0].split("=");
    value = unescape(temp[1]);

    return value;
  }


function receiveSearchRequest(){

  value = processForm();
  var r = new XMLHttpRequest();
  r.open('GET', 'https://bookstore-e0ecb.firebaseio.com/books.json', true);


  r.onreadystatechange = function () {
    if (r.readyState != 4 || r.status != 200) return;
    var data = JSON.parse(r.responseText);

    var arrDATA = [];

    // The search only works in an array
    // So we are now inputting everything inside an array
    // As well as the ID, which determines the location in the database
    // This ID will be used to update the cart and to remove the entry from the database
    for (var ID in data){
      // creating a new entrr in the object
      data[ID]["ID"] = ID;
      arrDATA.push(data[ID]); 
    }

    // Settings for the search
    var options = {

      include: ["score"],
      // Will sort based on score
      shouldSort: true,
      tokenize: false,
      matchAllTokens: false,
      findAllMatches: true,
      // The treshhold determines how strict the search is.
      // The lower the value the more strict it is
      threshold: 0.2,
      location: 0,
      distance: 5000,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      // Keys to look for
      keys: ['author','bookName','course', 'prof', 'crn']
    };

    // Calling the Search object and passing the database and the search options
    var f = new Fuse(arrDATA, options);
    var output = f.search(value);



    for(var index in output){

      results.push(output[index].item);
    }


 table();
  }


  
  r.send();

 

}


function table(){
    $('#my-final-table').dynatable({
      dataset: {
      records: results,
      perPageDefault: 20
      },
      features:{
        search:false
      }
    }).bind('dynatable:afterProcess', setImages);

    setImages();

}