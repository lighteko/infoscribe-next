"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your signup logic here
    console.log("Signup form submitted");
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 text-foreground mb-8">
          <Brain className="w-8 h-8 text-[#FFB800]" />
          <span className="text-2xl font-bold">Infoscribe</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Create your account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
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
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Create a password"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Confirm your password"
            />
          </div>
          
          <Button type="submit" className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90">
            Sign Up
          </Button>
        </form>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FFB800] hover:underline">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
} 