
export interface Page<T> {
  content: T[];
  sort: any;
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}