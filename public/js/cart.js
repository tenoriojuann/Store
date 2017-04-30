var cookies = Cookies.getJSON('cart');
console.log(cookies);

function drawTable() {

    $('#shopping-cart').dynatable({
        dataset: {
            records: cookies,
            perPageDefault: 100
        },
        features: {
            search: false,
            paginate: false,
            recordCount: false
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


    console.log(cookies);

    for(var i = 0; i < cookies.length; i++) {
        var obj = cookies[i];
        console.log(obj);
        console.log(id);
        if (obj.id === id) {
            var index = cookies.indexOf(obj.id);
            cookies.splice(index, 1);
            Cookies.remove('cart');
            Cookies.set('cart', JSON.stringify(cookies));
            window.location = "cart.html";
        }
    }



}


