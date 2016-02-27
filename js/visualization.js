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

    var margin = {top: 10, right: 10, bottom: 10, left: 50},
        width = 950 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        middlespacing = 20;

    //yScale for the year
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width])
        .domain(data_nested.map(function(d){return d['key'];}));

    //xScale for R
    var yScale_R = d3.scale.linear()
        .range([(height/2)-middlespacing, 0])
        .domain(d3.extent(data_nested, function(d){return d.values['max_R']}));

    //xScale for RA
    var yScale_RA = d3.scale.linear()
        .range([(height/2)+middlespacing, height])
        .domain(d3.extent(data_nested, function(d){return d.values['min_RA']}));    

    //color by league
    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6"]) //fix color later
        .domain(['AL', 'NL'])

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis_R = d3.svg.axis()
        .scale(yScale_R)
        .orient("left");

    var yAxis_RA = d3.svg.axis()
        .scale(yScale_RA)
        .orient("left");

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //y-axis needs fixing for position
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 0)
        .attr("dy", ".35em")
        .attr("transform", "rotate(90)")
        .style("text-anchor", "middle");
    
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis_R)
        .append("text")
        .style("text-anchor", "middle")
        .attr("x", -20)
        .attr("y", 0)
        .text("Teams with most Runs Scored each Season");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis_RA)
        .append("text")
        .style("text-anchor", "middle")
        .attr("x", 3*width/4)
        .attr("y", -height)
        .text("Teams with the least Runs Allowed each Season");

    var Rbars = svg.append("g")
        .attr("id", "Rbar-group")
        .selectAll(".Rbar")
        .data(data_nested, function(d){return d['key'];}) //key is the year
    
    //Updates    
    Rbars.transition().duration(500)
        .attr("y", function(d){return yScale_R(d.values['max_R']);})
        .attr("height", function(d){return d.values['max_R']});

    //new data
    Rbars.enter()
        .append("rect")
        .attr("class", "Rbar")
        .attr("x", function(d){return xScale(+d['key']);})
        .attr("y", function(d){return yScale_R(d.values['max_R']);})//top of rect
        .attr("width", xScale.rangeBand()-2) //set bar width to the max minus some spacing
        .attr("height", function(d){return yScale_R.range()[0] - yScale_R(d.values['max_R']);}) //dist between y value and bottom
        .attr("fill", function(d){return color(d.values['max_R_league']);});

    var RAbars = svg.append("g")
        .attr("id", "RAbar-group")
        .selectAll(".RAbar")
        .data(data_nested, function(d){return d['key'];}) //key is the year
    
    //updates   
    RAbars.transition().duration(500)
        .attr("height", function(d){return yScale_RA(d.values['min_RA']);});

    //new data
    Rbars.enter()
        .append("rect")
        .attr("class", "RAbar")
        .attr("x", function(d){return xScale(+d['key']);})
        .attr("y", yScale_RA.range()[0])
        .attr("width", xScale.rangeBand()-2) //set bar width to the max minus some spacing
        .attr("height", function(d){return yScale_RA(d.values['min_RA']) - yScale_RA.range()[0];})
        .attr("fill", function(d){return color(d.values['min_RA_league']);});

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