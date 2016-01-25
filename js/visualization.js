function agg_franchise(leaves){
	return {
		'franchName' : leaves[0]['franchName'],
		'seasons' : leaves		
	};
};

function draw(team_data) {
	"use strict";

    // Group by franchise id for line graph
    var nested_franchises = d3.nest()
        .key(function(d) {return d['franchID'];})
        .rollup(agg_franchise)
        .sortKeys(d3.ascending)
        .entries(team_data);

	//Adjustable Settings
	var year_min = d3.min(team_data, function(d) {return d['year'];});
	var year_max = d3.max(team_data, function(d) {return d['year'];});
    var year_span = year_max-year_min
    var selected_year = year_max;
    var selected_teams = ["", "", "", "", ""];
    var color = d3.scale.category10().domain([0,1,2,3,4]);

	var stats = {
	'winpercent':'Winning Percentage',
	'W':'Wins',
	'L':'Losses',
	'G':'Games Played',
	'R':'Runs',
	'AB':'At Bats',
	'H':'Hits',
	'2B':'Doubles',
	'3B':'Triples',
	'HR':'HomeRuns',
	'BB':'Walks',
	'SO':'Strikeouts',
	'SB':'Stolen Bases',
	'RA':'Runs Given Up',
	'ERA':'ERA',
	'CG':'Complete Games',
	'BBA':'Walks (pitching)',
	'SOA':'Strikeouts (pitching)',
	'E':'Errors'
	};

    /* Interface Elements */

    //Show or hide unselected teams
    d3.select("#checkbox-unselectedteam")
        .on("change", function() {
            Graph1.show_unselected = this.checked;
            Graph1.updateGraph()
    });

    /* Setup Team Selection */
    var nav = d3.select(".mdl-navigation");
    var team_buttons = nav.selectAll("button.team-button")
        .data(nested_franchises)
        .enter()
        .append("button")
        .attr("class", "team-button mdl-button mdl-js-button")
        .attr("id", function(d){return d.key;})
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

    /* Set xstat/ystat */
    var g1_ystat = d3.select("#g1_ystat_select")
        .attr("name", "g1_ystat")
        .on("change", function(){
            Graph1.ystat = d3.select("#g1_ystat_select").property("value");
            Graph1.updateGraph();
        });

    g1_ystat.selectAll("option")
        .data(Object.keys(stats))
        .enter()
        .append("option")
        .attr("value", function(d){return d;})
        .property("selected", function(d){return d === "R";}) //default value
        .text(function(d){return stats[d];});


    var g2_ystat = d3.select("#g2_ystat_select")
        .attr("name", "g2_ystat")
        .on("change", function(){
            Graph2.ystat = d3.select("#g2_ystat_select").property("value");
            Graph2.updateGraph();
        });

    g2_ystat.selectAll("option")
        .data(Object.keys(stats))
        .enter()
        .append("option")
        .attr("value", function(d){return d;})
        .property("selected", function(d){return d === "R";}) //default value
        .text(function(d){return stats[d];});


    var g2_xstat = d3.select("#g2_xstat_select")
        .attr("name", "g2_xstat")
        .on("change", function(){
            Graph2.xstat = d3.select("#g2_xstat_select").property("value");
            Graph2.updateGraph();
        });

    g2_xstat.selectAll("option")
        .data(Object.keys(stats))
        .enter()
        .append("option")
        .attr("value", function(d){return d;})
        .property("selected", function(d){return d === "HR";}) //default value
        .text(function(d){return stats[d];});






    //Graph1 object
    var Graph1 = new Object();

    //size
    Graph1.margin = {top : 50, right: 50, bottom: 50, left: 80};
    Graph1.width = 960 - Graph1.margin.left - Graph1.margin.right;
    Graph1.height = 320 - Graph1.margin.top - Graph1.margin.bottom;

    //Graph Display Parameters
    Graph1.ystat = d3.select("#g1_ystat_select").property("value");
    Graph1.show_unselected = true;

    
    //SVG layout structure
    Graph1.svg = d3.select("#graph1").select("svg")
    	.attr("width", Graph1.width + Graph1.margin.left + Graph1.margin.right)
    	.attr("height", Graph1.height + Graph1.margin.top + Graph1.margin.bottom)
    	
    Graph1.chart = Graph1.svg.append("g")
    	.attr("transform", "translate(" + Graph1.margin.left + "," + Graph1.margin.top + ")");

    Graph1.chart.append("g").attr("class", "axis x-axis");
    Graph1.chart.append("g").attr("class", "axis y-axis");
    Graph1.chart.append("g").attr("class", "unselected");
    Graph1.chart.append("g").attr("class", "selected");
    Graph1.legend = Graph1.svg.append("g").attr("class", "legend")
        .attr("height", 40)
        .attr("width", Graph1.width)
        .attr("transform", "translate(" + Graph1.margin.left + "," + (Graph1.height+Graph1.margin.top+Graph1.margin.bottom/2) + ")")

    var year_marker = Graph1.chart.append("g").attr("id", "year_marker");
    year_marker.append("line")
        .attr("stroke", "#3f51b5")
        .attr("stroke-width", 3)
        .attr("fill", "none");
    year_marker.append("text")
        .attr("fill", "#3f51b5")
        .attr("text-anchor", "middle");

    //labels and title
    Graph1.chart.append("text")
        .attr("x", Graph1.width/2)
        .attr("y", -Graph1.margin.top/2)
        .attr("class", "title label")
        .text(stats[Graph1.ystat] + " over Time");
    Graph1.chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -Graph1.height/2)
        .attr("y", -2*Graph1.margin.left/3)
        .attr("class", "y-label label")
        .text(stats[Graph1.ystat]);
    Graph1.chart.append("text")
        .attr("x", Graph1.width/2)
        .attr("y", Graph1.height + 40)
        .attr("class", "y-label label")
        .text("Season");

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
    		return d[Graph1.ystat];
    		}));

    Graph1.xAxis = d3.svg.axis().scale(Graph1.xScale).orient("bottom");
    Graph1.yAxis = d3.svg.axis().scale(Graph1.yScale).orient("left");

    //Add axes
    Graph1.chart.select("g.x-axis")
    	.attr("transform", "translate(0," + Graph1.height + ")")
    	.call(Graph1.xAxis);
    Graph1.chart.select("g.y-axis")
    	.call(Graph1.yAxis);


    Graph1.updateGraph = function() {
        //update legend
        Graph1.legend = d3.select("#color-key").selectAll("li")
            .data(nested_franchises.filter(function(d) {
                return selected_teams.indexOf(d.key) >= 0;}),
                    function(d) {return d.key;})
        Graph1.legend.enter()
            .append("li")
            .style("color", function(d){return color(selected_teams.indexOf(d.key));})
            .text(function(d){return d.values.franchName;});
        Graph1.legend.exit().remove();

    	//update yscale domain
    	Graph1.yScale.domain(d3.extent(team_data, function(d) {
    		return d[Graph1.ystat];
    	}));
        //update yaxis
        Graph1.chart.select("g.y-axis")
        	.transition()
        	.duration(500)
        	.call(Graph1.yAxis)

        //function to get correct data
        var lineGen = d3.svg.line()
        .x(function(d) {
        	return Graph1.xScale(d3.time.format("%Y").parse(d['year']));
        })
        .y(function(d) {
        	return Graph1.yScale(d[Graph1.ystat]);
        });

    	//Plot unselected background gray lines
    	if(Graph1.show_unselected) {
    		var unselected = Graph1.chart.select("g.unselected").selectAll("path")
    			.data(nested_franchises, function(d) {return d.key;});

    		unselected.transition().duration(500)
    			.attr('d', function(d) {return lineGen(d.values.seasons);});

    		unselected.enter()
    			.append('path')
        		.attr('d', function(d) {return lineGen(d.values.seasons);}) //seasons is an array
                .attr("title", "unselected")
        		.style('stroke', 'gray')
        		.style('stroke-width', 1)
        		.style('fill', 'none')
        		.style('fill-opacity', 0.2);
        } else {
        	Graph1.chart.select("g.unselected").selectAll("path").remove();
        };

        //Plot selected lines
        var selected = Graph1.chart.select("g.selected").selectAll("path")
        	.data(nested_franchises.filter(function(d) {
        		return selected_teams.indexOf(d.key) >= 0;}),
    				function(d) {return d.key;}) //key function to tie to team id
        selected.transition().duration(500)
        	.attr('d', function(d){ return lineGen(d.values.seasons);});

        selected.enter().append("path")
        	.attr('d', function(d){ return lineGen(d.values.seasons);})
            .attr("title", function(d){return d.values.franchName;})
        	.style('stroke', function(d){
                return color(selected_teams.indexOf(d.key));})
        	.style('stroke-width', 3)
        	.style('fill', 'none')
        	.style('fill-opacity', 0.8)
        
        selected.exit().remove()

        //Plot line showing year
        d3.select("#year_marker").select("line")
            .transition()
            .duration(500)
            .attr("x1", Graph1.xScale(d3.time.format("%Y").parse(selected_year)))
            .attr("x2", Graph1.xScale(d3.time.format("%Y").parse(selected_year)))
            .attr("y1", 5)
            .attr("y2", Graph1.height)
        d3.select("#year_marker").select("text")
            .transition()
            .duration(500)
            .attr("x", Graph1.xScale(d3.time.format("%Y").parse(selected_year)))
            .attr("y", 0)
            .text(selected_year);

        //update labels and title
        Graph1.chart.select(".title")
            .text(stats[Graph1.ystat] + " over Time");

        Graph1.chart.select(".y-label")
            .text(stats[Graph1.ystat]);

    };

    Graph1.updateGraph();


    





    //Graph2 Object
    var Graph2 = new Object();

    //size
    Graph2.margin = {top : 50, right: 50, bottom: 150, left: 80};
    Graph2.width = 550 - Graph2.margin.left - Graph2.margin.right;
    Graph2.height = 400 - Graph2.margin.top - Graph2.margin.bottom;

    //Graph Display Parameters
    Graph2.xstat = d3.select("#g2_xstat_select").property("value");
    Graph2.ystat = d3.select("#g2_ystat_select").property("value");

    
    //SVG layout structure
    Graph2.svg = d3.select("#graph2").select("svg")
        .attr("width", Graph2.width + Graph2.margin.left + Graph2.margin.right)
        .attr("height", Graph2.height + Graph2.margin.top + Graph2.margin.bottom)
        
    Graph2.chart = Graph2.svg.append("g")
        .attr("transform", "translate(" + Graph2.margin.left + "," + Graph2.margin.top + ")");

    Graph2.chart.append("g").attr("class", "axis x-axis");
    Graph2.chart.append("g").attr("class", "axis y-axis");
    Graph2.chart.append("g").attr("class", "points");

    //legend
    Graph2.legend = Graph2.svg.append("g").attr("class", "legend")
                    .attr("transform", "translate("+ (Graph2.margin.left+20) + "," + (Graph1.height+Graph1.margin.top+Graph1.margin.bottom+10) + ")");

    Graph2.legend.selectAll("circle")
        .data([20, 15, 10, 5])
        .enter()
        .append("circle")
        .attr("cx", function(d,i){return i*120;})
        .attr("cy", 0)
        .attr("r", function(d){ return d;})
        .style("fill", "gray")
        .attr("fill-opacity", 0.7);

    Graph2.legend.selectAll("text")
        .data(["WS Winner", "WS Loser", "Playoff Team", "Others"])
        .enter()
        .append("text")
        .attr("x", function(d,i){return i*120;})
        .attr("y", 35)
        .text(function(d){return d;});


    //labels
    Graph2.chart.append("text")
        .attr("x", Graph2.width/2)
        .attr("y", -Graph2.margin.top/2)
        .attr("class", "title label")
        .text("Results for " + selected_year);
    Graph2.chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -Graph2.height/2)
        .attr("y", -2*Graph2.margin.left/3)
        .attr("class", "y-label label")
        .text(stats[Graph2.ystat]);
    Graph2.chart.append("text")
        .attr("x", Graph2.width/2)
        .attr("y", Graph2.height + 40)
        .attr("class", "x-label label")
        .text(stats[Graph2.xstat]);

    //Scales and axis
    Graph2.xScale = d3.scale.linear()
        .range([0, Graph2.width])
        .domain(d3.extent(team_data, function(d) {
            return d[Graph2.xstat];
            }));
    Graph2.yScale = d3.scale.linear()
        .range([Graph2.height, 0])
        .domain(d3.extent(team_data, function(d) {
            return d[Graph2.ystat];
            }));

    Graph2.xAxis = d3.svg.axis().scale(Graph2.xScale).orient("bottom");
    Graph2.yAxis = d3.svg.axis().scale(Graph2.yScale).orient("left");

    //Add axes
    Graph2.chart.select("g.x-axis")
        .attr("transform", "translate(0," + Graph2.height + ")")
        .call(Graph2.xAxis);
    Graph2.chart.select("g.y-axis")
        .call(Graph2.yAxis);

    //function to calc radius
    Graph2.getRadius = function(d) {
        var radius = 5
        if(d['w_worldseries']=="Y"){
            radius = 20; //ws winner
        } else if(d['w_league']=="Y"){
            radius = 15; //ws loser
        } else if (d['w_division'] == "Y" || d['w_wildcard']=="Y"){
            radius = 10; //playoffs
        }
        return radius;
    };
    Graph2.getColor = function(d) {
        if(selected_teams.indexOf(d.franchID) === -1){
            return "gray";
        } else {
            return color(selected_teams.indexOf(d.franchID));
        }
    };

    //update function
    Graph2.updateGraph = function() {
        //update xScale domain
        Graph2.xScale.domain(d3.extent(team_data, function(d) {
            return d[Graph2.xstat];
        }));
        //update xAxis
        Graph2.chart.select("g.x-axis")
            .transition()
            .duration(500)
            .call(Graph2.xAxis)        

        //update yScale domain
        Graph2.yScale.domain(d3.extent(team_data, function(d) {
            return d[Graph2.ystat];
        }));
        //update yAxis
        Graph2.chart.select("g.y-axis")
            .transition()
            .duration(500)
            .call(Graph2.yAxis)

        //plot all points
        var circles = Graph2.chart.select("g.points")
            .selectAll("circle")
            .data(team_data.filter(function(d){return d.year===selected_year;}),
        	function(d) {return d.franchID;});

        //move updated teams
        circles.transition()
            .duration(500)
            .attr("cx", function(d) {return Graph2.xScale(d[Graph2.xstat]);})
            .attr("cy", function(d) {return Graph2.yScale(d[Graph2.ystat]);})
            .attr("r", Graph2.getRadius)
            .attr("fill", Graph2.getColor)
            .attr("fill-opacity", 0.7);
        
        //add new teams	
        circles.enter()
            .append("circle")
            .attr("cx", function(d) {return Graph2.xScale(d[Graph2.xstat]);})
            .attr("cy", function(d) {return Graph2.yScale(d[Graph2.ystat]);})
            .attr("r", Graph2.getRadius)
            .attr("fill", Graph2.getColor)
            .style("fill-opacity", 0.5);

        //remove missing teams
        circles.exit().remove();

        //update labels and title
        Graph2.chart.select(".title")
            .text("Results for " + selected_year);

        Graph2.chart.select(".x-label")
            .text(stats[Graph2.xstat]);

        Graph2.chart.select(".y-label")
            .text(stats[Graph2.ystat]);
    };


    //Set up Graph2
    Graph2.updateGraph();

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

       		"W" : +d['W'],
       		"L" : +d['L'],
       		"G" : +d['G'],
            "winpercent" : (+d['W']/+d['G']), //Win Percentage
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