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
    console.log(
      `Request to ${path} with auth token: ${accessToken.substring(0, 10)}...`
    );
  } else {
    console.log(`Request to ${path} without auth token`);
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include", // Important for cookies/refresh tokens
  });

  if (res.status >= 400) {
    const response = await res.json();
    throw new Error(response.data.message);
  }

  return res.json();
}
