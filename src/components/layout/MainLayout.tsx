import { Suspense } from "react";
import { Navbar } from "./Navbar";
import type { MainLayoutProps } from "@/types";

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar reads searchParams so it must be in a Suspense boundary */}
      <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Navbar />
      </Suspense>
      <main className="flex-1 shrink-0 container mx-auto px-4 py-6">{children}</main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShopNext. All rights reserved.
      </footer>
    </div>
  );
}
