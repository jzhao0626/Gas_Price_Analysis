from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import json

JSON1 = open('Output/States_Annually.json').read()
annual_JSON = json.loads(JSON1) 
JSON2 = open('Output/States_Monthly.json').read()
month_JSON = json.loads(JSON2) 
JSON3 = open('Output/Disaster_Gas.json').read()
disaster_JSON = json.loads(JSON3) 


app = Flask(__name__)
print("\nInitiating flask server...")

app.config["MONGO_URI"] = "mongodb://localhost:27017/Gas_DB"
mongo = PyMongo(app)
Gas_DB = mongo.db
print("Connecting to MongoDB Gas_DB database...\n")

collections = Gas_DB.collection_names()
print("Searching for existing collection...")
if collections:
    print("Collections existed in database. Dropping...")
    for collection in collections:
        col = Gas_DB[collection]
        col.drop()
    print("Collections dropped.\n")
else:
    print("No collection found. Nothing to drop.\n")

print("Inserting new documents into the database")
keywords = annual_JSON.keys()
print(f"Number of documents in annual data: {len(keywords)}.")
for keyword in keywords:
    annual_dict = {}
    annual_dict["Date"] = keyword
    merged_annual_dict = {**annual_dict, **annual_JSON[keyword]}
    Gas_DB.Gas_Annual.insert_one(merged_annual_dict)

keywords = month_JSON.keys()
print(f"Number of documents in month data: {len(keywords)}.")
for keyword in keywords:
    month_dict = {}
    month_dict["Date"] = keyword
    merged_month_dict = {**month_dict, **month_JSON[keyword]}
    Gas_DB.Gas_Month.insert_one(merged_month_dict)

keywords = disaster_JSON.keys()
print(f"Number of documents in disaster data: {len(keywords)}.\n")
for keyword in keywords:
    disaster_dict = {}
    disaster_dict["Date"] = keyword
    merged_disaster_dict = {**disaster_dict, **disaster_JSON[keyword]}
    Gas_DB.Disaster_Gas.insert_one(merged_disaster_dict)



# @app.route("/")
# def index():
#     # return render_template("index.html", mars_dict=mars_dict)



if __name__ == "__main__":
    app.run(debug=False)
