import { useAuthStore } from "@/lib/store/auth-store";

export function useAuth({ requireAuth = false } = {}) {
  const { isAuthenticated, user, accessToken } = useAuthStore();

  return { isAuthenticated, user, accessToken };
}
