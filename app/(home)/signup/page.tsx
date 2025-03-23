"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { signUp } from "@/lib/api/requests/auth.requests";
import { Brain } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries());
    console.log(values);
    await signUp({
      email: values.email as string,
      username: values.username as string,
      firstName: values.firstName as string,
      lastName: values.lastName as string,
      password: values.password as string,
    });
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
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Enter your first name"
            />
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
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Enter your last name"
            />
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
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Enter your username"
            />
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
              name="password"
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
              name="confirmPassword"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
              placeholder="Confirm your password"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90"
          >
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
