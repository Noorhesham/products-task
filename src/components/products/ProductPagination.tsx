"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { ProductFilters, ProductPaginationProps } from "@/types";

function buildHref(rawParams: Record<string, string>, page: number): string {
  const p = new URLSearchParams(rawParams);
  p.set("page", String(page));
  return `/products?${p.toString()}`;
}

function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  const lo = Math.max(2, current - 1);
  const hi = Math.min(total - 1, current + 1);
  for (let i = lo; i <= hi; i++) pages.push(i);
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

/**
 * Client component so pagination uses router.push() — same client-side navigation
 * as the filter sidebar, giving the same instant skeleton feedback via the keyed
 * Suspense boundary in ProductsSection.
 *
 * href is still set on every link so middle-click / Ctrl+click / right-click
 * "Open in new tab" all work correctly.
 */
export function ProductPagination({ total, filters, rawParams }: ProductPaginationProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const limit = filters.limit ?? 12;
  const currentPage = filters.page ?? 1;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const pages = pageRange(currentPage, totalPages);
  const href = (page: number) => buildHref(rawParams, page);

  function navigate(page: number, e: React.MouseEvent) {
    // Let browser handle modifier keys (Ctrl/Cmd/Shift) and non-left clicks naturally
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    startTransition(() => router.push(href(page)));
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? href(currentPage - 1) : undefined}
            onClick={currentPage > 1 ? (e) => navigate(currentPage - 1, e) : undefined}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-40" : ""}
          />
        </PaginationItem>

        {pages.map((p, i) =>
          p === "…" ? (
            <PaginationItem key={`ell-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href={href(p)}
                onClick={(e) => navigate(p as number, e)}
                isActive={p === currentPage}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? href(currentPage + 1) : undefined}
            onClick={currentPage < totalPages ? (e) => navigate(currentPage + 1, e) : undefined}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-40" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
