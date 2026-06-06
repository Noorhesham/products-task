import type { SortField, SortOrder } from "./product";

export interface FetchOptions {
  limit?: number;
  skip?: number;
  sortBy?: SortField;
  order?: SortOrder;
}
