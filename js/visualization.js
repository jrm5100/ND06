function draw(team_data) {
    "use strict";

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
               "RA" : +d['RA']
            });
        };
    });
    return formatted_data;
};

/* Read in team data csv file, format the data, and run the draw function*/
d3.csv("data/Teams.csv", function(team_data) {
    team_data = format_data(team_data);
    draw(team_data);
    });
};