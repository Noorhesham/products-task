import { cookies } from "next/headers";

export const AUTH_COOKIE = "auth_token";
export const AUTH_USER_COOKIE = "auth_user";

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value ?? null;
}

export async function getAuthUser(): Promise<{ username: string; email: string; firstName: string; lastName: string; image: string } | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as {
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      image: string;
    };
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  return !!token;
}
