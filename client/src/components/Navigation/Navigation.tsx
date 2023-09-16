import Link from "next/link";
import * as React from "react";
const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavigationBar() {
  const pages = [
    { name: "Home", href: "/" },
    { name: "Notes", href: "/NoteList" },
    { name: "LinkView", href: "/LinkView" },
  ];
  return (
    <div>
      {pages.map((el) => (
        <Link href={el.href}>{el.name}</Link>
      ))}
    </div>
  );
}
export default NavigationBar;
