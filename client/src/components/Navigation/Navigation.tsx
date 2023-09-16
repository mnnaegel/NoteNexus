import Link from "next/link";
import * as React from "react";
import styles from "./Navigation.module.scss";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavigationBar() {
  const pages = [
    { name: "Home", href: "/" },
    { name: "Notes", href: "/NoteList" },
    { name: "LinkView", href: "/LinkView" },
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
