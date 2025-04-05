import { apiClient } from "@api/client";
import { executeWithTokenRefresh } from "@api/interceptor";

export async function subscribe(providerId: string) {
  return executeWithTokenRefresh(() =>
    apiClient("/subscription/subscribe", {
      method: "POST",
      body: JSON.stringify({
        providerId,
      }),
    })
  );
}

export async function unsubscribe(providerId: string) {
  return executeWithTokenRefresh(() =>
    apiClient(`/subscription/unsubscribe?providerId=${providerId}`, {
      method: "DELETE",
    })
  );
}

export async function getAllMySubscriptions() {
  return executeWithTokenRefresh(() =>
    apiClient("/subscription", {
      method: "GET",
    })
  );
}
