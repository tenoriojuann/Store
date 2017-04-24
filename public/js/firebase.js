
// Initialize Firebase
var config = {
    apiKey: "AIzaSyA5sQLFwbqG-b1OqK9ROXYN8yBJnL5zIC0",
    authDomain: "ksu-bookstore.firebaseapp.com",
    databaseURL: "https://ksu-bookstore.firebaseio.com",
    projectId: "ksu-bookstore",
    storageBucket: "ksu-bookstore.appspot.com",
    messagingSenderId: "87493716263"
};

firebase.initializeApp(config);

var database = firebase.database();
var storage = firebase.storage();
var storageRef = storage.ref();
