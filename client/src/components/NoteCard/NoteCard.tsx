import styles from "./NoteCard.module.scss";
import { Note } from "@/types/note.type";
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

interface INoteCardProps {
  note: Partial<Note>;
}

function NoteCard({ note }: INoteCardProps) {
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
    handleClose(event);
    // rename given note id?
  };
  const handleRemove = (event: any) => {
    handleClose(event);
    // remove given note id?
  };
  const handleOpen = (event: any) => {
    // open given note id?
  };
  return (
    <div className={styles.Wrapper}>
      <div className={styles.NoteCard} onClick={handleNoteCardClick}>
        <div className={styles.NoteCard__top}>
          {note.name}
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
