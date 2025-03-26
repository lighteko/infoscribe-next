"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { resetPassword } from "@/lib/api/requests/auth.requests"; // Assuming this exists
import { Brain } from "lucide-react";
import Link from "next/link";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (!token) {
      setError(
        "Missing reset token. Please request a new password reset link."
      );
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setPasswordMatch(false);
        return;
      }

      setPasswordMatch(true);

      if (!token) {
        setError("Invalid or missing reset token. Please try again.");
        return;
      }

      await resetPassword({
        token,
        newPassword: password,
      });

      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 text-foreground mb-8">
          <Brain className="w-8 h-8 text-[#FFB800]" />
          <span className="text-2xl font-bold">Infoscribe</span>
        </div>

        {success ? (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Password Reset Successful
            </h1>
            <p className="text-muted-foreground mb-6">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>
            <Button
              asChild
              className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
            >
              <Link href="/login">Go to Login</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Create new password</h1>
            <p className="text-muted-foreground mb-6">
              Enter a new password for your account.
            </p>

            {error && (
              <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                  placeholder="Enter new password"
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  required
                  className={`w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] ${
                    !passwordMatch ? "border-red-500" : ""
                  }`}
                  placeholder="Confirm new password"
                />
                {!passwordMatch && (
                  <p className="text-sm text-red-500">Passwords do not match</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
                disabled={!token}
              >
                Reset Password
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Remember your password?{" "}
              <Link href="/login" className="text-[#FFB800] hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}
      </Card>
    </main>
  );
}
