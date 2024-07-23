"use client"

import { useTranslation } from "@/app/i18n/i18n";
import { FormEventHandler, MouseEventHandler, ReactEventHandler } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

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
  const { t } = useTranslation("navigation");
  
  return (
    <Container >
      <Row className="gx-2">
        <Col xl={2} >
          <Button className="btn btn-primary ms-0" type="button" variant="primary" onClick={onFirstPage} disabled={page == 1}><i className="bi bi-skip-start me-2" />{t("paging.buttons.first")}</Button>
        </Col>
        <Col sm="auto" xxl={3} >
          <Form as="form" className="d-flex justify-content-start" role="search" id="paging-navigation-search-form" onSubmit={onSearch}>
            <Form.Control type="search" placeholder={t("paging.search.placeholder")} name="searchCriteria" aria-label="Search"
              onInput={onSearchInput} />
          </Form>
        </Col>
        <Col sm="auto" xxl={2} >
          <Button className="btn btn-primary" type="submit" form="paging-navigation-search-form" variant="primary">{t("paging.search.buttons.search")}<i className="bi bi-search ms-2" /></Button>
        </Col>
        <Col sm="auto" xxl={3} className="d-flex justify-content-end">
          <Button className="btn btn-primary" type="button" variant="primary" onClick={onPreviousPage}
            disabled={page <= 1}><i className="bi bi-rewind-btn me-2" />{t("paging.buttons.previous")}</Button>
        </Col>
        <Col sm="auto" xxl={2} >
          <Button className="btn btn-primary" type="button" variant="primary" onClick={onNextPage}
            disabled={page >= totalPages}>{t("paging.buttons.next")}<i className="bi bi-fast-forward-btn ms-2" /></Button>
        </Col>
      </Row>
      <Row className="m-0 p-0">
        <Col >
          <span className="text-primary align-middle">{t("paging.page")} {page} {t("paging.pageOf")} {totalPages == 0 ? "..." : totalPages}</span>
        </Col>
      </Row>
    </Container>
  );
}
