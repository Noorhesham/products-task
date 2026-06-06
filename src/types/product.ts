export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

/** Fields the DummyJSON API can sort by */
export type SortField =
  | "price"
  | "rating"
  | "title"
  | "discountPercentage"
  | "stock";

export type SortOrder = "asc" | "desc";

export const SORT_FIELD_LABELS: Record<SortField, string> = {
  price: "Price",
  rating: "Rating",
  title: "Name",
  discountPercentage: "Discount",
  stock: "Stock",
};

export const DEFAULT_LIMIT = 12;

export interface ProductFilters {
  search?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortOrder;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
}
