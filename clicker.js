function make_clicker (){
    var client = {};

    // Submit an answer via AJAX
    client.submit = function(ans)
    {
	$.get("question_model.php",
	      {
		  user: this.name,
		  response: ans
	      }
	     );
    }

    // 
    client.name = "default-invalid";

    return client;
}

var clicker_client;

window.onload = function () {
    clicker_client = make_clicker();
    clicker_client.name = window.prompt("Please provide an identifier",
					"user:" +Math.floor(Math.random()*1000));
    $(".response-field").removeClass("disabled");
    
}
