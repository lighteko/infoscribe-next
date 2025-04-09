"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { resetPassword } from "@/lib/api/requests/auth.requests";
import { Brain, Loader2, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { sendGAEvent } from "@/lib/analytics";

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Use our custom hook for password strength
  const {
    passwordStrength,
    error: passwordError,
    validatePasswordStrength,
    checkPasswordStrength,
  } = usePasswordStrength();

  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract token from URL on component mount
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setFormError(
        "Missing reset token. Please request a new password reset link."
      );
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const validatePassword = () => {
    // First check password strength
    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.isValid) {
      setFormError(strengthCheck.message);
      return false;
    }

    // Then check if passwords match
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    setSuccess(false);

    if (!validatePassword()) {
      setIsLoading(false);
      return;
    }

    if (!token) {
      setFormError(
        "Reset token is missing. Please request a new password reset link."
      );
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: password,
      });

      // Send reset_password event
      sendGAEvent('reset_password');

      setSuccess(true);

      // Redirect to login after successful password reset with a delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      if (error instanceof Error) {
        setFormError(
          error.message || "Failed to reset password. Please try again."
        );
      } else {
        setFormError(
          "An unexpected error occurred. Your reset link may have expired."
        );
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

        <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
        <p className="text-muted-foreground mb-6">
          Enter your new password below to reset your account.
        </p>

        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">
              Password reset successful! You'll be redirected to login...
            </span>
          </div>
        )}

        {formError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] pr-10"
                placeholder="Enter your new password"
                disabled={isLoading || !token}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {passwordStrength && passwordStrength.isValid && (
              <p
                className={`text-sm ${
                  passwordStrength.score === 4
                    ? "text-green-500"
                    : "text-amber-500"
                }`}
              >
                {passwordStrength.message}
              </p>
            )}
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800] pr-10"
                placeholder="Confirm your new password"
                disabled={isLoading || !token}
              />
              <button
                type="button"
                onClick={toggleShowConfirmPassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
            disabled={isLoading || !token}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have a reset link?{" "}
          <Link
            href="/auth/forgot-password"
            className="text-[#FFB800] hover:underline"
          >
            Request one here
          </Link>
        </p>
      </Card>
    </main>
  );
}
