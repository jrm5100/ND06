//Get best team in each league for R and RA every season
function agg_years(leaves){
    var al = leaves.filter(function(d){ return d['league']=="AL";}),
        nl = leaves.filter(function(d){ return d['league']=="NL";});
    
    //Get max run value in each league and filter teams to find those with the same value
    var maxR_AL = d3.max(al, function(d){return d['R'];}),
        maxR_AL_teams = al.filter(function(d){return d['R']===maxR_AL}),
        maxR_NL = d3.max(nl, function(d){return d['R'];}),
        maxR_NL_teams = nl.filter(function(d){return d['R']===maxR_NL});

    var minRA_AL = d3.min(al, function(d){return d['R'];}),
        minRA_AL_teams = al.filter(function(d){return d['R']===minRA_AL}),
        minRA_NL = d3.min(nl, function(d){return d['R'];}),
        minRA_NL_teams = nl.filter(function(d){return d['R']===minRA_NL});

    //Record which league had the better team and what the value was
    if (maxR_AL > maxR_NL){
        var maxR = maxR_AL;
        var maxR_league = "American League";
    } else if (maxR_NL > maxR_AL) {
        var maxR = maxR_NL;
        var maxR_league = "National League";
    } else { //tie just in case, but there aren't any in this data
        var maxR = maxR_AL;
        var maxR_league = "Tied";
    };

    if (minRA_AL < minRA_NL){
        var minRA = minRA_AL;
        var minRA_league = "American League";
    } else if (minRA_NL < minRA_AL){
        var minRA = minRA_NL;
        var minRA_league = "National League";
    } else { //tie just in case, but there aren't any in this data
        var minRA = minRA_AL;
        var minRA_league = "Tied";
    };

    return {

        'maxR_AL' : maxR_AL,
        'maxR_NL' : maxR_NL,

        //concat team names if there are multiple
        'maxR_AL_teams' : maxR_AL_teams.map(function(d){return d['name'];}).join(),
        'maxR_NL_teams' : maxR_NL_teams.map(function(d){return d['name'];}).join(),

        'minRA_AL' : minRA_AL,
        'minRA_NL' : minRA_NL,

        //concat team names if there are multiple
        'minRA_AL_teams' : minRA_AL_teams.map(function(d){return d['name'];}).join(),
        'minRA_NL_teams' : minRA_NL_teams.map(function(d){return d['name'];}).join(),

        'maxR' : maxR,
        'maxR_league' : maxR_league,
        'minRA' : minRA,
        'minRA_league' : minRA_league
    };
};

//Show a tooltip when hovering on a max runs scored rectangle
function show_tooltip_R(datum){
    var tt = d3.select("#tooltip_R")
    //Update the tooltip position and value
    var xPosition = d3.event.pageX,
        yPosition = d3.event.pageY;
    tt.style("left", (xPosition + 15) + "px")
        .style("top", yPosition + "px")
    
    //fill in values
    tt.select("#tt_year").text(datum.key);
    tt.select("#tt_maxR_AL").text(datum.values['maxR_AL']);
    tt.select("#tt_maxR_AL_teams").text(datum.values['maxR_AL_teams']);
    tt.select("#tt_maxR_NL").text(datum.values['maxR_NL']);
    tt.select("#tt_maxR_NL_teams").text(datum.values['maxR_NL_teams']);
    
    //Show the tooltip
    tt.classed("hidden", false);
};

//Show a tooltip when hovering on a min runs allowed rectangle
function show_tooltip_RA(datum){
    var tt = d3.select("#tooltip_RA")
    //Update the tooltip position and value
    var xPosition = d3.event.pageX,
        yPosition = d3.event.pageY;
    tt.style("left", (xPosition + 15) + "px")
        .style("top", yPosition + "px")
    
    //fill in values
    tt.select("#tt_year").text(datum.key);
    tt.select("#tt_minRA_AL").text(datum.values['minRA_AL']);
    tt.select("#tt_minRA_AL_teams").text(datum.values['minRA_AL_teams']);
    tt.select("#tt_minRA_NL").text(datum.values['minRA_NL']);
    tt.select("#tt_minRA_NL_teams").text(datum.values['minRA_NL_teams']);

    //Show the tooltip
    tt.classed("hidden", false);
};

