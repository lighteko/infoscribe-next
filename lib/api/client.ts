import { useAuthStore } from "@/lib/store/auth-store";

export async function apiClient(path: string, options?: RequestInit) {
  // Get token from store
  const accessToken = useAuthStore.getState().accessToken;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
  };

  // Add token to headers if available
  if (accessToken) {
    (headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`http://localhost:8000${path}`, {
    ...options,
    headers,
    credentials: "include", // Keep this for refresh token cookie
  });

  if (!res.ok) {
    const response = await res.json();
    throw new Error(response.data.message.split("Error: ")[1]);
  }

  return res.json();
}
