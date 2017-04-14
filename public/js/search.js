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
  var storageRef = storage.ref();






var r = new XMLHttpRequest();
r.open('GET', 'https://bookstore-e0ecb.firebaseio.com/BOOKS.json', true);

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

function setData(object, divID){

  var data = document.createElement('p');
  data.innerHTML = object.AUTHOR;
  data.style.fontWeight = "bold";
  data.style.color = "white";
  document.getElementById(divID).appendChild(data);
}

r.onreadystatechange = function () {
  if (r.readyState != 4 || r.status != 200) return;
  var data = JSON.parse(r.responseText);
  var x = [];

  for (var t in data){
    x.push(data[t]);
  }
  var options = {
    include: ["score"],
  	shouldSort: true,
  	tokenize: true,
  	matchAllTokens: true,
  	findAllMatches: true,
  	threshold: 0.5,
  	location: 0,
  	distance: 5000,
  	maxPatternLength: 32,
  	minMatchCharLength: 1,
    keys: ['AUTHOR','BOOK_NAME','COURSE','ISBN','CRN']
  }
  
  var f = new Fuse(x, options);
  var output = f.search(l);
  for(var out in output){
    setImage(output[out].item,'mine');
    //setData(output[out].item, 'mine');
  }
};

r.send();