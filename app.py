from flask import Flask, render_template, redirect, jsonify


#Import json
import json

#Import from SQL Alchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

# Define the PostgreSQL connection parameters
username = 'postgres'  # Ideally this would come from config.py (or similar)
password = 'bootcamp'  # Ideally this would come from config.py (or similar)
database_name = 'minne_crime_db' 
port_number = '5432' # Check your own port number! It's probably 5432, but it might be different!
connection_string = f'postgresql://{username}:{password}@localhost:{port_number}/{database_name}'

# Connect to the SQL database
engine = create_engine(connection_string)
base = automap_base()
base.prepare(engine, reflect=True)

#Reflect the tables
crimeData = base.classes.crimeData
demoCat = base.classes.demoCat
demographicData = base.classes.demographicData
neighborhoodData = base.classes.neighborhoodData

# Create an instance of Flask
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

# Route to render index.html template
@app.route('/')
def index():
    print("Loading index.html")

    return render_template('index.html')

# Route to gather data from PostgreSQL DB: minne_crime_db
@app.route("/getDemographicData/<neighID>")
def getDemographicData(neighID):
    print("Getting data")
    # Open a session
    session = Session(engine)
    
    #Get Demo data for all Minneapolis
    sel = [demographicData.neighborhoodID, demoCat.demographic, demoCat.category, demographicData.percent]
    demo_results = session.query(*sel).join(demographicData, demoCat.demoID == demographicData.demoID).filter(demographicData.neighborhoodID == neighID).all()
    
    #Close the session
    session.close()

     #Put demographic data into a list of dictionaries
    demo_list = []
    for record in demo_results:
        (demographicData_neighborhoodID, demoCat_demographic, demoCat_category, demographicData_percent) = record
        dict = {}
        dict["neighborhoodID"] = demographicData_neighborhoodID
        dict["demographic"] = demoCat_demographic
        dict["category"] = demoCat_category
        dict["percent"] = demographicData_percent
        demo_list.append(dict)
    
    # data = []
    # data.append({"neighborhoodList": neighborhood_list})
    # data.append({"crimeData": crime_list})
    # data.append({"demoList": demo_list})
    # print("data gathered")

    # Neighborhood crime info
    return jsonify(demo_list)

    # Route to gather data from PostgreSQL DB: minne_crime_db
@app.route("/getNeighborhoods")
def getNeighborhoods():
    print("Getting data")
    # Open a session
    session = Session(engine)

    #Get list of neighborhoods with ID
    neigh_results = session.query(neighborhoodData.neighborhoodID, neighborhoodData.neighborhood).all()
    
    #Close the session
    session.close()

    #Put neighborhoods into a list of dictionaries
    neighborhood_list = []
    for neighborhoodData_neighborhoodID, neighborhoodData_neighborhood in neigh_results:
        dict = {}
        dict["neighborhoodID"] = neighborhoodData_neighborhoodID
        dict["neighborhood"] = neighborhoodData_neighborhood
        neighborhood_list.append(dict)

    # Neighborhood crime info
    return jsonify(neighborhood_list)

    # Route to gather data from PostgreSQL DB: minne_crime_db
@app.route("/getCrimeData")
def getCrimeData():
    print("Getting data")
    # Open a session
    session = Session(engine)

    #Get Crime data for all Minneapolis
    sel = [neighborhoodData.neighborhoodID, neighborhoodData.neighborhood, crimeData.occurred_date, crimeData.offense_cat, crimeData.offense, crimeData.latitude, crimeData.longitude, crimeData.crime_count]
    crime_results = session.query(*sel).join(crimeData, neighborhoodData.neighborhoodID == crimeData.neighborhoodID).all()
  
    #Close the session
    session.close()

    #Put crime data into a list of dictionaries
    crime_list = []
    for record in crime_results:
        (neighborhoodData_neighborhoodID, neighborhoodData_neighborhood, crimeData_occurred_date, crimeData_offense_cat, crimeData_offense, crimeData_latitude, crimeData_longitude, crimeData_crime_count) = record
        dict = {}
        dict["neighborhoodID"] = neighborhoodData_neighborhoodID
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

if __name__ == "__main__":
    app.run(debug=True)



