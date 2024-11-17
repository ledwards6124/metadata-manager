from flask import Flask, json, jsonify
from flask_restful import Resource, Api, reqparse, request
from flask_cors import CORS

def compute_key(metadata):
    artist = metadata['TP1']
    title = metadata['TT2']
    hashed = hash(artist + title)
    return hashed
   
files = {} 

class Files(Resource):
    
    def __init__(self):
        super().__init__()

        
    
    def get(self):
        return jsonify([(i['metadata'])for i in files.values()])
    
    def post(self):
        metadata = request.form.get('metadata')
        j_metadata = json.loads(metadata)
        file = request.files['file']
        key = compute_key(j_metadata)
        song = {
            'metadata': j_metadata,
            'file': file
        }
        files.update({key: song})
        return j_metadata
    
    def delete(self,):
        key = request.args.get('key')
        val = files.pop(key, -1)
        print(files)
        if val != -1:
            return jsonify(val['metadata'])
        else:
            return jsonify({'error': 'key not found'})
        
        