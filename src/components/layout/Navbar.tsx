"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { ShoppingBag, LogOut, Menu, X, ShoppingCart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { logoutAction } from "@/app/actions/auth";
import { useUIStore } from "@/store/uiStore";
import { useCartStore, cartItemCount } from "@/store/cartStore";
import { CartSheet } from "@/components/cart/CartSheet";
import { useDebounce } from "@/hooks/useDebounce";

interface User {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

export function Navbar({ user }: { user: User | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { openCart, items } = useCartStore();
  const count = cartItemCount(items);

  // Hide navbar search on /products — the sidebar has its own search there
  const isProductsListing = pathname === "/products";

  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (debouncedSearch === current) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
      params.delete("category");
    } else {
      params.delete("search");
    }
    params.delete("page"); // reset page on new search
    if (pathname.startsWith("/products") && !pathname.includes("/products/")) {
      startTransition(() => router.push(`/products?${params.toString()}`));
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 w-full container mx-auto items-center gap-4 px-4  ">
          {/* Logo */}
          <Link
            href="/products"
            className="flex items-center gap-2 font-bold text-xl shrink-0"
            onClick={closeMobileMenu}
          >
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="text-primary">Shop</span>
          </Link>

          {/* Search — hidden on /products (sidebar has its own search there) */}
          {!isProductsListing && (
            <div className="hidden md:flex flex-1 max-w-xl">
              <Input
                type="search"
                placeholder="Search products…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full"
                aria-label="Search products"
              />
            </div>
          )}

          {/* Cart on mobile */}
          <div className="relative md:hidden ml-auto mr-1">
            <Button variant="ghost" size="icon" onClick={openCart} aria-label={`Cart (${count} items)`}>
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {count > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center pointer-events-none">
                {count > 99 ? "99+" : count}
              </Badge>
            )}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0 ml-auto">
            {user && (
              <div className="flex items-center gap-2 border-r pr-3 border-border">
                <img src={user.image} alt={user.firstName} className="h-8 w-8 rounded-full border bg-muted" />
                <span className="text-sm font-medium text-foreground">Hi, {user.firstName}</span>
              </div>
            )}
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={openCart} aria-label={`Cart (${count} items)`}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {count > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center pointer-events-none">
                  {count > 99 ? "99+" : count}
                </Badge>
              )}
            </div>
            {user ? (
              <form action={logoutAction}>
                <Button variant="outline" size="sm" type="submit" disabled={isPending}>
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Logout
                </Button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({ variant: "default", size: "sm" })}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile expanded */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-3 space-y-3 bg-background animate-in fade-in-0 slide-in-from-top-4 duration-200 ease-out origin-top">
            {user && (
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <img src={user.image} alt={user.firstName} className="h-10 w-10 rounded-full border bg-muted" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}
            {!isProductsListing && (
              <Input
                type="search"
                placeholder="Search products…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full"
              />
            )}
            <div className="pt-1">
              {user ? (
                <form action={logoutAction} className="w-full">
                  <Button variant="outline" size="sm" type="submit" className="w-full">
                    <LogOut className="h-4 w-4 mr-1.5" />
                    Logout
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className={buttonVariants({ variant: "outline", size: "sm", className: "w-full text-center" })}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className={buttonVariants({ variant: "default", size: "sm", className: "w-full text-center" })}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart sheet — lives outside header so it overlays the whole page */}
      <CartSheet />
    </>
  );
}
