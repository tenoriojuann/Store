// Initialize Firebase
var config = {
// Your firebase information goes here
};

firebase.initializeApp(config);

var database = firebase.database();
var storage = firebase.storage();
var storageRef = storage.ref();
