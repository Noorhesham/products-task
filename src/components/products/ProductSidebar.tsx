"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X, ArrowUp, ArrowDown, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { SORT_FIELD_LABELS, DEFAULT_LIMIT } from "@/types";
import type { SortField, SortOrder } from "@/types";

const SORT_FIELDS: SortField[] = ["price", "rating", "title", "discountPercentage", "stock"];
const PER_PAGE_OPTIONS = [8, 12, 20, 40];
const PRICE_MIN = 0;
const PRICE_MAX = 2000;

export function ProductSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Current URL state (used for comparison to avoid spurious navigations)
  const urlSearch = searchParams.get("search") ?? "";
  const urlMinPrice = Number(searchParams.get("minPrice") ?? PRICE_MIN);
  const urlMaxPrice = Number(searchParams.get("maxPrice") ?? PRICE_MAX);
  const currentCategory = searchParams.get("category") ?? "";
  const currentSortBy = (searchParams.get("sortBy") ?? "") as SortField | "";
  const currentOrder = (searchParams.get("order") ?? "asc") as SortOrder;
  const currentLimit = Number(searchParams.get("limit") ?? DEFAULT_LIMIT);

  // Local state — update instantly for smooth UI
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [priceRange, setPriceRange] = useState<number[]>([urlMinPrice, urlMaxPrice]);

  // Debounced values — these trigger the URL push (the "action")
  const debouncedSearch = useDebounce(searchInput, 500);
  const debouncedPriceRange = useDebounce(priceRange, 600);

  // Sync local search from URL (handles browser back/forward, external changes)
  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  // Sync local price range from URL
  useEffect(() => {
    setPriceRange([
      Number(searchParams.get("minPrice") ?? PRICE_MIN),
      Number(searchParams.get("maxPrice") ?? PRICE_MAX),
    ]);
  }, [searchParams]);

  // Debounced search → URL push (skips if value already matches URL)
  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (debouncedSearch === current) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced price → URL push (skips if range already matches URL)
  useEffect(() => {
    const curMin = Number(searchParams.get("minPrice") ?? PRICE_MIN);
    const curMax = Number(searchParams.get("maxPrice") ?? PRICE_MAX);
    const [min, max] = debouncedPriceRange;
    if (min === curMin && max === curMax) return;
    const params = new URLSearchParams(searchParams.toString());
    if (min === PRICE_MIN && max === PRICE_MAX) {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else {
      params.set("minPrice", String(min));
      params.set("maxPrice", String(max));
    }
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }, [debouncedPriceRange]); // eslint-disable-line react-hooks/exhaustive-deps

  function push(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
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

  function clearAll() {
    setSearchInput("");
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    startTransition(() => router.push(pathname));
  }

  const isPriceFiltered = priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;
  const hasActiveFilters =
    urlSearch || currentCategory || currentSortBy || searchParams.get("order") || isPriceFiltered;

  const filtersContent = (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Filters</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="h-4 text-[10px] px-1.5">
              Active
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      {/* ── Search ── */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Search</p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search products…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8 h-10 text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* ── Price Range ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Price Range</p>
          {isPriceFiltered && (
            <button
              onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}
              className="text-[10px] text-primary hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-primary">${priceRange[0]}</span>
          <span className="text-muted-foreground/60">–</span>
          <span className="text-primary">${priceRange[1]}</span>
        </div>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={10}
          value={priceRange}
          onValueChange={(v) => setPriceRange(Array.isArray(v) ? [...v] : [v as number])}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>$0</span>
          <span>$2,000</span>
        </div>
      </div>

      <Separator />

      {/* ── Category ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Categories</p>
          {currentCategory && (
            <button
              onClick={() => push({ category: null })}
              className="text-[10px] text-primary hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        {categoriesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto pr-1 space-y-1 bg-background/50 rounded-lg border p-2">
            {categories?.map((cat) => {
              const selectedCategories = currentCategory ? currentCategory.split(",") : [];
              const isChecked = selectedCategories.includes(cat.slug);
              return (
                <label
                  key={cat.slug}
                  className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:bg-muted/50 p-1.5 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      let nextCats: string[];
                      if (isChecked) {
                        nextCats = selectedCategories.filter((c) => c !== cat.slug);
                      } else {
                        nextCats = [...selectedCategories, cat.slug];
                      }
                      push({ category: nextCats.length ? nextCats.join(",") : null });
                    }}
                    className="rounded border-input text-primary focus:ring-ring h-4 w-4 cursor-pointer"
                  />
                  <span className="capitalize">{cat.name}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      {/* ── Sort By ── */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Sort By</p>
        <Select value={currentSortBy || "none"} onValueChange={(v) => push({ sortBy: v ?? "none" })}>
          <SelectTrigger className="h-10 text-sm w-full" aria-label="Sort by">
            <SelectValue placeholder="Default order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Default order</SelectItem>
            {SORT_FIELDS.map((field) => (
              <SelectItem key={field} value={field} className="text-sm">
                {SORT_FIELD_LABELS[field]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentSortBy && (
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <Button
              variant={currentOrder === "asc" ? "default" : "outline"}
              size="sm"
              onClick={() => push({ order: "asc" })}
              className="h-9 text-xs gap-1"
            >
              <ArrowUp className="h-3 w-3" />
              Asc
            </Button>
            <Button
              variant={currentOrder === "desc" ? "default" : "outline"}
              size="sm"
              onClick={() => push({ order: "desc" })}
              className="h-9 text-xs gap-1"
            >
              <ArrowDown className="h-3 w-3" />
              Desc
            </Button>
          </div>
        )}
      </div>

      <Separator />

      {/* ── Items Per Page ── */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Per Page</p>
        <Select value={String(currentLimit)} onValueChange={(v) => push({ limit: v ?? String(DEFAULT_LIMIT) })}>
          <SelectTrigger className="h-10 text-sm w-full" aria-label="Items per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PER_PAGE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)} className="text-sm">
                {n} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile view (Sheet) */}
      <div className="block lg:hidden w-full">
        <Sheet>
          <SheetTrigger render={
            <Button variant="outline" className="w-full flex items-center justify-between h-10 px-4">
              <span className="flex items-center gap-2 font-semibold text-sm">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px] flex items-center justify-center rounded-full">
                    Active
                  </Badge>
                )}
              </span>
              <span className="text-xs text-muted-foreground">Tap to adjust</span>
            </Button>
          } />
          <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto p-6">
            <SheetHeader className="p-0 mb-4">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your product results below.</SheetDescription>
            </SheetHeader>
            {filtersContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop view (Inline container) */}
      <div className="hidden lg:block rounded-xl border bg-card shadow-sm p-5 space-y-5">
        {filtersContent}
      </div>
    </>
  );
}
