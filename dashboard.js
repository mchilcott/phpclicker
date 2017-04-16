function make_dashboard ()
{
    var dash = {};

    // Response data
    dash.responses = [];

    // Put a table into the given jQuery selector, filled with the given data
    function makeTable(selector, data) {
        var table = $(selector).empty();
        for (var ind in data) {
            var row = $("<tr/>");
            
            row.append($("<td/>").text(ind));
            row.append($("<td/>").text(data[ind]));

            table.append(row);
        };
    }

    // Makes a set of progress bars from labeled data fields
    function makeGraph(selector, data){
        var div = $(selector).empty();
        var sum = 0;
        
        for (var ind in data){
            // Compute sum of elements
            sum += data[ind];
        }

        for (var ind in data){
            var percent = 0;
            if(sum != 0) // Don't divide by zero - it's silly
                var percent = data[ind]/sum * 100;
            var bar = '<div class="progress">'+
                '<div class="progress-bar" role="progressbar" aria-valuenow="'+
                percent+'" aria-valuemin="0" aria-valuemax="100" style="min-width: 5em; width: '+
                percent+'%">'+ind+': '+percent.toFixed(1)+'%</div></div>';
            div.append(bar);
        };

    }


    // Update the response list table
    dash.update_responses = function (){
        makeTable("#response-list", dash.responses);
    }

    // Update the total response table
    dash.update_totals = function (){
        var totals = [];
        totals['A'] = 0;
        totals['B'] = 0;
        totals['C'] = 0;
        totals['D'] = 0;
        totals['E'] = 0;
        totals['F'] = 0;
        // Tally up the results
        for (var ind in dash.responses)
        {
            var resp = dash.responses[ind];
            
            if(!totals[resp]) totals[resp] = 0;
            
            totals[resp] ++ ;
        }


        // Make progress bars
        makeGraph("#summary_graph", totals);
        
    }

    // Regenerate display 
    dash.update_disp = function() {
	dash.update_totals();
	dash.update_responses();
    }
    
    dash.toggle_visible = function (selector){
        $(selector).toggle();
    }

    // Callback from AJAX to receive the response data
    dash.update = function (data){
	dash.responses = JSON.parse(data);
    }

    // Run the update loop
    dash.update_loop = function () {
	// Make request
	$.get("question_model.php",
	      {
		  retrieve: null
	      },
	      dash.update
	     );

	// Update the display
	dash.update_disp ();

	setTimeout(dash.update_loop, 500);
    }

    // Set everything up for the start of a new question
    dash.new_question = function () {
        dash.responses = [];
	dash.update_disp;
        $.get("question_model.php",
	      {next: null});
    }

    
    return dash;
};


var dashboard;

window.onload = function(){
    dashboard = make_dashboard();
    dashboard.update_loop();
}
