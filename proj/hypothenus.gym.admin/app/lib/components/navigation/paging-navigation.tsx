"use client"

import Button from "react-bootstrap/esm/Button";

export default function PagingNavigation(
  { pageNumber,
    totalPages,
    onNextPage,
    onPreviousPage,
    onFirstPage }
    :
    {
      pageNumber: number,
      totalPages: number,
      onNextPage: React.MouseEventHandler<HTMLButtonElement>,
      onPreviousPage: React.MouseEventHandler<HTMLButtonElement>,
      onFirstPage: React.MouseEventHandler<HTMLButtonElement>
    }
) {
  return (
    <div className="d-flex flex-row justify-content-between text-secondary fw-bold pe-3">
      <div>
        <Button className="ms-0" type="button" variant="primary" onClick={onFirstPage} disabled={pageNumber == 1}><i className="bi bi-skip-start me-2" />First page</Button>
        <span className="align-middle ms-2">page {pageNumber} of {totalPages == 0 ? "..." : totalPages}</span>
      </div>
      <div className="me-4">
        <Button className="ms-2" type="button" variant="primary" onClick={onPreviousPage}
          disabled={pageNumber <= 1}><i className="bi bi-rewind-btn me-2" />Previous page</Button>
        <Button className="ms-2" type="button" variant="primary" onClick={onNextPage}
          disabled={pageNumber >= totalPages}>Next page<i className="bi bi-fast-forward-btn ms-2" /></Button>
      </div>
    </div>
  );
}
