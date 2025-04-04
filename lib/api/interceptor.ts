import { logOut, refreshToken } from "./requests/auth.requests";
import { useAuthStore } from "@/lib/store/auth-store";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export async function executeWithTokenRefresh<T>(
  apiCall: () => Promise<T>,
  maxRetries = 1 // Add retry limit
): Promise<T> {
  let retryCount = 0;

  async function attemptCall(): Promise<T> {
    try {
      return await apiCall();
    } catch (error: any) {
      if (retryCount < maxRetries && !useAuthStore.getState().accessToken) {
        retryCount++;
        // Create refresh promise first, then set flag to avoid race condition
        if (!isRefreshing) {
          refreshPromise = refreshToken()
            .catch((e) => {
              // logOut();
              console.log(e);
            })
            .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
          isRefreshing = true;
        }

        // Wait for existing refresh to complete
        if (refreshPromise) {
          await refreshPromise;
          return attemptCall(); // Retry with recursion
        }
      }
      throw error;
    }
  }

  return attemptCall();
}
