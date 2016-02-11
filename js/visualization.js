//function takes the mean of stats for all teams in a given year with given playoff status
function agg_result_by_year(leaves){
    return {
        'winpercent':d3.mean(leaves, function(d) {return d['winpercent'];}), 
        'W':d3.mean(leaves, function(d) {return d['W'];}),
        'L':d3.mean(leaves, function(d) {return d['L'];}),  
        'R':d3.mean(leaves, function(d) {return d['R'];}), 
        'AB':d3.mean(leaves, function(d) {return d['AB'];}), 
        'H':d3.mean(leaves, function(d) {return d['H'];}), 
        '2B':d3.mean(leaves, function(d) {return d['2B'];}), 
        '3B':d3.mean(leaves, function(d) {return d['3B'];}), 
        'HR':d3.mean(leaves, function(d) {return d['HR'];}), 
        'BB':d3.mean(leaves, function(d) {return d['BB'];}), 
        'SO':d3.mean(leaves, function(d) {return d['SO'];}), 
        'SB':d3.mean(leaves, function(d) {return d['SB'];}), 
        'RA':d3.mean(leaves, function(d) {return d['RA'];}), 
        'ERA':d3.mean(leaves, function(d) {return d['ERA'];}), 
        'CG':d3.mean(leaves, function(d) {return d['CG'];}), 
        'BBA':d3.mean(leaves, function(d) {return d['BBA'];}), 
        'SOA':d3.mean(leaves, function(d) {return d['SOA'];}), 
        'E':d3.mean(leaves, function(d) {return d['E'];})
    };
};

//function to divide teams up for a given season based on their playoff finish
function playoff_status(team){
    if(team['w_worldseries']==='Y'){
        return "ws_win";
    } else if (team['w_league']==='Y'){
        return "ws_loss";
    } else if (team['w_division']==="Y" || team['w_wildcard']==="Y"){
        return "playoffs";
    } else {
        return "none";
    }
};

