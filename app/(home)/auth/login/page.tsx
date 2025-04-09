"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { logIn } from "@/lib/api/requests/auth.requests";
import { Brain, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { sendGAEvent } from "@/lib/analytics";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { accessToken, isAuthenticated } = useAuthStore();

  // Check for existing token on component mount and redirect if authenticated
  useEffect(() => {
    if (accessToken && isAuthenticated) {
      router.push("/dashboard"); // Redirect to dashboard or another protected route
    }
  }, [accessToken, isAuthenticated, router]);

  // If we're still checking authentication or redirecting, show minimal loading state
  if (accessToken && isAuthenticated) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
        <div>Redirecting to dashboard...</div>
      </main>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const values = Object.fromEntries(formData.entries());

      await logIn({
        email: values.email as string,
        pwd: values.password as string,
        isSessionOnly: values.remember ? false : true,
      });

      // Send the login event to Google Analytics
      sendGAEvent('login', { method: 'email' });

      router.push("/dashboard");
    } catch (err: any) {
      if (err.response) {
        const { status, response } = err;

        if (status === 401) {
          setError("Invalid email or password. Please try again.");
        } else if (status === 429) {
          setError("Too many login attempts. Please try again later.");
        } else if (status === 400) {
          setError("Invalid login details. Please check and try again.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          const data = response?.data || {};
          setError(data.message || "Login failed. Please try again.");
        }
      } else if (err instanceof Error) {
        if (
          err.message.includes("network") ||
          err.message.toLowerCase().includes("fetch")
        ) {
          setError(
            "Network error. Please check your connection and try again."
          );
        } else {
          setError(`Login failed: ${err.message}`);
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

        <h1 className="text-2xl font-bold mb-6">Welcome back</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                name="remember"
                className="rounded border-gray-300 text-[#FFB800] focus:ring-[#FFB800]"
              />
              <label
                htmlFor="remember"
                className="text-sm text-muted-foreground"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#FFB800] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-[#FFB800] hover:underline">
            Sign up
          </Link>
        </p>
      </Card>
    </main>
  );
}
