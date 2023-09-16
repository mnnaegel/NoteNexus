import NavigationBar from "@/components/Navigation/Navigation";
import classnames from "classnames";
import { Container, Grid, TextField, TextareaAutosize } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import styles from "./NoteEditor.module.scss";
import { eventNames } from "process";

function NoteEditor() {
  // NOTE: uuid() will be different for initial key and paragraph id
  const initial_id = uuid();
  const [updated, setUpdated] = useState({})
  const [editorContent, setEditorContent] = useState([
    {
      key: initial_id,
      text: "",
      paragraphId: initial_id,
      before: "",
      after: "",
    },
  ]);

  const handleKeyPress = (event: any) => {
    // Enter is pressed for a given item id
    if (event.key === "Enter") {
      event.preventDefault();
      const id = event.target.id;

      const length = editorContent.length;
      let new_arr = [];
      for (let i = 0; i < length; i++) {
        if (editorContent[i].paragraphId !== id) {
          new_arr.push(editorContent.slice(i)[0]);
        } else if (editorContent[i].paragraphId === id) {
          let newParaId = uuid();
          let curr = editorContent.slice(i)[0];
          let next = curr.after;
          curr.after = newParaId;
          new_arr.push(curr);
          let newPara = {
            key: newParaId,
            text: "",
            paragraphId: newParaId,
            before: curr.paragraphId,
            after: next,
          };
          new_arr.push(newPara);
          if (next !== "") {
            let next_el = editorContent.slice(i + 1)[0];
            next_el.before = newParaId;
            ++i;
            new_arr.push(next_el);
          }
        }
      }

      setEditorContent(new_arr);
      console.log("enter press here! ");
    }
    // There has been a change to a specific field
    else  {
      setUpdated([])
    }
  };

  return (
    <div className={styles.NoteEditor}>
      <NavigationBar />
      <Container>
        <h1>Note Editor</h1>
        <button>Save</button>
        <form>
          <Grid></Grid>

          {editorContent.map((el, index) => (
            <Grid item xs={12}>
              <TextareaAutosize
                autoFocus
                className={styles.paragraph}
                // ref={(element: any) => element && (index == focusIdx) && element.focus()}
                id={el.paragraphId}
                key={el.key}
                value={el.text}
                onChange={(e) => {
                  let editorCont = editorContent.map((editor, index) => {
                    if (editor.paragraphId !== el.paragraphId) {
                      return editor;
                    } else {
                      return {
                        key: el.key,
                        text: e.target.value,
                        paragraphId: el.paragraphId,
                        before: el.before,
                        after: el.after,
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
