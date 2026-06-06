"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login, registerUser } from "@/lib/api";
import { AUTH_COOKIE, AUTH_USER_COOKIE } from "@/lib/auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60, // 1 hour
};

// ── Login ─────────────────────────────────────────────────────────────────────

export type LoginFormState = { error: string } | null;

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return { error: "Username and password are required." };
  }

  const cookieStore = await cookies();
  let user = null;

  // 1. Check if the user exists in our local registered users cookie database
  const existingUsersCookie = cookieStore.get("registered_users")?.value;
  if (existingUsersCookie) {
    try {
      const registeredUsers = JSON.parse(decodeURIComponent(existingUsersCookie));
      const matchedUser = registeredUsers.find(
        (u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      if (matchedUser) {
        user = {
          accessToken: `mock_token_${matchedUser.username}_${Date.now()}`,
          username: matchedUser.username,
          email: matchedUser.email,
          firstName: matchedUser.firstName,
          lastName: matchedUser.lastName,
          image: "https://dummyjson.com/icon/emilys/128", // fallback placeholder image
        };
      }
    } catch (e) {
      console.error("Error reading registered users cookie", e);
    }
  }

  // 2. If not found locally, attempt to log in using DummyJSON's default database (e.g. emilys / emilyspass)
  if (!user) {
    try {
      user = await login(username, password);
    } catch {
      return { error: "Invalid username or password. Please try again." };
    }
  }

  // Save the session token and user info cookies
  cookieStore.set(AUTH_COOKIE, user.accessToken, COOKIE_OPTIONS);
  cookieStore.set(
    AUTH_USER_COOKIE,
    encodeURIComponent(
      JSON.stringify({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      })
    ),
    { ...COOKIE_OPTIONS, httpOnly: false }
  );

  redirect("/products");
}

// ── Register ─────────────────────────────────────────────────────────────────

export type RegisterFormState = { error: string } | null;

export async function registerAction(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const firstName = (formData.get("firstName") as string)?.trim();
  const lastName = (formData.get("lastName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Server-side validation
  if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (username.length < 3) {
    return { error: "Username must be at least 3 characters long." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  let newUser;
  try {
    newUser = await registerUser({ firstName, lastName, email, username, password, age: 25 });
    
    // Persist this registered user in cookies so they can log in successfully afterwards
    const cookieStore = await cookies();
    let registeredUsers: any[] = [];
    const existingUsersCookie = cookieStore.get("registered_users")?.value;
    if (existingUsersCookie) {
      try {
        registeredUsers = JSON.parse(decodeURIComponent(existingUsersCookie));
      } catch {}
    }
    registeredUsers.push({ username, password, firstName, lastName, email });
    cookieStore.set("registered_users", encodeURIComponent(JSON.stringify(registeredUsers)), COOKIE_OPTIONS);
  } catch {
    return { error: "Registration failed. Please try again." };
  }

  // Redirect to login with a success flag — use the returned user's first name
  redirect(`/login?registered=1&name=${encodeURIComponent(newUser.firstName)}`);
}

// ── Logout ───────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(AUTH_USER_COOKIE);
  redirect("/login");
}
