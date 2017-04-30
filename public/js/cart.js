var cookies = JSON.parse(localStorage.getItem('cart'));
console.log(cookies);


function mergeMultiples(arr) {
    return _(arr)
            .groupBy('isbn')
            .map((object, isbn) => ({
            isbn: isbn,
            crn: _.map(object, 'crn').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }),
            bookName: _.map(object, 'bookName').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            quantityNew: _.map(object, 'quantityNew').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            quantityRental: _.map(object, 'quantityRental').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            quantityUsed: _.map(object, 'quantityUsed').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            quantityEbook: _.map(object, 'quantityEbook').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            summary: _.map(object, 'summary')[0],
            id: _.map(object, 'id')[0],

            author: _.map(object, 'author').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            course: _.map(object, 'course').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }),
            professor: _.map(object, 'professor').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }),
            priceEbook: _.map(object, 'priceEbook').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            priceNew: _.map(object, 'priceNew').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            priceUsed: _.map(object, 'priceUsed').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            priceRental: _.map(object, 'priceRental').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            })[0],
            Required: _.map(object, 'Required').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }),
            term: _.map(object, 'term').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }),
            new: _.map(object, 'new').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }).reduce(function(a, b) { return (parseInt(a) + parseInt(b)).toString(); }, 0),
            used: _.map(object, 'used').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }).reduce(function(a, b) { return (parseInt(a) + parseInt(b)).toString(); }, 0),
            rental: _.map(object, 'rental').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }).reduce(function(a, b) { return (parseInt(a) + parseInt(b)).toString(); }, 0),
            ebook: _.map(object, 'ebook').sort().filter(function (item, pos, ary) {
                return !pos || item != ary[pos - 1];
            }).reduce(function(a, b) { return (parseInt(a) + parseInt(b)).toString(); }, 0),
        }))
.value();
}



function drawTable() {

    cookies = mergeMultiples(cookies);
    localStorage.setItem('cart', JSON.stringify(cookies));
    console.log(cookies);
    //cookies = mergeMultiples(cookies);
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
                remove.style.marginLeft = "18%";
                remove.onclick = function() {
                    var isbn = row.find('td:nth-last-child(2)').text();
                    removeFromCart(isbn);
                };
                remove.innerHTML = "Remove from cart";
                row.find('td:first-child').replaceWith(img);
                row.find('td:last-child').replaceWith(remove);
            });
        }
    });
}

// option if the user wants to remove item from cart
function removeFromCart(isbn) {


    var data = $.grep(cookies, function(e){
        return e.isbn != isbn;
    });

    localStorage.setItem('cart', JSON.stringify(data));
    window.location = "Cart.html";


}


