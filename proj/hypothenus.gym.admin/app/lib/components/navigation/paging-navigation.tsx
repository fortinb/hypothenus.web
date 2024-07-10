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
    onSearchInput  }
    :
    {
      page: number,
      totalPages: number,
      onNextPage: MouseEventHandler<HTMLButtonElement>,
      onPreviousPage: MouseEventHandler<HTMLButtonElement>,
      onFirstPage: MouseEventHandler<HTMLButtonElement>,
      onSearch:  FormEventHandler<HTMLFormElement>,
      onSearchInput:  ReactEventHandler<HTMLInputElement>
    }
) {
  return (
    <div className="d-flex flex-row justify-content-between text-secondary fw-bold ps-3 pe-3">
      <div>
        <Button className="btn btn-primary ms-0" type="button" variant="primary" onClick={onFirstPage} disabled={page == 1}><i className="bi bi-skip-start me-2" />First page</Button>
        <span className="text-primary align-middle ms-2 me-1">page {page} of {totalPages == 0 ? "..." : totalPages}</span>
      </div>
      <div className="flex-wrap">
        <Form as="form" className="d-flex" role="search" onSubmit={onSearch}>
          <Form.Control type="search" placeholder="Search" name="searchCriteria" defaultValue="" aria-label="Search" 
              onInput={onSearchInput} />
          <Button className="btn btn-primary ms-2" type="submit" variant="primary">Search</Button>
        </Form>
      </div>
      <div className="me-4">
        <Button className="btn btn-primary ms-2" type="button" variant="primary" onClick={onPreviousPage}
          disabled={page <= 1}><i className="bi bi-rewind-btn me-2" />Previous page</Button>
        <Button className="btn btn-primary ms-2" type="button" variant="primary" onClick={onNextPage}
          disabled={page >= totalPages}>Next page<i className="bi bi-fast-forward-btn ms-2" /></Button>
      </div>
    </div>
  );
}
