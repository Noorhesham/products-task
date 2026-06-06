import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import { getAuthUserAction } from "@/app/actions/auth";
import type { Category, UserSession } from "@/types";

export function useEntity<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  options?: { staleTime?: number }
) {
  return useQuery<T>({
    queryKey,
    queryFn,
    ...options,
  });
}

export function useCategories() {
  return useEntity<Category[]>(["categories"], fetchCategories, {
    staleTime: 5 * 60 * 1000,
  });
}

export function useUser() {
  return useEntity<UserSession | null>(["authUser"], getAuthUserAction, {
    staleTime: 60 * 1000,
  });
}
