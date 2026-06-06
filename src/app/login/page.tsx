import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your ShopNext account",
};

interface LoginPageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await isAuthenticated()) {
    redirect("/products");
  }

  const sp = await searchParams;
  const justRegistered = sp.registered === "1";
  const newName = sp.name ? decodeURIComponent(sp.name) : null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">ShopNext</h1>
          <p className="text-muted-foreground mt-2">Sign in to explore our products</p>
        </div>

        {/* Registration success banner */}
        {justRegistered && (
          <div className="flex items-center gap-3 mb-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 px-4 py-3 text-sm text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>
              {newName ? `Welcome, ${newName}!` : "Account created!"}{" "}
              Sign in with the credentials below.
            </span>
          </div>
        )}

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground mt-4">
          Demo credentials:{" "}
          <span className="font-medium text-foreground">emilys</span> /{" "}
          <span className="font-medium text-foreground">emilyspass</span>
        </p>

        <p className="text-center text-sm text-muted-foreground mt-3">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
