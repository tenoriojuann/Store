function displayKW(){

	document.getElementById('selection').style.display = "none";
	document.getElementById('selection2').style.display = "none";
	document.getElementById('s').style.display = "block";

}

function displayProfessors(){


	if(document.getElementById('professor').checked) {
  
    var prof = [];
    $.ajax({

    	
        url: "https://ksu-bookstore.firebaseio.com/books.json",
        success: function (data) {

        for( var id in data){
        	prof.push(data[id].professor);
           
        }
        document.getElementById('s').style.display = "none";
        document.getElementById('selection2').style.display = "none";
		document.getElementById('selection').style.display = "block";
		prof.sort();
		prof = prof.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });

		$.each(prof, function(key, value) {   
     		$('#options')
         	.append($("<option></option>")
                    .attr("value",value)
                    .text(value)); 
		});

        },
        async: false
    });

}

}

function displayCRS(){

if(document.getElementById('crs').checked) {
  
    var courses = [];
    $.ajax({

    	
        url: "https://ksu-bookstore.firebaseio.com/books.json",
        success: function (data) {

        for( var id in data){
        	courses.push(data[id].course);
           
        }

        document.getElementById('s').style.display = "none";
        document.getElementById('selection').style.display = "none";
		document.getElementById('selection2').style.display = "block";
		courses.sort();
		courses = courses.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });

		$.each(courses, function(key, value) {   
     		$('#courses')
         	.append($("<option></option>")
                    .attr("value",value)
                    .text(value)); 
		});

        },
        async: false
    });

}


}