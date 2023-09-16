import json
from flask import Flask, request
from lm import encode_text
from db.model import Paragraph
from db import es_write_paragraph, get_note_by_id

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.post('/submit_paragraph')
def submit_paragraph():
    body = request.json
    
    if 'contents' in body:
        emb = encode_text(body['contents'])
    else:
        return app.response_class(
            response=json.dumps({"message":"Request didn't have paragraph contents."}),
            status=400,
            mimetype='application/json'
        )
    
    para = Paragraph(
        note_id = body['note_id'] if 'note_id' in body else '-1',
        next = body['next'] if 'next' in body else None,
        previous = body['previous'] if 'previous' in body else None,
        embedding = emb,
        contents = body['contents']
    )
    
    es_write_paragraph(para)
    
    return ''
