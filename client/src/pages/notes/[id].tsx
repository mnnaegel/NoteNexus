import { Note } from "@/types/note.type";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const id = router.query.id;
  const [note, setNote] = useState<Partial<Note>>();

  useEffect(() => {
    if (!!id && typeof id === "string"){
      axios
      .get("http://localhost:8080/notes/" + id)
      .then((response) => {
        setNote(response.data.data);
        console.log(response,id);
      })
      .catch((error) => {
        console.error(error);
      })  
    }
  }, [id]);

  return (
    <div>
      <h1>{note?.title}</h1>
    </div>
  )
}
