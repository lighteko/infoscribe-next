"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { forgotPassword } from "@/lib/api/requests/auth.requests";
import { Brain, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());

    if (!values.email || !values.username) {
      setError("Please provide both email and username");
      setIsLoading(false);
      return;
    }

    try {
      await forgotPassword({
        email: values.email as string,
        username: values.username as string,
      });
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Password reset error:", error);
      if (error instanceof Error) {
        setError(
          error.message ||
            "Failed to send reset instructions. Please try again."
        );
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

        <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
        <p className="text-muted-foreground mb-6">
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>

        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">
              Password reset instructions sent! Check your email.
            </span>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Instructions"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-[#FFB800] hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
