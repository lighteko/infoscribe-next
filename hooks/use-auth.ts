'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { refreshToken } from '@/lib/api/requests/auth.requests';

interface UseAuthOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  onAuthSuccess?: () => void;
  onAuthFailure?: () => void;
}

export function useAuth({
  requireAuth = false,
  redirectTo = '/auth/login',
  onAuthSuccess,
  onAuthFailure,
}: UseAuthOptions = {}) {
  const { user, accessToken, isAuthenticated, setUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && requireAuth) {
        try {
          // Attempt to refresh token if we're not authenticated
          await refreshToken();
          onAuthSuccess?.();
        } catch (error) {
          // If refresh fails and auth is required, redirect
          if (requireAuth) {
            router.push(redirectTo);
            onAuthFailure?.();
          }
        }
      } else if (isAuthenticated && onAuthSuccess) {
        onAuthSuccess();
      }
    };

    checkAuth();

    // Set up automatic token refresh (every 5 minutes)
    const refreshInterval = setInterval(async () => {
      if (isAuthenticated) {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Failed to refresh token:', error);
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, requireAuth, redirectTo, router, onAuthSuccess, onAuthFailure]);

  return { user, accessToken, isAuthenticated };
}
