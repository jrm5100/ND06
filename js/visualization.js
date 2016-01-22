function agg_franchise(leaves){
	return {
		'franchName' : leaves[0]['franchName'],
		'seasons' : leaves		
	};
};

function draw(team_data) {
	"use strict";

	//Adjustable Settings
	var year_min = d3.min(team_data, function(d) {return d['year'];});
	var year_max = d3.max(team_data, function(d) {return d['year'];});
    var year_span = year_max-year_min
    var selected_year = year_max;
    var selected_teams = ["", "", "", "", ""];

	var stats = [
	{'key':'winpercent', 'name':'Winning Percentage'},
	{'key':'W', 'name':'Wins'},
	{'key':'L', 'name':'Losses'},
	{'key':'Games', 'name':'Games Played'},
	{'key':'R', 'name':'Runs'},
	{'key':'AB', 'name':'At Bats'},
	{'key':'H', 'name':'Hits'},
	{'key':'2B', 'name':'Doubles'},
	{'key':'3B', 'name':'Triples'},
	{'key':'HR', 'name':'HomeRuns'},
	{'key':'BB', 'name':'Walks'},
	{'key':'SO', 'name':'Strikeouts'},
	{'key':'SB', 'name':'Stolen Bases'},
	{'key':'RA', 'name':'Runs Given Up'},
	{'key':'ERA', 'name':'ERA'},
	{'key':'CG', 'name':'Complete Games'},
	{'key':'BBA', 'name':'Walks (pitching)'},
	{'key':'SOA', 'name':'Strikeouts (pitching)'},
	{'key':'E', 'name':'Errors'}
	];


	// Group by franchise id for line graph
	var nested_franchises = d3.nest()
		.key(function(d) {return d['franchID'];})
		.rollup(agg_franchise)
		.sortKeys(d3.ascending)
		.entries(team_data);

    //Graph1 object
    var Graph1 = new Object();

    //size
    Graph1.margin = {top : 50, right: 50, bottom: 80, left: 80};
    Graph1.width = 960 - Graph1.margin.left - Graph1.margin.right;
    Graph1.height = 400 - Graph1.margin.top - Graph1.margin.bottom;

    //Graph Display Parameters
    Graph1.ystat = {'key':'winpercent', 'name':'Winning Percentage'};
    Graph1.show_unselected = true;

    
    //SVG layout structure
    Graph1.svg = d3.select("#graph1").select("svg")
    	.attr("width", Graph1.width + Graph1.margin.left + Graph1.margin.right)
    	.attr("height", Graph1.height + Graph1.margin.top + Graph1.margin.bottom)
    	.append("g")
    	.attr("transform", "translate(" + Graph1.margin.left + "," + Graph1.margin.top + ")");

    Graph1.svg.append("g").attr("class", "axis x-axis");
    Graph1.svg.append("g").attr("class", "axis y-axis");
    Graph1.svg.append("g").attr("class", "unselected");
    Graph1.svg.append("g").attr("class", "selected");

    var year_marker = Graph1.svg.append("g").attr("id", "year_marker");
    year_marker.append("line");
    year_marker.append("text");

    //Scales and axis
    Graph1.xScale = d3.time.scale()
    	.range([0, Graph1.width])
    	.domain([
    		d3.time.format("%Y").parse(year_min),
    		d3.time.format("%Y").parse(year_max)
    		]);
    Graph1.yScale = d3.scale.linear()
    	.range([Graph1.height, 0])
    	.domain(d3.extent(team_data, function(d) {
    		return d[Graph1.ystat.key];
    		}));

    Graph1.xAxis = d3.svg.axis().scale(Graph1.xScale).orient("bottom");
    Graph1.yAxis = d3.svg.axis().scale(Graph1.yScale).orient("left");

    //Add axes
    Graph1.svg.select("g.x-axis")
    	.attr("transform", "translate(0," + Graph1.height + ")")
    	.call(Graph1.xAxis);
    Graph1.svg.select("g.y-axis")
    	.call(Graph1.yAxis);


    Graph1.updateGraph = function() {
    	//update yscale domain
    	Graph1.yScale.domain(d3.extent(team_data, function(d) {
    		return d[Graph1.ystat.key];
    	}));
        //update yaxis
        Graph1.svg.select("g.y-axis")
        	.transition()
        	.duration(500)
        	.call(Graph1.yAxis)

        //function to get correct data
        var lineGen = d3.svg.line()
        .x(function(d) {
        	return Graph1.xScale(d3.time.format("%Y").parse(d['year']));
        })
        .y(function(d) {
        	return Graph1.yScale(d[Graph1.ystat.key]);
        });

    	//Plot unselected background gray lines
    	if(Graph1.show_unselected) {
    		var unselected = Graph1.svg.select("g.unselected").selectAll("path")
    			.data(nested_franchises, function(d) {return d.key;});

    		unselected.transition().duration(500)
    			.attr('d', function(d) {return lineGen(d.values.seasons);});

    		unselected.enter()
    			.append('path')
        		.attr('d', function(d) {return lineGen(d.values.seasons);}) //seasons is an array
        		.style('stroke', 'gray')
        		.style('stroke-width', 1)
        		.style('fill', 'none')
        		.style('fill-opacity', 0.3);
        } else {
        	Graph1.svg.select("g.unselected").selectAll("path").remove();
        };

        //Plot selected lines
        var color = d3.scale.category10().domain(selected_teams);

        var selected = Graph1.svg.select("g.selected").selectAll("path")
        	.data(nested_franchises.filter(function(d) {
        		return selected_teams.indexOf(d.key) >= 0;}),
    				function(d) {return d.key;}) //key function to tie to team id
        selected.transition().duration(500)
        	.attr('d', function(d){ return lineGen(d.values.seasons);});

        selected.enter()
        	.append("path")
        	.attr('d', function(d){ return lineGen(d.values.seasons);})
        	.attr('stroke', function(d,i){return color(i);})
        	.attr('stroke-width', 3)
        	.attr('fill', 'none')
        	.attr('fill-opacity', 1);
        
        selected.exit().remove()


        //update labels
        //update year line
    };

    Graph1.updateGraph();


    





    //Graph2 Object
    var Graph2 = new Object();

    //size
    Graph2.margin = {top : 50, right: 50, bottom: 80, left: 80};
    Graph2.width = 480 - Graph2.margin.left - Graph2.margin.right;
    Graph2.height = 400 - Graph2.margin.top - Graph2.margin.bottom;

    //Graph Display Parameters
    Graph2.xstat = {'key':'HR', 'name':'HomeRuns'};
    Graph2.ystat = {'key':'winpercent', 'name':'Winning Percentage'};

    
    //SVG layout structure
    Graph2.svg = d3.select("#graph2").select("svg")
        .attr("width", Graph2.width + Graph2.margin.left + Graph2.margin.right)
        .attr("height", Graph2.height + Graph2.margin.top + Graph2.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + Graph2.margin.left + "," + Graph2.margin.top + ")");

    Graph2.svg.append("g").attr("class", "axis x-axis");
    Graph2.svg.append("g").attr("class", "axis y-axis");
    Graph2.svg.append("g").attr("class", "points");

    //Scales and axis
    Graph2.xScale = d3.scale.linear()
        .range([0, Graph2.width])
        .domain(d3.extent(team_data, function(d) {
            return d[Graph2.xstat.key];
            }));
    Graph2.yScale = d3.scale.linear()
        .range([Graph2.height, 0])
        .domain(d3.extent(team_data, function(d) {
            return d[Graph2.ystat.key];
            }));

    Graph2.xAxis = d3.svg.axis().scale(Graph2.xScale).orient("bottom");
    Graph2.yAxis = d3.svg.axis().scale(Graph2.yScale).orient("left");

    //Add axes
    Graph2.svg.select("g.x-axis")
        .attr("transform", "translate(0," + Graph2.height + ")")
        .call(Graph2.xAxis);
    Graph2.svg.select("g.y-axis")
        .call(Graph2.yAxis);

    //function to calc radius
    Graph2.getRadius = function(d) {
        return 5; //fix later
    };
    Graph2.getColor = function(d) {
        return "gray"; //fix later
    }

    //update function
    Graph2.updateGraph = function() {
        //update xScale domain
        Graph2.xScale.domain(d3.extent(team_data, function(d) {
            return d[Graph2.xstat.key];
        }));
        //update xAxis
        Graph2.svg.select("g.x-axis")
            .transition()
            .duration(500)
            .call(Graph2.xAxis)        

        //update yScale domain
        Graph2.yScale.domain(d3.extent(team_data, function(d) {
            return d[Graph2.ystat.key];
        }));
        //update yAxis
        Graph2.svg.select("g.y-axis")
            .transition()
            .duration(500)
            .call(Graph2.yAxis)

        //plot all points
        var circles = Graph2.svg.select("g.points")
            .selectAll("circle")
            .data(team_data.filter(function(d){return d.year===selected_year;}),
        	function(d) {return d.franchID;});

        //move updated teams
        circles.transition()
            .duration(500)
            .attr("cx", function(d) {return Graph2.xScale(d[Graph2.xstat.key]);})
            .attr("cy", function(d) {return Graph2.yScale(d[Graph2.ystat.key]);})
            .attr("r", Graph2.getRadius)
            .attr("fill", Graph2.getColor)
            .attr("fill-opacity", 0.5);
        
        //add new teams	
        circles.enter()
            .append("circle")
            .attr("cx", function(d) {return Graph2.xScale(d[Graph2.xstat.key]);})
            .attr("cy", function(d) {return Graph2.yScale(d[Graph2.ystat.key]);})
            .attr("r", Graph2.getRadius)
            .attr("fill", Graph2.getColor)
            .style("fill-opacity", 0.5);

        //remove missing teams
        circles.exit().remove();

        //labels and title
        Graph2.svg.append("text")
            .attr("x", Graph2.width/2)
            .attr("y", 0)
            .text("Results for " + selected_year)
            .attr("class", "title")

        Graph2.svg.append("text")
            .attr("x", Graph2.width/2)
            .attr("y", Graph2.height-12)
            .text(Graph2.xstat.name)
            .attr("class", "x-label")

        Graph2.svg.append("text")
            .attr("x", 12)
            .attr("y", Graph2.height/2)
            .text(Graph2.ystat.name)
            .attr("class", "y-label")
    };


    //Set up Graph2
    Graph2.updateGraph();



    /* Setup Year Summary */
    function draw_yearinfo(){
    	// fill in info like WS winner
    };

    function update_yearinfo(delta) {
    	if (delta < 0){
    		selected_year = String(d3.max([year_min, +selected_year + delta]))
    	} else {
    		selected_year = String(d3.min([year_max, +selected_year + delta]))
    	};

		//update text
		d3.select("#year-value-text")
		.text(selected_year);
		//update attribute
		Graph1.updateGraph();
		Graph2.updateGraph();
	};





	/* Interface Elements */

	//Show or hide unselected teams
	var unselected_button = d3.select("#show_unselected-teams-button")
	unselected_button.on("click", function(d){
		if(unselected_button.classed("mdl-button--colored mdl-button--raised")){
			//disable button and remove unselected
			unselected_button.classed("mdl-button--colored mdl-button--raised", false);
			Graph1.show_unselected = false;
			Graph1.updateGraph();
		} else {
			//enable button and add unselected
			unselected_button.classed("mdl-button--colored mdl-button--raised", true);
			Graph1.show_unselected = true;
			Graph1.updateGraph();
		};
	});

	/* Setup Team Selection */
	var nav = d3.select(".mdl-navigation");
	var team_buttons = nav.selectAll("button.team-button")
		.data(nested_franchises)
		.enter()
		.append("button")
		.attr("class", "team-button mdl-button mdl-js-button")
		.attr("id", function(d){return d['key'];})
		.text(function(d) {return d.values['franchName']});

	/* team button functionality */
	team_buttons.on("click", function(d) {

    	// Check if already selected and modify
    	var pos_in_selected = selected_teams.indexOf(d.key);
        var first_blank = selected_teams.indexOf("");

    	if(pos_in_selected === -1 & first_blank != -1) {
    		//add to selected and update
    		selected_teams[first_blank] = d.key;
    		d3.select(this)
    		.classed("mdl-button--colored mdl-button--raised", true);
    		Graph1.updateGraph();
            Graph2.updateGraph();
    	} else if (pos_in_selected === -1 & first_blank === -1) {
    		//ignore
    	} else {
    		//remove from selected and update
    		selected_teams[pos_in_selected] = "";
    		d3.select(this)
    		.classed("mdl-button--colored", false)
    		.classed("mdl-button--raised", false);
    		Graph1.updateGraph();
            Graph2.updateGraph();
    	};
    });

	/* Setup Year Selection */

	d3.select("#year-down-10")
    .on("click", function(d){
        update_yearinfo(-10);
    });


	d3.select("#year-down-1")
	.on("click", function(d){
		update_yearinfo(-1);
	});

	d3.select("#year-up-1")
	.on("click", function(d){
		update_yearinfo(1);
	});

	d3.select("#year-up-10")
	.on("click", function(d){
		update_yearinfo(10);
	});

};

