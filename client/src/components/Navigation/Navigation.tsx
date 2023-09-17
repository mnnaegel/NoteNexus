import Link from "next/link";
import * as React from "react";
import styles from "./Navigation.module.scss";

interface INavigationBarProps {
  isNotLoggedIn?: boolean;
}
function Header({ isNotLoggedIn }: INavigationBarProps) {
  const allowedPages = isNotLoggedIn
    ? [{ name: "Home", href: "/" }]
    : [
        { name: "Notes", href: "/notes" },
        { name: "LinkView", href: "/links" },
        { name: "Editor", href: "/NoteEditor" },
      ];

  return (
    <div className={styles.Header}>
      <div className={styles.Header__navigationBar}>
        {allowedPages.map((page) => (
          <Link
            className={styles.NavigationBar__item}
            href={page.href}
            key={page.name}
          >
            {page.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
export default Header;
