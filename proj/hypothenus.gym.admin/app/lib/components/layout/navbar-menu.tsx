"use client";

import Link from "next/link";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function NavbarMenu() {
  
   return (
    <Navbar expand="lg" className="container-xxl bd-gutter flex-wrap flex-lg-nowrap" >
      <Container className="container-fluid">
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <div className="w-100 d-flex justify-content-between">
            <div>
              <Nav className="mb-2 mb-lg-0">
                <div className="mt-2 mt-lg-0 me-2">
                  <img src="/images/logo_small_blue.png"></img>
                </div>
                <Nav.Link as={Link} href="/">Home</Nav.Link>
                <Nav.Link as={Link} href="/gyms">Gyms</Nav.Link>
              </Nav>
            </div>
            <div>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
