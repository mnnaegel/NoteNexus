import styles from "./NoteList.module.scss";
import Grid from "@mui/material/Grid"; // Grid version 1
import NoteCard from "../../components/NoteCard/NoteCard";

const TestNotes = [
  {
    id: "123",
    name: "Note 1",
    summary: "This note is for testing",
  },
  {
    id: "123",
    name: "Note 2",
    summary: "This note is for testing",
  },
  {
    id: "123",
    name: "Note 3",
    summary: "This note is for testing",
  },
];

function NoteList() {
  return (
    <div className={styles.NoteList}>
      <Grid container spacing={2}>
        {TestNotes.map((note) => {
          // change to Note after
          return (
            <Grid item xs={8} key={note.id}>
              <NoteCard note={note} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default NoteList;
