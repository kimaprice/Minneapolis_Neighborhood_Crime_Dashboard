#Import from Flask
from flask import Flask
from flask import render_template
from flask import redirect
from flask import jsonify

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
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

# Route to render index.html template
@app.route('/')
def index():

    dashboard = render_tempate("index.html")
    return dashboard

# Route to gather data from PostgreSQL DB: minne_crime_db
@app.route("/getNeighborhoodData")
def getSQL():

    # Redirect back to home page
    return redirect("/")

@app.route("/readjsonfile/<filename>")
def ReadJsonFileRoute():    
    ''' Opens a JSON or GeoJSON file and then returns
        its contents to the client. The filename is specified
        as a parameter. '''

    # Note that we have to assemble the complete filepath. We do this on the 
    # server because the client has no knowledge of the server's file structure.
    filepath = f"static/data/Minneapolis_Neighborhoods.geojson"

    # Add some simple error handling to help if the user entered an invalid
    # filename. 
    try: 
        with open(filepath) as f:    
            json_data = json.load(f)
    except:
        json_data = {'Error': f'File not found on server!'}

    print('Returning data from a file')

    return jsonify(json_data)


if __name__ == "__main__":
    app.run(debug=True)


