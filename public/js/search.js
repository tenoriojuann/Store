// Sets the images of the books to the given div
function setImage(object, divID){

  storageRef.child('images/'+object.ISBN+'.jpg').getDownloadURL().then(function(url){
    var img = document.createElement('img');
    img.src = url;
    img.height = "250";
    img.width = "250";
    document.getElementById(divID).appendChild(img);
    setData(object, divID);
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

// Sets the data to the given div
function setData(object, divID){


  var data = document.createElement('p');
  data.innerHTML = object.AUTHOR;
  data.style.fontWeight = "bold";
  data.style.color = "black";
  document.getElementById(divID).appendChild(data);
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
    var results = [];
    for(var index in output){
      results.push(output[index].item);
    }
    console.log(results);

$('#my-final-table').dynatable({
  dataset: {
    records: results
  }
});


  };
  
  r.send();
}