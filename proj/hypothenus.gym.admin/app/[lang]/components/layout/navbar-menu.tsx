"use client";

import { changeLanguage, useTranslation } from "@/app/i18n/i18n";
import Image from 'next/image';
import Link from "next/link";
import { useParams, usePathname, useRouter } from 'next/navigation';
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function NavbarMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ lang: string }>();
  const { t } = useTranslation("layout");

  function languageRedirect(languageRequested: string) {
   
    if (!pathname.startsWith(`/${params.lang}`)) {
      return;
    }

    changeLanguage(languageRequested);
    router.push(pathname.replace(params.lang, languageRequested));
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
                <Dropdown.Toggle id="navbar-languages-dropdown">
                  {t("navbar.language.title")}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => languageRedirect("en")}>
                      {t("navbar.language.en")}
                      {params.lang=="en" &&
                        <i className="bi bi-check"></i>
                      }
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => languageRedirect("fr")}>
                    {t("navbar.language.fr")}
                    {params.lang=="fr" &&
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