import { Suspense, type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { getAuthUser } from "@/lib/auth";

interface MainLayoutProps {
  children: ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const user = await getAuthUser();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar reads searchParams so it must be in a Suspense boundary */}
      <Suspense fallback={<div className="h-16 border-b bg-background" />}>
        <Navbar user={user} />
      </Suspense>
      <main className="flex-1 shrink-0 container mx-auto px-4 py-6">{children}</main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShopNext. All rights reserved.
      </footer>
    </div>
  );
}
