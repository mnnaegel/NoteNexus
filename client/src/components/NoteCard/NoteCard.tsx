import styles from "./NoteCard.module.scss";
import { Note } from "@/types/note.type";
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Card from "@mui/material/Card";

interface INoteCardProps {
  note: Partial<Note>;
}

function NoteCard({ note }: INoteCardProps) {
  const router = useRouter();

  const onNoteCardClick = () => {
    router.push("/" + note.id);
  };
  return (
    <Card
      className={styles.NoteCard}
      sx={{ maxWidth: 345 }}
      onClick={() => {
        onNoteCardClick();
      }}
    >
      <CardHeader title={note.name} subheader={note.summary} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Test content for the note card
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Go to note</Button>
      </CardActions>
    </Card>
  );
}

export default NoteCard;
