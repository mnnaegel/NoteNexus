import os
import uuid
import subprocess
import json

# Path to the 'zet' folder
path_to_zet = 'zet'

# Function to send a curl POST request for creating a note
def create_note(file_name):
    note_uuid = str(uuid.uuid4())
    
    # Prepare the data for the note
    data = {
        "id": note_uuid,
        "title": file_name,
        "content": "",
        "author": "user_2VUQ9LhYmfF3smchWbZZhrV63fu"
    }
    
    curl_command = [
        'curl', '-X', 'POST',
        'http://localhost:8080/notes',
        '-H', 'Content-Type: application/json',
        '-d', json.dumps(data)
    ]
    
    subprocess.run(curl_command)
    
    return note_uuid

# Function to send a curl POST request for creating a paragraph
def create_paragraph(note_uuid, content):
    paragraph_uuid = str(uuid.uuid4())
    
    # Prepare the data for the paragraph
    data = {
        "update": {
            paragraph_uuid: {
                "id": paragraph_uuid,
                "note_id": note_uuid,
                "next": "",
                "previous": "",
                "contents": content
            }
        }
    }
    
    curl_command = [
        'curl', '-X', 'POST',
        'http://127.0.0.1:5000/edit_paragraphs',
        '-H', 'Content-Type: application/json',
        '-d', json.dumps(data)
    ]
    
    subprocess.run(curl_command)

# Walk through the directory recursively
count = 0

for root, dirs, files in os.walk(path_to_zet):
    for file in files:
        if file.endswith('.md'):
            # Join the root directory and the file name to get the full path
            full_path = os.path.join(root, file)
            with open(full_path, 'r') as f:
                note_uuid = create_note(file)
                create_paragraph(note_uuid, f.read())
            
            # Increment the count
            count += 1
            
            # Stop after processing 30 markdown files
            if count == 30:
                break

    # Exit the outer loop if we've already processed 30 files
    if count == 30:
        break
