import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  searchProducts,
  fetchProductsByCategory,
  fetchCategories,
} from "@/lib/api";
import type { ProductsResponse, Category, ProductFilters } from "@/types";
import { DEFAULT_LIMIT } from "@/types";

/**
 * Fetches products with all API-supported filters applied:
 * search, category, sortBy, order, limit (per-page), and skip (pagination).
 *
 * Priority: search > category > all products.
 * The query key includes every filter so React Query refetches
 * automatically whenever any URL param changes.
 */
export function useProducts(filters: ProductFilters = {}) {
  const {
    search,
    category,
    sortBy,
    order,
    page = 1,
    limit = DEFAULT_LIMIT,
  } = filters;

  const skip = (page - 1) * limit;
  const opts = { limit, skip, sortBy, order };

  return useQuery<ProductsResponse>({
    queryKey: ["products", { search, category, sortBy, order, page, limit }],
    queryFn: () => {
      if (search) return searchProducts(search, opts);
      if (category) return fetchProductsByCategory(category, opts);
      return fetchProducts(opts);
    },
    placeholderData: (prev) => prev,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}
