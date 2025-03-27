import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export function useAuth({ requireAuth = false } = {}) {
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, requireAuth, router]);

  return { isAuthenticated, user, accessToken };
}
