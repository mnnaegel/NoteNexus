from db.model import Paragraph
from elasticsearch import Elasticsearch, helpers

PARAGRAPH_INDEX = 'paragraph'

es = Elasticsearch(
    "https://34.135.245.185:9200",
    basic_auth=('elastic','WdKf6dzpHNwdNrYlb4m-'),
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

def get_paragraphs_by_noteid(note_id : str):
    q = {
        "term" : {
            "note_id": {
                "value" : note_id
            }
        }
    }
    
    res = es.search(index=PARAGRAPH_INDEX, query=q)
    print("Got %d Hits:" % res['hits']['total']['value'])
    
    rs = []
    for hit in res['hits']['hits']:
        doc = hit['_source']
        del doc['embedding']
        rs.append(doc)
    
    return rs

def vector_similarity_search(query_vector : list[float], threshold : float):
    q = {
        "script_score": {
            "query" : {
                "match_all":{}
            },
            "script": {
                "source": "cosineSimilarity(params.query_vector, 'embedding')", 
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