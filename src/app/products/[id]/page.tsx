import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Star, Tag, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fetchProductById } from "@/lib/api";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = Number(id);
  if (isNaN(numericId)) return { title: "Product Not Found" };
  try {
    const product = await fetchProductById(numericId);
    return {
      title: product.title,
      description: product.description.slice(0, 160),
      openGraph: {
        title: product.title,
        description: product.description.slice(0, 160),
        images: [{ url: product.thumbnail, width: 400, height: 400 }],
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (isNaN(numericId)) notFound();

  let product;
  try {
    product = await fetchProductById(numericId);
  } catch {
    notFound();
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const savings = product.price - discountedPrice;

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-6 -ml-2 gap-1.5 text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* ── Image gallery (Client Component) ── */}
          <ProductImageGallery images={product.images} thumbnail={product.thumbnail} title={product.title} />

          {/* ── Product details ── */}
          <div className="space-y-5">
            {/* Category + title */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <Badge variant="secondary" className="capitalize text-xs">
                  {product.category}
                </Badge>
                {product.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-[10px] capitalize text-muted-foreground px-1.5 py-0">
                    #{tag}
                  </Badge>
                ))}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight leading-tight">{product.title}</h1>
              {product.brand && <p className="text-sm text-muted-foreground mt-1">by {product.brand}</p>}
            </div>

            {/* Star rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30 fill-muted-foreground/10",
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className={cn(
                "text-sm font-semibold",
                product.availabilityStatus === "Low Stock" ? "text-amber-600" :
                product.availabilityStatus === "Out of Stock" ? "text-destructive" : "text-green-600"
              )}>
                {product.availabilityStatus} ({product.stock} left)
              </span>
            </div>

            <Separator />

            {/* Pricing */}
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">${discountedPrice.toFixed(2)}</span>
                {product.discountPercentage >= 1 && (
                  <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                )}
                {product.discountPercentage >= 10 && (
                  <Badge className="bg-destructive text-destructive-foreground text-xs">
                    -{Math.round(product.discountPercentage)}% OFF
                  </Badge>
                )}
              </div>
              {product.discountPercentage >= 1 && (
                <p className="text-sm text-green-600 font-medium mt-1">You save ${savings.toFixed(2)}</p>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>

            <Separator />

            {/* Meta chips */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Package className="h-4 w-4 text-muted-foreground/70" />
                <span>SKU: <strong className="text-foreground font-semibold">{product.sku}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-muted-foreground/70" />
                <span className="capitalize">{product.category}</span>
              </div>
            </div>

            {/* CTA — Add to Cart is a client component */}
            <AddToCartButton product={product} />
          </div>
        </div>

        <Separator className="my-10" />

        {/* Bottom Section: Details & Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left/Middle Column: Specs & Meta (2/3 width) */}
          <div className="md:col-span-2 space-y-8">
            {/* Specs Grid */}
            <div>
              <h2 className="text-lg font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-xl p-5 bg-card/50 text-sm">
                <div className="flex justify-between border-b pb-2 sm:border-0 sm:pb-0">
                  <span className="text-muted-foreground">SKU</span>
                  <span className="font-medium text-foreground">{product.sku}</span>
                </div>
                <div className="flex justify-between border-b pb-2 sm:border-0 sm:pb-0">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium text-foreground">{product.weight}g</span>
                </div>
                {product.dimensions && (
                  <div className="flex justify-between border-b pb-2 sm:border-0 sm:pb-0">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span className="font-medium text-foreground">
                      {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-b pb-2 sm:border-0 sm:pb-0">
                  <span className="text-muted-foreground">Min. Order Qty</span>
                  <span className="font-medium text-foreground">{product.minimumOrderQuantity} units</span>
                </div>
                <div className="flex justify-between border-b pb-2 sm:border-0 sm:pb-0">
                  <span className="text-muted-foreground">Warranty</span>
                  <span className="font-medium text-foreground">{product.warrantyInformation}</span>
                </div>
                <div className="flex justify-between border-b pb-2 sm:border-0 sm:pb-0">
                  <span className="text-muted-foreground">Return Policy</span>
                  <span className="font-medium text-foreground">{product.returnPolicy}</span>
                </div>
                <div className="flex justify-between border-b pb-2 sm:border-0 sm:pb-0">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-foreground">{product.shippingInformation}</span>
                </div>
                <div className="flex justify-between border-b pb-2 sm:border-0 sm:pb-0">
                  <span className="text-muted-foreground">Availability</span>
                  <span className={cn(
                    "font-semibold",
                    product.availabilityStatus === "Low Stock" ? "text-amber-600" :
                    product.availabilityStatus === "Out of Stock" ? "text-destructive" : "text-green-600"
                  )}>
                    {product.availabilityStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-lg font-bold mb-4">Customer Reviews</h2>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review: any, idx: number) => (
                    <div key={idx} className="border rounded-xl p-4 bg-card/30 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground/30 fill-muted-foreground/10"
                                )}
                              />
                            ))}
                          </div>
                          <p className="text-sm font-semibold mt-1 text-foreground">{review.reviewerName}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">&ldquo;{review.comment}&rdquo;</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Right Column: QR Code & Meta Tags (1/3 width) */}
          <div className="space-y-6">
            {/* QR Code Card */}
            {product.meta?.qrCode && (
              <div className="border rounded-xl p-5 bg-card/50 flex flex-col items-center text-center space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Product QR Code</span>
                <div className="relative w-36 h-36 border p-2 bg-white rounded-lg flex items-center justify-center">
                  <img
                    src={product.meta.qrCode}
                    alt="Product Barcode QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-muted-foreground space-y-0.5">
                  <p>Barcode: {product.meta.barcode}</p>
                  <p>Created: {new Date(product.meta.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {/* Tags Card */}
            {product.tags && product.tags.length > 0 && (
              <div className="border rounded-xl p-5 bg-card/50 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground block">Product Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="capitalize text-xs px-2 py-0.5">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
