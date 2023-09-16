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

### Endpoints
**edit_paragraphs**

Used for creating new paragraphs, and updating or deleting existing paragraphs.
```
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

