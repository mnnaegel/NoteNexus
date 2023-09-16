import styles from "./NoteCard.module.scss";
import { Note } from "@/types/note.type";
import { IconButton, Menu, MenuItem, Modal } from "@mui/material";
import { useRouter } from "next/router";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface INoteCardProps {
  note: Partial<Note>;
  deleteNoteGivenId: (id: string) => void;
  updateNote: (data: Partial<Note>) => void;
}

function NoteCard({ note, deleteNoteGivenId, updateNote }: INoteCardProps) {
  const { push } = useRouter();
  const [renameModalOpen, setRenameModalOpen] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();

  const handleNoteCardClick = () => {
    push("/notes/" + note.id);
  };
  const [anchorElement, setAnchorElement] = useState(null);
  const handleClick = (event: any) => {
    setAnchorElement(event.currentTarget);
    event.stopPropagation();
  };
  const handleCloseOptions = (event: any) => {
    event.stopPropagation();
    setAnchorElement(null);
  };
  const handleRenameOpen = (event: any) => {
    event.stopPropagation();
    setRenameModalOpen(true);
  };
  const onRenameNote = (data: any, event: any) => {
    updateNote({
      id: note.id,
      title: data.newNoteTitle,
      summary: note.summary || "",
      author: note.author,
    });
    handleCloseOptions(event);
    setRenameModalOpen(false);
  };
  const handleDeleteNote = (event: any) => {
    event.stopPropagation();
    deleteNoteGivenId(note.id || "");
    handleCloseOptions(event);
  };
  const handleOpenNote = (event: any) => {
    // open given note id?
  };

  return (
    <div className={styles.Wrapper}>
      <Modal
        open={renameModalOpen}
        onClose={() => {
          setRenameModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form
          // className={styles.NoteList__create}
          onSubmit={handleSubmit(onRenameNote)}
        >
          <input
            className={styles.NoteList__create__input}
            placeholder="Start a new note"
            {...register("newNoteTitle", {
              required: true,
              maxLength: 30,
            })}
          />
          <button className={styles.NoteList__create__submit} type="submit">
            Rename
          </button>
        </form>
      </Modal>
      <div className={styles.NoteCard} onClick={handleNoteCardClick}>
        <div className={styles.NoteCard__top}>
          {note.title}
          <IconButton
            aria-controls="overflow-menu"
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="overflow-menu"
            anchorEl={anchorElement}
            open={!!anchorElement}
            onClose={handleCloseOptions}
          >
            <MenuItem onClick={handleRenameOpen}>Rename</MenuItem>
            <MenuItem onClick={handleDeleteNote}>Remove</MenuItem>
            <MenuItem onClick={handleOpenNote}>Open in new tab</MenuItem>
          </Menu>
        </div>
        <div className={styles.NoteCard__body}>{note.summary}</div>
      </div>
    </div>
  );
}

export default NoteCard;
