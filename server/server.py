from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS

from model.services import Files

app = Flask(__name__) #create Flask instance
CORS(app) #Enable CORS on Flask server to work with Nodejs pages
api = Api(app) #api router

api.add_resource(Files, '/files')

if __name__ == '__main__':
    app.run(debug=True)



    