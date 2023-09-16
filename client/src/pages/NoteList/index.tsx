import styles from "./NoteList.module.scss";
import Grid from "@mui/material/Grid"; // Grid version 1
import NoteCard from "../../components/NoteCard/NoteCard";
import NavigationBar from "@/components/Navigation/Navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { Note } from "@/types/note.type";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";

function NoteList() {
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm();
  const [notes, setNotes] = useState<Array<Partial<Note>>>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/notes/users/" + user?.id)
      .then((response) => {
        setNotes(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  const onCreateNote = (data: any) => {
    const postData = {
      id: uuidv4(),
      title: data.newNoteName,
      summary: "",
      author: user?.id,
    } as Partial<Note>;

    const axiosConfig = {
      method: "post",
      url: "http://localhost:8080/notes",
      headers: {
        "Content-Type": "application/json",
      },
      data: postData,
    };

    axios(axiosConfig)
      .then((response) => {
        console.log("Response:", response.data);
        setNotes([...(notes || []), postData as Partial<Note>]);
        reset();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const deleteNoteGivenId = (id: string) => {
    axios
      .delete("http://localhost:8080/notes/" + id)
      .then(() => {
        setNotes((notes) => {
          return notes.filter((note) => {
            return note.id !== id;
          });
        });
        return;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const updateNote = (data: Partial<Note>) => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .patch("http://localhost:8080/notes/" + data.id, data, {
        headers,
      })
      .then((response) => {
        setNotes([
          ...(notes.map((note) => {
            if (note.id === data.id) {
              return data;
            }
            return note;
          }) || []),
        ]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <NavigationBar />
      <div className={styles.NoteList}>
        <form
          className={styles.NoteList__create}
          onSubmit={handleSubmit(onCreateNote)}
        >
          <div className={styles.NoteList__create__wrapper}>
            <input
              className={styles.NoteList__create__input}
              placeholder="Start a new note"
              {...register("newNoteName", {
                required: true,
                maxLength: 30,
              })}
            />
            <button className={styles.NoteList__create__submit} type="submit">
              <AddIcon />
            </button>
          </div>
        </form>

        <Grid container spacing={2} className={styles.NoteList__cardsContainer}>
          {notes && notes.length > 0 ? (
            notes.map((note) => {
              console.log("note:", note);
              // change to Note after
              return (
                <Grid item xs={12} sm={6} md={3} key={note.id}>
                  <NoteCard
                    note={note}
                    deleteNoteGivenId={deleteNoteGivenId}
                    updateNote={updateNote}
                  />
                </Grid>
              );
            })
          ) : (
            <div className={styles.NoteList__noNotes}>Create a New Note!</div>
          )}
        </Grid>
      </div>
    </>
  );
}

export default NoteList;