function draw(team_data) {
    "use strict";

    // Group teams by playoff status then year and take the mean
    var grouped = d3.nest()
        .key(playoff_status)
        .key(function(d){return d['year']})
        .rollup(agg_result_by_year)
        .sortKeys(d3.ascending)
        .entries(team_data);

    console.log(grouped);

    //Create a dictionary to give better text labels for statistics
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

    // Group stats into offense or pitching categories
    var o_stats = ['R', 'AB', 'H', '2B', '3B', 'HR', 'BB', 'SO', 'SB']
    var p_stats = ['RA', 'ERA', 'CG', 'BBA', 'SOA', 'E']

    /* Interface Elements */

    /* Selector for the statistic in graph1 */
    var g1_ystat = d3.select("#g1_ystat_select")
        .attr("name", "g1_ystat")
        .on("change", function(){
            Graph1.ystat = d3.select("#g1_ystat_select").property("value");
            Graph1.updateGraph();
        });

    g1_ystat.selectAll("option")
        .data(o_stats) //offensive stats for graph1
        .enter()
        .append("option")
        .attr("value", function(d){return d;})
        .property("selected", function(d){return d === "R";}) //default value
        .text(function(d){return stats[d];});

    /* Selector for the statistic in graph2 */
    var g2_ystat = d3.select("#g2_ystat_select")
        .attr("name", "g2_ystat")
        .on("change", function(){
            Graph2.ystat = d3.select("#g2_ystat_select").property("value");
            Graph2.updateGraph();
        });

    g2_ystat.selectAll("option")
        .data(p_stats) //pitching stats for graph2
        .enter()
        .append("option")
        .attr("value", function(d){return d;})
        .property("selected", function(d){return d === "RA";}) //default value
        .text(function(d){return stats[d];});

    //Graph1 object will show offensive stats
    var Graph1 = new Object();

    //size
    Graph1.margin = {top : 50, right: 25, bottom: 60, left: 80};
    Graph1.width = 640 - Graph1.margin.left - Graph1.margin.right;
    Graph1.height = 320 - Graph1.margin.top - Graph1.margin.bottom;

    //Graph Display Parameters
    Graph1.ystat = d3.select("#g1_ystat_select").property("value");

    //SVG layout structure
    Graph1.svg = d3.select("#graph1").select("svg")
        .attr("width", Graph1.width + Graph1.margin.left + Graph1.margin.right)
        .attr("height", Graph1.height + Graph1.margin.top + Graph1.margin.bottom)

    Graph1.chart = Graph1.svg.append("g")
        .attr("transform", "translate(" + Graph1.margin.left + "," + Graph1.margin.top + ")");

    //Create groups
    Graph1.chart.append("g").attr("class", "axis x-axis");
    Graph1.chart.append("g").attr("class", "axis y-axis");
    Graph1.chart.append("g").attr("class", "data")

    //labels and title
    Graph1.chart.append("text")
        .attr("x", Graph1.width/2)
        .attr("y", -Graph1.margin.top/2)
        .attr("class", "title label")
    Graph1.chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -Graph1.height/2)
        .attr("y", -2*Graph1.margin.left/3)
        .attr("class", "y-label label")
    Graph1.chart.append("text")
        .attr("x", Graph1.width/2)
        .attr("y", Graph1.height + 40)
        .attr("class", "y-label label")
        .text("Season");

    //xScale is constant
    Graph1.xScale = d3.scale.linear()
        .range([0, Graph1.width])
        .domain([1969-0.5, 2014+0.5])//add half year padding for display purposes
    //yScale goes from min to max of the selected stat
    Graph1.yScale = d3.scale.linear()
        .range([Graph1.height, 0])
        .domain(d3.extent(team_data, function(d) {
            return d[Graph1.ystat];
            }));

    Graph1.xAxis = d3.svg.axis()
        .scale(Graph1.xScale)
        .orient("bottom")
        .tickFormat(d3.format("d"))
        .tickSize(-Graph1.height, -1, -1);
    Graph1.yAxis = d3.svg.axis()
        .scale(Graph1.yScale)
        .orient("left");

    //move x-axis to bottom and call both axes
    Graph1.chart.select("g.x-axis")
        .attr("transform", "translate(0," + Graph1.height + ")")
        .call(Graph1.xAxis.ticks(10));
    Graph1.chart.select("g.y-axis")
        .call(Graph1.yAxis);


    Graph1.updateGraph = function() {
        //update y-scale domain for the selected stat
        Graph1.yScale.domain(d3.extent(team_data, function(d) {
            return d[Graph1.ystat];
        }));
        //update yaxis
        Graph1.chart.select("g.y-axis")
            .transition()
            .duration(500)
            .call(Graph1.yAxis)

        //divide data
        var stats_ws_win = grouped.filter(function(d){return d.key=="ws_win"});
        var stats_ws_loss = grouped.filter(function(d){return d.key=="ws_loss"});
        var stats_playoffs = grouped.filter(function(d){return d.key=="playoffs"});
        var stats_none = grouped.filter(function(d){return d.key=="none"});

        //function to get correct line data
        var lineGen = d3.svg.line()
        .x(function(d) {
            return Graph1.xScale(d.key);
        })
        .y(function(d) {
            return Graph1.yScale(d[Graph1.ystat]);
        });

        //Plot stats
        var data = Graph1.chart.select("g.data").selectAll("path")
            .data(nested_franchises.filter(function(d){return d.key===selected_team;}))
        selected_lines.transition().duration(500)
            .attr('d', function(d){ return lineGen(d.values.seasons);});

        selected_lines.enter().append("path")
            .attr('d', function(d){ return lineGen(d.values.seasons);})
            .style('stroke', "#3f51b5")
            .style('stroke-width', 2)
            .style('fill', 'none')

        selected_lines.exit().remove();

        //Plot circles on lines
        var selected_circles = Graph1.chart.select("g.selected").selectAll("circle")
            .data(team_data.filter(function(d){return d.franchID===selected_team;}))
        selected_circles.transition().duration(500)
            .attr('cx', function(d){ return Graph1.xScale(d['year']);})
            .attr('cy', function(d){ return Graph1.yScale(d[Graph1.ystat]);});

        selected_circles.enter().append("circle")
            .attr('cx', function(d){ return Graph1.xScale(d['year']);})
            .attr('cy', function(d){ return Graph1.yScale(d[Graph1.ystat]);})
            .attr('r', 4)
            .style('fill', "#3f51b5");

        selected_circles.exit().remove();

        //plot wswin circles
        var wswin_markers = Graph1.chart.select("g.selected").selectAll(".wswin_marker")
        	.data(team_data.filter(function(d){return d.franchID===selected_team;}));

        wswin_markers.transition().duration(500)
        	.attr('cx', function(d){ return Graph1.xScale(d['year']);})
            .attr('cy', Graph1.height-5);

        wswin_markers.enter().append("circle")
        	.attr('cx', function(d){ return Graph1.xScale(d['year']);})
            .attr('cy', Graph1.height-5)
            .attr('class', 'wswin_marker')
            .attr('r', function(d){
            	if(d['w_worldseries']=="Y"){
            		return 5;
            	} else {
            		return 0;
            	};
            })
            .style('fill', "#3f51b5");

        wswin_markers.exit().remove();


        //update labels and title
        Graph1.chart.select(".title")
            .text(stats[Graph1.ystat] + " from " + String(selected_year_min) + " to " + String(selected_year_max));

        Graph1.chart.select(".y-label")
            .text(stats[Graph1.ystat]);

    };

    Graph1.updateGraph();


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
        if (+d['yearID'] >= 1969){ //Filter out stats that are pre-1969
            formatted_data.push(
            {
            'franchName' : d['franchName'],
            'franchID' : d['franchID'],
            'year' : +d['yearID'],

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
            });
        };
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