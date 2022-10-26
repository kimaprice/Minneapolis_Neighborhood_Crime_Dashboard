Select * from democat;

Select * from demographicdata;

Select * from neighborhood;

Select * from crimedata;

Select n.neighborhood,
d.offense_cat,
sum(d.crime_count)
from crimeData as d 
left join neighborhood as n
on d.neighborhoodid = n.neighborhood_id
Group By n.neighborhood,
d.offense_cat
Order By n.neighborhood,
d.offense_cat;

Select n.neighborhood,
c.demographic,
c.category,
d.percent
from demographicData as d
left join neighborhooddata as n
on d.neighborhoodid = n.neighborhoodid
left join demoCat as c
on d.demoid = c.demoid
where n.neighborhood = 'Bryn - Mawr';


Select d.offense_cat,
d.offense,
sum(d.crime_count)
from crimeData as d 
Group By d.offense_cat,
d.offense
Order By d.offense_cat,
d.offense;

Select d.offense_cat,
d.monthyear,
d.neighborhoodid,
sum(d.crime_count)
from crimeData as d 
Where d.neighborhoodid = 1 or d.neighborhoodid = 100
Group By d.offense_cat,
d.monthyear,
d.neighborhoodid;
