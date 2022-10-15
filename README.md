# Minneapolis Neighborhood Crime Dashboard

### Produced by:
* Brandon Groenewold
* Nathan Johnson
* Kim Price
* Marti Reisinger

# Overview
This code base gathers datasets to create dashbaord containing demographic and crime data visualizations for Minneapolis neighborhoods. 

# Behind the Scenes

## Data Sets:

 * Minneapolis Neighborhood Crime: crime_data.csv
	* Link: https://www.minneapolismn.gov/government/government-data/datasource/crime-dashboard/
	* Description: Contains crime statistics for Minneapolis neighborhoods from 1/1/2018 through 10/13/2022.  Columns we will use are neighborhood, occurred date, offense category, offense, crime_count 

* Neighborhood Demographic data: ~5 bytes per file (85 files per demographic - age, education, income)
	* Link for selecting neighborhoods: https://www.mncompass.org/profiles/neighborhoods/minneapolis-saint-paul
	* Link for all Minneapolis: https://www.mncompass.org/profiles/city/minneapolis?population-by-age-group
	* Description: This source contains one csv per neighborhood, per demographic area. We are targeting age, income and education for all Minneapolis neighborhoods (exceptions to this are Camden Industrial and Humboldt Industrial Area as demographics were not available)
	
* Minneapolis Neighborhood GeoJson
	* Link:  https://opendata.minneapolismn.gov/datasets/minneapolis-neighborhoods/explore?location=44.970893%2C-93.261718%2C12.88
	* Description: GeoJson file containing the mapping of the neighborhoods in Minneapolis from the Minneaoplis government site.


## Database
The data for the dashboard is saved in a PostgreSQL database ``minne_crime_db``.  The geojson file used in the map control is stored as a file in the ``static/Data`` folder.  In order to use the dashboard, you will need follow the steps below for creating the database and running the ETL scripts to prepare and load the data to the database.

### Instructions to recreate the PostgreSQL database housing the demographic and crime data

Schema for database:
![alt text](/Resources/DB_files/DB_schema.png)

 1. Clone the Repo git@github.com:kimaprice/Minneapolis_Neighborhood_Crime_Dashboard.git
 1. Open pgAdmin PostgreSQL
 1. Create a new database named ``minne_crime_db``.
 1. Open the ``Resources/DB_files/minne_crime_db_Create.sql`` file in a query tool and run it to create the tables.
 1. Run ``jupyter notebook`` and open ``crime_data_ETL.ipynb`` - run this in an environment that has pandas, sqlalchemy, numpy, and python 3.8
 1. Verify and update as needed the `username` `port` and `password` in the `LOAD` section of the notebook to match your PostgreSQL.
 1. Run the notebook.
 1. Use this test queries in ``Resources/DB_files/minne_crime_db_test.sql`` to validate you successfully loaded the data.

## Data Access Layer
A Flask server is used to access the data and serve it to the dashboard.  There are 9 routes used to gather data for the various visualizations on the dashboard.

## Interface Layer
The interface was created in html and javascript is used to dynamically draw the visualizations and provide the interactive components.  A style sheet was used to apply custom styles to the dashboard features.
 * We used a new (to us) Javascript Library:
	* arraygeous JS Library: Library for math on an array used in calculating the percent of crime for the selected neighborhood
	* Link: https://unpkg.com/arraygeous@0.1.24/build/arraygeous.min.js

# Main Attraction - The Minneapolis Crime Dashboard
 * The map of Minneapolis neighborhoods
	* Each neighborhood is shaded with a color corresponding to the number of crimes committed.
	* When you hover over a neighborhood, a popup displays the name of the neighborhood along with the number of crimes committed.
	* When you click on a neighborhood, the visualizations on the page update to show the data related to that neighborhood.
 * The neighborhood demographics (age, income, education) are displayed in tabs to the right of the map.
	* When a neighborhood is selected, the percent of total Minneapolis crime that occurred in that neighborhood is populated in row about the demographic tabs
	* The Minneapolis (all neighborhoods) demographic data is loaded when the dashboard first loads and remains on the visualizations along with the selected neighborhood for easier comparison.
	* The legend on each visualiztion allows the user to toggle the different data sets on and off of the chart.
 * The crime charts (total crime count by year: 2019-2022, and breakdown by offense for the selected neighborhood) are located in tabs below the map.
	* The Minneapolis (all neighborhoods) demographic data is loaded when the dashboard first loads and remains on the total crime chart along with the selected neighborhood for easier comparison.
	* The legend on each visualiztion allows the user to toggle the different data sets on and off of the chart.
*  The footer on the dashboard contains the links to the websites from which the data was sourced and a drop down with links to view the crime and demographic data. 

![alt text](/Resources/dashboard.png)