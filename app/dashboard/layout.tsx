"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logOut } from "@/lib/api/requests/auth.requests";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useRef } from "react";
import { refreshToken } from "@/lib/api/requests/auth.requests";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    router.replace("/");
  };

  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set up automatic token refresh
  useEffect(() => {
    // Function to check and refresh token
    const checkAndRefreshToken = async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    };

    // Initial check
    checkAndRefreshToken();

    // Set up periodic checks (e.g., every 5 minutes)
    refreshTimerRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    // Clean up the timer when component unmounts
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [refreshToken]);

  return (
    <div className="flex min-h-screen h-screen overflow-hidden">
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader setMobileMenuOpen={setMobileMenuOpen} />
        <main className="flex-1 pb-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
