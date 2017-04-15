// Firebase stuff
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