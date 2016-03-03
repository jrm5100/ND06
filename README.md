# ND06
Tell Stories with with Data Visualization

# Summary
I used data from Lahman's Baseball Database.  Specifically, I plotted the maximum runs scored and the minimum runs allowed of any team for each season in a bar chart.  I then colored the bars according to which league the team is in.  This clearly demonstrates that the best scoring team is almost always from the AL and the team that gives up the fewest runs is usually from the NL.

# Design
My initial project with this data was far too exploratory, but still interesting to me so it now resides here: https://github.com/jrm5100/Baseball_Dynasty_Exploration.  I decided to focus on a much smaller narrative.  Bar charts are useful for showing different values for comparison (in this case over time) and I thought that using the same x-axis in two different plots was more clear than making a grouped bar chart, especially since the bars would have to be very narrow.  Reversing the axis order of the bottom plot allows both charts to grow out from the x-axis.  Coloring by which league the best team was in makes the difference between leagues very obvious.  I tried adding small markers for the median values in order to give some added context into how much better the best team in the league was, but this seemed to distract from the main story of the visual.  A tooltip provides additional information on the best teams in each league which would otherwise clutter the visual.  Some seasons were shortened by strikes which affects the results- I thought changing the color of the tick text was the simplest way to convey that information.  A secondary insight of this visual is the changing number of runs scored/allowed each season.

# Feedback
* First Version
  * "That's a cool visualization! I like the combination of the time-line plot with a scatter plot for a single year -- and the possibility of selecting several teams for comparison.  One thing I noticed is that the number of homeruns has generally increased over time -- although the number of games played remained almost constant. I have to admit, I hardly know anything about baseball, but is this an indication that the sports 'intensity' has increased? In your instructions section you mention a drop in offense over the last 15 years... from which feature can one see this? Is it this slight decline in the number of homeruns over recent years?"
    * I decided to make a more clear narrative by making it about dynasties.
  * "The custom dynasty team selection button isn't working.""
   * Fixed.
  * "The line graph makes it hard to see years on the edges and it looks messy if there are too many years."
    * I extensively reworked the x-axis to use a linear scale and padded the domain.
  * "The criteria is based on world series wins, but it's hard to see what years they won it.  Unless you scan through the years on the bottom."
    * I added a small marker at the bottom of the line plot that marks years in which the team won the World Series.  I also tried text labels (to show other results too) but the graph became too cluttered when looking at more than 5 or so years (on custom dynasty view).
  * "Are the gray lines other franchises?  That was confusing.  It looks cluttered."
    * I renamed this option to make it clear that it is showing other teams.  I also disabled it by default.
  * "I didn't realize that you could adjust the team and the years.  The graphs titles aren't clear to me either."
    * I moved the custom dynasty paragraph next to the controls for the custom dynasty and moved the button to the same area in order to make this a more cohesive section of the visualization.  I also added more descriptive plot titles and moved individual plot descriptions to the sections that contain the controls.
* Review Feedback
  * This visualization presents a lot of information for the chart reader to explore, and it would be a great visualization for the end of a martini glass narrative. But for an explanatory chart, the chart reader really needs to show some interesting findings directly to the reader without the reader having to figure it out for him or herself.
    * I overhauled the visualization to focus on which league the teams with the most runs scored or fewest runs allowed are from.
* Second Version
  * "First comment is relying on color to denote shortened season. Could you add an asterisk next to the year in the graph axis? The next comment is ambiguity on median value. Is that across the entire entire mlb or for the respective leagues? This is probably going to far into the analysis but just listing the best offensive team and best defensive team don't really show the real impact of the DH, it might just show that a team spent more money on hitting than pitching. It would be interesting to see score differentials between the league."
    * I tried adding an asterisk but it shifted alignment of the labels.  I feel that changing the description of red text was a better solution.
    * I decided to remove the median marker since it was distracting from the main narrative of the visualization.  I also updated the mouseover with information about the best team in each league so that the difference can be seen in detail if desired.
  * "Having a DH has a significantly positive correlation with more runs, while it's not clear what "could" be contributing to the NL having better fielding numbers. You are making a hypothesis behind the offense, but not the defense."
    * I updated the description to try and be more clear.


# Resources
* http://www.getmdl.io/
* http://www.seanlahman.com/baseball-archive/statistics/
* http://bl.ocks.org/mbostock/3019563 (margins)
* http://chimera.labs.oreilly.com/books/1230000000345/ch10.html#_html_div_tooltips (tooltips)

# Licenses
Data is from Lahman's Baseball Database (copyright 1996-2015 by Sean Lahman).
http://www.seanlahman.com/baseball-archive/statistics/