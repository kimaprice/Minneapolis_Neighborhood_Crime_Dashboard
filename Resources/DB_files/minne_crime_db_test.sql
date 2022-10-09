Select * from demoCat;

Select * from demographicData;

Select * from neighborhood;

Select * from crimeData;

Select n.neighborhood,
d.offense_cat,
sum(d.crime_count)
from crimeData as d 
left join neighborhood as n
on d.neighborhood_id = n.neighborhood_id
Group By n.neighborhood,
d.offense_cat
Order By n.neighborhood,
d.offense_cat;

Select n.neighborhood,
c.demographic,
c.category,
d.percent
from demographicData as d
left join neighborhood as n
on d.neighborhood_id = n.neighborhood_id
left join demoCat as c
on d.demo_id = c.demo_id
where n.neighborhood = 'Ericsson';

