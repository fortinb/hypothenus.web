
export interface Page<T> {
    content: T[];
    pageable: Pageable;
    sort: any;
    total: number;
  }

  export interface Pageable {
    pageNumber: number;
    pageSize: number;
  }