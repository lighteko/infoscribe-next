"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signUp } from "@/lib/api/requests/auth.requests";
import { Brain } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const values = Object.fromEntries(formData.entries());

      // Basic validation
      if (values.password !== values.confirmPassword) {
        setFieldErrors({ confirmPassword: "Passwords do not match" });
        throw new Error("Passwords do not match");
      }

      await signUp({
        email: values.email as string,
        username: values.username as string,
        firstName: values.firstName as string,
        lastName: values.lastName as string,
        password: values.password as string,
      });

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error("Signup error:", err);

      if (err instanceof Error && "response" in (err as any)) {
        const response = (err as any).response;
        const status = response?.status;
        const data = response?.data || {};

        if (status === 409) {
          setError("An account with this email already exists.");
        } else if (status === 422 || status === 400) {
          if (data.errors && typeof data.errors === "object") {
            setFieldErrors(data.errors);
            setError("Please fix the errors in the form.");
          } else {
            setError(
              data.message ||
                "Invalid signup data. Please check your information."
            );
          }
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(data.message || "Signup failed. Please try again.");
        }
      } else if (err instanceof Error) {
        if (
          err.message.includes("network") ||
          err.message.toLowerCase().includes("fetch")
        ) {
          setError(
            "Network error. Please check your connection and try again."
          );
        } else if (!err.message.includes("Passwords do not match")) {
          setError(`Signup failed: ${err.message}`);
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 text-foreground mb-8">
          <Brain className="w-8 h-8 text-[#FFB800]" />
          <span className="text-2xl font-bold">Infoscribe</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">Create your account</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            Account created successfully! You can now{" "}
            <Link href="/auth/login" className="underline font-medium">
              log in
            </Link>
            .
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] ${
                fieldErrors.firstName ? "border-red-500" : ""
              }`}
              placeholder="Enter your first name"
            />
            {fieldErrors.firstName && (
              <p className="text-red-500 text-sm">{fieldErrors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] ${
                fieldErrors.lastName ? "border-red-500" : ""
              }`}
              placeholder="Enter your last name"
            />
            {fieldErrors.lastName && (
              <p className="text-red-500 text-sm">{fieldErrors.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] ${
                fieldErrors.username ? "border-red-500" : ""
              }`}
              placeholder="Enter your username"
            />
            {fieldErrors.username && (
              <p className="text-red-500 text-sm">{fieldErrors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] ${
                fieldErrors.email ? "border-red-500" : ""
              }`}
              placeholder="Enter your email"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] ${
                fieldErrors.password ? "border-red-500" : ""
              }`}
              placeholder="Create a password"
            />
            {fieldErrors.password && (
              <p className="text-red-500 text-sm">{fieldErrors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] ${
                fieldErrors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder="Confirm your password"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#FFB800] hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
