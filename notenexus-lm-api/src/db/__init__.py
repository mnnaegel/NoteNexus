from db.model import Paragraph
from elasticsearch import Elasticsearch

es = Elasticsearch(
    "https://34.135.245.185:9200",
    basic_auth=('elastic','WdKf6dzpHNwdNrYlb4m-'),
    verify_certs=False
)

def write_paragraph(paragraph : Paragraph):
    doc = paragraph.for_es()
    res = es.index(index="paragraph", document=doc)
    return res['result']

def get_note_by_id(note_id : str):
    if not note_id:
        raise ValueError("No note_id specified.")
    
    query = {
        "term": {
            "note_id":{
                "value" : note_id
            }
        }  
    }
    
    # resp = es.search(index="test-index", query={"match_all": {}})
    # res = es.search(index="paragraph", query=query)
    # print("Got %d Hits:" % res['hits']['total']['value'])
    # for hit in res['hits']['hits']:
    #     print("%(timestamp)s %(author)s: %(text)s" % hit["_source"])
    
    raise NotImplementedError()
    
