import styles from "./LinkView.module.scss";

const TestNotes = [
  {
    id: "123",
    name: "Note 1",
    summary: "This note is for testing",
  },
  {
    id: "123",
    name: "Note 2",
    summary: "This note is for testing",
  },
  {
    id: "123",
    name: "Note 3",
    summary: "This note is for testing",
  },
];

function LinkView() {
  return (
    // change later to graph or something
    <div className={styles.LinkView}>
      {TestNotes.map((note) => {
        return <div key={note.id}>{note.id}</div>;
      })}
    </div>
  );
}

export default LinkView;
