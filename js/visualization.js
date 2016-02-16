function draw(team_data) {
    "use strict";

    console.log(team_data);

    //Group for first plot

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
              tmpdata['finish'] = 'World Series Win';
            } else if (d['LgWin'] === "Y"){
              tmpdata['finish'] = 'World Series Loss';
            } else if (d['DivWin'] === "Y" || d['WCWin'] === "Y"){
              tmpdata['finish'] = 'Playoffs';
            } else {
              tmpdata['finish'] = 'No Playoffs';
            }

            formatted_data.push(tmpdata);
        };
    });

    //Re-process all data to get next-season finish and change in stats
    var maxyear = d3.max(formatted_data, function(d){return d['year'];});
    var diff_data = [];
    formatted_data.forEach(function(current){
      if (current['year'] < maxyear) { //can't calculate next-year results for the final year
        next = formatted_data.filter(function(n){return n['year']===current['year']+1 && n['franchID']===current['franchID']})[0];
        diff_data.push({
            'teamID' : current['franchID'],
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