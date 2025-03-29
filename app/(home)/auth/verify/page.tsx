"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { verifyEmail } from "@/lib/api/requests/auth.requests";
import { Brain, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const verificationToken = searchParams.get("token");

    if (!verificationToken) {
      setError("Missing verification token. Please check your email link.");
      setIsLoading(false);
      return;
    }

    const verifyEmailToken = async () => {
      try {
        await verifyEmail({ token: verificationToken });
        setSuccess(true);

        // Redirect to login after successful verification
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } catch (error) {
        console.error("Email verification error:", error);
        if (error instanceof Error) {
          setError(
            error.message || "Failed to verify email. Please try again."
          );
        } else {
          setError(
            "An unexpected error occurred. Your verification link may have expired."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmailToken();
  }, [searchParams, router]);

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex items-center justify-center gap-2 text-foreground mb-8">
          <Brain className="w-8 h-8 text-[#FFB800]" />
          <span className="text-2xl font-bold">Infoscribe</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Email Verification</h1>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center mt-6">
            <Loader2 className="h-8 w-8 text-[#FFB800] animate-spin mb-4" />
            <p>Verifying your email address...</p>
          </div>
        ) : success ? (
          <div className="mt-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <p>Your email has been successfully verified!</p>
              <p className="text-sm mt-2">Redirecting you to login page...</p>
            </div>
            <Link href="/auth/login" className="text-[#FFB800] hover:underline">
              Click here if you're not redirected automatically
            </Link>
          </div>
        ) : (
          <div className="mt-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <Link
                  href="/contact"
                  className="text-[#FFB800] hover:underline"
                >
                  Contact support
                </Link>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Already verified?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#FFB800] hover:underline"
                >
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
}
