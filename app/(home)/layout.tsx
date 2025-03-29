"use client";

import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRouter } from "next/navigation";
import { logOut } from "@/lib/api/requests/auth.requests";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.replace("/");
  };

  return (
    <div className="min-h-screen">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Brain className="w-8 h-8 text-[#FFB800]" />
          <span className="text-2xl font-bold">Infoscribe</span>
        </Link>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
              >
                Log out
              </Button>
              <Link href="/dashboard">
                <Button className="bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90">
                  Go to Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-[#F2F3D9] text-[#030027] hover:bg-[#F2F3D9]/90">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
      {children}
    </div>
  );
}
