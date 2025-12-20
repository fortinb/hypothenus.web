
import NavBreadcrumb from "../navigation/breadcrumb";
import NavbarMenu from "../navigation/navbar-menu";

export default function Header() {
  return (
    <div>
      <header className="navbar shadow sticky-top p-0">
        <NavbarMenu />
      </header>
      <div className="d-flex flex-row justify-content-start ms-5">
        <NavBreadcrumb />
      </div>
    </div>
  );
}
