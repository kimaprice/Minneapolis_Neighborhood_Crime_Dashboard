Select * from demo_cat;

Select * from demographic_data;

Select * from neighborhood;

Select * from crime_data;

Select n.neighborhood,
d.offense_cat,
sum(d.crime_count)
from crime_data as d 
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
from demographic_data as d
left join neighborhood as n
on d.neighborhood_id = n.neighborhood_id
left join demo_cat as c
on d.demo_id = c.demo_id
where n.neighborhood = 'Ericsson';

