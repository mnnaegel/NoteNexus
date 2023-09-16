import styles from "./NoteList.module.scss";
import Grid from "@mui/material/Grid"; // Grid version 1
import NoteCard from "../../components/NoteCard/NoteCard";
import NavigationBar from "@/components/Navigation/Navigation";
import { Button, Input, TextField } from "@mui/material";
import { useState } from "react";

const TestNotes = [
  {
    id: "note_id_1",
    name: "Note 1",
    summary: "This note is for testing",
  },
  {
    id: "note_id_2",
    name: "Note 2",
    summary: "This note is for testing",
  },
  {
    id: "note_id_3",
    name: "Note 3",
    summary: "This note is for testing",
  },
  {
    id: "note_id_4",
    name: "Note 4",
    summary: "This note is for testing",
  },
  {
    id: "note_id_5",
    name: "Note 5",
    summary: "This note is for testing",
  },
];

function NoteList() {
  const [newNoteName, setNewNoteName] = useState<string>("");
  return (
    <>
      <NavigationBar />
      <div className={styles.NoteList}>
        <div className={styles.NoteList__create}>
          <TextField
            className={styles.NoteList__create__input}
            label="New Note Name"
            variant="filled"
            value={newNoteName}
            InputProps={{ className: styles.NoteList__create__input }}
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              setNewNoteName(event.target.value);
            }}
          />

          <Button
            className={styles.NoteList__create__button}
            variant="contained"
            onClick={() => {
            }}
          >
            Create Note
          </Button>
        </div>
        <Grid container spacing={2} className={styles.NoteList__cardsContainer}>
          {TestNotes.map((note) => {
            // change to Note after
            return (
              <Grid item xs={12} sm={6} md={3} key={note.id}>
                <NoteCard note={note} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </>
  );
}

export default NoteList;
