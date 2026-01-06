"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from 'next/image';
import Link from "next/link";
import { useParams } from 'next/navigation';
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function NavbarMenu() {
  const params = useParams<{ lang: string }>();
  const t = useTranslations("layout");
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(language: string) {

    router.push(`/${language}${pathname.substring(3)}`);
  }

  return (
    <Navbar expand="lg" className="container-xxl bd-gutter flex-wrap flex-lg-nowrap" >
      <Container className="container-fluid">
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <div className="d-flex justify-content-between align-items-center w-100 ">
            <div>
              <Nav className="mb-2 mb-lg-0">
                <div className="mt-2 mt-lg-0 me-2">
                  <Nav.Link as={Link} className="nav-link-img p-2" href={`/${params.lang}`}>
                    <Image src="/images/logo_transparent.png"
                      width={86}
                      height={32}
                      alt="Hypothenus"></Image>
                  </Nav.Link>
                </div>
                <div className="d-flex align-items-center">
                  <Nav.Link as={Link} href={`/${params.lang}/admin/brands`}>{t("navbar.brands.title")}</Nav.Link>
                </div>
              </Nav>
            </div>
            <div>
              <Dropdown>
                <Dropdown.Toggle id="navbar-languages-dropdown">
                  {t("navbar.language.title")}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => changeLanguage("en")}>
                    {t("navbar.language.en")}
                    {params.lang == "en" &&
                      <i className="bi bi-check"></i>
                    }
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLanguage("fr")}>
                    {t("navbar.language.fr")}
                    {params.lang == "fr" &&
                      <i className="bi bi-check"></i>
                    }
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}