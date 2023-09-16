import json
from flask import Flask, request
from lm import encode_note

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.post('/write_note')
def write_note():
    body = request.json
    
    if 'note' in body:
        emb = encode_note(body['note'])
    else:
        return app.response_class(
            response=json.dumps({"message":"Request didn't have a note inside it."}),
            status=400,
            mimetype='application/json'
        )
    
    print(emb)
    return ''