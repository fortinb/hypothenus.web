
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  sort: any;
  totalPages: number;
  totalElements: number;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
}