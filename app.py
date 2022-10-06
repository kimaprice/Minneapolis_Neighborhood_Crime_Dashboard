from flask import Flask, render_template, redirect
import os
import psycopg2
import get_data

# Create an instance of Flask
app = Flask(__name__)

# Connect to postgreSQL DB
def get_db_connection():
    conn = psycopg2.connect(host='localhost',
                            database='minne_crime_db',
                            user=os.environ['DB_USERNAME'],
                            password=os.environ['DB_PASSWORD'])
    return conn


# Route to render index.html template using data from Mongo
@app.route('/')
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT statement')
    books = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('index.html', books=books)


# Route to gather neighborhood specific data
@app.route("/getData")
def getData():

    # Redirect back to home page
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)



