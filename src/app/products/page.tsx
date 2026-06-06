import { Suspense } from "react";
import type { Metadata } from "next";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductSidebar } from "@/components/products/ProductSidebar";
import { ProductsSection } from "@/components/products/ProductsSection";
import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";
import { DEFAULT_LIMIT } from "@/types";
import type { ProductFilters as Filters, SortField } from "@/types";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our full catalog of products",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string>>;
}

const VALID_SORT = new Set<SortField>(["price", "rating", "title", "discountPercentage", "stock"]);

function SidebarSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-5 animate-pulse">
      <div className="h-4 w-20 bg-muted rounded" />
      <div className="h-px bg-border" />
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-9 w-full bg-muted rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sp = await searchParams;

  const filters: Filters = {
    search: sp.search || undefined,
    category: sp.category || undefined,
    sortBy: VALID_SORT.has(sp.sortBy as SortField) ? (sp.sortBy as SortField) : undefined,
    order: sp.order === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(sp.page ?? 1) || 1),
    limit: Number(sp.limit ?? DEFAULT_LIMIT) || DEFAULT_LIMIT,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
  };

  /**
   * Key changes on every filter/page change → React instantly unmounts the
   * old Suspense boundary and shows the skeleton while ProductsSection refetches.
   */
  const suspenseKey = JSON.stringify(filters);

  const activeLabel = filters.search
    ? `Results for "${filters.search}"`
    : filters.category
      ? filters.category.includes(",")
        ? `Categories: ${filters.category
            .split(",")
            .map((c) => c.replace("-", " "))
            .join(", ")}`
        : `Category: ${filters.category.replace("-", " ")}`
      : "All Products";

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* ── Main content — left column on desktop ── */}
        <main className="order-2 lg:order-1 flex-1 min-w-0 space-y-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{activeLabel}</p>
          </div>

          <Suspense key={suspenseKey} fallback={<ProductGridSkeleton count={filters.limit} />}>
            <ProductsSection filters={filters} rawParams={sp} />
          </Suspense>
        </main>

        {/* ── Right sticky sidebar — top on mobile ── */}
        <aside className="order-1 lg:order-2 w-full lg:w-72 shrink-0 lg:sticky lg:top-20">
          <Suspense fallback={<SidebarSkeleton />}>
            <ProductSidebar />
          </Suspense>
        </aside>
      </div>
    </MainLayout>
  );
}
