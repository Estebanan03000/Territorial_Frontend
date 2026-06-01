export interface PagedResponse<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export interface DeleteResponse {
  message: string;
}

export interface SearchParams {
  [key: string]: string | number | boolean | null | undefined;
}
