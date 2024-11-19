from io import BytesIO
from flask import Flask, request, send_file
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from model.services import FILES, Files
app = Flask(__name__) #create Flask instance
CORS(app, resources={'/modify': {'origins': '*'}, '/files': {'origins': '*'}}) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

app.route('/modify', methods=['PUT'])
 

api.add_resource(Files, '/files')

if __name__ == '__main__':
    app.run(debug=True)



    