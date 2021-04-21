from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import csv
import json
import pandas as pd
import sys, getopt, pprint
import pymongo

#CSV to JSON Conversion
df = pd.read_csv('Output/States_Annually.csv',encoding = 'UTF-8')
df.to_json('States_Annually.json')
jdf = open('States_Annually.json').read()
data = json.loads(jdf) 



app = Flask(__name__)
# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/Gas_DB"
mongo = PyMongo(app)
db = mongo.db
db.Gas.insert_one(data)

@app.route("/")
def index():
    return render_template("index.html", mars_dict=mars_dict)


@app.route("/scrape")
def scraper():
    mars_dict = mongo.db.mars_dict
    mars_data = scrape_mars.scrape()
    mars_dict.update({}, mars_data, upsert=True)
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)
