import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new ShopNext account",
};

export default async function RegisterPage() {
  if (await isAuthenticated()) {
    redirect("/products");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">ShopNext</h1>
          <p className="text-muted-foreground mt-2">Join us and start shopping today</p>
        </div>
        <RegisterForm />
        <p className="text-center text-xs text-muted-foreground mt-6">
          Powered by{" "}
          <span className="font-medium text-foreground">DummyJSON</span> — a mock API.
          Registration stores your profile but sign-in uses test credentials.
        </p>
      </div>
    </main>
  );
}
