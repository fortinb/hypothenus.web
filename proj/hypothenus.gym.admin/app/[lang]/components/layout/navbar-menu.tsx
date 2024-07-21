"use client";

import { changeLanguage, useTranslation } from "@/app/i18n/i18n";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Image from 'next/image';
import { useParams } from "next/navigation";

export default function NavbarMenu() {
  const params = useParams<{ lang: string }>();
  const { t } = useTranslation(params.lang);

  return (
    <Navbar expand="lg" className="container-xxl bd-gutter flex-wrap flex-lg-nowrap" >
      <Container className="container-fluid">
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <div className="d-flex justify-content-between align-items-center w-100 ">
            <div>
              <Nav className="mb-2 mb-lg-0">
                <div className="mt-2 mt-lg-0 me-2">
                  <Nav.Link as={Link} className="nav-link-img p-2" href="/">
                    <Image src="/images/logo_small_blue.png" 
                      width={86}
                      height={32} 
                      alt="Hypothenus"></Image>
                  </Nav.Link>
                </div>
                <Nav.Link as={Link} href="/gyms">{t("navbar.gyms.title")}</Nav.Link>
              </Nav>
            </div>
            <div>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {t("navbar.language.title")}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => changeLanguage("en")}>{t("navbar.language.en")}</Dropdown.Item>
                  <Dropdown.Item onClick={() => changeLanguage("fr")}>{t("navbar.language.fr")}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
/*
   <Button onClick={() => changeLanguage(i18n.resolvedLanguage === "fr" ? "en" : "fr")}>{i18n.resolvedLanguage === "fr" ? "EN" : "FR"}</Button>
*/