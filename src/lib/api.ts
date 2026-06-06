import type { Product, ProductsResponse, Category, AuthUser, RegisterInput, RegisteredUser, SortField, SortOrder } from "@/types";

const BASE_URL = "https://dummyjson.com";

export interface FetchOptions {
  limit?: number;
  skip?: number;
  sortBy?: SortField;
  order?: SortOrder;
}

function buildQuery(opts: FetchOptions = {}): string {
  const params = new URLSearchParams();
  if (opts.limit !== undefined) params.set("limit", String(opts.limit));
  if (opts.skip !== undefined) params.set("skip", String(opts.skip));
  if (opts.sortBy) params.set("sortBy", opts.sortBy);
  if (opts.order) params.set("order", opts.order);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

/** Revalidate every 5 minutes  */
const SSR_CACHE: RequestInit = { next: { revalidate: 300 } };

export async function login(username: string, password: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
}

export async function registerUser(data: RegisterInput): Promise<RegisteredUser> {
  return apiFetch<RegisteredUser>("/users/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function fetchProducts(opts: FetchOptions = {}): Promise<ProductsResponse> {
  return apiFetch<ProductsResponse>(`/products${buildQuery(opts)}`, SSR_CACHE);
}

export async function searchProducts(
  query: string,
  opts: FetchOptions = {}
): Promise<ProductsResponse> {
  const params = new URLSearchParams({ q: query });
  if (opts.limit !== undefined) params.set("limit", String(opts.limit));
  if (opts.skip !== undefined) params.set("skip", String(opts.skip));
  if (opts.sortBy) params.set("sortBy", opts.sortBy);
  if (opts.order) params.set("order", opts.order);
  return apiFetch<ProductsResponse>(`/products/search?${params.toString()}`, SSR_CACHE);
}

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/products/categories", {
    next: { revalidate: 3600 }, // categories rarely change — cache 1 h
  });
}

export async function fetchProductsByCategory(
  category: string,
  opts: FetchOptions = {}
): Promise<ProductsResponse> {
  return apiFetch<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}${buildQuery(opts)}`,
    SSR_CACHE
  );
}

export async function fetchProductById(id: number): Promise<Product> {
  return apiFetch<Product>(`/products/${id}`, { next: { revalidate: 300 } });
}
