from flask import Flask,render_template,request,jsonify
from shipnav.Graph_search import main_search
from dotenv import load_dotenv
import ast,os,csv
import psycopg2 as ps
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

db_host = os.getenv("PGHOST")
db_port = os.getenv("PGPORT")
db_name = os.getenv("PGDATABASE")
db_user = os.getenv("PGUSER")
db_password = os.getenv("PGPASSWORD")

def list_to_string(lst):
    str_list = [str(element) for element in lst]
    result = "(" + ",".join(str_list) + ")"

    return result


db_uri = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
@app.route('/')
def Hello():
    return "<h1>hello</h1>"

@app.route("/stream-path",methods=['POST','GET'])
def stream_path():
    print(type(request.get_json().get('source_coords')[0]))
    ntype=1
    gtype='full'
    source_coords = ast.literal_eval(list_to_string(request.json.get('source_coords')))
    print("source:", source_coords, type(source_coords))
    destination_coords = ast.literal_eval(list_to_string(request.json.get('destination_coords')))
    if(request.json.get('gtype') != None):
        gtype = request.json.get('gtype')
    if(request.json.get('ntype') != None):
        ntype = int(request.json.get('ntype'))
    path=[]
    
    print("source:", source_coords, type(source_coords))
    print("destination:", destination_coords)

    if gtype=="full":
        path = main_search(source_coords,destination_coords, "full", ntype)
    if gtype=="part":
        return jsonify({"message":"Not implemented yet"}),400
    return path 


from query_routes import *
if __name__ == "__main__":
    app.run(host="0.0.0.0")
    
# source_coords = list_to_string(request.json.get('source_coords'))
#     print("source:", source_coords, type(source_coords))
#     destination_coords = list_to_string(request.json.get('destination_coords'))