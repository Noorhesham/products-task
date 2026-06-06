"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Product, AddToCartButtonProps } from "@/types";

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price * (1 - product.discountPercentage / 100),
      thumbnail: product.thumbnail,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex gap-3 pt-1">
      <Button
        size="lg"
        className="flex-1 gap-2 transition-all"
        onClick={handleAdd}
        disabled={product.stock === 0 || added}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </>
        )}
      </Button>
      <Link
        href="/products"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        Browse More
      </Link>
    </div>
  );
}
