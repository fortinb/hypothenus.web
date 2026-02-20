
import NavbarBreadcrumb from "../navigation/navbar-breadcrumb";
import NavbarMenu from "../navigation/navbar-menu";


export default async function Header({ lang }: { lang: string }) {
  return (
    <div>
      <header className="navbar shadow sticky-top p-0">
        <NavbarMenu lang={lang} />
      </header>
      <div className="d-flex flex-row justify-content-start ms-5">
        <NavbarBreadcrumb />
      </div>
    </div>
  );
}
