import Link from "next/link";
import * as React from "react";
import styles from "./Header.module.scss";

interface IHeaderProps {
  isNotLoggedIn?: boolean;
}
function Header({ isNotLoggedIn }: IHeaderProps) {
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
            className={styles.Header__navigationBar__item}
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
