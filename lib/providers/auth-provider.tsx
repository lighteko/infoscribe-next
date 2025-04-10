"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { logOut, refreshToken } from "@/lib/api/requests/auth.requests";
import { useRouter, usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we need to refresh the token
  useEffect(() => {
    if (pathname.includes("auth")) return;
    const checkAndRefreshToken = async () => {
      try {
        if (!accessToken) {
          await refreshToken();
        }
      } catch (error: any) {
        if (
          error.message.includes("Refresh token is required") ||
          error.message.includes("Authentication is required")
        ) {
          router.replace("/");
        }
      } finally {
        setAuthChecked(true);
      }
    };

    // Initial check
    checkAndRefreshToken();

    // Set up periodic checks (every 5 minutes)
    refreshTimerRef.current = setInterval(checkAndRefreshToken, 5 * 60 * 1000);

    // Clean up the timer when component unmounts
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [accessToken]);

  return children;
}
