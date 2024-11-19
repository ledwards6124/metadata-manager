from io import BytesIO
from tempfile import TemporaryFile
from flask import Flask, json, jsonify, make_response, send_file
from flask_restful import Resource, Api, reqparse, request
from flask_cors import CORS
import os
import mutagen
import hashlib
   
FILES = {}

def py_hash(file):
    return int(hashlib.sha256(file).hexdigest(), 16)
        

class Files(Resource):
    
    def __init__(self):
        super().__init__()

        
    
    def get(self):
        key = request.args.get('key')
        if key:
            if key in FILES:
                file = FILES[key]['file']
                f = BytesIO()
                file.save(f)
                f.seek(0)
            
                response = send_file(f, as_attachment=True, mimetype='audio/mpeg', download_name=f'modified_{key}')
                response.headers['content-disposition'] = f'attachment; filename="modified_{key}.mp3"'
                return response
            return jsonify(f'No files found with key {key}...')
        entries = []
        for k in FILES.keys():
            entries.append((k, FILES[k]['metadata']))
        return jsonify(entries)
    
    def post(self):
        metadata = request.form.get('metadata')
        file = request.files['file']
        mp3 = mutagen.File(file, easy=False)
        song = {
            'metadata': json.loads(metadata),
            'file': mp3
        }
        
        if song['metadata'] and song['file']:
            
            key = file.filename
            if key not in FILES.keys():
                FILES[key] = song #add to files
                return jsonify(song['metadata'])
        return jsonify('Error uploading song...')
    
    def put(self):
        # Parse metadata from the request
        metadata = request.get_json()

        if not metadata or 'key' not in metadata:
            return {'error': 'Metadata is missing or invalid.'}, 400
        
        key = metadata['key']
        

        # Check if the file exists in FILES
        if key in FILES:

            try:
                # Load the MP3 file using Mutagen
                
                for k in metadata.keys():
                    if k in FILES[key]['metadata']:
                        FILES[key]['metadata'][k] = metadata[k]
                return jsonify(FILES[key]['metadata'])
            except KeyError:
                return jsonify('Key not found...')
        return {'error': f'File with key {key} not found.'}, 404

        # Return error if the file doesn't exist in FILES   
    


    
    def delete(self,):
        key = request.args.get('key')
        val = FILES.pop(key, -1)
        if val != -1:
            return jsonify(val['metadata'])
        else:
            return jsonify({'error': 'key not found'})
        

        
        