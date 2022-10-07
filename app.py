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
@app.route("/getNeighborhoodData")
def getSQL():

    # Redirect back to home page
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)



