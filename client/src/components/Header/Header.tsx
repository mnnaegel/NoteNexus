import Link from "next/link";
import * as React from "react";
import styles from "./Header.module.scss";
import { usePathname } from "next/navigation";

interface IHeaderProps {
  isNotLoggedIn?: boolean;
}
function Header({ isNotLoggedIn }: IHeaderProps) {
  const pathname = usePathname();
  const allowedPages = isNotLoggedIn
    ? [{ name: "Home", href: "/" }]
    : [
        { name: "Notes", href: "/notes" },
        { name: "LinkView", href: "/links" },
      ];

  return (
    <div className={styles.Header}>
      <div className={styles.Header__navigationBar}>
        {allowedPages.map((page) => {
          const isActive = pathname?.startsWith(page.href);
          return (
            <Link
              className={
                styles[
                  `Header__navigationBar__item${isActive ? "--active" : ""}`
                ]
              }
              href={page.href}
              key={page.name}
            >
              {page.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
export default Header;
