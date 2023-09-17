import { Note } from "@/types/note.type";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { gsap, Power3 } from "gsap";
import styles from "./NoteEditor.module.scss";
import {
  TextareaAutosize,
  Grid,
  Container,
  Alert,
  IconButton,
  Collapse,
} from "@mui/material";
import SideBar from "@/components/SideBar/SideBar";
import NavigationBar from "@/components/Header/Header";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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

  // Alert State
  const [alertOpen, setAlertOpen] = useState(false);
  // Editor View?
  const [editorView, setEditorView] = useState(true);

  const containerRef = useRef(null);
  const note_id = router.query.id as string;
  const [note, setNote] = useState<Partial<Note>>();
  // State listing deleted nodes
  const [deleted, setDeleted] = useState<string[]>([]);
  const initial_id = uuid();
  const [focusIdx, setFocusIdx] = useState(0);
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
          console.log(response.data);
          let editorCont: Partial<Paragraph>[] = response.data;
          if (editorCont.length > 0) {
            setEditorContent(reOrderParagaphs(editorCont));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  // Reorders paragraph received from API to match sequence
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
      let raw_el: Partial<Paragraph> = orderDict[head];
      let processed_el: Paragraph = {
        id: raw_el.id as string,
        key: raw_el.id as string,
        contents: raw_el.contents as string,
        previous: raw_el.previous as string,
        next: raw_el.next as string,
        updated: false,
      };
      head = raw_el.next as string;
      output_arr.push(processed_el);
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
      delete: deleted,
    };

    console.log("Post Data:");
    console.log(postData);
    axios
      .post("http://127.0.0.1:5000/edit_paragraphs", postData)
      .then((response) => {
        setAlertOpen(true);
        console.log(response);
        // Resets all to false
        let editorCont: Paragraph[] = editorContent.map((el) => {
          return {
            id: el.id as string,
            key: el.key as string,
            contents: el.contents as string,
            previous: el.previous as string,
            next: el.next as string,
            updated: false,
          };
        });
        setEditorContent(editorCont);
        setDeleted([]);
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
    // Empty Case
    else if (event.key === "Backspace" && event.target.value === "") {
      event.preventDefault();
      const id = event.target.id;
      setDeleted([...(deleted as string[]), id]);
      // Edge Case: Head is deleted or is only element
      if (editorContent.length === 1) {
        return;
      } else if (editorContent[0].id === id) {
        let editorCont: Paragraph[] = [];
        let headpara: Paragraph = editorContent.slice(1)[0];
        headpara.previous = "";
        headpara.updated = true;
        editorCont = [
          headpara,
          ...editorContent.slice(2, editorContent.length),
        ];
        console.log(editorCont);
        setEditorContent(editorCont);
        setFocusIdx(0);
      } else {
        let editorCont: Paragraph[] = [];
        for (let i = 0; i < editorContent.length; ++i) {
          if (editorContent[i].next === id) {
            setFocusIdx(i);
            let newNext = editorContent[i + 1].next;
            let prevEl: Paragraph = editorContent.slice(i)[0];
            prevEl.next = newNext;
            prevEl.updated = true;
            editorCont.push(prevEl);
          } else if (editorContent[i].id === id) {
            // Do nothing
          } else if (editorContent[i].previous === id) {
            let newPrev = editorContent[i - 1].previous;
            let nextEl: Paragraph = editorContent.slice(i)[0];
            nextEl.previous = newPrev;
            nextEl.updated = true;
            editorCont.push(nextEl);
          } else {
            editorCont.push(editorContent.slice(i)[0]);
          }
        }
        setEditorContent(editorCont);
      }
      console.log("backspace pressed!");
    }
    // There has been a change to a specific field
  };

  function linkView() {
    setEditorView(false);
  }

  function shrink() {
    gsap.timeline().to(containerRef.current, {
      left: "10%",
      width: "75%",
      duration: 1,
      ease: Power3.easeInOut,
    });
  }

  function createParagraph(para: Paragraph) {
    let contents: string[] = para.contents.split(" ");
    if (contents.length > 1 && contents[0] === "#") {
      return (
        <div className={styles.viewerpara}>
          <h1>{para.contents}</h1>
        </div>
      );
    } else if (contents.length > 1 && contents[0] === "##") {
      return (
        <div className={styles.viewerpara}>
          <h2>{para.contents}</h2>
        </div>
      );
    } else if (contents.length > 1 && contents[0] === "###") {
      return (
        <div className={styles.viewerpara}>
          <h3>{para.contents}</h3>
        </div>
      );
    }
    return (
      <div id={para.id} className={styles.viewerpara}>
        <IconButton className={styles.manuallink}>
          <OpenInNewIcon/>
        </IconButton>
        {para.contents}
      </div>
    );
  }

  return (
    <div className={styles.NoteEditor}>
      <SideBar
        noteId={note_id}
        saveClick={updateNote}
        linkView={linkView}
        editorView={() => setEditorView(true)}
      />
      <NavigationBar />
      <Collapse in={alertOpen}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlertOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Request sent successfully!
        </Alert>
      </Collapse>
      <Container className={styles.container}>
        <div className={styles.title}>
          <h1>Now Editing: {note?.title}</h1>
        </div>
        <form>
          <Grid container ref={containerRef} className={styles.grid}>
            {/* View Mode */}
            {!editorView && (
              <Grid item container spacing={1} xs={12}>
                <Grid item container xs={9}>
                  <Grid item xs={12}>
                    {editorContent.map((el) => {
                      return createParagraph(el);
                    })}
                  </Grid>
                </Grid>
                <Grid item xs={3}>
                  <p>Test</p>
                </Grid>
              </Grid>
            )}
            {/* Editor View */}
            {editorView &&
              editorContent.map((el, index) => (
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
          </Grid>
        </form>
      </Container>
    </div>
  );
}