function hide_tooltip_R(){
    d3.select("#tooltip_R").classed("hidden", true);
};

function hide_tooltip_RA(){
    d3.select("#tooltip_RA").classed("hidden", true);
};

function draw(data) {
    "use strict";

    //nest data by year and calculate min/maxes
    var data_nested = d3.nest()
        .key(function(d){return d['year'];})
        .rollup(agg_years)
        .entries(data);

    //use conventional margin style
    var margin = {top: 10, right: 10, bottom: 80, left: 80},
        width = 950 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom,
        middlespacing = 20;

    var svg = d3.select("#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //xScale for the year
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width])
        .domain(data_nested.map(function(d){return d['key'];}));

    //yScale for R
    var yScale_R = d3.scale.linear()
        .range([(height/2)-middlespacing, 0])
        .domain([0, d3.max(data_nested, function(d){return d.values['maxR']})]);

    //yScale for RA
    var yScale_RA = d3.scale.linear()
        .range([0, (height/2)-middlespacing]) //reverse range to draw down from top
        .domain([0, d3.max(data_nested, function(d){return d.values['minRA']})]);    

    //color by league
    var colors = ["#00796b", "#536DFE"]
    var leagues = ["American League", "National League"]
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

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height/2 + ")")
        .call(xAxis)
        .selectAll("text") //rotate tick labels and center them between the graphs
        .attr("y", 0)
        .attr("x", 0)
        .attr("dy", ".5em") //center in bars
        .attr("transform", "rotate(90)")
        .style("text-anchor", "middle")
        .classed("short-season", function(d){return ['1972', '1981', '1994', '1995'].indexOf(d)>-1;}); //add a class if the season was strike-shortened
    
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis_R)
        .append("text") //add y label
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
        .append("text") //add y label
        .attr("class", "label")
        .style("text-anchor", "middle")
        .attr("x", -height/4)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .text("Fewest Runs Allowed");

    var barwidth = xScale.rangeBand()-2; //bar width is width of a year in the scale minus 2
    var median_marker_height = 4 //set the height of small rects used to show median values

    //Plot Run Data
    var chart_R = svg.append("g").attr("id", "chart_R")
        
    chart_R.selectAll(".Rbar")
        .data(data_nested, function(d){return d['key'];}) //key is the year
        .enter()
        .append("rect")
            .attr("class", "Rbar")
            .attr("x", function(d){return xScale(+d['key']);})
            .attr("y", function(d){return yScale_R(d.values['maxR']);})//top of rect
            .attr("width", barwidth)
            .attr("height", function(d){return yScale_R.range()[0] - yScale_R(d.values['maxR']);}) //dist between top of rect and bottom
            .attr("fill", function(d){return color(d.values['maxR_league']);})
            .on("mouseover", function(d) {show_tooltip_R(d);})
            .on("mouseout", hide_tooltip_R);

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
            .attr("height", function(d){return yScale_RA(d.values['minRA']);})
            .attr("fill", function(d){return color(d.values['minRA_league']);})
            .on("mouseover", function(d) {show_tooltip_RA(d);})
            .on("mouseout", hide_tooltip_RA);

    //Add legend at the bottom
    var legendtext = leagues.map(function(l){return "Team was from the " + l;}); //add more text to legend labels

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("height", 45) //20px for each with 5px spacing
        .attr("width", 200)
        .attr("transform", "translate(" + (width + margin.right - 270) + "," + (height + margin.bottom - 45)+ ")"); //bottom right corner

    legend.selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) {return i * 25;})
        .attr("width", 20)
        .attr("height", function(d){return 20;})
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
        .text("Seasons in red were shortened due to strikes");

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