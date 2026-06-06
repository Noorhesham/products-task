"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";
import { SORT_FIELD_LABELS, DEFAULT_LIMIT } from "@/types";
import type { SortField, SortOrder } from "@/types";

const SORT_FIELDS: SortField[] = ["price", "rating", "title", "discountPercentage", "stock"];
const PER_PAGE_OPTIONS = [8, 12, 20, 40];

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const current = {
    category: searchParams.get("category") ?? "",
    sortBy: (searchParams.get("sortBy") ?? "") as SortField | "",
    order: (searchParams.get("order") ?? "asc") as SortOrder,
    limit: Number(searchParams.get("limit") ?? DEFAULT_LIMIT),
  };

  const hasActiveFilters =
    current.category || current.sortBy || searchParams.get("order");

  function push(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    // Always reset page when filters change
    params.delete("page");
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || value === "all" || value === "none") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function clearFilters() {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  function toggleOrder() {
    push({ order: current.order === "asc" ? "desc" : "asc" });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Category */}
      {categoriesLoading ? (
        <Skeleton className="h-8 w-36" />
      ) : (
        <Select
          value={current.category || "all"}
          onValueChange={(v) => push({ category: v ?? "all" })}
        >
          <SelectTrigger className="h-8 w-36 text-xs" aria-label="Category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug} className="capitalize text-xs">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Separator orientation="vertical" className="h-6 hidden sm:block" />

      {/* Sort field */}
      <Select
        value={current.sortBy || "none"}
        onValueChange={(v) => push({ sortBy: v ?? "none" })}
      >
        <SelectTrigger className="h-8 w-32 text-xs" aria-label="Sort by">
          <SelectValue placeholder="Sort by…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Default order</SelectItem>
          {SORT_FIELDS.map((field) => (
            <SelectItem key={field} value={field} className="text-xs">
              {SORT_FIELD_LABELS[field]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort direction toggle — only shown when a sort field is active */}
      {current.sortBy && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleOrder}
          className="h-8 gap-1 text-xs"
          aria-label={`Sort ${current.order === "asc" ? "ascending" : "descending"}`}
        >
          {current.order === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {current.order === "asc" ? "Asc" : "Desc"}
        </Button>
      )}

      <Separator orientation="vertical" className="h-6 hidden sm:block" />

      {/* Items per page */}
      <Select
        value={String(current.limit)}
        onValueChange={(v) => push({ limit: v ?? String(DEFAULT_LIMIT) })}
      >
        <SelectTrigger className="h-8 w-24 text-xs" aria-label="Items per page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PER_PAGE_OPTIONS.map((n) => (
            <SelectItem key={n} value={String(n)} className="text-xs">
              {n} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear
          </Button>
        </>
      )}
    </div>
  );
}
