import { refreshToken } from "./requests/auth.requests";
import { useAuthStore } from "@/lib/store/auth-store";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export async function executeWithTokenRefresh<T>(
  apiCall: () => Promise<T>
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    // If error is due to token expiration
    if (
      error.message?.includes("expired") &&
      useAuthStore.getState().accessToken
    ) {
      // Only refresh once, queue all requests
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshToken()
          .catch(() => {
            // If refresh fails, logout
            useAuthStore.getState().logout();
            throw error;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      // Wait for the refresh to complete
      if (refreshPromise) {
        await refreshPromise;
        // Retry the original request
        return apiCall();
      }
    }
    throw error;
  }
}
