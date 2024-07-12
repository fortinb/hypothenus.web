"use client"

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FormEventHandler, MouseEventHandler, ReactEventHandler } from 'react';

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
    <div className="container">
      <div className="row gx-2">
        <div className="col-md-2">
          <Button className="btn btn-primary ms-0" type="button" variant="primary" onClick={onFirstPage} disabled={page == 1}><i className="bi bi-skip-start me-2" />First page</Button>
        </div>
        <div className="col-md-3">
          <Form as="form" className="d-flex justify-content-start" role="search" id="paging-navigation-search-form" onSubmit={onSearch}>
            <Form.Control type="search" placeholder="Search" name="searchCriteria"  aria-label="Search"
              onInput={onSearchInput} />
          </Form>
        </div>
        <div className="col-md-2">
          <Button className="btn btn-primary" type="submit" form="paging-navigation-search-form" variant="primary">Search<i className="bi bi-search ms-2" /></Button>
        </div>
        <div className="col-md-3 d-flex justify-content-end">
          <Button className="btn btn-primary" type="button" variant="primary" onClick={onPreviousPage}
            disabled={page <= 1}><i className="bi bi-rewind-btn me-2" />Previous page</Button>
        </div>
        <div className="col-md-2">
          <Button className="btn btn-primary" type="button" variant="primary" onClick={onNextPage}
            disabled={page >= totalPages}>Next page<i className="bi bi-fast-forward-btn ms-2" /></Button>
        </div>
      </div>
      <div className="row m-0 p-0">
        <div className="col-md-3">
          <span className="text-primary align-middle">page {page} of {totalPages == 0 ? "..." : totalPages}</span>
        </div>
      </div>
    </div>
  );
}
