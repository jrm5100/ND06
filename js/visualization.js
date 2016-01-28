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
    //Start with first franchise selected
    var selected_year_min = 2010;
    var selected_year_max = 2014;
    var selected_year = selected_year_min;
    var selected_team = "SFG";

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

    var dynasties = [
        {'name':'2010-2014 Giants', 'key':'SFG', 'start':2010, 'end':2014},
        {'name':'1996-2000 Yankees', 'key':'NYY', 'start':1996, 'end':2000},
        {'name':'1971-1975 A\'s', 'key':'OAK', 'start':1971, 'end':1975},
        {'name':'1958-1962 Yankees', 'key':'NYY', 'start':1958, 'end':1962},
        {'name':'1949-1953 Yankees', 'key':'NYY', 'start':1949, 'end':1953},
        {'name':'1942-1946 Cardinals', 'key':'STL', 'start':1942, 'end':1946},
        {'name':'1935-1939 Yankees', 'key':'NYY', 'start':1935, 'end':1939},
        {'name':'1914-1918 Red Sox', 'key':'BOS', 'start':1914, 'end':1918},
        {'name':'1910-1914 Athletics', 'key':'OAK', 'start':1910, 'end':1914}
        ];

    /* Interface Elements */

    //Custom Dynasty

    //Fill out team selection
    var custom_team = d3.select("#custom-team").selectAll("option")
        .data(nested_franchises)
        .enter()
        .append("option")
        .attr("value", function(d){return d.key;})
        .property("selected", function(d){return d.key === "ATL";}) //default value
        .text(function(d){return d.values.franchName;});

    //Dynasty Buttons
    var dynasty_buttons = d3.select("#dynasties_list").selectAll("button")
        .data(dynasties)
        .enter()
        .append("button")
        .attr("class", "mdl-button mdl-js-button mdl-button--raised")
        .text(function(d){return d.name;})
        .on("click", function(d){
            //update buttons
            dynasty_buttons.classed("mdl-button--colored", false);
            d3.select("#submit-custom").classed("mdl-button--colored", false);
            d3.select(this).classed("mdl-button--colored", true);
            //update settings
            selected_team = d.key;
            selected_year = +d.start;
            selected_year_min = +d.start;
            selected_year_max = +d.end;
            //update graphs
            Graph1.updateGraph();
            Graph2.updateGraph();
        });

    //custom button functionality
    d3.select("#submit-custom")
        .on("click", function(){
            //update buttons
            dynasty_buttons.classed("mdl-button--colored", false);
            d3.select(this).classed("mdl-button--colored", true);
            //update settings
            selected_team = d3.select("#custom-team").property("value");
            selected_year_min = +d3.select("#custom-year-min").property("value");
            selected_year = selected_year_min;
            selected_year_max = +d3.select("#custom-year-max").property("value");
            //update graphs
            Graph1.updateGraph();
            Graph2.updateGraph();
        })


    //first one is selected by default
    d3.select("#dynasties_list").select("button").classed("mdl-button--colored", true);

    //Show or hide unselected teams
    d3.select("#checkbox-unselectedteam")
        .on("change", function() {
            Graph1.show_unselected = this.checked;
            Graph1.updateGraph()
    });

    /* Setup Year Selection */

    d3.select("#year-down-1")
        .on("click", function(d){
            if(selected_year > selected_year_min){
                selected_year -= 1;
                Graph2.updateGraph();
            };
        });

    d3.select("#year-up-1")
        .on("click", function(d){
            if(selected_year < selected_year_max){
                selected_year += 1;
                Graph2.updateGraph();
            };
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
        .property("selected", function(d){return d === "winpercent";}) //default value
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
        .property("selected", function(d){return d === "RA";}) //default value
        .text(function(d){return stats[d];});






    //Graph1 object
    var Graph1 = new Object();

    //size
    Graph1.margin = {top : 50, right: 25, bottom: 50, left: 80};
    Graph1.width = 640 - Graph1.margin.left - Graph1.margin.right;
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

    //Create Clip Path
    Graph1.chart.append("clipPath")
        .attr("id", "graph1-clip")
        .append("rect")
        .attr("width", Graph1.width)
        .attr("height", Graph1.height);

    Graph1.chart.append("g").attr("class", "axis x-axis");
    Graph1.chart.append("g").attr("class", "axis y-axis");
    Graph1.chart.append("g").attr("class", "unselected").attr("clip-path", "url(#graph1-clip)");
    Graph1.chart.append("g").attr("class", "selected").attr("clip-path", "url(#graph1-clip)");

    //labels and title
    Graph1.chart.append("text")
        .attr("x", Graph1.width/2)
        .attr("y", -Graph1.margin.top/2)
        .attr("class", "title label")
        .text(stats[Graph1.ystat]);
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
    Graph1.xScale = d3.scale.linear()
        .range([0, Graph1.width])
        .domain([selected_year_min, selected_year_max]);
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
        //update xscale domain
        Graph1.xScale.domain([selected_year_min, selected_year_max]);
        //update yscale domain
        Graph1.yScale.domain(d3.extent(team_data, function(d) {
            return d[Graph1.ystat];
        }));
        //update xaxis
        Graph1.chart.select("g.x-axis")
            .transition()
            .duration(500)
            .call(Graph1.xAxis)
        //update yaxis
        Graph1.chart.select("g.y-axis")
            .transition()
            .duration(500)
            .call(Graph1.yAxis)

        //function to get correct data
        var lineGen = d3.svg.line()
        .x(function(d) {
            return Graph1.xScale(d['year']);
        })
        .y(function(d) {
            return Graph1.yScale(d[Graph1.ystat]);
        });

        //If show unselected is enabled
        if(Graph1.show_unselected) {
            //Plot unselected background gray lines
            var unselected_lines = Graph1.chart.select("g.unselected").selectAll("path")
                .data(nested_franchises, function(d) {return d.key;});

            unselected_lines.transition().duration(500)
                .attr('d', function(d) {return lineGen(d.values.seasons);});

            unselected_lines.enter()
                .append('path')
                .attr('d', function(d) {return lineGen(d.values.seasons);}) //seasons is an array
                .attr("title", "unselected")
                .style('stroke', 'gray')
                .style('stroke-width', 1)
                .style('fill', 'none')
                .style('stroke-opacity', 0.6);
            //Plot circles on unselected lines
            var unselected_circles = Graph1.chart.select("g.unselected").selectAll("circle")
                .data(team_data);
            unselected_circles.transition().duration(500)
                .attr('cx', function(d){ return Graph1.xScale(d['year']);})
                .attr('cy', function(d){ return Graph1.yScale(d[Graph1.ystat]);});

            unselected_circles.enter().append("circle")
                .attr('cx', function(d){ return Graph1.xScale(d['year']);})
                .attr('cy', function(d){ return Graph1.yScale(d[Graph1.ystat]);})
                .attr('r', 3)
                .style('fill', "gray")
                .style('fill-opacity', 0.6);

            unselected_circles.exit().remove();

        //else remove everything
        } else {
            Graph1.chart.select("g.unselected").selectAll("*").remove();
        };

        //Plot selected lines
        var selected_lines = Graph1.chart.select("g.selected").selectAll("path")
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

        //update labels and title
        Graph1.chart.select(".title")
            .text(stats[Graph1.ystat]);

        Graph1.chart.select(".y-label")
            .text(stats[Graph1.ystat]);

    };

    Graph1.updateGraph();








    //Graph2 Object
    var Graph2 = new Object();

    //size
    Graph2.margin = {top : 50, right: 25, bottom: 140, left: 80};
    Graph2.width = 640 - Graph2.margin.left - Graph2.margin.right;
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
                    .attr("transform", "translate("+ (Graph2.margin.left+50) + "," + (Graph1.height+Graph1.margin.top+Graph1.margin.bottom+25) + ")");

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
        .attr("class", "label")
        .attr("x", function(d,i){return i*120;})
        .attr("y", 35)
        .text(function(d){return d;});


    //labels
    Graph2.chart.append("text")
        .attr("x", Graph2.width/2)
        .attr("y", -Graph2.margin.top/2)
        .attr("class", "title label")
        .text("Results for " + String(selected_year));
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

    //small helper functions for plotting
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
    Graph2.isSelected = function(d) {
        if(d.franchID === selected_team){
            return true;
        } else {
            return false;
        }
    };
    Graph2.getStroke

    //update function
    Graph2.updateGraph = function() {
        //update year label
        d3.select("#year-value-text").text(String(selected_year));

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
            .attr("fill", function(d) {if(Graph2.isSelected(d)){return "#3f51b5";} else {return "gray";}})
            .attr("stroke", function(d) {if(Graph2.isSelected(d)){return "#3f51b5";} else {return "none";}})
            .attr("fill-opacity", 0.7);
        
        //add new teams    
        circles.enter()
            .append("circle")
            .attr("cx", function(d) {return Graph2.xScale(d[Graph2.xstat]);})
            .attr("cy", function(d) {return Graph2.yScale(d[Graph2.ystat]);})
            .attr("r", Graph2.getRadius)
            .attr("fill", function(d) {if(Graph2.isSelected(d)){return "#3f51b5";} else {return "gray";}})
            .attr("stroke", function(d) {if(Graph2.isSelected(d)){return "#3f51b5";} else {return "none";}})
            .style("fill-opacity", 0.5);

        //remove missing teams
        circles.exit().remove();

        //update labels and title
        Graph2.chart.select(".title")
            .text("Results for " + String(selected_year));

        Graph2.chart.select(".x-label")
            .text(stats[Graph2.xstat]);

        Graph2.chart.select(".y-label")
            .text(stats[Graph2.ystat]);
    };


    //Set up Graph2
    Graph2.updateGraph();

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
            'year' : +d['yearID'],

               "W" : +d['W'],
               "L" : +d['L'],
               "G" : +d['G'],
            "winpercent" : (+d['W']/+d['G']), //Win Percentage
               "w_division" : d['DivWin'],
               "w_wildcard" : d['WCWin'],
               "w_league" : d['LgWin'],
               "w_worldseries" : d['WSWin'],

               "R" : +d['R']*(162/+d['G']),
               "AB" : +d['AB']*(162/+d['G']),
               "H" : +d['H']*(162/+d['G']),
               "2B" : +d['2B']*(162/+d['G']),
               "3B" : +d['3B']*(162/+d['G']),
               "HR" : +d['HR']*(162/+d['G']),
               "BB" : +d['BB']*(162/+d['G']),
               "SO" : +d['SO']*(162/+d['G']),
               "SB" : +d['SB']*(162/+d['G']),

               "RA" : +d['RA']*(162/+d['G']),
               "ERA" : +d['ERA'],
               "CG" : +d['CG']*(162/+d['G']),
               "BBA" : +d['BBA']*(162/+d['G']),
               "SOA" : +d['SOA']*(162/+d['G']),
               "E" : +d['E']*(162/+d['G'])
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