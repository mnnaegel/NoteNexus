import Link from "next/link";
import * as React from "react";
import styles from "./Navigation.module.scss";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

interface INavigationBarProps {
  isNotLoggedIn?: boolean;
}
function NavigationBar({ isNotLoggedIn }: INavigationBarProps) {
  const unauthenticatedPages = [{ name: "Home", href: "/" }];
  const authenticatedPages = [
    { name: "Notes", href: "/notes" },
    { name: "LinkView", href: "/links" },
    { name: "Editor", href: "/NoteEditor" },
  ];
  return isNotLoggedIn ? (
    <div className={styles.NavigationBar}>
      {unauthenticatedPages.map((page) => (
        <Link href={page.href} key={page.name}>
          {page.name}
        </Link>
      ))}
    </div>
  ) : (
    <div className={styles.NavigationBar}>
      {authenticatedPages.map((page) => (
        <Link href={page.href} key={page.name}>
          {page.name}
        </Link>
      ))}
    </div>
  );
}
export default NavigationBar;
