function agg_finishes(leaves){
    var total = leaves.length;
    return [
    {'key':'WS Win', 'value':leaves.filter(function(d){return d['finish']==="WS Win";}).length/total},
    {'key':'WS Loss', 'value': leaves.filter(function(d){return d['finish']==="WS Loss";}).length/total},
    {'key':'Playoffs', 'value': leaves.filter(function(d){return d['finish']==="Playoffs";}).length/total},
    {'key':'No Playoffs', 'value': leaves.filter(function(d){return d['finish']==="No Playoffs";}).length/total}
    ]
};

function plot_graph1(data) {

    //combine data by finish and finish_next
    data_nested = d3.nest()
        .key(function(d){return d['finish_next'];})
        .rollup(agg_finishes)
        .entries(data);

    var margin = {top: 20, right: 20, bottom: 50, left: 80},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var finishNames = ['No Playoffs', 'Playoffs', 'WS Loss', 'WS Win'];

    //first x scale for finish in some given year
    var y0 = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .1)
        .domain(finishNames);

    //second x scale for finish in the following year
    var y1 = d3.scale.ordinal()
        .rangeRoundBands([y0.rangeBand(), 0])
        .domain(finishNames);

    //y scale and color both for fraction of teams with finish making that finish_next
    var x = d3.scale.linear()
        .range([0, width])
        .domain([0,1]);

    var color = d3.scale.ordinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.format(".0%"));

    var yAxis = d3.svg.axis()
        .scale(y0)
        .orient("left");

    var svg = d3.select("#graph1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .style("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", 45)
        .text("Fraction of Teams (1969-2013)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    var finish = svg.selectAll(".finish")
        .data(data_nested)
        .enter().append("g")
        .attr("class", "finish")
        .attr("transform", function(d) { return "translate(0," + y0(d['key']) + ")"; });

    finish.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter().append("rect")
        .attr("width", function(d) { return x(d.value); })
        .attr("x", function(d) { return 0; })
        .attr("y", function(d) { return y1(d.key); })
        .attr("height", y1.rangeBand())
        .style("fill", function(d) { return color(d.key); });

    var legend = svg.selectAll(".legend")
        .data(finishNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });


};

function draw(data) {
    "use strict";

    console.log(data);

    //Group for first plot
    plot_graph1(data);
};

function format_data(team_data) {
    //Select only certain features and format to numbers as needed
    var formatted_data = []
    team_data.forEach(function(d) {
        if (+d['yearID'] >= 1969){ //Filter out stats that are pre-1969
            var tmpdata = {};
            tmpdata['franchID'] = d['franchID']
            tmpdata['name'] = d['name'];
            tmpdata['year'] = +d['yearID'];
            tmpdata['W'] = +d['W'];
            tmpdata['R'] = +d['R'];
            tmpdata['RA'] = +d['RA'];

            //encode season result
            if (d['WSWin'] === "Y"){
              tmpdata['finish'] = 'WS Win';
          } else if (d['LgWin'] === "Y"){
              tmpdata['finish'] = 'WS Loss';
          } else if (d['DivWin'] === "Y" || d['WCWin'] === "Y"){
              tmpdata['finish'] = 'Playoffs';
          } else {
              tmpdata['finish'] = 'No Playoffs';
          }

          formatted_data.push(tmpdata);
      };
  });

    //Iterate through data to get next-season finish and change in stats
    var maxyear = d3.max(formatted_data, function(d){return d['year'];});
    var diff_data = [];
    formatted_data.forEach(function(current){
      if (current['year'] < maxyear) { //can't calculate next-year results for the final year
        //iterate team/season entries and find the matching team entry for the following year
    next = formatted_data.filter(function(n){return n['year']===current['year']+1 && n['franchID']===current['franchID']})[0];
    diff_data.push({
        'franchID' : current['franchID'],
        'name' : current['name'],
        'year' : current['year'],
        'finish' : current['finish'],
        'finish_next' : next['finish'],
        'delta_W' : next['W']-current['W'],
        'delta_R' : next['R']-current['R'],
        'delta_RA' : next['RA']-current['RA']
    })
}
});

    return diff_data;
};

/* Read in team data csv file, format the data, and run the draw function*/
d3.csv("data/Teams.csv", function(team_data) {
    team_data = format_data(team_data);
    draw(team_data);
}
);