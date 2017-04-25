var functions = require('firebase-functions');
var $ = require("jquery");
// The current card.js code does not explictly require jQuery, but instead uses the global, so this line is needed.
window.jQuery = $;
var card = require("card");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
