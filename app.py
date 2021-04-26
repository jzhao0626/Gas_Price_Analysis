from flask import Flask, render_template, redirect, jsonify
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


print(f"Number of documents in annual data: {len(annual_JSON)}.")
for annual in annual_JSON:
    # annual_dict = {}
    # annual_dict["Date"] = keyword
    # merged_annual_dict = {**annual_dict, **annual_JSON[keyword]}
    Gas_DB.Gas_Annual.insert_one(annual)



print(f"Number of documents in month data: {len(month_JSON)}.")
for month in month_JSON:
    # month_dict = {}
    # month_dict["Date"] = keyword
    # merged_month_dict = {**month_dict, **month_JSON[keyword]}
    Gas_DB.Gas_Month.insert_one(month)



print(f"Number of documents in disaster data: {len(disaster_JSON)}.\n")
for disaster in disaster_JSON:
    # disaster_dict = {}
    # disaster_dict["Date"] = keyword
    # merged_disaster_dict = {**disaster_dict, **disaster_JSON[keyword]}
    Gas_DB.Disaster_Gas.insert_one(disaster)



@app.route("/")
def index():
    
    return render_template("index.html")



@app.route("/data")

def data():
    disaster_dict_flask = [disaster for disaster in Gas_DB.Disaster_Gas.find({},{"_id": False})]
    annual_dict_flask = [annual for annual in Gas_DB.Gas_Annual.find({},{"_id": False})]
    month_dict_flask = [month for month in Gas_DB.Gas_Month.find({},{"_id": False})]
    final_data = {
        "disaster_json": disaster_dict_flask,
        "annual_json": annual_dict_flask,
        "month_json": month_dict_flask
    }
    return jsonify(final_data)



if __name__ == "__main__":
    app.run(debug=True)
