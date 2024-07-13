"use client"

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FormEventHandler, MouseEventHandler, ReactEventHandler } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function PagingNavigation(
  { page,
    totalPages,
    onNextPage,
    onPreviousPage,
    onFirstPage,
    onSearch,
    onSearchInput }
    :
    {
      page: number,
      totalPages: number,
      onNextPage: MouseEventHandler<HTMLButtonElement>,
      onPreviousPage: MouseEventHandler<HTMLButtonElement>,
      onFirstPage: MouseEventHandler<HTMLButtonElement>,
      onSearch: FormEventHandler<HTMLFormElement>,
      onSearchInput: ReactEventHandler<HTMLInputElement>
    }
) {
  return (
    <Container >
      <Row className="gx-2">
        <Col xl={2} >
          <Button className="btn btn-primary ms-0" type="button" variant="primary" onClick={onFirstPage} disabled={page == 1}><i className="bi bi-skip-start me-2" />First page</Button>
        </Col>
        <Col sm="auto" xxl={3} >
          <Form as="form" className="d-flex justify-content-start" role="search" id="paging-navigation-search-form" onSubmit={onSearch}>
            <Form.Control type="search" placeholder="Search" name="searchCriteria" aria-label="Search"
              onInput={onSearchInput} />
          </Form>
        </Col>
        <Col sm="auto" xxl={2} >
          <Button className="btn btn-primary" type="submit" form="paging-navigation-search-form" variant="primary">Search<i className="bi bi-search ms-2" /></Button>
        </Col>
        <Col sm="auto" xxl={3} className="d-flex justify-content-end">
          <Button className="btn btn-primary" type="button" variant="primary" onClick={onPreviousPage}
            disabled={page <= 1}><i className="bi bi-rewind-btn me-2" />Previous page</Button>
        </Col>
        <Col sm="auto" xxl={2} >
          <Button className="btn btn-primary" type="button" variant="primary" onClick={onNextPage}
            disabled={page >= totalPages}>Next page<i className="bi bi-fast-forward-btn ms-2" /></Button>
        </Col>
      </Row>
      <Row className="m-0 p-0">
        <Col >
          <span className="text-primary align-middle">page {page} of {totalPages == 0 ? "..." : totalPages}</span>
        </Col>
      </Row>
    </Container>
  );
}
