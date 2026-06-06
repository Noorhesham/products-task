import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Product, ProductFilters } from "./product";
import { UserSession } from "./auth";

export interface QueryProviderProps {
  children: ReactNode;
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export interface ProductsSectionProps {
  filters: ProductFilters;
  rawParams: Record<string, string>;
}

export interface ProductPaginationProps {
  total: number;
  filters: ProductFilters;
  rawParams: Record<string, string>;
}

export interface ProductImageGalleryProps {
  images: string[];
  thumbnail: string;
  title: string;
}

export interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

export interface ProductGridSkeletonProps {
  count?: number;
}

export interface ProductCardProps {
  product: Product;
}

export interface AddToCartButtonProps {
  product: Product;
}

export interface NavbarProps {}

export interface MainLayoutProps {
  children: ReactNode;
}

export interface ProductsPageProps {
  searchParams: Promise<Record<string, string>>;
}

export interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}
