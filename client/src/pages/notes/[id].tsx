import { Note } from "@/types/note.type";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import styles from "./NoteEditor.module.scss";
import { TextareaAutosize, Grid, Container } from "@mui/material";
import NavigationBar from "@/components/Navigation/Navigation";

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
  update: { [key: string]: Partial<Paragraph> };
  delete: string[];
}

export default function Page() {
  const router = useRouter();

  const note_id = router.query.id as string;
  const [note, setNote] = useState<Partial<Note>>();
  const initial_id = uuid();
  const [focusIdx, setFocusIdx] = useState(0);
  const [rawParagraphs, setRawParagraphs] = useState<Partial<Paragraph>[]>([]);
  // Starting Editor (Overwritten if note is non-empty)
  const [editorContent, setEditorContent] = useState<Paragraph[]>([
    {
      key: initial_id,
      contents: "",
      id: initial_id,
      previous: "",
      next: "",
      updated: true,
    },
  ]);

  useEffect(() => {
    if (!!note_id && typeof note_id === "string") {
      // Gets note metadata and general info
      axios
        .get("http://localhost:8080/notes/" + note_id)
        .then((response) => {
          setNote(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });

      // Gets note paragraph data
      axios
        .get(`http://127.0.0.1:5000/get_paragraphs/${note_id}`)
        .then((response) => {
          let editorCont: Partial<Paragraph>[] = response.data;
          if (editorCont.length > 0) {
          setEditorContent(reOrderParagaphs(editorCont));

          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  function reOrderParagaphs(raw_array: Partial<Paragraph>[]) {
    let head: string = "";
    let orderDict: { [key: string]: Partial<Paragraph> } = {};
    let output_arr: Paragraph[] = [];
    // Find head and create Dict
    for (let i = 0; i < raw_array.length; ++i) {
      if (raw_array[i].previous == "") {
          head = raw_array[i].id as string;
      }
      orderDict[raw_array[i].id as string] = raw_array[i];
    }

    // Establish order
    while (head !== "") {
      let raw_el: Partial<Paragraph> = orderDict[head]
      let processed_el: Paragraph = {
        id: raw_el.id as string,
        key: raw_el.id as string,
        contents: raw_el.contents as string,
        previous: raw_el.previous as string,
        next: raw_el.next as string,
        updated: false
      }
      head = raw_el.next as string;
      output_arr.push(processed_el)

    }
    return output_arr;
  }

  function updateNote() {
    const updated: { [key: string]: Partial<Paragraph> } = {};
    for (let i = 0; i < editorContent.length; i++) {
      if (editorContent[i].updated) {
        const para = editorContent[i];
        updated[para.id] = {
          id: para.id,
          contents: para.contents,
          previous: para.previous,
          next: para.next,
          note_id: note_id,
        };
      }
    }

    const postData: UpdateParagraphRequest = {
      update: updated,
      delete: [],
    };

    console.log(postData);
    axios
      .post("http://127.0.0.1:5000/edit_paragraphs", postData)
      .then((response) => {
        console.log(response);
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
          setFocusIdx(i + 1);
          curr.next = newParaId;
          curr.updated = true;
          new_arr.push(curr);
          let newPara = {
            key: newParaId,
            contents: "",
            id: newParaId,
            previous: curr.id,
            next: next,
            updated: true,
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
        <h1>Note Title: {note?.title}</h1>
        <button onClick={updateNote}>Save</button>
        <form>
          <Grid></Grid>

          {editorContent.map((el, index) => (
            <Grid item xs={12}>
              <TextareaAutosize
                className={styles.paragraph}
                ref={(element: any) =>
                  element && index == focusIdx && element.focus()
                }
                id={el.id}
                key={el.key}
                value={el.contents}
                onChange={(e) => {
                  setFocusIdx(index);
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
                        updated: true,
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
