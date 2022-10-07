from flask import Flask, render_template, redirect, jsonify
import os
import psycopg2
from sqlalchemy import create_engine, inspect
import get_data

# Create an instance of Flask
app = Flask(__name__)

# Connect to postgreSQL DB
protocol = 'postgresql'
username = 'postgres'
password = 'bootcamp'
host = 'localhost'
port = 5432
database_name = 'minne_crime_db'
connection_string = f'{protocol}://{username}:{password}@{host}:{port}/{database_name}'
engine = create_engine(connection_string)

def get_db_connection():



# Route to render index.html template using data from Mongo
@app.route('/')
def index():
   



# Route to gather neighborhood specific data
@app.route("/getData")
def getData():

    # Redirect back to home page
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)



