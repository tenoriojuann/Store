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
                row.find('td:first-child').replaceWith(img);
            });
        }
    });
}

// option if the user wants to remove item from cart
function removeFromCart() {

}


