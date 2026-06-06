import { PackageSearch, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import type { EmptyStateProps } from "@/types";

export function EmptyState({
  title = "No products found",
  description = "Try adjusting your search or filter.",
  icon: Icon = PackageSearch,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
