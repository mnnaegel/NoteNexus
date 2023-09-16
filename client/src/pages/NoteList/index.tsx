import styles from "./NoteList.module.scss";
import Grid from "@mui/material/Grid"; // Grid version 1
import NoteCard from "../../components/NoteCard/NoteCard";
import NavigationBar from "@/components/Navigation/Navigation";
import { Button, Input, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

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
    summary:
      "This note is for testingThis note is for testingThis note is for testingThis note is for testingThis note is for testingThis note is for testingThis note is for testingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtestingtesting",
  },
];

function NoteList() {
  const [newNoteName, setNewNoteName] = useState<string>("");
  const { user } = useUser();
  useEffect(() => {
    axios
      .get("http://localhost:8080/users/abc")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  const onCreateNote = () => {
    const postData = {
      id: uuidv4(),
      title: newNoteName,
      content: "",
      author: user?.id,
    };

    // Define the Axios request configuration
    const axiosConfig = {
      method: "post",
      url: "http://localhost:8080/notes",
      headers: {
        "Content-Type": "application/json",
      },
      data: postData,
    };

    // Make the Axios POST request
    axios(axiosConfig)
      .then((response) => {
        // Handle the response if needed
        console.log("Response:", response.data);
      })
      .catch((error) => {
        // Handle errors if any
        console.error("Error:", error);
      });
  };

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
            sx={{ color: "#212922", backgroundColor: "#aef6c7" }}
            variant="contained"
            onClick={() => {
              onCreateNote();
            }}
            className={styles.NoteList__create__button}
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
