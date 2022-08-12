export type PaginationFilters = {
  limit: number;
  skip: number;
};

export type ListManyResponsePagination = {
  limit: number;
  skip: number;
  total: number;
};
export type ListManyResponse<Type> = {
  pagination: ListManyResponsePagination;
  results: Type[];
};
