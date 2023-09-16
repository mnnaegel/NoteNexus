import NavigationBar from "@/components/Navigation/Navigation";
import styles from "./LinkView.module.scss";

const TestNotes = [
  {
    id: "note_id_1",
    name: "Note 1",
    summary: "This note is for testing",
  },
  {
    id: "note_id_2",
    name: "Note 2",
    summary: "This note is for testing",
  },
  {
    id: "note_id_3",
    name: "Note 3",
    summary: "This note is for testing",
  },
];

function LinkView() {
  return (
    // change later to graph or something
    <>
      <NavigationBar />
      <div className={styles.LinkView}>
        {TestNotes.map((note) => {
          return <div key={note.id}>{note.id}</div>;
        })}
      </div>
    </>
  );
}

export default LinkView;
