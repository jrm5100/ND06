# ND06
Tell Stories with with Data Visualization

# Summary
I used data from Lahman's Baseball Database to show various statistics for baseball dynasties.  The criteria used here was <a href="http://espn.go.com/blog/sweetspot/post/_/id/54157/ranking-baseballs-greatest-dynasties">3 world series wins in a span of 5 years</a>, but since the definition of a dynasty is subjective it is also possible to customize the display.  The first graph displays one statistic (winning percentage by default) for the years of the dynasty with the selected team highlighted. The second graph displays two statistics (runs and runs allowed) in a scatterplot for the selected year, with the selected team highlighted.  

# Design
This was designed to be an exploratory visualization, but with an initial explanatory view.  This way a narrative can be conveyed, with plenty of flexibility for further exploration.  After the first version I settled on a more clear main narrative- displaying information for one "dynasty" at a time with the flexibility to let the reader explore their own choice of "dynasty" or view different stats.

I decided to include two charts that are connected- selecting a team will highlight stats for that team in both charts in the same color.  The first chart gives a historical view of team performance in the context of other teams in the league. For example, a particular team may have a higher winning percentage or lower ERA than most other teams within a span of a few seasons.  In the first version I allowed selection of up to 5 teams and display across 100+ years, but ultimately decided this was too cluttered.  My original solution of making display of unselected teams (which provides context) optional was not enough.  The second chart allows comparison of two different stats (in a scatterplot) in the context of all other teams in the same season.  This can allow the user to find correlations among all teams.  For example, do more HR correlate with more doubles?  Do more walks given up correlate with more runs given up?  The size of the points indicates the outcome of the team's season (winning the world series, etc).  I kept this relatively simple with only 4 possible outcome labels.

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
    * I overhauled the visualization to focus on a comparison between world series winning teams and the rest of the league.  Is pitching or hitting more important?


# Resources
* http://www.getmdl.io/
* http://www.seanlahman.com/baseball-archive/statistics/
* http://bl.ocks.org/mbostock/3019563
* http://espn.go.com/blog/sweetspot/post/_/id/54157/ranking-baseballs-greatest-dynasties


# Licenses
Data is from Lahman's Baseball Database (copyright 1996-2015 by Sean Lahman).
http://www.seanlahman.com/baseball-archive/statistics/