from telnetlib import theNULL
from flask import Flask, render_template, redirect


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
crime_data = base.classes.crime_data
demo_cat = base.classes.demo_cat
demographic_data = base.classes.demographic_data
neighborhood = base.classes.neighborhood

# Create an instance of Flask
app = Flask(__name__)

#app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

# Route to render index.html template
@app.route('/')
def index():
    print("this is my file")
    return render_template('index.html')


# Route to gather data from PostgreSQL DB: minne_crime_db
@app.route("/getNeighborhoodData/<neighborhoodName>")
def getSQL(neighborhoodName):

    # Open a session, run the query to get crime data, and then close the session again
    session = Session(engine)
    if neighborhood = 'all':
       results = session.query(neighborhood).join(crime_data, neighborhood.neighborhood_id==crime_data.neighborhood_id).all()
    else:
        results = session.query(neighborhood).join(crime_data, neighborhood.neighborhood_id==crime_data.neighborhood_id).filter(User.email == neighborhoodName).all()

    session.close()

    # Create a list of dictionaries, with each dictionary containing one row from the query. 
    crime_info = []
    for id, neighborhoodN, occurred_date in results:
        dict = {}
        dict["neighborhood_id"] = id
        dict["neighborhoodN"] = neighborhoodN
        dict["occurred_date"] = occurred_date
        crime_info.append(dict)

    # Redirect back to home page
    return (crime_info)

if __name__ == "__main__":
    app.run(debug=True)



