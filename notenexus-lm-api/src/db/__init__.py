import os
from db.model import Paragraph
from elasticsearch import Elasticsearch, helpers

PARAGRAPH_INDEX = 'paragraph'

es = Elasticsearch(
    os.environ['ELASTIC_CLUSTER'],
    basic_auth=(os.environ['ELASTIC_USER'],os.environ['ELASTIC_PASS']),
    verify_certs=False
)

def delete_paragraphs_by_id(ids : list):
    def create_iterator(ids):
        for id in ids:
            yield {
                '_op_type': 'delete',
                '_index': PARAGRAPH_INDEX,
                '_id': id
            }

    for success, info in helpers.parallel_bulk(client=es, actions=create_iterator(ids), thread_count=1, raise_on_error=False):
        if not success: 
            print('Doc failed', info)

def write_paragraphs(paragraphs : list[Paragraph]):
    def create_iterator(paragraphs):
        for p in paragraphs:
            yield {
                '_op_type': 'index',
                '_index': PARAGRAPH_INDEX,
                '_id': p.id,
                '_source': p.as_doc()
            }

    for success, info in helpers.parallel_bulk(client=es, actions=create_iterator(paragraphs), thread_count=1):
        if not success: 
            print('Doc failed', info)

def update_paragraphs(paragraphs : list[Paragraph]):
    #Delete the old paragraphs by id
    delete_ids = [p.id for p in paragraphs]
    delete_paragraphs_by_id(delete_ids)
    
    #Write the updated paragraphs
    write_paragraphs(paragraphs)

def get_paragraphs_by_noteids(note_ids : list[str]):
    q = {
        "terms" : {
            "note_id": note_ids
        }
    }
    
    res = es.search(index=PARAGRAPH_INDEX, query=q)
    rs = []
    for hit in res['hits']['hits']:
        doc = hit['_source']
        del doc['embedding']
        rs.append(doc)
    
    return rs

def get_paragraph_neighbors(paragraph : dict, note_ids : list[str], k_neighbors : int = 5, exclude_own_note : bool = True):
    if not paragraph:
        return None

    q = {
        "field": "embedding",
        "query_vector": paragraph['embedding'],
        "k": k_neighbors,
        "num_candidates": 20
    }
    
    if exclude_own_note:
        q['filter'] = {
            "bool": {
                "must": [
                    {
                        "terms":{
                            "note_id" : note_ids
                        }
                    }  
                ],
                "must_not": [
                    {
                        "term": {
                            "note_id": paragraph['note_id']
                        }
                    }
                ]
            }
        }
    
    
    res = es.search(index=PARAGRAPH_INDEX, knn=q)
    
    rs = []
    for hit in res['hits']['hits']:
        doc = hit['_source']
        del doc['embedding']
        rs.append(doc)
    
    
    links = []
    for doc in rs:
        links.append({
            "source": paragraph['id'],
            "target": doc['id']
        })
    return links
    

def get_paragraph_by_paraid(para_id : str):
    resp = es.get(index=PARAGRAPH_INDEX, id=para_id)
    
    if '_source' in resp:
        return resp['_source']
    return None
    
    

def search_paragraph_contents(query_string: str):
    q = {
        "simple_query_string": {
            "fields": [ "contents" ],
            "query": query_string
        }
    }
    
    res = es.search(index=PARAGRAPH_INDEX, query=q)
    
    rs = []
    for hit in res['hits']['hits']:
        doc = hit['_source']
        del doc['embedding']
        rs.append(doc)
    
    return rs

def vector_similarity_search(query_vector : list[float], threshold : float, ignore_notes : list[str]):
    q = {
        "script_score": {
            "query" : {
                "bool":{
                    "must_not":[
                        { "terms": {"note_ids": ignore_notes}}
                    ]
                }
            },
            "script": {
                "source": """
                    double value = cosineSimilarity(params.query_vector, 'embedding');
                    return sigmoid(1, Math.E, -value); 
                """,
                "params": {
                    "query_vector": query_vector
                }
            }
        }
    }
    
    res = es.search(index=PARAGRAPH_INDEX, query=q)
    
    rs = []
    for hit in res['hits']['hits']:
        score = float(hit['_score'])
        if score >= threshold:
            doc = hit['_source']
            del doc['embedding']
            doc['similarity'] = score
            rs.append(doc)
    
    return rs

def vector_distance_search(query_vector : list[float], threshold : float, ignore_notes : list[str]):
    q = {
        "script_score": {
            "query" : {
                "bool":{
                    "must_not":[
                        { "terms": {"note_ids": ignore_notes}}
                    ]
                }
            },
            "script": {
                "source": """
                    double value = l2norm(params.query_vector, 'embedding');
                    return value;
                """, 
                "params": {
                    "query_vector": query_vector
                }
            }
        }
    }
    
    res = es.search(index=PARAGRAPH_INDEX, query=q)
    
    rs = []
    for hit in res['hits']['hits']:
        score = float(hit['_score'])
        if True:
            doc = hit['_source']
            del doc['embedding']
            doc['distance'] = score
            rs.append(doc)
    
    return rs