import styles from "./NoteList.module.scss";
import Grid from "@mui/material/Grid"; // Grid version 1
import NoteCard from "../../components/NoteCard/NoteCard";
import NavigationBar from "@/components/Header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { Note } from "@/types/note.type";
import { useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import logo from "../../assets/temporaryLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";

function NoteList() {
  const { user } = useUser();
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [notes, setNotes] = useState<Array<Partial<Note>>>([]);
  const [filter, setFilter] = useState<string>("");
  const [filteredNotes, setFilteredNotes] = useState<Array<Partial<Note>>>([]);

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
        setNotes([...(notes || []), postData as Partial<Note>]);
        push("/notes/" + postData.id);
        console.log("notes:", notes);
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
  const getFilteredNotes = (text: string) => {
    // use brian's api to get the filtered notes
    setFilteredNotes(notes);
  };
  useEffect(() => {
    getFilteredNotes("");
    if (localStorage.getItem("noteId") !== null) {
      let item = localStorage.getItem("noteId");
      localStorage.clear();
      push("/notes/"+item)
    }
  }, []);
  return (
    <>
      <NavigationBar />
      <div className={styles.NoteList}>
        <div className={styles.NoteList__top}>
          <div className={styles.NoteList__filter}>
            <div className={styles.NoteList__filter__wrapper}>
              <input
                className={styles.NoteList__filter__input}
                type="filter"
                placeholder="Filter"
                value={filter}
                onChange={(e) => {
                  return setFilter(e.target.value);
                }}
              />
              <button className={styles.NoteList__filter__search}>
                <SearchIcon />
              </button>
            </div>
          </div>

          <form
            className={styles.NoteList__create}
            onSubmit={handleSubmit(onCreateNote)}
          >
            <span className={styles.NoteList__create__input__errors}>
              {errors.newNoteName && "Please name your note"}
            </span>
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
        </div>
        {notes && notes.length > 0 ? (
          <Grid
            container
            spacing={2}
            className={styles.NoteList__cardsContainer}
          >
            {notes.map((note) => {
              return (
                <Grid item xs={12} sm={6} md={3} key={note.id}>
                  <NoteCard
                    note={note}
                    deleteNoteGivenId={deleteNoteGivenId}
                    updateNote={updateNote}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <div className={styles.NoteList__noNotes}>
            <p className={styles.NoteList__noNotes__header}>
              No notes have been found!
            </p>
            <Image src={logo} alt="logo" height={160} width={160} />
          </div>
        )}
      </div>
    </>
  );
}

export default NoteList;
