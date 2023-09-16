import Link from "next/link";
import * as React from "react";
import styles from "./Navigation.module.scss";

function NavigationBar() {
  const pages = [
    { name: "Home", href: "/" },
    { name: "Notes", href: "/NoteList" },
    { name: "LinkView", href: "/LinkView" },
    { name: "Editor", href: "/NoteEditor" },
  ];
  return (
    <div className={styles.NavigationBar}>
      {pages.map((el) => (
        <Link href={el.href} key={el.name}>
          {el.name}
        </Link>
      ))}
    </div>
  );
}
export default NavigationBar;
