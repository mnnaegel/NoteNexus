import styles from "./NoteList.module.scss";
import Grid from "@mui/material/Grid"; // Grid version 1
import NoteCard from "../../components/NoteCard/NoteCard";
import NavigationBar from "@/components/Navigation/Navigation";

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
];

function NoteList() {
  return (
    <>
      <NavigationBar />
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
    </>
  );
}

export default NoteList;
