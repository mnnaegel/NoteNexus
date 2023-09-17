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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
        <form onSubmit={handleSubmit(onRenameNote)} className={styles.Modal}>
          <div className={styles.Modal__wrapper}>
            <span className={styles.Modal__title}>Rename</span>
            <div className={styles.Modal__body}>Please enter a new name</div>
            <input
              className={styles.Modal__input}
              placeholder="My Note..."
              {...register("newNoteTitle", {
                required: { value: true, message: "Required" },
                maxLength: 30,
              })}
            />
            <div className={styles.Modal__buttons}>
              <span className={styles.Modal__input__errors}>
                {errors.newNoteTitle && "Please rename your note"}
              </span>

              <button
                className={styles.Modal__buttons__cancel}
                onClick={() => {
                  setRenameModalOpen(false);
                }}
              >
                Cancel
              </button>
              <button className={styles.Modal__buttons__submit} type="submit">
                OK
              </button>
            </div>
          </div>
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
