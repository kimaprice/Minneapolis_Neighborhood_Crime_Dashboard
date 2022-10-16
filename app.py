#Import config file password values
import config

#Import Flask
from flask import Flask, render_template, redirect, jsonify

#Import json
import json

#Import from SQL Alchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import or_
from sqlalchemy import func
from sqlalchemy import and_

####### Define the PostgreSQL connection parameters - getting username, password and port from the config file the user created per the instructions ##########
username = config.myusername  
password = config.mypassword  
database_name = 'minne_crime_db' 
port_number = config.myport_number 
connection_string = f'postgresql://{username}:{password}@localhost:{port_number}/{database_name}'

# Connect to the SQL database
engine = create_engine(connection_string)
base = automap_base()
base.prepare(engine, reflect=True)

#Reflect the tables
crimeData = base.classes.crimedata
demoCat = base.classes.democat
demographicData = base.classes.demographicdata
neighborhoodData = base.classes.neighborhooddata

# Create an instance of Flask
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

###### Route to render index.html template ######
@app.route('/')
def index():
    print("Loading index.html")

    return render_template('index.html')

###### Route to gather demograhic data for a specified neighborhood ######
@app.route("/getDemographicData/<neighID>")
def getDemographicData(neighID):
    print("Getting data")
    # Open a session
    session = Session(engine)
    
    #Get Demo data for all Minneapolis
    sel = [demographicData.neighborhoodid, demoCat.demographic, demoCat.category, demographicData.percent]
    demo_results = session.query(*sel).join(demographicData, demoCat.demoid == demographicData.demoid).filter(or_(demographicData.neighborhoodid == neighID,demographicData.neighborhoodid == 100)).all()
    
    #Close the session
    session.close()

     #Put demographic data into a list of dictionaries
    demo_list = []
    for record in demo_results:
        (demographicData_neighborhoodid, demoCat_demographic, demoCat_category, demographicData_percent) = record
        dict = {}
        dict["neighborhoodID"] = demographicData_neighborhoodid
        dict["demographic"] = demoCat_demographic
        dict["category"] = demoCat_category
        dict["percent"] = demographicData_percent
        demo_list.append(dict)
    
    # Neighborhood crime info
    return jsonify(demo_list)


###### Route to gather data the list of neighborhoods with ids ######
@app.route("/getNeighborhoods")
def getNeighborhoods():
    print("Getting data")
    # Open a session
    session = Session(engine)

    #Get list of neighborhoods with ID
    neigh_results = session.query(neighborhoodData.neighborhoodid, neighborhoodData.neighborhood).all()
    
    #Close the session
    session.close()

    #Put neighborhoods into a list of dictionaries
    neighborhood_list = []
    for neighborhoodData_neighborhoodid, neighborhoodData_neighborhood in neigh_results:
        dict = {}
        dict["neighborhoodID"] = neighborhoodData_neighborhoodid
        dict["neighborhood"] = neighborhoodData_neighborhood
        neighborhood_list.append(dict)

    # Neighborhood crime info
    return jsonify(neighborhood_list)

###### Route to gather high level crime data for specified neighborhood and Minneapolis ######
@app.route("/getCrimeData/<neighid>")
def getCrimeData(neighid):
    print("Getting data")
    # Open a session
    session = Session(engine)

    #Get Crime data for all Minneapolis
    sel1 = [crimeData.year, func.sum(crimeData.crime_count).label('crimetotal')]
    crime_results_all = session.query(*sel1).filter(crimeData.year >= 2019).group_by(crimeData.year).order_by(crimeData.year).all()
  
    #Get Crime data for all selected neighborhood
    sel = [crimeData.year, func.sum(crimeData.crime_count).label('crimetotal')]
    crime_results = session.query(*sel).filter(and_(crimeData.neighborhoodid == neighid, crimeData.year >= 2019)).group_by(crimeData.year).order_by(crimeData.year).all()

    #Close the session
    session.close()

    #Put b into a list of dictionaries
    
    crime_list = []
    for crimeData_year, crimeData_crimetotal in crime_results_all:
        dict={}
        dict['id']=100
        dict['year']= crimeData_year
        dict['crime_counts']= crimeData_crimetotal
        crime_list.append(dict)

    for crimeData_year, crimeData_crimetotal in crime_results:
        dict={}
        dict['id']=neighid
        dict['year']= crimeData_year
        dict['crime_counts']= crimeData_crimetotal
        crime_list.append(dict)

    # Neighborhood crime info
    return jsonify(crime_list)

