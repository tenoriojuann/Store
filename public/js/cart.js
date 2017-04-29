var cookie = Cookies.getJSON('cart');
console.log(cookie);

function drawTable() {
    $('#shopping-cart').dynatable({
        dataset: {
            records: cookie,
            perPageDefault: 10
        },
        features: {
            search: false
        }
    });

    $('#shopping-cart tr').each(function (index) {

        if (index > 0) {
            var row = $(this);
            var isbn = row.find('td:nth-last-child(2)').text();
            storageRef.child('images/' + isbn + '.jpg').getDownloadURL().then(function (url) {
                var img = document.createElement('img');
                img.src = url;
                img.height = "125";
                img.width = "100";
                var remove = document.createElement('button');
                remove.type = "button";
                remove.className = "btn btn-warning";
                remove.onclick = function() {
                    var id = row.find('td:nth-last-child(3)').text();
                    removeFromCart(id);
                };
                remove.innerHTML = "Remove from cart";
                row.find('td:first-child').replaceWith(img);
                row.find('td:last-child').replaceWith(remove);
            });
        }
    });
}

// option if the user wants to remove item from cart
function removeFromCart(id) {

    var cookies = Cookies.getJSON('cart');

    console.log(cookies);

    for(var i = 0; i < cookies.length; i++) {
        var obj = cookies[i];

        if (obj.id == id) {
            cookies.remove(obj[i]);
        }
    }
    console.log(cookies);

    //drawTable();

	/*var cookie = Cookies.getJSON('cart');
	$('#shopping-cart tr').each(function (index) {
		if(index > 0){

			var row = $(this);
      // Detect all the ticked checkboxes
      		if(row.find('input').is(':checked')){
				cookie.splice(index-1,1);
      		}
		}
	});

	Cookies.remove('cart');
	Cookies.set('cart', JSON.stringify(cookie));
	window.location = "cart.html"*/

}


