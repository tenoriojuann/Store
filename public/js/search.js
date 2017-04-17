    var results = [];
    var value;
    var Cart = [];


// Finds the books that have been checked and adds the ID to the cart
function sendToCart(){
  $('#my-final-table tr').each(function(index){
    var row = $(this);
    if(index>0){

      if(row.find('input[type="checkbox"]').is(':checked')){
          console.log(row.find('td:nth-last-child(3)').text());
          Cart.push(row.find('td:nth-last-child(3)').text());

      }
    }
  });


}


// When the user clicks on an image a model pop up will appear
function displayInfo(isbn, summary){

storageRef.child('images/'+isbn+'.jpg').getDownloadURL().then(function(url){
  var modal = document.getElementById('myModal');
  var captionText = document.getElementById("caption");
// Get the image and insert it inside the modal - use its "alt" text as a caption
  var modalImg = document.getElementById("img01");
    modal.style.display = "block";
    modalImg.src = url;
    captionText.innerHTML = summary;
});


var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
    modal.style.display = "none";
  }

  $('#myModal').click(function (){
      $(this).hide();
  });
}






// Sets the images of the books to the given div
function setImages(){

$('#my-final-table tr').each(function(index){

  var row = $(this);
  if(index>0){
    var isbn = row.find('td:last-child').text();
    storageRef.child('images/'+isbn+'.jpg').getDownloadURL().then(function(url){
      var img = document.createElement('img');
      img.src = url;
      img.height = "125";
      img.width = "100";
      img.onclick = function(){displayInfo(isbn,row.find('td:nth-last-child(2)').text())};
      var check = document.createElement('input');
      check.setAttribute('type', 'checkbox');
      check.setAttribute('value', 'default');
      row.find('td:first-child').replaceWith(img);
      row.find('td:nth-last-child(4)').replaceWith(check);
    });



  }

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
      data[ID]["id"] = ID;
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
      keys: ['author','bookName','course', 'prof', 'crn', 'summary']
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
      perPageDefault: 10
      },
      features:{
        search:false
      }
    }).bind('dynatable:afterProcess', setImages);

    setImages();

}