###### Route to gather crime breakdown for a specified neighborhood ######
@app.route("/getCrimeBreakdown/<neighid>")
def getCrimeBreakdown(neighid):
    print("Getting data")
    # Open a session
    session = Session(engine)

    #Get Crime breakdown for the selected neighborhood
    sel = [crimeData.year, crimeData.offense_cat, func.sum(crimeData.crime_count).label('crimetotal')]
    crime_results = session.query(*sel).filter(and_(crimeData.neighborhoodid == neighid, crimeData.year >= 2019)).group_by(crimeData.year, crimeData.offense_cat).order_by(crimeData.offense_cat, crimeData.year).all()

    #Close the session
    session.close()

    #Put crime data into a list of dictionaries
    crime_list = []
    for record in crime_results:
        (crimeData_year, crimeData_offense_cat, crimeData_crimetotal) = record
        dict={}
        dict['id']=neighid
        dict['year']= crimeData_year
        dict['crime_counts']= crimeData_crimetotal
        dict['offense_cat']= crimeData_offense_cat
        crime_list.append(dict)


    # Neighborhood crime info
    return jsonify(crime_list)


###### Route to gather crime counts for Minneapolis in order to calculate percents of crime ######
@app.route("/percent")
def percent():
    print("percent")
    # Open a session
    session = Session(engine)

    #Get Crime data for all selected neighborhood
    sel = [neighborhoodData.neighborhood, func.sum(crimeData.crime_count).label('crimetotal')]
    crime_results = session.query(*sel).join(neighborhoodData, neighborhoodData.neighborhoodid == crimeData.neighborhoodid).filter(crimeData.year >= 2019).group_by(neighborhoodData.neighborhood).all()

    #Close the session
    session.close()

    #Put into a list of dictionaries   
    percent = []
    for neighborhoodData_neighborhood, crimeData_crimetotal in crime_results:
        dict={}
        dict['neighborhood']= neighborhoodData_neighborhood
        dict['crime_counts']= crimeData_crimetotal
        percent.append(dict)

    # Neighborhood crime info
    return jsonify(percent)

# Route to display total data for crime breakdown
@app.route("/MinneapolisCrimeBreakdown")
def MinneapolisCrimeBreakdown():
    print("Getting data")
    # Open a session
    session = Session(engine)

    #Get Crime breakdown for the selected neighborhood
    sel = [crimeData.year, crimeData.offense_cat, func.sum(crimeData.crime_count).label('crimetotal')]
    crime_results = session.query(*sel).filter(crimeData.year >= 2019).group_by(crimeData.year, crimeData.offense_cat).order_by(crimeData.offense_cat, crimeData.year).all()

    #Close the session
    session.close()

    #Put crime data into a list of dictionaries
    crime_list = []
    for record in crime_results:
        (crimeData_year, crimeData_offense_cat, crimeData_crimetotal) = record
        dict={}
        dict['year']= crimeData_year
        dict['crime_counts']= crimeData_crimetotal
        dict['offense_cat']= crimeData_offense_cat
        crime_list.append(dict)


    # Neighborhood crime info
    return jsonify(crime_list)



###### Route to gather full crimedata table ######
@app.route("/DetailedCrimeData")
def DetailedCrimeData():
    print("Getting data")
    # Open a session
    session = Session(engine)

    #Get Crime data for all Minneapolis
    sel = [neighborhoodData.neighborhoodid, neighborhoodData.neighborhood, crimeData.occurred_date, crimeData.offense_cat, crimeData.offense, crimeData.latitude, crimeData.longitude, crimeData.crime_count]
    crime_results = session.query(*sel).join(crimeData, neighborhoodData.neighborhoodid == crimeData.neighborhoodid).all()
  
    #Close the session
    session.close()

    #Put crime data into a list of dictionaries
    crime_list = []
    for record in crime_results:
        (neighborhoodData_neighborhoodid, neighborhoodData_neighborhood, crimeData_occurred_date, crimeData_offense_cat, crimeData_offense, crimeData_latitude, crimeData_longitude, crimeData_crime_count) = record
        dict = {}
        dict["neighborhoodID"] = neighborhoodData_neighborhoodid
        dict["neighborhood"] = neighborhoodData_neighborhood
        dict["offense_cat"] = crimeData_offense_cat
        dict["crime_count"] = crimeData_crime_count
        dict["occured_date"] = crimeData_occurred_date
        dict["offense"] = crimeData_offense
        dict["latitude"] = crimeData_latitude
        dict["longitude"] = crimeData_longitude
        crime_list.append(dict)


    # Neighborhood crime info
    return jsonify(crime_list)

###### Route to read the Minneapolis neighborhood GeoJson ######
@app.route("/readjsonfile")
def ReadJsonFileRoute():    

    # set a variable to our file location
    filepath = "static/data/Minneapolis_GeoJson_Updated.geojson"

    # Open the file
    with open(filepath) as f:    
        # lod the files data to a json variable
        json_data = json.load(f)

    # Minneapolis neighborhood GeoJson data
    return jsonify(json_data)

if __name__ == "__main__":
    app.run(debug=True)



