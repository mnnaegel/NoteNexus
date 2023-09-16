import NavigationBar from "@/components/Navigation/Navigation";
import classnames from 'classnames';
import { Container, Grid, TextField, TextareaAutosize } from "@mui/material";
import { useEffect, useState } from "react";
import { LinkedNode, ParagraphData } from "@/types/linkedlist.type";

import styles from './NoteEditor.module.scss'



function NoteEditor() {
  const [idCounter, setIdCounter] = useState(0)
  const [editorContent, setEditorContent] = useState([{ key: 0, text: "", paragraphId: `para${idCounter}`, before: "", after: "" }]);


  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      window.alert(event.target.id)
      const length = editorContent.length
      const curr = editorContent.slice(length - 1)[0]
      curr.after = `para${idCounter + 1}`
      setEditorContent([
        ...(editorContent.slice(0, length - 1)),
        curr,
        { key: editorContent.length, text: "", paragraphId: `para${idCounter + 1}`, before: "", after: "" },
      ]);
      setIdCounter(idCounter + 1)
      console.log("enter press here! ");
    }
  };


  return (
    <div className={styles.NoteEditor}>
      <NavigationBar />
      <Container>
        <h1>Note Editor</h1>
        <form>
          <Grid>

          </Grid>

          {editorContent.map((el) => (
            <Grid item xs={12}>
              <TextareaAutosize
                className={styles.paragraph}
                autoFocus
                id={el.paragraphId}
                key={el.key}
                value={el.text}
                onChange={(e) => {
                  let editorCont = editorContent.map((editor, index) => {
                    if (index !== el.key) {
                      return editor
                    }
                    else {
                      return { key: el.key, text: e.target.value, paragraphId: el.paragraphId, before: el.before, after: el.after }
                    }

                  })
                  console.log(editorContent)
                  setEditorContent(editorCont)
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
