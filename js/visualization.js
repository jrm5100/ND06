function agg_years(leaves){
    var max_R = d3.max(leaves, function(d){return d['R'];}),
        max_R_teams = leaves.filter(function(d){return d['R']===max_R}),
        min_RA = d3.min(leaves, function(d){return d['RA'];}),
        min_RA_teams = leaves.filter(function(d){return d['RA']===min_RA})
    return {
        'max_R' : max_R,
        'min_R' : d3.min(leaves, function(d){return d['R'];}),
        'median_R' : d3.median(leaves, function(d){return d['R'];}),
        //Concat an array of teams that have the max R value in case of ties
        'max_R_team_ID' : max_R_teams.map(function(d){return d['franchID'];}).join(),
        'max_R_team_name' : max_R_teams.map(function(d){return d['name'];}).join(),
        'max_R_league' : max_R_teams.map(function(d){return d['league'];}).join(),

        
        'max_RA' : d3.max(leaves, function(d){return d['RA'];}),
        'min_RA' : min_RA,
        'median_RA' : d3.median(leaves, function(d){return d['RA'];}),
        //Concat an array of teams that have the min RA value in case of ties
        'min_RA_team_ID' : min_RA_teams.map(function(d){return d['franchID'];}).join(),
        'min_RA_team_name' : min_RA_teams.map(function(d){return d['name'];}).join(),
        'min_RA_league' : min_RA_teams.map(function(d){return d['league'];}).join()
    };
};

function draw(data) {
    "use strict";

    //nest data by year and calculate min/maxes
    var data_nested = d3.nest()
        .key(function(d){return d['year'];})
        .rollup(agg_years)
        .entries(data);

    console.log(data_nested);

    var margin = {top: 20, right: 50, bottom: 50, left: 50},
        width = 950 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom,
        middlespacing = 20;

    //yScale for the year
    var yScale = d3.scale.ordinal()
        .rangeRoundBands([height, 0])
        .domain(data_nested.map(function(d){return d['key'];}));

    //xScale on left for R
    var xScale_R = d3.scale.linear()
        .range([(width/2)-middlespacing, 0]) //backwards range so high numbers = more left
        .domain(d3.extent(data, function(d){return d['R']}));

    //xScale on right for RA
    var xScale_RA = d3.scale.linear()
        .range([width, (width/2)+middlespacing]) //backwards range so low numbers = more right
        .domain(d3.extent(data, function(d){return d['R']}));    

    //color by league
    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6"]) //fix color later
        .domain(['AL', 'NL'])

    var xAxis_R = d3.svg.axis()
        .scale(xScale_R)
        .orient("bottom");

    var xAxis_RA = d3.svg.axis()
        .scale(xScale_RA)
        .orient("bottom");

    var yAxisleft = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    var yAxisright = d3.svg.axis()
        .scale(yScale)
        .orient("right");

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //y-axis needs fixing for position
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxisleft)

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxisright)
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_R)
        .append("text")
        .style("text-anchor", "middle")
        .attr("x", width/4)
        .attr("y", -height)
        .text("Teams with most Runs Scored");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis_RA)
        .append("text")
        .style("text-anchor", "middle")
        .attr("x", 3*width/4)
        .attr("y", -height)
        .text("Teams with least Runs Allowed");

    var Rbars = svg.selectAll(".Rbar")
        .data(data_nested, function(d){return d['key'];})
        
    Rbars.transition().duration(500)
        .attr("width", function(d){return d.values['max_R']});

    Rbars.enter()
        .append("rect")
        .attr("class", "Rbar")
        .attr("x", function(d){return xScale_R(d.values['max_R']);})
        .attr("y", function(d){return yScale(+d['key']);})
        .attr("height", yScale.rangeBand()) //set bar height to the max width
        .attr("width", function(d){return ((width/2)-middlespacing) - xScale_R(d.values['max_R']);})
        .attr("fill", function(d){return color(d.values['max_R_league']);});

    var RAbars = svg.append("g")
        .selectAll(".RAbar")
        .data(data_nested, function(d){return d['key'];})
        
    RAbars.transition().duration(500)
        .attr("width", function(d){return d.values['min_RA']});

    Rbars.enter()
        .append("rect")
        .attr("class", "RAbar")
        .attr("x", (width/2)+middlespacing)
        .attr("y", function(d){return yScale(+d['key']);})
        .attr("height", yScale.rangeBand()) //set bar height to the max width
        .attr("width", function(d){return xScale_RA(d.values['min_RA'])-((width/2)+middlespacing);})
        .attr("fill", function(d){return color(d.values['min_RA_league']);})
};

function format_data(team_data) {
    //Select only certain features and format to numbers as needed
    var formatted_data = []
    team_data.forEach(function(d) {
        if (+d['yearID'] >= 1969){ //Filter out stats that are pre-1969
            var tmpdata = {
            'franchID' : d['franchID'],
            'name' : d['name'],
            'league' : d['lgID'],
            'year' : +d['yearID'],
            'R' : +d['R'],
            'RA' : +d['RA'],
            };
          formatted_data.push(tmpdata);
        };
    });

    return formatted_data;
};

/* Read in team data csv file, format the data, and run the draw function*/
d3.csv("data/Teams.csv", function(team_data) {
    team_data = format_data(team_data);
    draw(team_data);
}
);