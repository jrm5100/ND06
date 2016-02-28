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

    var margin = {top: 10, right: 10, bottom: 50, left: 80},
        width = 950 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom,
        middlespacing = 20;

    //yScale for the year
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width])
        .domain(data_nested.map(function(d){return d['key'];}));

    //xScale for R
    var yScale_R = d3.scale.linear()
        .range([(height/2)-middlespacing, 0])
        .domain([0, d3.max(data_nested, function(d){return d.values['max_R']})]);

    //xScale for RA
    var yScale_RA = d3.scale.linear()
        .range([0, (height/2)-middlespacing])
        .domain([0, d3.max(data_nested, function(d){return d.values['max_RA']})]);    

    //color by league
    var colors = ["#98abc5", "#8a89a6"]
    var leagues = ["AL", "NL"]
    var color = d3.scale.ordinal()
        .range(colors)
        .domain(leagues);

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

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(xAxis)
        .selectAll("text") //rotate tick labeels and center them between the graphs
        .attr("y", 0)
        .attr("x", 0)
        .attr("dy", ".5em") //center in bars
        .attr("transform", "rotate(90)")
        .style("text-anchor", "middle")
        .classed("short-season", function(d){return ['1972', '1981', '1994', '1995'].indexOf(d)>-1;}); //add a class if the season was strike-shortened
    
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis_R)
        .append("text")
        .attr("class", "label")
        .style("text-anchor", "middle")
        .attr("x", -height/4)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .text("Most Runs Scored");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + (height/2 +middlespacing) + ")")
        .call(yAxis_RA)
        .append("text")
        .attr("class", "label")
        .style("text-anchor", "middle")
        .attr("x", -height/4)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .text("Fewest Runs Allowed");

    var barwidth = xScale.rangeBand()-2;
    var median_marker_height = 4

    //Plot Run Data
    var chart_R = svg.append("g").attr("id", "chart_R")
        
    chart_R.selectAll(".Rbar")
        .data(data_nested, function(d){return d['key'];}) //key is the year
        .enter()
        .append("rect")
            .attr("class", "Rbar")
            .attr("x", function(d){return xScale(+d['key']);})
            .attr("y", function(d){return yScale_R(d.values['max_R']);})//top of rect
            .attr("width", barwidth)
            .attr("height", function(d){return yScale_R.range()[0] - yScale_R(d.values['max_R']);}) //dist between y value and bottom
            .attr("fill", function(d){return color(d.values['max_R_league']);});

    chart_R.selectAll(".median-marker")
        .data(data_nested, function(d){return d['key'];}) //key is the year
        .enter()
        .append("rect")
            .attr("class", "median-marker")
            .attr("x", function(d){return xScale(d['key']);})
            .attr("y", function(d){return yScale_R(d.values['median_R']);})
            .attr("width", barwidth)
            .attr("height",median_marker_height);

    var chart_RA = svg.append("g").attr("id", "chart_RA")
        .attr("transform", "translate(0," + (height/2 +middlespacing) + ")")
        
    chart_RA
        .selectAll(".RAbar")
        .data(data_nested, function(d){return d['key'];}) //key is the year
        .enter()
        .append("rect")
            .attr("class", "RAbar")
            .attr("x", function(d){return xScale(+d['key']);})
            .attr("y", 0)
            .attr("width", barwidth)
            .attr("height", function(d){return yScale_RA(d.values['min_RA']);})
            .attr("fill", function(d){return color(d.values['min_RA_league']);});

    chart_RA.selectAll(".median-marker")
        .data(data_nested, function(d){return d['key'];}) //key is the year
        .enter()
        .append("rect")
            .attr("class", "median-marker")
            .attr("x", function(d){return xScale(d['key']);})
            .attr("y", function(d){return yScale_RA(d.values['median_RA']);})
            .attr("width", barwidth)
            .attr("height", median_marker_height);

    //Add legend at the bottom
    var legendtext = leagues.map(function(l){return "Team was from the " + l;}).concat(['Median Value']),
        legendcolors = colors.concat(["#000000"]);

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 70) //20px for each with 5px spacing
        .attr("width", 200)
        .attr("transform", "translate(" + (width + margin.right - 200) + "," + (height + margin.bottom - 70)+ ")"); //bottom right corner

    legend.selectAll("rect")
        .data(legendcolors)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) {
            if(d=="#000000"){return i * 25 + 8;} //different pos for median rect b/c it is shorter
            else {return i * 25;};})
        .attr("width", 20)
        .attr("height", function(d){
            if(d=="#000000"){return median_marker_height;} //median rect is shorter
            else {return 20;};})
        .attr("fill", function(d) {return d;});

    legend.selectAll("text")
        .data(legendtext)
        .enter()
        .append("text")
        .text(function(d){return d;})
        .attr("x", 25)
        .attr("y", function(d, i) {return i * 25 + 15;});

    //x-axis label
    svg.append("text")
        .attr("class", "label")
        .attr("x", width/2)
        .attr("y", height + 10)
        .attr("text-anchor", "middle")
        .text("Season");    

    //note on strike seasons
    svg.append("text")
        .attr("font-size", "1em")
        .attr("x", width/2)
        .attr("y", height + 25)
        .attr("text-anchor", "middle")
        .attr("fill", "red")
        .text("*Short season due to strikes");

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