import NavigationBar from "@/components/Navigation/Navigation";
import classnames from "classnames";
import { Container, Grid, TextareaAutosize } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";

import styles from "./NoteEditor.module.scss";

interface Paragraph {
    key: string;
    contents: string;
    id: string;
    previous: string;
    next: string;
    updated: boolean;
    note_id?: string;
}

interface UpdateParagraphRequest {
  update: {[key: string]: Partial<Paragraph>};
  delete: string[];
}

function NoteEditor() {
  // NOTE: uuid() will be different for initial key and paragraph id
  const initial_id = uuid();
  const [focusIdx, setFocusIdx] = useState(0);
  // Starting Editor
  const [editorContent, setEditorContent] = useState<Paragraph[]>([
    {
      key: initial_id,
      contents: "",
      id: initial_id,
      previous: "",
      next: "",
      updated: true
    },
  ]);


  function updateNote() {
    const updated: {[key: string]: Partial<Paragraph>} = {}
    for (let i = 0; i < editorContent.length; i++) {
      if (editorContent[i].updated) {
        const para = editorContent[i];  
        updated[para.id] = {
          id: para.id,
          contents: para.contents,
          previous: para.previous,
          next: para.next,
          note_id: "test_town"
        } 
      }
    }

    const postData: UpdateParagraphRequest = {
      update: updated,
      delete: []
    }

    console.log(postData)
    axios
      .post("http://127.0.0.1:5000/edit_paragraphs", postData)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleKeyPress = (event: any) => {
    // Enter is pressed for a given item id
    if (event.key === "Enter") {
      event.preventDefault();
      const id = event.target.id;

      const length = editorContent.length;
      let new_arr = [];
      for (let i = 0; i < length; i++) {
        if (editorContent[i].id !== id) {
          new_arr.push(editorContent.slice(i)[0]);
        } else if (editorContent[i].id === id) {
          let newParaId = uuid();
          let curr = editorContent.slice(i)[0];
          let next = curr.next;
          setFocusIdx(i+1)
          curr.next = newParaId;
          curr.updated = true;
          new_arr.push(curr);
          let newPara = {
            key: newParaId,
            contents: "",
            id: newParaId,
            previous: curr.id,
            next: next,
            updated: true
          };
          new_arr.push(newPara);
          if (next !== "") {
            let next_el = editorContent.slice(i + 1)[0];
            next_el.previous = newParaId;
            next_el.updated = true;
            ++i;
            new_arr.push(next_el);
          }
        }
      }
      setEditorContent(new_arr);
      console.log("enter press here! ");
    }
    // There has been a change to a specific field
  };

  return (
    <div className={styles.NoteEditor}>
      <NavigationBar />
      <Container>
        <h1>Note Editor</h1>
        <button onClick={updateNote}>Save</button>
        <form>
          <Grid></Grid>

          {editorContent.map((el, index) => (
            <Grid item xs={12}>
              <TextareaAutosize
                className={styles.paragraph}
                ref={(element: any) => element && (index == focusIdx) && element.focus()}
                id={el.id}
                key={el.key}
                value={el.contents}
                onChange={(e) => {
                  setFocusIdx(index)
                  let editorCont = editorContent.map((editor, index) => {
                    if (editor.id !== el.id) {
                      return editor;
                    } else {
                      return {
                        key: el.key,
                        contents: e.target.value,
                        id: el.id,
                        previous: el.previous,
                        next: el.next,
                        updated: true
                      };
                    }
                  });
                  setEditorContent(editorCont);
                }}
                onKeyDown={handleKeyPress}
              />
            </Grid>
          ))}
        </form>
      </Container>
    </div>
  );
}

export default NoteEditor;
