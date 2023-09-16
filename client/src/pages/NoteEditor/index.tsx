import NavigationBar from "@/components/Navigation/Navigation";
import { Container, TextField } from "@mui/material";
import { useState } from "react";

function NoteEditor() {
  const [editorContent, setEditorContent] = useState([{ key: 0, text: "" }]);
  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      setEditorContent([
        ...editorContent,
        { key: editorContent.length, text: "" },
      ]);
      console.log("enter press here! ");
    }
  };
  return (
    <>
      <NavigationBar />
      <Container>
        <h1>Note Editor</h1>
        <form>
          {editorContent.map((el) => (
            <textarea
              autoFocus
              key={el.key}
              value={el.text}
              onChange={(e) => {
                let editorCont = editorContent.map((editor, index) => {
                  if (index !== el.key) {
                    return editor
                  }
                  else {
                    return {key: el.key, text: e.target.value}
                  }

                })
                console.log(editorContent)
                setEditorContent(editorCont)
              }}
              onKeyDown={handleKeyPress}
            />
          ))}
        </form>
      </Container>
    </>
  );
}

export default NoteEditor;
