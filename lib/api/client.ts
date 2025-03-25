export async function apiClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`http://localhost:8000${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    credentials: "include",
  });

  if (!res.ok) {
    const response = await res.json();
    throw new Error(response.data.message.split("Error: ")[1]);
  }

  return res.json();
}
