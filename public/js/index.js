function displayKW(){

	document.getElementById('selection').style.display = "none";
	document.getElementById('selection2').style.display = "none";
	document.getElementById('s').style.display = "block";

}


function toProperCase(s)
{
    return s.toLowerCase().replace(/^(.)|\s(.)/g,
        function($1) { return $1.toUpperCase(); });
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

        console.log(prof);

            // Changing all the professors names to Proper Case
            for(var entry in prof){
                prof[entry] = toProperCase(prof[entry]);
            }
        document.getElementById('s').style.display = "none";
        document.getElementById('selection2').style.display = "none";
		document.getElementById('selection').style.display = "block";
		prof.sort();

		// Remove multiple entries
		prof = prof.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });

		// Adding each professor to the drop down
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