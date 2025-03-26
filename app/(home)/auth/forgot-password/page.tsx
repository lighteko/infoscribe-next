"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { forgotPassword } from "@/lib/api/requests/auth.requests";
import { Brain } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const values = Object.fromEntries(formData.entries());
      setEmail(values.email as string);
      
      await forgotPassword({
        email: values.email as string,
        username: values.username as string
      });
      
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || "Failed to send password reset instructions. Please try again.");
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-2xl font-bold mb-2">Check your email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent password reset instructions to <span className="font-medium">{email}</span>. 
              Please check your inbox and follow the link to reset your password.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              If you don't see the email, check your spam folder or 
              <Button variant="link" className="p-0 h-auto text-[#FFB800] font-normal" onClick={() => setSuccess(false)}>
                {" try again"}
              </Button>.
            </p>
            <Button 
              asChild
              className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
            >
              <Link href="/login">Return to Login</Link>
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
            <p className="text-muted-foreground mb-6">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            {error && (
              <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-md">
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
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                  placeholder="Enter your email"
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
                />
              </div>
              <Button 
                type="submit" 
                className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Instructions"}
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
