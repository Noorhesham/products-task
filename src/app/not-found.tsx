import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <PackageSearch className="h-16 w-16 text-muted-foreground mx-auto" />
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/products" className={cn(buttonVariants())}>
          Back to Products
        </Link>
      </div>
    </main>
  );
}
