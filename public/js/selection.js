var IDs = Cookies.getJSON('id');
var numberOfItems = [];


function selectedBooks(){

	var rootRef = database.ref();
	var storeRef = rootRef.child("books");

	var table = document.createElement('table');
	table.setAttribute('id', "selectionTable");
	for(index in IDs){	
		var starCountRef = firebase.database().ref('books/' + IDs[index]);
		starCountRef.on('value', function(snapshot) {

		var book = snapshot.val();
	  	storageRef.child('images/'+book.isbn+'.jpg').getDownloadURL().then(function(url){

      		var img = document.createElement('img');
      		var row = table.insertRow();
      		var cell1 = row.insertCell(0);
      		var cell2 = row.insertCell(1);
      		var cell3 = row.insertCell(2);
      		var cell4 = row.insertCell(3);
      		var cell5 = row.insertCell(4);
      		var cell6 = row.insertCell(5); // ID
      		var input = document.createElement('input');
      		input.setAttribute('type', 'text');
      		input.setAttribute('value' , '0');
      		var input2 = document.createElement('input');
      		input2.setAttribute('type', 'text');
      		input2.setAttribute('value' , '0');
      		var input3 = document.createElement('input');
      		input3.setAttribute('type', 'text');
      		input3.setAttribute('value' , '0');
      		var input4 = document.createElement('input');
      		input4.setAttribute('type', 'text');
      		input4.setAttribute('value' , '0');
      		img.src = url;
      		img.src = url;
      		img.height = "250";
      		img.width = "175";
      		var text1 = document.createElement('p');
      		var text2 = document.createElement('p');
      		var text3 = document.createElement('p');
      		var text4 = document.createElement('p');
      		 cell1.appendChild(img);
      		text1.innerHTML = "Ebook: " + book.priceEbook;
      		      		cell2.appendChild(text1);
      		cell2.appendChild(input);
      		text2.innerHTML = "Used: " + book.priceUsed;
      		cell3.appendChild(text2);
      		cell3.appendChild(input2);
      		text3.innerHTML = "Rental: " + book.priceRental;
      		cell4.appendChild(text3);
      		cell4.appendChild(input3);
      		text4.innerHTML = "New: " + book.priceNew;
      		cell5.appendChild(text4);
      		cell5.appendChild(input4);
      		var txt5 = document.createElement('p');
      		txt5.innerHTML = snapshot.key;
      		txt5.style.display = 'none';
      		cell6.appendChild(txt5);
		});

	});
  }

  document.getElementById('my-container').appendChild(table);
}


function sendToCart(){

	var cartData = [];
  $('#selectionTable tr').each(function(index){
    var row = $(this);
    var values = [];
    var id = row.find('td:last-child').text();
	row.find('input').each(function(){
		values.push(this.value);
    });
    var tmp = {
    		"id": id,
    		"ebook": values[0],
				"used": values[1],
				"rental" : values[2],
				"new" : values[3]
			
		};
	cartData.push(tmp);
  });


//set cookie


  Cookies.set('cart', JSON.stringify(cartData));

  window.location.href = "Cart.html"

}
