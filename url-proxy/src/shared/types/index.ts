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

export type GraphicDataGroupTimeValue = {
  name: string;
  [key: string]: string | number;
};
export type GraphicDataGroupValue = {
  day: GraphicDataGroupTimeValue[];
  day_hour: GraphicDataGroupTimeValue[];
  day_hour_minute: GraphicDataGroupTimeValue[];
};
export type GraphicDataResponse = {
  by_destination_name: GraphicDataGroupValue;
  by_click_type: GraphicDataGroupValue;
};
