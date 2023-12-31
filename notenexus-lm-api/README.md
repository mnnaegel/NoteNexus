# Setup
### Run this the first time
```
python -m venv env
source env/bin/activate
pip install -r requirements.txt
```

### Run this to start the API
```
sh start_api.sh
```

# Endpoints

## GET Requests
### get_paragraphs

Used to get paragraphs for a particular note.
```json
GET /get_paragraphs/{note_id}
```

## POST Requests

### edit_paragraphs
Used for creating new paragraphs, and updating or deleting existing paragraphs.
```json
POST /edit_paragraphs
{
    "update":{
        "para_uid_5":{
            "id":"para_uid_5",
            "note_id":"note_uid_1",
            "next":"para_uid_6",
            "previous":"para_uid_2",
            "contents": "This is a paragraph."
        },
        "para_uid_6":{
            "id":"para_uid_5",
            "note_id":"note_uid_1",
            "next":"",
            "previous":"para_uid_5",
            "contents": "This is another paragraph."
            
        }
    },
    "delete":[
        "para_uid_3",
        "para_uid_4",
    ]
}
```

### get_linked_paragraphs
Encode a query text into a vector and identify similar notes by their embedding
```json
POST /get_linked_paragraphs
{
    "text_query":"this is just an example.",
    "threshold":0.5
}
```

### notes_by_keyword (Todo)
Identify notes which match query keywords by their contents.