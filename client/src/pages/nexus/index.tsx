import styles from "./LinkView.module.scss";
import { Note } from "@/types/note.type";
import ForceGraph, { Link, Node } from "@/components/Graph/ForceGraph";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Paragraph } from "@/types/paragraph.type";

function LinkView() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      axios
        .get(
          "http://localhost:8080/notes/users/user_2VUQ9LhYmfF3smchWbZZhrV63fu"
        )
        .then((response) => {
          // parse response.data as Note[]
          const notes: Note[] = response.data;
          return axios.post('http://localhost:5000/get_paragraphs', {
            note_ids: notes
          });
          const paragraphs: Node[] = notes.map((note, i) => {
            return {
              noteId: note.id,
              id: i,
            };
          });

          setNodes(paragraphs);
        })
        .catch((error) => {
          console.error("There was an error!", error); // Handle the error here
        });
    }
  }, [isLoaded, isSignedIn, nodes.length]);

  useEffect(() => {
    console.log(nodes)
    // query for links
    const url = "http://localhost:5000/get_paragraphs";
    let links = [];
    const data = nodes.map((node) => {
      return {
        noteId: node.noteId,
      };
    });
    const wrappedData = { note_ids: data };
    
    // for each noteid, get the related paragraphs
    axios
    .post(url, wrappedData)
    .then((response) => {
      console.log('wrapped data', wrappedData);
    })
    .catch((error) => {
      console.error("There was an error!", error); // Handle the error here
    });
  }, [nodes]);


  
  return (
    <div className="App">
      <ForceGraph nodes={nodes} links={links} />
    </div>
  );
}

export default LinkView;
