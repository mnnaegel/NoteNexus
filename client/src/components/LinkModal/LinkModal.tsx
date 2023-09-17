import { IconButton } from "@mui/material";
import styles from "./LinkModal.module.scss";
import classnames from "classnames";
import SaveIcon from "@mui/icons-material/Save";
import ClassIcon from "@mui/icons-material/Class";
import CreateIcon from "@mui/icons-material/Create";
import { useEffect, useRef } from "react";
import { gsap, Power3 } from "gsap";
import { useRouter } from "next/router";

export type Props = {
  className?: string;
  open: boolean;
  data: any;
};

function LinkModal({ className, open, data }: Props) {
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    console.log("state change");
    if (open) {
      gsap
        .timeline()
        .to(modalRef.current, {
          right: "0%",
          duration: 1,
          ease: Power3.easeInOut,
        });
    } else {
      gsap
        .timeline()
        .to(modalRef.current, {
          right: "-50%",
          duration: 1,
          ease: Power3.easeInOut,
        });
    }
  }, [open]);

  function linkView() {
    if (data === null) {
      return <h1>Select a paragraph to view the links for</h1>;
    } else {
      <div>
        {data.paragraphs.map((el: any) => {
          console.log(el);
          return <p>{el.contents}</p>;
        })}
      </div>;
    }
  }

  function switchToNote(noteId: string) {
    localStorage.setItem("noteId", noteId)
    router.push("/notes/");
    
    // router.push("/notes/" + noteId);
  }

  return (
    <div ref={modalRef} className={classnames(styles.LinkModal, className)}>
      <h2>Links in Text</h2>
      <p>We found these notes that might be close to this!</p>
      {data === null && <p>Click on the link to find similar notes</p>}
      {!(data === null) &&
        data.paragraphs.slice(0, 8).map((el: any) => {
          if (el.contents === "") {
            return;
          }
          return (
            <div
              onClick={() => switchToNote(el.id)}
              className={styles.externallink}
            >
              {el.contents}
            </div>
          );
        })}
    </div>
  );
}

export default LinkModal;
