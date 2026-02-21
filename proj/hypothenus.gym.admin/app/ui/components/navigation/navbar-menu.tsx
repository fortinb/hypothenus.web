"use client";
import Image from 'next/image';
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import SigninButton from "./signin-button";
import LanguageButton from "./language-button";
import MemberMenu from "./member-menu";
import { useTranslations } from "next-intl";
import AdminButton from "./admin-button";
import { Authorize } from "../security/authorize";

export default function NavbarMenu({ lang }: { lang: string }) {
  const t = useTranslations("layout");

  return (

    <Navbar expand="lg" className="container-xxl bd-gutter flex-wrap flex-lg-nowrap" >
      <Container className="container-fluid">
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">

          <div className="d-flex flex-row align-items-center w-100">
            <div className="d-flex flex-column align-items-start w-50">
              <Nav className="mb-2 mb-lg-0">
                <div className="mt-2 mt-lg-0 me-2">
                  <Nav.Link as={Link} className="nav-link-img p-2" href={`/${lang}`}>
                    <Image src="/images/logo_transparent.png"
                      width={86}
                      height={32}
                      alt="Hypothenus"></Image>
                  </Nav.Link>
                </div>
                <div className="d-flex align-items-center">
                  <Authorize roles="member">
                    <MemberMenu lang={lang} />
                  </Authorize>
                </div>
              </Nav>
            </div>
            <div className="d-flex flex-column align-items-center w-50">
              <div className="d-flex flex-row justify-content-end w-100">
                <div className="me-2">
                 <Authorize roles={["admin", "manager"]}>
                   <AdminButton lang={lang} />
                 </Authorize>
                </div>
                <div className="me-2">
                  <SigninButton lang={lang} />
                </div>
                <div className="me-2">
                  <LanguageButton lang={lang} />
                </div>
              </div>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}