function join_data(team_data, franchise_data) {
	
	/* Join df to get franchise names */
	team_data.forEach(function(team){
		var match = franchise_data.filter(function(franchise){
			return franchise['franchID'] === team['franchID'];
		});

		if (match[0] != undefined & match[0]['active'] === 'Y') {
			team['franchName'] = match[0]['franchName']
		} else {
			team['franchName'] = "NA"
		};
	});

	/* Remove teams without an active franchise */
	var active_franchises = team_data.filter(function(t){
		return t['franchName'] != "NA"
	})

	return active_franchises
};

function format_data(team_data) {
	var formatted_data = []
	team_data.forEach(function(d) {
		formatted_data.push(
		{
			'franchName' : d['franchName'],
			'franchID' : d['franchID'],
			'year' : d['yearID'],

       		"winpercent" : (+d['W']/+d['G']), //Win Percentage
       		"W" : +d['W'],
       		"L" : +d['L'],
       		"G" : +d['G'],
       		"w_division" : d['DivWin'],
       		"w_wildcard" : d['WCWin'],
       		"w_league" : d['LgWin'],
       		"w_worldseries" : d['WSWin'],

       		"R" : +d['R'],
       		"AB" : +d['AB'],
       		"H" : +d['H'],
       		"2B" : +d['2B'],
       		"3B" : +d['3B'],
       		"HR" : +d['HR'],
       		"BB" : +d['BB'],
       		"SO" : +d['SO'],
       		"SB" : +d['SB'],

       		"RA" : +d['RA'],
       		"ERA" : +d['ERA'],
       		"CG" : +d['CG'],
       		"BBA" : +d['BBA'],
       		"SOA" : +d['SOA'],
       		"E" : +d['E']
       	}
       	);
	});
	return formatted_data;
};

/* Read in two csv Files.  Join on franchID to get Franchise Names */
d3.csv("data/Teams.csv", function(team_data) {
	d3.csv("data/TeamsFranchises.csv", function(franchise_data) {
		team_data = join_data(team_data, franchise_data);
		team_data = format_data(team_data);
		draw(team_data);
	});
});