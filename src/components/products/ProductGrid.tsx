"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "./ProductCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export function ProductGrid({ products, isLoading, isError, errorMessage }: ProductGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  // GSAP staggered fade-up animation when products load
  useEffect(() => {
    if (!products?.length || !gridRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-card]");
      if (!cards?.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "all", // clean up inline styles after animation
        },
      );
    }, gridRef);

    return () => ctx.revert();
  }, [products]);

  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (isError) {
    return <ErrorState description={errorMessage} />;
  }

  if (!products?.length) {
    return <EmptyState />;
  }

  return (
    <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
      {products.map((product) => (
        <div key={product.id} data-card>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
