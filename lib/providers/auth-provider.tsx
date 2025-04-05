"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { refreshToken } from "@/lib/api/requests/auth.requests";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we need to refresh the token
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      try {
        if (!accessToken) {
          await refreshToken();
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
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