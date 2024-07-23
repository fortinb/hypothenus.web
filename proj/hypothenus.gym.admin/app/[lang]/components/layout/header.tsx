"use client"

import NavbarMenu from "./navbar-menu";

export default function Header({lang}: {lang: string}) {
  return (
    <header className="navbar navbar-expand-lg bd-navbar shadow sticky-top border border-2">
      <NavbarMenu />
    </header>
  );
}
