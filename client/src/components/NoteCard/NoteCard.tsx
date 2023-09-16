import styles from "./NoteCard.module.scss";
import { Note } from "@/types/note.type";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import axios from "axios";

interface INoteCardProps {
  note: Partial<Note>;
  deleteNoteGivenId: (id: string) => void;
}

function NoteCard({ note, deleteNoteGivenId }: INoteCardProps) {
  const { push } = useRouter();
  const handleNoteCardClick = () => {
    push("/NoteList/" + note.id);
  };
  const [anchorElement, setAnchorElement] = useState(null);
  const handleClick = (event: any) => {
    setAnchorElement(event.currentTarget);
    event.stopPropagation();
  };
  const handleClose = (event: any) => {
    event.stopPropagation();
    setAnchorElement(null);
  };
  const handleRename = (event: any) => {
    event.stopPropagation();
    handleClose(event);
    // rename given note id?
  };
  const handleRemove = (event: any) => {
    event.stopPropagation();
    deleteNoteGivenId(note.id || "");
    handleClose(event);
  };
  const handleOpen = (event: any) => {
    // open given note id?
  };

  return (
    <div className={styles.Wrapper}>
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
            onClose={handleClose}
          >
            <MenuItem onClick={handleRename}>Rename</MenuItem>
            <MenuItem onClick={handleRemove}>Remove</MenuItem>
            <MenuItem onClick={handleOpen}>Open in new tab</MenuItem>
          </Menu>
        </div>
        <div className={styles.NoteCard__body}>{note.summary}</div>
      </div>
    </div>
  );
}

export default NoteCard;
