import Link from "next/link";
import * as React from "react";
import styles from "./Header.module.scss";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import logo from "../../assets/temporaryLogo.png";
import Image from "next/image";

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
      <Link
        className={styles.Header__logo}
        href={isNotLoggedIn ? "/" : "/notes"}
      >
        <Image src={logo} alt="logo" height={50} width={50} />
      </Link>

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
      <UserButton />
    </div>
  );
}
export default Header;
