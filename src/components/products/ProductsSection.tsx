import { fetchProducts, fetchProductsByCategory, searchProducts } from "@/lib/api";
import { ProductGrid } from "./ProductGrid";
import { ProductPagination } from "./ProductPagination";
import { DEFAULT_LIMIT, SORT_FIELD_LABELS } from "@/types";
import type { Product, ProductFilters, ProductsResponse } from "@/types";

interface ProductsSectionProps {
  filters: ProductFilters;
  rawParams: Record<string, string>;
}

const PRICE_MIN_DEFAULT = 0;
const PRICE_MAX_DEFAULT = 2000;

/**
 * Async Server Component — fetches and renders products.
 *
 * When minPrice/maxPrice are set, fetches all matching products (up to 200),
 * applies the price filter, then paginates the result manually.
 * Otherwise uses the API's native pagination.
 *
 * Lives inside a Suspense boundary keyed to the active filters so Next.js
 * streams the skeleton fallback instantly on every filter change.
 */
export async function ProductsSection({ filters, rawParams }: ProductsSectionProps) {
  const {
    search,
    category,
    sortBy,
    order,
    page = 1,
    limit = DEFAULT_LIMIT,
    minPrice,
    maxPrice,
  } = filters;

  const hasPriceFilter =
    (minPrice !== undefined && minPrice > PRICE_MIN_DEFAULT) ||
    (maxPrice !== undefined && maxPrice < PRICE_MAX_DEFAULT);

  const categoriesList = category ? category.split(",").filter(Boolean) : [];
  const hasMultipleCategories = categoriesList.length > 1;
  const useClientSide = hasPriceFilter || hasMultipleCategories;

  let products: Product[];
  let total: number;

  if (useClientSide) {
    let allProducts: Product[] = [];
    if (search) {
      const data = await searchProducts(search, { limit: 200 });
      allProducts = data.products;
    } else if (categoriesList.length > 0) {
      const results = await Promise.all(
        categoriesList.map((cat) => fetchProductsByCategory(cat, { limit: 200 }))
      );
      allProducts = results.flatMap((r) => r.products);
    } else {
      const data = await fetchProducts({ limit: 200 });
      allProducts = data.products;
    }

    // Filter by price range
    let filtered = allProducts;
    if (hasPriceFilter) {
      filtered = allProducts.filter((p) => {
        const effectivePrice = p.price * (1 - p.discountPercentage / 100);
        return (
          (minPrice === undefined || effectivePrice >= minPrice) &&
          (maxPrice === undefined || effectivePrice <= maxPrice)
        );
      });
    }

    // Sort client-side
    if (sortBy) {
      filtered.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];
        if (typeof valA === "string" && typeof valB === "string") {
          return order === "desc" ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        return order === "desc"
          ? (valB as number) - (valA as number)
          : (valA as number) - (valB as number);
      });
    }

    total = filtered.length;
    const skip = (page - 1) * limit;
    products = filtered.slice(skip, skip + limit);
  } else {
    const skip = (page - 1) * limit;
    const data = search
      ? await searchProducts(search, { limit, skip, sortBy, order })
      : category
      ? await fetchProductsByCategory(category, { limit, skip, sortBy, order })
      : await fetchProducts({ limit, skip, sortBy, order });

    total = data.total;
    products = data.products;
  }

  const sortLabel =
    sortBy ? `sorted by ${SORT_FIELD_LABELS[sortBy]} (${order ?? "asc"})` : null;

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          {total.toLocaleString()}
        </span>{" "}
        product{total !== 1 ? "s" : ""} found
        {sortLabel && <span className="ml-1">· {sortLabel}</span>}
      </p>

      <ProductGrid products={products} isLoading={false} isError={false} />

      <ProductPagination total={total} filters={filters} rawParams={rawParams} />
    </div>
  );
}
