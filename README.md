# ND06
Tell Stories with with Data Visualization

# Summary
I used data from Lahman's Baseball Database to show various statistics for baseball dynasties.  The criteris for a dynasty was 3 world series wins in a span of 5 years, but it is also possible to customize the display if the reader has their own definition of a dynasty.  The first graph displays one statistic (winning percentage by default) for the years of the dynasty with the selected team highlighted. The second graph displays two statistics (runs and runs allowed) in a scatterplot for the selected year, with the selected team highlighted.  

# Design
This was designed to be an exploratory visualization, but with an initial explanatory view.  This way a narrative can be conveyed, with plenty of flexibility for further exploration.  After the first version I settled on a more clear main narrative- displaying information for one "dynasty" at a time with the flexibility to let the reader explore their own choice of "dynasty" or view different stats.

I decided to include two charts that are connected- selecting a team will highlight stats for that team in both charts in the same color.  The first chart gives a historical view of team performance in the context of other teams in the league. In the first version I allowed selection of up to 5 teams and display across 100+ years, but ultimately decided this was too cluttered.  My original solution of making display of unselected teams (which provides context) optional was not enough.  The second chart allows comparison of two different stats in the context of all other teams in the same season.  This can allow the user to find correlations among all teams.  For example, do more HR correlate with more doubles?  Do more walks given up correlate with more runs given up?

# Feedback
* That's a cool visualization! I like the combination of the time-line plot with a scatter plot for a single year -- and the possibility of selecting several teams for comparison.  One thing I noticed is that the number of homeruns has generally increased over time -- although the number of games played remained almost constant. I have to admit, I hardly know anything about baseball, but is this an indication that the sports 'intensity' has increased? In your instructions section you mention a drop in offense over the last 15 years... from which feature can one see this? Is it this slight decline in the number of homeruns over recent years?
** I decided to make a more clear narrative by making it about dynasties.




# Resources
* http://www.getmdl.io/
* http://www.seanlahman.com/baseball-archive/statistics/
* http://bl.ocks.org/mbostock/3019563
* http://espn.go.com/blog/sweetspot/post/_/id/54157/ranking-baseballs-greatest-dynasties


# Licenses
Data is from Lahman's Baseball Database (copyright 1996-2015 by Sean Lahman).
http://www.seanlahman.com/baseball-archive/statistics/