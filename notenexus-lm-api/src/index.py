import json, os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from db.model import Paragraph
from db import (
    get_paragraphs_by_noteids,
    delete_paragraphs_by_id,
    update_paragraphs,
    vector_similarity_search,
    vector_distance_search,
    search_paragraph_contents,
    get_paragraph_neighbors,
    get_paragraph_by_paraid
)


from lm import (
    encode_text,
    summarize_documents
)

load_dotenv()
app = Flask(__name__)
CORS(app)

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
    paragraphs = get_paragraphs_by_noteids([note_id])
    return jsonify(paragraphs)

@app.post('/get_paragraphs')
def get_paragraphs_with_list():
    body = request.json
    
    if 'note_ids' not in body:
        return 'No note_ids parameter specified', 400
    
    rs = get_paragraphs_by_noteids(body['note_ids'])
    
    return jsonify(rs)

@app.post('/get_knn_links')
def get_knn_links():
    body = request.json
    
    if 'para_id' not in body:
        return 'no para_id specified', 400
    
    if 'note_ids' not in body:
        return 'No note_ids parameter specified', 400
    
    
    k = 3 if 'k' not in body else body['k']
    paragraph = get_paragraph_by_paraid(body['para_id'])
    rs = get_paragraph_neighbors(paragraph, body['note_ids'], k)

    result = {
        "links" : rs if rs else []
    }
    
    if 'include_summary' in body and body['include_summary']:
        contents = paragraph['contents']
        if len(contents) > 250:
            summary = summarize_documents(contents)
        else:
            summary = contents
        result['summary'] = summary
    
    
    return jsonify(result)





# Used for writing new paragraphs, and update or deleting existing paragraphs
@app.post('/get_similarity_links')
def get_similarity_links():
    body = request.json
    
    if 'para_id' not in body:
        return "theres no para_id", 400
    
    paragraph = get_paragraph_by_paraid(body['para_id'])
    threshold = 0.5 if 'threshold' not in body else float(body['threshold'])
    rs = vector_similarity_search(paragraph['embedding'],threshold)
    
    combined_contents = "\n".join([result['contents'] for result in rs])
                 
    result = {
        "paragraphs": rs
    }
    
    if 'include_summary' in body and body['include_summary']:
        if len(combined_contents) > 250:
            summary = summarize_documents(combined_contents)
        else:
            summary = None
        result['summary'] = summary
    return jsonify(result)
    
@app.post('/keyword_search')
def keyword_search():
    body = request.json
    if 'query' not in body:
        return "theres no query", 400
    
    rs = search_paragraph_contents(body['query'])
    
    return jsonify(rs)
