"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { SearchState, setSearchCriteria } from "../../store/slices/searchSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks/useStore";

export default function NavbarMenu() {

  const searchState: SearchState = useSelector((state: any) => state.search?.value);
  const dispatch = useAppDispatch();

  function search(formData: FormData) {
    const searchCriteria = formData.get("searchCriteria");
    if (searchCriteria) {
      dispatch(setSearchCriteria(searchCriteria?.toString()));
    }
  }
 
   return (
    <Navbar expand="lg" className="container-xxl bd-gutter flex-wrap flex-lg-nowrap" >
      <Container className="container-fluid">
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent">
          <div className="w-100 d-flex justify-content-between">
            <div>
              <Nav className="mb-2 mb-lg-0">
                <div className="mt-2 mt-lg-0 me-2">
                  <img src="/images/logo_small.png"></img>
                </div>
                <Nav.Link as={Link} href="/">Home</Nav.Link>
                <Nav.Link as={Link} href="/gyms">Gyms</Nav.Link>
              </Nav>
            </div>
            <div>
              <Form as="form" className="d-flex" role="search" action={search}>
                <Form.Control type="search" placeholder="Search"  name="searchCriteria" defaultValue="" aria-label="Search" disabled={!searchState.active}/>
                <Button className="ms-2" type="submit" variant="primary" disabled={!searchState.active}>Search</Button>
              </Form>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}
