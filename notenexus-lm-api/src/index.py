import json
from flask import Flask, request, jsonify
from lm import encode_text
from db.model import Paragraph
from db import (
    get_paragraphs_by_noteid,
    delete_paragraphs_by_id,
    update_paragraphs,
    vector_similarity_search
)

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# Used for writing new paragraphs, and update or deleting existing paragraphs
@app.post('/edit_paragraphs')
def edit_paragraphs():
    body = request.json
    
    
    if 'delete' in body and body['delete']:
        #delete logic
        delete_paragraphs_by_id(body['delete'])
        
        
    
    if 'update' in body and body['update']:
        #update logic
        paragraphs_to_update = []
        for element in body['update'].values():
            paragraphs_to_update.append(
                Paragraph (
                    id = element['id'],
                    note_id = element['note_id'] if 'note_id' in element else '-1',
                    next = element['next'] if 'next' in element else None,
                    previous = element['previous'] if 'previous' in element else None,
                    embedding = encode_text(element['contents']),
                    contents = element['contents']
                )
            )
        
        if paragraphs_to_update:
            update_paragraphs(paragraphs_to_update)
        
    return ''

@app.get("/get_paragraphs/<note_id>")
def get_paragraphs(note_id):
    paragraphs = get_paragraphs_by_noteid(note_id)
    
    return jsonify(paragraphs)

# Used for writing new paragraphs, and update or deleting existing paragraphs
@app.post('/get_linked_paragraphs')
def get_linked_paragraphs():
    body = request.json
    
    if 'text_query' not in body:
        return "theres no text query", 400
    
    query_vector = encode_text(body['text_query'])
    threshold = 0.5 if 'threshold' not in body else float(body['threshold'])
    rs = vector_similarity_search(query_vector,threshold)
    
    return jsonify(rs)
    