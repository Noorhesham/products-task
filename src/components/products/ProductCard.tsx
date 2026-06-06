import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product, ProductCardProps } from "@/types";

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-shadow pt-0! duration-200 hover:shadow-lg hover:-translate-y-0.5">
        {/* Product image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
          {product.discountPercentage >= 10 && (
            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">
              -{Math.round(product.discountPercentage)}%
            </Badge>
          )}
        </div>

        <CardContent className="md:p-4 flex flex-col gap-2">
          {/* Category */}
          <Badge variant="secondary" className="self-start text-xs capitalize">
            {product.category}
          </Badge>

          {/* Title */}
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mt-auto">
            <span className="font-bold text-base">${discountedPrice.toFixed(2)}</span>
            {product.discountPercentage >= 1 && (
              <span className="text-xs text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
