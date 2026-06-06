"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore, cartTotal, cartItemCount } from "@/store/cartStore";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } =
    useCartStore();

  const total = cartTotal(items);
  const count = cartItemCount(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open: boolean) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Cart
            {count > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                {count}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="text-xs text-muted-foreground">
                Add products to get started
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                {/* Thumbnail */}
                <Link
                  href={`/products/${item.id}`}
                  onClick={closeCart}
                  className="shrink-0"
                >
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <Link
                    href={`/products/${item.id}`}
                    onClick={closeCart}
                    className="text-sm font-medium leading-tight line-clamp-2 hover:text-primary transition-colors"
                  >
                    {item.title}
                  </Link>
                  <p className="text-sm font-semibold text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm tabular-nums">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeItem(item.id)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with total */}
        {items.length > 0 && (
          <SheetFooter className="border-t px-5 py-4 gap-3">
            <div className="w-full space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary text-base">${total.toFixed(2)}</span>
              </div>
              <Button className="w-full gap-2" size="lg">
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={clearCart}
              >
                Clear cart
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
