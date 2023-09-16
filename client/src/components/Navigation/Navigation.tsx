import Link from "next/link";
import * as React from "react";

function NavigationBar() {
  const pages = [
    { name: "Home", href: "/" },
    { name: "Notes", href: "/NoteList" },
    { name: "LinkView", href: "/LinkView" },
    { name: "Editor", href: "/NoteEditor" },
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
