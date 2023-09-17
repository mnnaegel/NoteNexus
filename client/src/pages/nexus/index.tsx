import styles from "./LinkView.module.scss";
import { Note } from "@/types/note.type";
import ForceGraph from "@/components/Graph/ForceGraph";

function LinkView() {
  const data = {
    nodes: [
      { id: 1, noteId: 1 },
      { id: 2, noteId: 2 },
    ],
    links: [{ source: 1, target: 2 }],
  };

  return (
    <div className="App">
      <ForceGraph nodes={data.nodes} links={data.links} />
    </div>
  );
}

export default LinkView;
